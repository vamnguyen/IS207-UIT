<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class ShopOrderController extends Controller
{
    /**
     * Get all orders containing products from the authenticated shop
     */
    public function index(Request $request)
    {
        $shopId = $request->user()->id;

        // Get orders that have at least one item from this shop
        $orders = Order::with(['user', 'items.product', 'payment', 'evidences.user'])
            ->whereHas('items.product', function ($query) use ($shopId) {
                $query->where('shop_id', $shopId);
            })
            ->orderByDesc('created_at')
            ->get();

        return response()->json($orders);
    }

    /**
     * Get a specific order detail (if it contains shop's products)
     */
    public function show(Request $request, $id)
    {
        $shopId = $request->user()->id;

        $order = Order::with(['user', 'items.product', 'payment', 'evidences.user'])
            ->whereHas('items.product', function ($query) use ($shopId) {
                $query->where('shop_id', $shopId);
            })
            ->findOrFail($id);

        return response()->json($order);
    }
}
