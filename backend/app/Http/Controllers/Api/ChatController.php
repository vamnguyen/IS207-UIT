<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Throwable;

class ChatController extends Controller
{
    public function invoke(Request $request)
    {
        $data = $request->validate([
            'message' => ['required', 'string'],
            'conversation_id' => ['nullable', 'integer'],
        ]);

        /** @var User $user */
        $user = $request->user();

        $conversation = $this->resolveConversation($user, $data['conversation_id'] ?? null, $data['message']);

        DB::transaction(function () use ($conversation, $data) {
            $conversation->messages()->create([
                'role' => 'user',
                'content' => $data['message'],
                'metadata' => null,
            ]);
            $conversation->update(['last_message_at' => now()]);
        });

        $shortcutResponse = $this->tryHandleShortcuts($user, $data['message']);

        return response()->stream(function () use ($conversation, $shortcutResponse, $user, $data) {
            ignore_user_abort(true);
            set_time_limit(0);

            $this->streamEvent([
                'event' => 'conversation',
                'conversation_id' => $conversation->id,
            ]);

            if ($shortcutResponse !== null) {
                $message = $shortcutResponse['message'];
                $metadata = $shortcutResponse['metadata'] ?? null;

                $this->streamEvent([
                    'event' => 'delta',
                    'conversation_id' => $conversation->id,
                    'content' => $message,
                ]);

                $this->streamEvent([
                    'event' => 'done',
                    'conversation_id' => $conversation->id,
                    'message' => $message,
                    'metadata' => $metadata,
                    'usage' => null,
                ]);

                DB::transaction(function () use ($conversation, $message, $metadata) {
                    $conversation->messages()->create([
                        'role' => 'assistant',
                        'content' => $message,
                        'metadata' => $metadata,
                    ]);

                    $conversation->update(['last_message_at' => now()]);
                });

                return;
            }

            $apiPayload = $this->buildApiPayload($conversation, $user, $data['message']);

            try {
                $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . config('services.openrouter.key'),
                    'Content-Type' => 'application/json',
                    'HTTP-Referer' => config('app.url'),
                    'X-Title' => config('app.name'),
                ])->timeout(0)->withOptions(['stream' => true])->post('https://openrouter.ai/api/v1/chat/completions', $apiPayload);

                if ($response->failed()) {
                    $this->streamEvent([
                        'event' => 'error',
                        'conversation_id' => $conversation->id,
                        'message' => 'Assistant service returned an error. Please try again later.',
                    ]);

                    Log::error('OpenRouter request failed', [
                        'conversation_id' => $conversation->id,
                        'status' => $response->status(),
                        'body' => $response->body(),
                    ]);

                    return;
                }

                $stream = $response->toPsrResponse()->getBody();
                $buffer = '';
                $assistantMessage = '';
                $usage = null;
                $responseId = null;
                $model = $apiPayload['model'] ?? null;
                $finished = false;

                while (! $stream->eof()) {
                    $chunk = $stream->read(1024);

                    if ($chunk === false) {
                        break;
                    }

                    $buffer .= $chunk;

                    while (($position = strpos($buffer, "\n\n")) !== false) {
                        $packet = substr($buffer, 0, $position);
                        $buffer = substr($buffer, $position + 2);

                        $finished = $this->handleProviderStreamPacket($packet, $conversation->id, $assistantMessage, $usage, $responseId, $model);

                        if ($finished) {
                            break 2;
                        }
                    }
                }

                if (! $finished && trim($buffer) !== '') {
                    $this->handleProviderStreamPacket($buffer, $conversation->id, $assistantMessage, $usage, $responseId, $model);
                }

                $this->streamEvent([
                    'event' => 'done',
                    'conversation_id' => $conversation->id,
                    'message' => $assistantMessage !== '' ? $assistantMessage : 'Assistant did not respond.',
                    'metadata' => [
                        'model' => $model,
                        'response_id' => $responseId,
                    ],
                    'usage' => $usage,
                ]);

                DB::transaction(function () use ($conversation, $assistantMessage, $usage, $model, $responseId) {
                    $conversation->messages()->create([
                        'role' => 'assistant',
                        'content' => $assistantMessage !== '' ? $assistantMessage : 'Assistant did not respond.',
                        'metadata' => [
                            'model' => $model,
                            'usage' => $usage,
                            'response_id' => $responseId,
                        ],
                    ]);

                    $conversation->update(['last_message_at' => now()]);
                });
            } catch (Throwable $exception) {
                Log::error('OpenRouter stream failed', [
                    'conversation_id' => $conversation->id,
                    'message' => $exception->getMessage(),
                ]);

                $this->streamEvent([
                    'event' => 'error',
                    'conversation_id' => $conversation->id,
                    'message' => 'Failed to contact assistant. Please try again later.',
                ]);
            }
        }, 200, [
            'Content-Type' => 'text/event-stream',
            'Cache-Control' => 'no-cache, no-transform',
            'Connection' => 'keep-alive',
            'X-Accel-Buffering' => 'no',
        ]);
    }

    protected function resolveConversation(User $user, ?int $conversationId, string $message): Conversation
    {
        if ($conversationId) {
            return $user->conversations()->findOrFail($conversationId);
        }

        return $user->conversations()->create([
            'title' => mb_substr($message, 0, 80),
            'last_message_at' => now(),
        ]);
    }

    protected function buildApiPayload(Conversation $conversation, User $user, string $latestMessage): array
    {
        $history = $conversation->messages()
            ->latest('id')
            ->limit(20)
            ->get()
            ->sortBy('id')
            ->values();

        $messages = [
            ['role' => 'system', 'content' => $this->systemPrompt()],
        ];

        foreach ($history as $entry) {
            $messages[] = [
                'role' => $entry->role,
                'content' => $entry->content,
            ];
        }

        return [
            'model' => 'openai/gpt-oss-20b:free',
            'messages' => $messages,
            'stream' => true,
        ];
    }

    protected function formatCurrency($value): string
    {
        $numeric = is_numeric($value) ? (float) $value : 0.0;

        return number_format($numeric, 0, ',', '.') . '₫';
    }

    protected function streamEvent(array $payload): void
    {
        echo 'data: ' . json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n\n";

        if (function_exists('ob_flush')) {
            @ob_flush();
        }

        flush();
    }

    protected function handleProviderStreamPacket(
        string $packet,
        int $conversationId,
        string &$assistantMessage,
        ?array &$usage,
        ?string &$responseId,
        ?string &$model
    ): bool {
        $lines = preg_split("/\r?\n/", $packet) ?: [];

        foreach ($lines as $line) {
            $line = trim($line);

            if ($line === '' || !str_starts_with($line, 'data:')) {
                continue;
            }

            $data = trim(substr($line, 5));

            if ($data === '[DONE]') {
                return true;
            }

            $decoded = json_decode($data, true);

            if (! is_array($decoded)) {
                continue;
            }

            $responseId = $decoded['id'] ?? $responseId;
            $model = $decoded['model'] ?? $model;
            $usage = $decoded['usage'] ?? $usage;

            $delta = data_get($decoded, 'choices.0.delta.content');

            if (is_string($delta) && $delta !== '') {
                $assistantMessage .= $delta;

                $this->streamEvent([
                    'event' => 'delta',
                    'conversation_id' => $conversationId,
                    'content' => $delta,
                ]);
            }
        }

        return false;
    }

    protected function tryHandleShortcuts(User $user, string $latestMessage): ?array
    {
        $normalized = Str::of($latestMessage)->lower()->squish()->value();
        $normalizedAscii = Str::of($normalized)->ascii()->value();

        $bestSellerTriggers = ['sản phẩm bán chạy', 'best seller'];
        $bestSellerAsciiTriggers = ['san pham ban chay', 'best seller'];

        if (in_array($normalized, $bestSellerTriggers, true) || in_array($normalizedAscii, $bestSellerAsciiTriggers, true)) {
            return $this->buildBestSellerResponse();
        }

        $ordersTriggers = ['đơn hàng tôi đã mua'];
        $ordersAsciiTriggers = ['don hang toi da mua'];

        if (in_array($normalized, $ordersTriggers, true) || in_array($normalizedAscii, $ordersAsciiTriggers, true)) {
            return $this->buildUserOrdersResponse($user);
        }

        return null;
    }

    protected function buildBestSellerResponse(): array
    {
        $bestSellers = OrderItem::select('product_id', DB::raw('SUM(quantity) as total_quantity'))
            ->with(['product' => function ($query) {
                $query->select('id', 'name', 'price');
            }])
            ->groupBy('product_id')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        if ($bestSellers->isEmpty()) {
            return [
                'message' => 'Hiện chưa có dữ liệu để xác định sản phẩm bán chạy.',
                'metadata' => [
                    'shortcut' => 'best_sellers',
                    'count' => 0,
                ],
            ];
        }

        $lines = $bestSellers->map(function ($item, $index) {
            $product = $item->product;
            $name = $product?->name ?? ('Sản phẩm #' . $item->product_id);
            $price = $product?->price !== null ? $this->formatCurrency($product->price) : 'Giá chưa cập nhật';
            $quantity = (int) ($item->total_quantity ?? 0);

            return sprintf('%d. %s - %s (%d lượt thuê)', $index + 1, $name, $price, $quantity);
        })->all();

        return [
            'message' => "Top 5 sản phẩm bán chạy:\n" . implode("\n", $lines),
            'metadata' => [
                'shortcut' => 'best_sellers',
                'count' => $bestSellers->count(),
            ],
        ];
    }

    protected function buildUserOrdersResponse(User $user): array
    {
        $orders = Order::with(['items.product' => function ($query) {
            $query->select('id', 'name');
        }])
            ->where('user_id', $user->id)
            ->latest('created_at')
            ->limit(5)
            ->get();

        if ($orders->isEmpty()) {
            return [
                'message' => 'Bạn chưa có đơn hàng nào trong hệ thống.',
                'metadata' => [
                    'shortcut' => 'user_orders',
                    'count' => 0,
                ],
            ];
        }

        $lines = $orders->map(function (Order $order, $index) {
            $status = $order->status ?? 'Chưa cập nhật';
            $total = $this->formatCurrency($order->total_amount ?? 0);
            $period = $this->formatOrderPeriod($order);

            $items = $order->items->map(function ($item) {
                $productName = $item->product?->name ?? ('Sản phẩm #' . $item->product_id);

                return $productName . ' x' . $item->quantity;
            })->implode(', ');

            $details = sprintf('%d. Đơn #%s - Trạng thái: %s - Tổng: %s', $index + 1, $order->id, $status, $total);

            if ($period !== null) {
                $details .= "\n   {$period}";
            }

            if ($items !== '') {
                $details .= "\n   Sản phẩm: {$items}";
            }

            return $details;
        })->all();

        return [
            'message' => "Đây là các đơn hàng gần đây của bạn:\n" . implode("\n\n", $lines),
            'metadata' => [
                'shortcut' => 'user_orders',
                'count' => $orders->count(),
            ],
        ];
    }

    protected function formatOrderPeriod(Order $order): ?string
    {
        $start = $this->formatDate($order->start_date ?? null);
        $end = $this->formatDate($order->end_date ?? null);

        if ($start !== null && $end !== null) {
            return "Thời gian thuê: {$start} - {$end}";
        }

        if ($start !== null) {
            return "Bắt đầu: {$start}";
        }

        if ($end !== null) {
            return "Kết thúc: {$end}";
        }

        return null;
    }

    protected function formatDate($value): ?string
    {
        if ($value === null || $value === '') {
            return null;
        }

        try {
            return Carbon::parse($value)->format('d/m/Y');
        } catch (Throwable $exception) {
            return (string) $value;
        }
    }

    protected function systemPrompt(): string
    {
        return 'Bạn là trợ lý ảo của nền tảng thương mại điện tử cho thuê đồ ReRent. ' .
            'Ưu tiên sử dụng dữ liệu cửa hàng (sản phẩm, đơn hàng, thanh toán) được cung cấp trong các thông điệp hệ thống. ' .
            'Gợi ý người dùng thử các lệnh nhanh: "sản phẩm bán chạy" (hoặc "best seller") để xem top sản phẩm và "đơn hàng tôi đã mua" để xem lịch sử đơn hàng của họ.';
    }
}
