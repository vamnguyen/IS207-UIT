import type { Metadata } from "next";
import React from "react";
import { AuthHeader } from "@/components/layout/auth-header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | ReRent",
    absolute: "Đăng nhập và đăng ký | ReRent",
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
