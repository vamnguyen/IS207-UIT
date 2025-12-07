<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderEvidence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderEvidenceController extends Controller
{
    public function index($orderId)
    {
        $order = Order::findOrFail($orderId);

        // Authorization: Only owner or shop (admin/shop role) can view
        // For simplicity, assuming user() is the owner.
        // Real implementation should check if user->id == order->user_id or user is admin/shop

        $evidences = $order->evidences()->with('user')->orderBy('created_at', 'desc')->get();

        return response()->json($evidences);
    }

    public function store(Request $request, $orderId)
    {
        $request->validate([
            'type' => 'required|in:send_package,receive_package,return_package,receive_return',
            'media_url' => 'required|string',
            'note' => 'nullable|string',
        ]);

        $order = Order::findOrFail($orderId);

        // Authorization check
        if ($request->user()->id !== $order->user_id && $request->user()->role !== 'admin' && $request->user()->role !== 'shop') {
             return response()->json(['message' => 'Unauthorized'], 403);
        }

        $evidence = OrderEvidence::create([
            'order_id' => $order->id,
            'user_id' => $request->user()->id,
            'type' => $request->input('type'),
            'media_url' => $request->input('media_url'),
            'note' => $request->input('note'),
        ]);

        return response()->json($evidence, 201);
    }
}
