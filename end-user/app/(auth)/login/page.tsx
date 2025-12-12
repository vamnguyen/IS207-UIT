import type { Metadata } from "next";
import AuthLayout from "@/components/auth/auth-layout"; 
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập | ReRent",
};

export default function LoginPage() {
  return (
    <AuthLayout
      heroTitle="Welcome back!"
      heroSubtitle="Đăng nhập để tiếp tục quản lý sự kiện của bạn"
    >
      {/* 
      - font-sans: Font chữ hiện đại, sạch sẽ.
      - text-white: Mặc định chữ màu trắng.
      - antialiased: Làm mịn chữ cho đẹp hơn.
      */}
      <div className="font-sans text-white antialiased">
        <LoginForm />
      </div>
    </AuthLayout>
  );
}