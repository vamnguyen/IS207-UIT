<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $perPage = (int) $request->integer('per_page', 10);
        $perPage = max(1, min($perPage, 50));

        $paginator = $user->conversations()
            ->with(['latestMessage'])
            ->withCount('messages')
            ->orderByDesc('last_message_at')
            ->orderByDesc('id')
            ->paginate($perPage);

        $data = $paginator->getCollection()->map(function (Conversation $conversation) {
            return $this->transformConversation($conversation);
        })->values();

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $conversation = $request->user()->conversations()->create([
            'title' => $data['title'] ?? null,
            'last_message_at' => null,
        ]);

        $conversation->loadMissing(['latestMessage'])->loadCount('messages');

        return response()->json([
            'data' => $this->transformConversation($conversation),
        ], 201);
    }

    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $this->ensureOwnership($request->user()->id, $conversation);
        $conversation->loadMissing(['latestMessage'])->loadCount('messages');

        return response()->json([
            'data' => $this->transformConversation($conversation),
        ]);
    }

    public function update(Request $request, Conversation $conversation): JsonResponse
    {
        $this->ensureOwnership($request->user()->id, $conversation);

        $data = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
        ]);

        $conversation->update([
            'title' => $data['title'] ?? null,
        ]);

        $conversation->loadMissing(['latestMessage'])->loadCount('messages');

        return response()->json([
            'data' => $this->transformConversation($conversation),
        ]);
    }

    public function destroy(Request $request, Conversation $conversation): JsonResponse
    {
        $this->ensureOwnership($request->user()->id, $conversation);
        $conversation->delete();

        return response()->json(null, 204);
    }

    protected function transformConversation(Conversation $conversation): array
    {
        $latestMessage = $conversation->latestMessage;

        return [
            'id' => $conversation->id,
            'title' => $conversation->title,
            'last_message_at' => optional($conversation->last_message_at)->toIso8601String(),
            'created_at' => optional($conversation->created_at)->toIso8601String(),
            'updated_at' => optional($conversation->updated_at)->toIso8601String(),
            'messages_count' => $conversation->messages_count ?? $conversation->messages()->count(),
            'latest_message' => $latestMessage ? [
                'id' => $latestMessage->id,
                'role' => $latestMessage->role,
                'content' => $latestMessage->content,
                'metadata' => $latestMessage->metadata,
                'created_at' => optional($latestMessage->created_at)->toIso8601String(),
            ] : null,
        ];
    }

    protected function ensureOwnership(int $userId, Conversation $conversation): void
    {
        if ($conversation->user_id !== $userId) {
            abort(403);
        }
    }
}
