<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{CartItem, Order, OrderItem, Payment};
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

class PaymentController extends Controller
{
    /**
     * Tạo phiên thanh toán Stripe Checkout
     */
    public function checkoutCard(Request $request)
    {
        $validated = $request->validate([
        'address' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Lấy toàn bộ cart items của user
        $cartItems = CartItem::whereHas('cart', fn($q) => $q->where('user_id', $user->id))
            ->with('product')
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Giỏ hàng trống.'], 400);
        }

        // Tính tổng tiền (VND)
        $totalAmount = $cartItems->sum('total_price');

        DB::beginTransaction();
        try {
            // 1️⃣ Tạo đơn hàng tạm thời (pending)
            $order = Order::create([
                'user_id' => $user->id,
                'start_date' => $cartItems->min('start_date'),
                'end_date' => $cartItems->max('end_date'),
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'address' => $validated['address'],
            ]);

            // 2️⃣ Lưu từng sản phẩm vào order_items
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price ?? 0,
                    'days' => $item->days,
                    'subtotal' => $item->total_price,
                ]);
            }

            // 3️⃣ Tạo bản ghi payment (pending)
            $payment = Payment::create([
                'order_id' => $order->id,
                'payment_method' => 'card',
                'amount' => $totalAmount,
                'status' => 'pending',
            ]);

            // 4️⃣ Tạo session thanh toán Stripe
            $stripe = new StripeClient(config('cashier.secret'));

            $lineItems = $cartItems->map(function ($item) {
                return [
                    'price_data' => [
                        'currency' => 'vnd',
                        'product_data' => [
                            'name' => $item->product->name,
                        ],
                        'unit_amount' => intval($item->total_price),
                    ],
                    'quantity' => 1,
                ];
            })->toArray();

            $session = $stripe->checkout->sessions->create([
                'mode' => 'payment',
                'payment_method_types' => ['card'],
                'line_items' => $lineItems,
                'metadata' => [
                    'order_id' => $order->id,
                    'payment_id' => $payment->id,
                    'user_id' => $user->id,
                ],
                'success_url' => env('FRONTEND_URL') . '/checkout/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url' => env('FRONTEND_URL') . '/checkout/cancel',
                'customer_email' => $user->email,
            ]);

            DB::commit();

            return response()->json(['url' => $session->url]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Stripe webhook xử lý sau khi thanh toán hoàn tất
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $orderId = $session->metadata->order_id ?? null;
            $paymentId = $session->metadata->payment_id ?? null;

            if ($orderId && $paymentId) {
                DB::transaction(function () use ($orderId, $paymentId) {
                    $order = Order::find($orderId);
                    $payment = Payment::find($paymentId);

                    if ($order && $order->status === 'pending') {
                        // ✅ Cập nhật trạng thái đơn hàng
                        $order->update(['status' => 'confirmed']);

                        // ✅ Cập nhật trạng thái thanh toán
                        if ($payment) {
                            $payment->update(['status' => 'completed']);
                        }

                        // ✅ Xóa giỏ hàng sau thanh toán thành công
                        CartItem::whereHas('cart', fn($q) => $q->where('user_id', $order->user_id))->delete();
                    }
                });
            }
        }

        return response()->json(['status' => 'success']);
    }
}
