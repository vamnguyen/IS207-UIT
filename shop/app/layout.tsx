import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/providers";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReRent - Nền tảng cho thuê đồ dùng hàng đầu Việt Nam",
  description:
    "Thuê dễ dàng, trả nhanh chóng, giá cả hợp lý. Từ thiết bị điện tử đến đồ gia dụng, tất cả đều có sẵn tại ReRent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Toaster />
          {children}
          <Analytics />
        </Providers>
      </body>
    </html>
  );
}
