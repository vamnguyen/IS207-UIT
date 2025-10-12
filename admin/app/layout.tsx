import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {
  LayoutDashboard,
  Users,
  FolderTree,
  Package,
  ShoppingCart,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Admin Dashboard - ReRent",
  description: "Admin Dashboard for ReRent Services",
};

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Người dùng", href: "/users", icon: Users },
  { name: "Danh mục", href: "/categories", icon: FolderTree },
  { name: "Sản phẩm", href: "/products", icon: Package },
  { name: "Đơn hàng", href: "/orders", icon: ShoppingCart },
  { name: "Bình luận", href: "/comments", icon: MessageSquare },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen gap-10 mr-10">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-card">
            <div className="flex h-16 items-center border-b px-6">
              <h1 className="text-xl font-bold">Admin ReRent</h1>
            </div>
            <nav className="space-y-1 p-4">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3"
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 overflow-auto items-end">
            <div className="container py-6">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
