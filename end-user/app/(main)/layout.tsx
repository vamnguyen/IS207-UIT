import type { Metadata } from "next";
import React from "react";
import { AppHeader } from "@/components/layout/app-header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: {
    template: "%s | ReRent",
    absolute: "ReRent Việt Nam | Thuê đồ online dễ dàng",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppHeader />
      {children}
      <Footer />
    </>
  );
}
