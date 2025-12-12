import type { Metadata } from "next";
import AuthLayout from "@/components/auth/auth-layout"; // Gọi Layout chia đôi màn hình
import { RegisterForm } from "@/components/auth/register-form"; 
export const metadata: Metadata = {
  title: "Đăng ký tài khoản | ReRent",
  description: "Tạo tài khoản để bắt đầu thuê và cho thuê đồ dùng sự kiện",
};

export default function RegisterPage() {
  return (
    <AuthLayout
      // Đổi tiêu đề cho phù hợp với trang Đăng ký
      heroTitle="Tham gia cùng ReRent"
      heroSubtitle="Tạo tài khoản ngay để khám phá hàng ngàn thiết bị và dịch vụ cho sự kiện của bạn."
    >
      {/* Form đăng ký sẽ nằm gọn gàng bên trái (hoặc giữa) của Layout */}
      <RegisterForm />
    </AuthLayout>
  );
}