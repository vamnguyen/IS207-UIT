import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/components/providers/providers";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "RentHub - Nền tảng cho thuê đồ dùng hàng đầu Việt Nam",
  description:
    "Thuê dễ dàng, trả nhanh chóng, giá cả hợp lý. Từ thiết bị điện tử đến đồ gia dụng, tất cả đều có sẵn tại RentHub.",
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
        className={`${inter.variable} antialiased`}
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
