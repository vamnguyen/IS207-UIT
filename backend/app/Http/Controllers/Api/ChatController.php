<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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

        $context = $this->buildContextForMessage($user, $latestMessage);
        if ($context) {
            $messages[] = ['role' => 'system', 'content' => $context];
            Log::debug('Chat context payload', [
                'conversation_id' => $conversation->id,
                'context' => $context,
            ]);
        }

        foreach ($history as $entry) {
            $messages[] = [
                'role' => $entry->role,
                'content' => $entry->content,
            ];
        }

        Log::debug('Chat payload constructed', [
            'conversation_id' => $conversation->id,
            'has_context' => $context !== null,
        ]);

        return [
            'model' => 'openai/gpt-oss-20b:free',
            'messages' => $messages,
            'stream' => false,
        ];
    }

    protected function buildContextForMessage(User $user, string $message): ?string
    {
        $normalized = mb_strtolower($message);
        $asciiNormalized = Str::lower(Str::ascii($message));
        $contextParts = [];

        if ($this->containsAny($normalized, ['bán chạy', 'best seller', 'hot nhất'], $asciiNormalized)) {
            Log::debug('Chat context: fetching best sellers', [
                'user_id' => $user->id,
                'message' => $message,
            ]);
            $bestSellers = Product::query()
                ->select('products.id', 'products.name', 'products.price')
                ->selectRaw('COALESCE(SUM(order_items.quantity), 0) as total_sold')
                ->leftJoin('order_items', 'order_items.product_id', '=', 'products.id')
                ->groupBy('products.id', 'products.name', 'products.price')
                ->orderByDesc('total_sold')
                ->limit(5)
                ->get();

            if ($bestSellers->isNotEmpty()) {
                Log::debug('Chat context: best seller results', [
                    'user_id' => $user->id,
                    'count' => $bestSellers->count(),
                    'product_ids' => $bestSellers->pluck('id'),
                ]);
                $hasSold = $bestSellers->contains(function ($product) {
                    return (int) $product->total_sold > 0;
                });

                $lines = [];
                foreach ($bestSellers as $index => $product) {
                    $lines[] = ($index + 1) . '. ' . $product->name . ' — giá ' . $this->formatCurrency($product->price) . ' (đã bán ' . (int) $product->total_sold . ')';
                }

                if ($hasSold) {
                    $contextParts[] = "Top sản phẩm bán chạy hiện tại:\n" . implode("\n", $lines);
                } else {
                    $latestFallback = Product::query()
                        ->select('id', 'name', 'price')
                        ->orderByDesc('created_at')
                        ->limit(5)
                        ->get();

                    $fallbackLines = [];
                    foreach ($latestFallback as $index => $product) {
                        $fallbackLines[] = ($index + 1) . '. ' . $product->name . ' — giá ' . $this->formatCurrency($product->price);
                    }

                    $contextParts[] = "Chú ý: Hiện chưa có đơn hàng nào để thống kê bán chạy. Hãy nói rõ điều này và gợi ý người dùng tham khảo các sản phẩm nổi bật sau (lọc theo thời gian cập nhật gần đây):\n" . implode("\n", $fallbackLines);
                }
            } else {
                Log::debug('Chat context: no best sellers found', [
                    'user_id' => $user->id,
                ]);
                $contextParts[] = 'Chú ý: Hiện chưa có sản phẩm nào trong hệ thống để thống kê. Hãy mời người dùng quay lại sau hoặc truy cập danh mục sản phẩm.';
            }
        }

        if ($this->containsAny($normalized, ['đơn hàng', 'order', 'đặt hàng', 'đã mua', 'đã order'], $asciiNormalized)) {
            Log::debug('Chat context: fetching recent orders', [
                'user_id' => $user->id,
                'message' => $message,
            ]);
            $orders = Order::query()
                ->with(['items.product'])
                ->where('user_id', $user->id)
                ->latest('created_at')
                ->limit(5)
                ->get();

            if ($orders->isNotEmpty()) {
                $lines = [];
                foreach ($orders as $order) {
                    $items = $order->items->map(function ($item) {
                        return $item->product?->name . ' x' . $item->quantity;
                    })->filter()->implode(', ');

                    $lines[] = '- Đơn #' . $order->id . ' (' . ($order->status ?? 'chưa rõ trạng thái') . ') tổng ' . $this->formatCurrency($order->total_amount) . ($items ? ': ' . $items : '');
                }

                $contextParts[] = "Các đơn hàng gần đây của user:\n" . implode("\n", $lines);
            } else {
                Log::debug('Chat context: no recent orders found', [
                    'user_id' => $user->id,
                ]);
                $contextParts[] = 'Chú ý: Hệ thống chưa ghi nhận đơn hàng nào cho người dùng này. Hãy trả lời nhẹ nhàng rằng chưa có lịch sử đơn hàng và hướng dẫn họ truy cập trang "Đơn hàng" để theo dõi khi có giao dịch.';
            }
        }

        if (empty($contextParts)) {
            Log::debug('Chat context: no contextual data available', [
                'user_id' => $user->id,
                'message' => $message,
            ]);

            return null;
        }

        return "Thông tin nội bộ để tham khảo khi trả lời:\n" . implode("\n\n", $contextParts);
    }

    protected function containsAny(string $haystack, array $needles, ?string $asciiHaystack = null): bool
    {
        foreach ($needles as $needle) {
            if ($needle !== '' && str_contains($haystack, $needle)) {
                return true;
            }

            if ($asciiHaystack !== null) {
                $asciiNeedle = Str::lower(Str::ascii($needle));
                if ($asciiNeedle !== '' && str_contains($asciiHaystack, $asciiNeedle)) {
                    return true;
                }
            }
        }

        return false;
    }

    protected function formatCurrency($value): string
    {
        $numeric = is_numeric($value) ? (float) $value : 0.0;

        return number_format($numeric, 0, ',', '.') . '₫';
    }

    protected function systemPrompt(): string
    {
        return 'Bạn là trợ lý ảo của nền tảng thương mại điện tử cho thuê đồ ReRent Store. ' .
            'Ưu tiên sử dụng dữ liệu cửa hàng (sản phẩm, đơn hàng, thanh toán) được cung cấp trong các thông điệp hệ thống. ' .
            'Nếu thiếu thông tin, trả lời trung thực và gợi ý người dùng thực hiện thao tác phù hợp trên website.';
    }
}
