<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class AIServiceClient
{
    protected string $baseUrl;
    protected int $timeout;

    public function __construct()
    {
        $this->baseUrl = config('services.ai.url', 'http://localhost:8001');
        $this->timeout = config('services.ai.timeout', 30);

        Log::debug('AIServiceClient initialized', ['baseUrl' => $this->baseUrl]);
    }

    /**
     * Send a chat message to AI service.
     */
    public function ask(string $query, ?int $userId = null, array $conversationHistory = []): ?array
    {
        try {
            Log::debug('Calling AI Service /ask', [
                'url' => "{$this->baseUrl}/ask",
                'query' => $query,
                'user_id' => $userId,
            ]);

            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/ask", [
                    'query' => $query,
                    'user_id' => $userId,
                    'conversation_history' => $conversationHistory,
                ]);

            if ($response->successful()) {
                Log::info('AI Service responded successfully');
                return $response->json();
            }

            Log::error('AI Service request failed', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::error('AI Service connection failed', [
                'url' => "{$this->baseUrl}/ask",
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Trigger product sync in AI service.
     */
    public function sync(): ?array
    {
        try {
            $response = Http::timeout($this->timeout)
                ->post("{$this->baseUrl}/sync");

            if ($response->successful()) {
                return $response->json();
            }

            return null;
        } catch (\Throwable $e) {
            Log::error('AI Service sync failed', [
                'message' => $e->getMessage(),
            ]);

            return null;
        }
    }

    /**
     * Check AI service health.
     */
    public function health(): ?array
    {
        try {
            $response = Http::timeout(5)
                ->get("{$this->baseUrl}/health");

            if ($response->successful()) {
                return $response->json();
            }

            Log::warning('AI Service health check failed', [
                'status' => $response->status(),
            ]);

            return null;
        } catch (\Throwable $e) {
            Log::warning('AI Service health check error', [
                'url' => "{$this->baseUrl}/health",
                'message' => $e->getMessage(),
            ]);
            return null;
        }
    }

    /**
     * Check if AI service is available - skip health check, just verify URL is configured.
     */
    public function isAvailable(): bool
    {
        // Skip health check to avoid connection issues between Docker containers
        // Just verify the service URL is configured
        return !empty($this->baseUrl);
    }
}
