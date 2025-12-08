<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;

class NewPasswordController extends Controller
{
    /**
     * 1. Gửi link reset password vào email
     */
    public function forgotPassword(Request $request)
    {
        // Validate email có tồn tại và đúng định dạng
        $request->validate(['email' => 'required|email']);

        // Gửi link reset (Laravel sẽ tự tìm user và tạo token)
        // Kết quả trả về là trạng thái: RESET_LINK_SENT hoặc INVALID_USER
        $status = Password::sendResetLink(
            $request->only('email')
        );

        // Nếu gửi thành công
        if ($status === Password::RESET_LINK_SENT) {
            return response()->json(['status' => __($status)]);
        }

        // Nếu lỗi (ví dụ email không tồn tại)
        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }

    /**
     * 2. Đặt lại mật khẩu mới (Reset)
     */
    public function reset(Request $request)
    {
        // Validate dữ liệu gửi lên
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ]);

        // Thực hiện đổi mật khẩu
        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ])->setRememberToken(Str::random(60));

                $user->save();
            }
        );

        // Nếu đổi thành công
        if ($status === Password::PASSWORD_RESET) {
            return response()->json(['status' => __($status)]);
        }

        // Nếu lỗi (token sai, email sai...)
        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}