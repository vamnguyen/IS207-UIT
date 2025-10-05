import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

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
              Chào mừng bạn quay trở lại với RentHub
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
