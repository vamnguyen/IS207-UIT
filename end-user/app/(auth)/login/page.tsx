import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { FacebookLoginButton } from "@/components/auth/facebook-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng nhập tài khoản",
};

export default function LoginPage() {
  // Lấy đường dẫn từ env (đang là .../api)
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  
  //  Tạo một biến riêng cho Social Login (Cắt bỏ chữ /api đi) ---
  // Kết quả sẽ ra: http://localhost:8000
  const BASE_URL = API_URL.replace(/\/api\/?$/, ""); 

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-balance">Đăng nhập</h1>
            <p className="text-muted-foreground text-pretty">
              Chào mừng bạn quay trở lại với ReRent
            </p>
          </div>

          {/* Form đăng nhập email/pass truyền thống */}
          <LoginForm />

          {/* ---: SOCIAL LOGIN --- */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Hoặc tiếp tục với
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Nút Google - Dùng BASE_URL (không có /api) */}
            <a
              href={`${BASE_URL}/auth/google`}
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Google
            </a>

            {/* Nút Facebook - Dùng BASE_URL (không có /api) */}
            <a
              href={`${BASE_URL}/auth/facebook`}
              className="flex items-center justify-center gap-2 px-4 py-2 border rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
            >
              <svg className="h-4 w-4 text-[#1877F2] fill-current" viewBox="0 0 24 24">
                 <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.66-2.797 3.54v.437h4.064l-.679 3.667h-3.385v7.98h-5.017Z" />
              </svg>
              Facebook
            </a>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}