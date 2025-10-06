import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-balance">Đăng ký</h1>
            <p className="text-muted-foreground text-pretty">
              Tạo tài khoản để bắt đầu thuê đồ dễ dàng
            </p>
          </div>

          <RegisterForm />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
