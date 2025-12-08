<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;


class GoogleController extends Controller
{
    /**
     * Chuyển hướng người dùng sang Google
     */
    public function redirectToGoogle()
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver('google');
        $driver->stateless();
        return $driver->redirect();
    }

    /**
     * Xử lý khi Google trả về kết quả
     */
    public function handleGoogleCallback()
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('google');
            $driver->stateless();
            // Lấy thông tin user từ Google
            $googleUser = $driver->user();

            // Tìm user trong database bằng google_id
            $user = User::where('google_id', $googleUser->getId())->first();

            if (!$user) {
                // Kiểm tra xem email đã tồn tại chưa
                $user = User::where('email', $googleUser->getEmail())->first();

                if ($user) {
                    // Nếu email đã có, cập nhật google_id cho user đó
                    $user->update([
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'email_verified_at' => $user->email_verified_at ?? now(),
                    ]);
                } else {
                    // Tạo user mới hoàn toàn
                    $user = User::create([
                        'name' => $googleUser->getName(),
                        'email' => $googleUser->getEmail(),
                        'google_id' => $googleUser->getId(),
                        'avatar' => $googleUser->getAvatar(),
                        'password' => bcrypt(Str::random(16)), // Tạo pass ngẫu nhiên
                        'email_verified_at' => now(),
                    ]);
                }
            } else {
                // Case 1: User đã từng đăng nhập bằng Google trước đó
                // Cập nhật lại avatar
                $user->update([
                    'avatar' => $googleUser->getAvatar(),
                ]);
            }

            Auth::login($user); // Đăng nhập

            return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $user->createToken('auth_token')->plainTextToken);
        } catch (\Exception $e) {
            Log::error('Google login error: ' . $e->getMessage());
            return redirect(env('FRONTEND_URL') . '/login?error=' . urlencode($e->getMessage()));
        }
    }
}
