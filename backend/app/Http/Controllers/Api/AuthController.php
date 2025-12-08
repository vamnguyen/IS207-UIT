<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{
    /**
     * Xử lý yêu cầu đăng ký người dùng mới.
     */
    public function register(Request $request) {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'sometimes|in:admin,shop,customer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role ?? 'customer',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ], 201);
    }

    /**
     * Xử lý yêu cầu đăng nhập.
     */
    public function login(Request $request)
    {
        // Validate
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        // Xác thực người dùng
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Lấy thông tin người dùng đã xác thực
        $user = User::where('email', $request['email'])->firstOrFail();

        // Tạo token mới
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }

    /**
     * Xử lý yêu cầu đăng xuất.
     */
    public function logout(Request $request)
    {
        // Thu hồi token hiện tại của người dùng
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Successfully logged out']);
    }
    public function redirectToProvider($provider)
    {
        // validate provider phải là google hoặc facebook
        if (!in_array($provider, ['google', 'facebook'])) {
            return response()->json(['error' => 'Provider not supported'], 400);
        }

        return Socialite::driver($provider)->stateless()->redirect();
    }

    // 2. Hàm xử lý khi Google/Facebook trả người dùng về
    public function handleProviderCallback($provider)
    {
        try {
            // Lấy thông tin từ Google/Facebook
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            // Tìm user trong DB xem có chưa (dựa vào email hoặc provider_id)
            $user = User::where('email', $socialUser->getEmail())->first();

            if (!$user) {
                // Nếu chưa có thì tạo mới (dựa theo migration sếp gửi)
                $user = User::create([
                    'name' => $socialUser->getName(),
                    'email' => $socialUser->getEmail(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                    'password' => null, // Sếp đã cho phép null trong migration
                ]);
            } else {
                // Nếu có rồi thì update lại provider_id cho chắc
                $user->update([
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'avatar' => $socialUser->getAvatar(),
                ]);
            }

            // Tạo Token đăng nhập
            $token = $user->createToken('auth_token')->plainTextToken;

            // QUAN TRỌNG: Redirect về trang Frontend Next.js kèm theo Token
            // Sếp nhớ thay đổi port 3000 nếu frontend chạy port khác
            $frontendUrl = "http://localhost:3000/auth/callback?token=" . $token;
            
            return redirect($frontendUrl);

        } catch (\Exception $e) {
            // Nếu lỗi thì đá về trang login frontend kèm thông báo lỗi
            return redirect('http://localhost:3000/login?error=social_login_failed');
        }
    }
} // Kết thúc Class

