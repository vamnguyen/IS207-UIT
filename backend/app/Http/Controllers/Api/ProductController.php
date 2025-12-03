<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
// use Illuminate\Support\Facades\Log;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = (int) ($request->query('per_page', 10));
        // Ensure perPage is within reasonable bounds
        $perPage = max(1, min(100, $perPage));

        $query = Product::with(['category', 'shop']);

        // Filters
        // Full-text-ish search: match name or description (partial, case-insensitive)
        if ($request->has('q')) {
            $search = $request->query('q');
            $query->where(function ($builder) use ($search) {
                $builder->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }
        if ($request->has('min_price')) {
            $min = (float) $request->query('min_price');
            $query->where('price', '>=', $min);
        }

        if ($request->has('max_price')) {
            $max = (float) $request->query('max_price');
            $query->where('price', '<=', $max);
        }

        if ($request->has('categories')) {
            $cats = explode(',', $request->query('categories'));
            $query->whereIn('category_id', $cats);
        }

        if ($request->has('status')) {
            $statuses = explode(',', $request->query('status'));
            $query->whereIn('status', $statuses);
        }

        // Sorting
        if ($request->has('sort')) {
            $sort = $request->query('sort');
            switch ($sort) {
                case 'price-low':
                    $query->orderBy('price', 'asc');
                    break;
                case 'price-high':
                    $query->orderBy('price', 'desc');
                    break;
                case 'newest':
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        }

        $products = $query->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Tạo sản phẩm (chỉ shop & admin)
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $validatedData = $request->validate([
            'name'        => 'required|string|max:255',
            'slug'        => 'nullable|string|max:255|unique:products,slug',
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
                'slug'        => $validatedData['slug'] ?? Str::slug($request->name),
                'description' => $request->description,
                'price'       => $request->price,
                'stock'       => $request->stock,
                'image_url'   => $request->images[0] ?? null,
                'images'      => $request->images ?? null,
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
        $perPage = max(1, min(100, $perPage));

        // Lấy status từ query param
        $status = $request->query('status');
        $products = Product::with(['category', 'shop'])
            ->where('category_id', $categoryId)
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            }) // Lọc theo status
            ->paginate($perPage);

        return response()->json($products);
    }

    /**
     * Lấy danh sách sản phẩm theo shop id
     */
    public function getByShopId(Request $request, int $shopId)
    {
        $perPage = (int) ($request->query('per_page', 10));
        $perPage = max(1, min(100, $perPage));

        $products = Product::with(['category', 'shop'])
            ->where('shop_id', $shopId)
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

        $data = $request->all();
        if ($request->name) {
            $data['slug'] = Str::slug($request->name);
        }

        $product->update($data);

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

    // Thêm hàm cập nhật trạng thái sản phẩm (Ngừng kinh doanh)
    public function updateStatus(Request $request, Product $product)
    {
        $user = $request->user();

        if ($user->role === 'shop' && $product->shop_id !== $user->id) {
            return response()->json(['message' => 'Forbidden - not your product'], 403);
        }

        $request->validate([
            'status' => 'required|in:
            Còn hàng,
            Tạm ngưng,
            Ngừng kinh doanh,
            Hết hàng'
        ]);

        $product->update([
            'status' => $request->status
        ]);

        return response()->json([
            'message' => 'Product status updated successfully',
            'product' => $product
        ]);
    }
}
