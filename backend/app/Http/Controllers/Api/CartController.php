<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    /**
     * Lấy giỏ hàng của user hiện tại
     */
    public function index()
    {
        $user = Auth::user();

        $cart = Cart::with('items.product.category')
            ->where('user_id', $user->id)
            ->first();

        if (!$cart) {
            return response()->json(['data' => []]);
        }

        return response()->json([
            'data' => $cart->items,
            'total_items' => $cart->items->count(),
            'total_price' => $cart->items->sum('total_price'),
        ]);
    }

    /**
     * Thêm sản phẩm vào giỏ
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity'   => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'days'       => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        // Tạo hoặc lấy cart của user hiện tại
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);

        // Bảo đảm cart thuộc về user đang login
        if ($cart->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access to this cart'], 403);
        }

        $product = Product::findOrFail($validated['product_id']);
        $days = $validated['days'];
        $quantity = $validated['quantity'];
        $totalPrice = $product->price * $days * $quantity;

        // Kiểm tra nếu sản phẩm đã có trong giỏ -> cập nhật
        $cartItem = CartItem::where('cart_id', $cart->id)
            ->where('product_id', $product->id)
            ->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $quantity,
                'days' => $days,
                'total_price' => $cartItem->total_price + $totalPrice,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);
        } else {
            $cartItem = CartItem::create([
                'cart_id' => $cart->id,
                'product_id' => $product->id,
                'quantity' => $quantity,
                'days' => $days,
                'total_price' => $totalPrice,
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
            ]);
        }

        return response()->json([
            'message' => 'Product added to cart successfully',
            'data' => $cartItem->load('product.category'),
        ], 201);
    }

    /**
     * Cập nhật sản phẩm trong giỏ
     */
    public function update(Request $request, $itemId)
    {
        $validated = $request->validate([
            'quantity'   => 'required|integer|min:1',
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
            'days'       => 'required|integer|min:1',
        ]);

        $user = Auth::user();

        $cartItem = CartItem::with('cart')->findOrFail($itemId);

        // Kiểm tra quyền sở hữu
        if ($cartItem->cart->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access to this cart item'], 403);
        }

        $product = $cartItem->product;
        $days = $validated['days'];
        $quantity = $validated['quantity'];

        $cartItem->update([
            'quantity' => $quantity,
            'days' => $days,
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'total_price' => $product->price * $days * $quantity,
        ]);

        return response()->json([
            'message' => 'Cart item updated successfully',
            'data' => $cartItem->load('product.category'),
        ]);
    }

    /**
     * Xóa 1 sản phẩm khỏi giỏ
     */
    public function destroy($itemId)
    {
        $user = Auth::user();

        $cartItem = CartItem::with('cart')->findOrFail($itemId);

        // Kiểm tra quyền sở hữu
        if ($cartItem->cart->user_id !== $user->id) {
            return response()->json(['error' => 'Unauthorized access to this cart item'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Cart item removed']);
    }

    /**
     * Xóa toàn bộ giỏ hàng
     */
    public function clear()
    {
        $user = Auth::user();

        $cart = Cart::where('user_id', $user->id)->first();

        if ($cart) {
            // Chỉ xóa cart của user hiện tại
            $cart->items()->delete();
        }

        return response()->json(['message' => 'Cart cleared successfully']);
    }
}
