import React from "react";
import Sidebar from "@/components/layout/sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen gap-10 mr-10">
      <Sidebar />
      <main className="flex-1 overflow-auto items-end">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  );
}
