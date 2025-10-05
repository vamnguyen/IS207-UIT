import type { Metadata } from "next";
import React from "react";
import { AuthHeader } from "@/components/layout/auth-header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | RentHub",
    absolute: "Đăng nhập và đăng ký | RentHub",
  },
  description: "Đăng nhập và đăng ký để bắt đầu thuê đồ dễ dàng",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AuthHeader />
      {children}
      <Footer />
    </>
  );
}
