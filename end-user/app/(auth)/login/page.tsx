import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { FacebookLoginButton } from "@/components/auth/facebook-button";
import { GoogleLoginButton } from "@/components/auth/google-button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng nhập tài khoản",
};

export default function LoginPage() {
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

          <LoginForm />

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

          <div className="flex flex-col gap-3">
            <FacebookLoginButton />
            <GoogleLoginButton />
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
