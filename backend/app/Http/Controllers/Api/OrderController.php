<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Order;
use Illuminate\Validation\Rule;

class OrderController extends Controller
{
    /**
     * Lấy danh sách đơn hàng của user hiện tại
     */
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'items.product', 'payment'])
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }

    /**
     * Lấy danh sách đơn hàng của user hiện tại
     */
    public function getOrdersForAdmin(Request $request)
    {
        $orders = Order::with(['user', 'items.product', 'payment'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }

    /**
     * Xem chi tiết 1 đơn hàng cụ thể
     */
    public function show(Request $request, $id)
    {
        $order = Order::with(['user', 'items.product', 'payment', 'evidences.user'])
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }

    /**
     * Admin: update order status
     */
    public function updateStatus(Request $request, $id)
    {
        // authorization: only admins allowed (route already has role:admin middleware but double-check)
        if (!$request->user() || $request->user()->role !== 'admin') {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => [
                'required',
                Rule::in(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned']),
            ],
        ]);

        $order = Order::with(['user', 'items.product', 'payment'])->findOrFail($id);

        $order->status = $validated['status'];
        $order->save();

        return response()->json($order);
    }
}
