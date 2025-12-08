<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Auth;
use Exception;

class SocialAuthController extends Controller
{
    // Danh sách các provider cho phép
    protected $providers = ['google', 'facebook'];

    // --- Hàm Redirect (Không đổi) ---
    public function redirectToProvider($provider)
    {
        if (!in_array($provider, $this->providers)) {
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . '/login?error=invalid_provider');
        }

        return Socialite::driver($provider)->stateless()->redirect();
    }

    // --- Hàm Xử lý Callback (ĐÃ SỬA) ---
    public function handleAuthCallback($provider)
    {
        if (!in_array($provider, $this->providers)) {
            return response()->json(['error' => 'Provider không hợp lệ'], 400);
        }

        try {
            // 1. CẤU HÌNH BỎ QUA XÁC MINH SSL CHO LOCALHOST (FIX LỖI VÒNG LẶP REDIRECT)
            $guzzleOptions = [
                'verify' => false, 
            ];
            // Khởi tạo Client với cấu hình verify=false
            $httpClient = new Client($guzzleOptions); 
            
            // 2. LẤY USER
            $socialUser = Socialite::driver($provider)
                ->stateless()
                // Gắn HTTP Client đã cấu hình vào driver để bỏ qua lỗi SSL/cURL 60
                ->setHttpClient($httpClient) 
                ->user();

            // 3. XỬ LÝ USER
            $user = User::updateOrCreate(
                ['email' => $socialUser->getEmail()],
                [
                    'name' => $socialUser->getName(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'email_verified_at' => now(),
                    'password' => null,
                ]
            );

            // Nếu muốn chắc chắn role là customer cho user mới tạo
            if (!$user->role) {
                $user->role = 'customer';
                $user->save();
            }

            // 4. TẠO TOKEN
            $token = $user->createToken('social_login')->plainTextToken;

            // 5. REDIRECT VỀ FRONTEND 
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . "/auth/social-callback/?token=" . $token . "&status=success");
        } catch (Exception $e) {
            // Log lỗi để debug
            \Log::error("Social Login Error ({$provider}): " . $e->getMessage());

            // Chuyển hướng lỗi về Frontend
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
            return redirect($frontendUrl . "/auth/social-callback/?status=error&message=" . urlencode($e->getMessage()));
        }
    }
}