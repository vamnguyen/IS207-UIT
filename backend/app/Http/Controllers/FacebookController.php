<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Laravel\Socialite\Facades\Socialite;


class FacebookController extends Controller
{
    /**
     * Chuyển hướng người dùng sang Facebook
     */
    public function redirectToFacebook()
    {
        /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
        $driver = Socialite::driver('facebook');
        $driver->stateless();
        return $driver->redirect();
    }

    /**
     * Xử lý khi Facebook trả về kết quả
     */
    public function handleFacebookCallback()
    {
        try {
            /** @var \Laravel\Socialite\Two\AbstractProvider $driver */
            $driver = Socialite::driver('facebook');
            $driver->stateless();
            // Lấy thông tin user từ Facebook
            $facebookUser = $driver->user();

            // Tìm user trong database
            $user = User::where('facebook_id', $facebookUser->getId())->first();

            if (!$user) {
                // Kiểm tra xem email đã tồn tại chưa
                $user = User::where('email', $facebookUser->getEmail())->first();

                if ($user) {
                    // Nếu email đã có, cập nhật facebook_id cho user đó
                    $user->update([
                        'facebook_id' => $facebookUser->getId(),
                        'avatar' => $facebookUser->getAvatar(),
                    ]);
                } else {
                    // Tạo user mới hoàn toàn
                    $user = User::create([
                        'name' => $facebookUser->getName(),
                        'email' => $facebookUser->getEmail(),
                        'facebook_id' => $facebookUser->getId(),
                        'avatar' => $facebookUser->getAvatar(),
                        'password' => bcrypt(Str::random(16)), // Tạo pass ngẫu nhiên
                        'email_verified_at' => now(),
                    ]);
                }
            } else {
                // Case 1: User đã từng đăng nhập bằng FB trước đó
                // Cập nhật lại avatar
                $user->update([
                    'avatar' => $facebookUser->getAvatar(),
                ]);
            }

            Auth::login($user); // Đăng nhập

            return redirect(env('FRONTEND_URL') . '/auth/callback?token=' . $user->createToken('auth_token')->plainTextToken);
        } catch (\Exception $e) {
            return redirect(env('FRONTEND_URL') . '/login?error=' . urlencode($e->getMessage()));
        }
    }
}
