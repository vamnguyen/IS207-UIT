<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Mail\ResetPasswordMail;
use Carbon\Carbon;

class PasswordController extends Controller
{
    /**
     * Change password for authenticated user.
     */
    public function changePassword(Request $request)
    {
        $user = $request->user();

        if ($user->google_id || $user->facebook_id) {
             return response()->json(['message' => 'Tài khoản đăng nhập bằng mạng xã hội không thể đổi mật khẩu.'], 403);
        }

        // If user has a password (not social login only), validate current password
        $rules = [
            'password' => 'required|string|min:8|confirmed',
        ];

        if ($user->password) {
            $rules['current_password'] = 'required|string';
        }

        $validator = Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Check current password if applicable
        if ($user->password && !Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'errors' => ['current_password' => ['Mật khẩu hiện tại không chính xác.']]
            ], 422);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();

        return response()->json([
            'message' => 'Đổi mật khẩu thành công.'
        ]);
    }

    /**
     * Send password reset link to email.
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            // To prevent email enumeration, usually returns success or generic message.
            // But for this project, let's just return 404 per requirements.
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->google_id || $user->facebook_id) {
             return response()->json(['message' => 'Tài khoản đăng nhập bằng mạng xã hội không thể đặt lại mật khẩu.'], 403);
        }

        // Generate token
        $token = Str::random(60);

        // Store token in DB
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $request->email],
            [
                'token' => Hash::make($token),
                'created_at' => Carbon::now()
            ]
        );

        // Send Email
        Mail::to($user->email)->send(new ResetPasswordMail($user, $token));

        return response()->json([
            'message' => 'Chúng tôi đã gửi liên kết đặt lại mật khẩu qua email của bạn.'
        ]);
    }

    /**
     * Reset password using token.
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|string|email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Verify token
        $resetRecord = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$resetRecord || !Hash::check($request->token, $resetRecord->token)) {
            return response()->json(['errors' => ['email' => ['Token không hợp lệ hoặc đã hết hạn.']]], 400);
        }

        // Check expiration (60 minutes)
        if (Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['errors' => ['email' => ['Token đã hết hạn.']]], 400);
        }

        // Update password
        $user = User::where('email', $request->email)->first();

        if (!$user) {
             return response()->json(['errors' => ['email' => ['Không tìm thấy người dùng.']]], 404);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        // Delete token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json([
            'message' => 'Đặt lại mật khẩu thành công.'
        ]);
    }
}
