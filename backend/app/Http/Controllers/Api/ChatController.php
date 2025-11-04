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

        $shortcutResponse = $this->tryHandleShortcuts($conversation, $user, $data['message']);

        if ($shortcutResponse !== null) {
            DB::transaction(function () use ($conversation, $shortcutResponse) {
                $conversation->messages()->create([
                    'role' => 'assistant',
                    'content' => $shortcutResponse['message'],
                    'metadata' => $shortcutResponse['metadata'],
                ]);

                $conversation->update(['last_message_at' => now()]);
            });

            return response()->json([
                'conversation_id' => $conversation->id,
                'message' => $shortcutResponse['message'],
                'usage' => null,
            ]);
        }

        $apiPayload = $this->buildApiPayload($conversation, $user, $data['message']);

        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.openrouter.key'),
                'Content-Type' => 'application/json',
                'HTTP-Referer' => config('app.url'),
                'X-Title' => config('app.name'),
            ])->post('https://openrouter.ai/api/v1/chat/completions', $apiPayload)->throw();
        } catch (Throwable $exception) {
            Log::error('OpenRouter request failed', [
                'conversation_id' => $conversation->id,
                'message' => $exception->getMessage(),
            ]);

            return response()->json([
                'error' => 'Failed to contact assistant. Please try again later.',
            ], 500);
        }

        $completion = $response->json();

        $assistantMessage = $completion['choices'][0]['message']['content'] ?? 'Assistant did not respond.';

        DB::transaction(function () use ($conversation, $assistantMessage, $completion, $apiPayload) {
            $conversation->messages()->create([
                'role' => 'assistant',
                'content' => $assistantMessage,
                'metadata' => [
                    'model' => $apiPayload['model'] ?? null,
                    'usage' => $completion['usage'] ?? null,
                    'response_id' => $completion['id'] ?? null,
                ],
            ]);

            $conversation->update(['last_message_at' => now()]);
        });

        return response()->json([
            'conversation_id' => $conversation->id,
            'message' => $assistantMessage,
            'usage' => $completion['usage'] ?? null,
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
            'stream' => false,
        ];
    }

    protected function formatCurrency($value): string
    {
        $numeric = is_numeric($value) ? (float) $value : 0.0;

        return number_format($numeric, 0, ',', '.') . '₫';
    }

    protected function tryHandleShortcuts(Conversation $conversation, User $user, string $latestMessage): ?array
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
            'message' => "Top sản phẩm bán chạy:\n" . implode("\n", $lines),
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
