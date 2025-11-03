<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index(Request $request, Conversation $conversation): JsonResponse
    {
        $this->ensureOwnership($request->user()->id, $conversation);

        $limit = (int) $request->integer('limit', 30);
        $limit = max(1, min($limit, 100));

        $query = $conversation->messages()->orderByDesc('id');

        if ($request->filled('before_id')) {
            $query->where('id', '<', (int) $request->input('before_id'));
        }

        $messages = $query->limit($limit + 1)->get();
        $hasMore = $messages->count() > $limit;

        if ($hasMore) {
            $messages = $messages->slice(0, $limit);
        }

        $messages = $messages->sortBy('id')->values();

        return response()->json([
            'data' => $messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'conversation_id' => $message->conversation_id,
                    'role' => $message->role,
                    'content' => $message->content,
                    'metadata' => $message->metadata,
                    'created_at' => optional($message->created_at)->toIso8601String(),
                    'updated_at' => optional($message->updated_at)->toIso8601String(),
                ];
            }),
            'meta' => [
                'has_more' => $hasMore,
                'next_before_id' => ($hasMore && $messages->isNotEmpty()) ? $messages->first()->id : null,
                'limit' => $limit,
            ],
        ]);
    }

    protected function ensureOwnership(int $userId, Conversation $conversation): void
    {
        if ($conversation->user_id !== $userId) {
            abort(403);
        }
    }
}
