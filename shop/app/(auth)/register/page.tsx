import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";
import { FacebookLoginButton } from "@/components/auth/facebook-button";
import { GoogleLoginButton } from "@/components/auth/google-button";
import Link from "next/link";
import Image from "next/image";
import Logo from "@/public/logo.png";
import AuthBg from "@/public/auth-bg.jpg";

export const metadata: Metadata = {
  title: "Đăng ký tài khoản",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {/* Logo */}
        <div className="p-6 w-fit">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={Logo}
              alt="ReRent Logo"
              width={60}
              height={60}
              className="aspect-auto"
            />
          </Link>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold text-balance">Đăng ký</h1>
              <p className="text-muted-foreground text-pretty">
                Tạo tài khoản để bắt đầu cho thuê đồ trên ReRent.
              </p>
            </div>

            {/* Social Login Buttons */}
            <div className="flex gap-3">
              <GoogleLoginButton />
              <FacebookLoginButton />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Hoặc đăng ký bằng email
                </span>
              </div>
            </div>

            <RegisterForm />

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Đăng nhập
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0">
          <Image
            src={AuthBg}
            alt="Concert background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-12 text-white">
          <h2 className="text-4xl font-bold italic mb-4">
            Tham gia cùng ReRent
          </h2>
          <p className="text-lg text-white/80">
            Tạo tài khoản ngay để bắt đầu cho thuê thiết bị và dịch vụ của bạn.
          </p>
        </div>
      </div>
    </div>
  );
}
