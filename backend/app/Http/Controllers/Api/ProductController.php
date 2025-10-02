<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
// use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with(['category', 'shop'])->paginate(10);
        return response()->json($products);
    }

    /**
     * Tạo sản phẩm (chỉ shop & admin)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'image_url'   => 'nullable|string',
            'images'      => 'nullable|array',
        ]);

        try {
            $product = Product::create([
            'name'        => $request->name,
            'slug'        => Str::slug($request->name),
            'description' => $request->description,
            'price'       => $request->price,
            'stock'       => $request->stock,
            'image_url'   => $request->image_url,
            'images'      => $request->images,
            'status'      => $request->status ?? 'Còn hàng',
            'category_id' => $request->category_id,
            'shop_id'     => $user->role === 'shop' ? $user->id : ($request->shop_id ?? $user->id),
            ]);

            return response()->json($product, 201);

        } catch (\Exception $e) {
            // Log::error('Product creation failed:', [
            //     'error' => $e->getMessage(),
            //     'file' => $e->getFile(),
            //     'line' => $e->getLine(),
            //     'trace' => $e->getTraceAsString()
            // ]);

            return response()->json([
                'message' => 'Product creation failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return response()->json($product->load(['category', 'shop']));
    }

    /**
     * Lấy danh sách sản phẩm theo category id (public)
     */
    public function getByCategoryId(Request $request, int $categoryId)
    {
        $perPage = (int) ($request->query('per_page', 10));

        $products = Product::with(['category', 'shop'])
            ->where('category_id', $categoryId)
            ->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Cập nhật sản phẩm (shop chỉ được cập nhật sản phẩm của mình)
     */
    public function update(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->role === 'shop' && $product->shop_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - not your product'], 403);
        }

        $request->validate([
            'name'        => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'sometimes|numeric|min:0',
            'stock'       => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|exists:categories,id',
            'image_url'   => 'nullable|string',
            'images'      => 'nullable|array',
        ]);

        $product->update(array_merge(
            $request->all(),
            $request->name ? ['slug' => Str::slug($request->name)] : []
        ));

        return response()->json($product);
    }

    /**
     * Xoá sản phẩm (shop chỉ được xoá sản phẩm của mình)
     */
    public function destroy(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->role === 'shop' && $product->shop_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - not your product'], 403);
        }

        $product->delete();
        return response()->json(['message' => 'Product deleted successfully']);
    }
}
