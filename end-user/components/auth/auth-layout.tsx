"use client";

import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
  heroTitle?: string;
  heroSubtitle?: string;
}

export default function AuthLayout({
  children,
  heroTitle = "Tham gia RERENT",
  heroSubtitle = "Tạo tài khoản để bắt đầu tổ chức sự kiện của bạn",
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      {/* LEFT: FORM SECTION */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          

          {children}
        </div>
      </div>

      {/* RIGHT: HERO IMAGE SECTION */}
      <div className="relative hidden lg:block lg:w-1/2 overflow-hidden">
        <img
          src="/tochucsukien.jpg"
          alt="Tổ chức sự kiện"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay gradient để chữ dễ đọc */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-green-800/40 to-transparent" />

        {/* Text overlay */}
        <div className="relative z-10 flex flex-col justify-end p-12 h-full text-white">
          <div className="space-y-4">
            <h2 className="font-serif text-4xl xl:text-5xl font-semibold leading-tight">
              {heroTitle}
            </h2>
            <p className="text-lg max-w-md opacity-90"> {/* Thêm opacity-90 cho dòng phụ nó nhạt hơn xíu cho đẹp */}
              {heroSubtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
