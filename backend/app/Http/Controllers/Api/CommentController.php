<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Comment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommentController extends Controller
{
    /**
     * Tạo comment mới (bao gồm cả nested comment)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'content' => 'required|string',
            'parent_id' => 'nullable|integer|exists:comments,id',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $postId = $validated['product_id'];
            $userId = $request->user()->id;
            $content = $validated['content'];
            $parentId = $validated['parent_id'] ?? null;

            $parent = null;
            $rightValue = 0;

            if ($parentId) {
                $parent = Comment::where('id', $parentId)->firstOrFail();

                $rightValue = $parent->right;

                // Dịch phải các comment có right >= rightValue
                Comment::where('product_id', $postId)
                    ->where('right', '>=', $rightValue)
                    ->update(['right' => DB::raw('`right` + 2')]);

                // Dịch phải các comment có left > rightValue
                Comment::where('product_id', $postId)
                    ->where('left', '>', $rightValue)
                    ->update(['left' => DB::raw('`left` + 2')]);
            } else {
                // Comment gốc → lấy max(right)
                $maxRight = Comment::where('product_id', $postId)->max('right');
                $rightValue = $maxRight ? $maxRight + 1 : 1;
            }

            // Tạo comment mới
            $comment = new Comment();
            $comment->content = $content;
            $comment->user_id = $userId;
            $comment->product_id = $postId;
            $comment->parent_id = $parentId;
            $comment->left = $rightValue;
            $comment->right = $rightValue + 1;
            $comment->save();

            return response()->json($comment, 201);
        });
    }

    /**
     * Lấy danh sách comment (phân trang, có thể lấy theo parent)
     */
    public function index(Request $request)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|integer|exists:products,id',
                'parent_id' => 'nullable|integer|exists:comments,id',
                'page' => 'nullable|integer|min:1',
                'limit' => 'nullable|integer|min:1|max:100',
            ]);

            $page = $validated['page'] ?? 1;
            $limit = $validated['limit'] ?? 10;
            $productId = $validated['product_id'];
            $parentId = $validated['parent_id'] ?? null;

            if ($parentId) {
                $parent = Comment::findOrFail($parentId);

                $query = Comment::where('product_id', $productId)
                    ->where('left', '>', $parent->left)
                    ->where('right', '<', $parent->right)
                    ->orderBy('left', 'asc')
                    ->with(['user', 'parent']);
            } else {
                $query = Comment::where('product_id', $productId)
                    ->orderBy('left', 'asc')
                    ->with(['user', 'parent']);
            }

            $comments = $query->paginate($limit, ['*'], 'page', $page);

            return response()->json([
                'data' => $comments->items(),
                'total_data' => $comments->total(),
                'page' => $comments->currentPage(),
                'limit' => $comments->perPage(),
                'total_pages' => $comments->lastPage(),
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch comments:', [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            return response()->json([
                'message' => 'Failed to fetch comments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cập nhật comment
     */
    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $productId = $validated['product_id'];
        $userId = $request->user()->id;
        $content = $validated['content'];

        $comment = Comment::where('id', $id)
            ->where('product_id', $productId)
            ->where('user_id', $userId)
            ->firstOrFail();

        $comment->content = $content;
        $comment->edited = true;
        $comment->edited_at = now();
        $comment->save();

        return response()->json(['success' => true]);
    }

    /**
     * Xoá comment và toàn bộ con của nó
     */
    public function destroy(Request $request, $id)
    {
        $validated = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
        ]);

        $productId = $validated['product_id'];
        $userId = $request->user()->id;

        return DB::transaction(function () use ($id, $productId, $userId) {
            $comment = Comment::where('id', $id)
                ->where('product_id', $productId)
                ->where('user_id', $userId) // Chỉ cho phép xóa comment của chính user đó
                ->firstOrFail();

            $leftValue = $comment->left;
            $rightValue = $comment->right;
            $width = $rightValue - $leftValue + 1;

            // Xoá toàn bộ comment trong phạm vi (bao gồm con)
            Comment::where('product_id', $productId)
                ->whereBetween('left', [$leftValue, $rightValue])
                ->delete();

            // Cập nhật các comment phía sau
            Comment::where('product_id', $productId)
                ->where('left', '>', $rightValue)
                ->update(['left' => DB::raw("`left` - {$width}")]);

            Comment::where('product_id', $productId)
                ->where('right', '>', $rightValue)
                ->update(['right' => DB::raw("`right` - {$width}")]);

            return response()->json(['success' => true]);
        });
    }
}
