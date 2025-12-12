"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Mail } from "lucide-react";

// Component UI
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Có lỗi xảy ra");
      }

      setIsSuccess(true);
      toast.success("Đã gửi email khôi phục!");
    } catch (error: any) {
      toast.error(error.message || "Gửi yêu cầu thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Container bao ngoài: Căn giữa màn hình (flex center) + Nền xám nhẹ
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 px-4 py-12">
      
      {/* Cái Card nằm giữa */}
      <div className="w-full max-w-md space-y-8">
        
        {isSuccess ? (
          // --- TRẠNG THÁI THÀNH CÔNG ---
          <Card className="rounded-2xl border border-gray-100 shadow-xl bg-white">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-8 w-8 text-[#2c6c24]" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">Kiểm tra email</CardTitle>
              <CardDescription className="text-center mt-2 text-gray-600">
                Chúng tôi đã gửi link đặt lại mật khẩu đến: <br />
                <span className="font-semibold text-gray-900 mt-1 block text-lg">
                  {email}
                </span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <Button asChild className="w-full h-11 rounded-xl bg-[#2c6c24] hover:bg-[#2c6c24]/90 text-white font-medium">
                <Link href="/login">Quay lại đăng nhập</Link>
              </Button>
              <div className="text-center">
                <button
                  onClick={() => setIsSuccess(false)}
                  className="text-sm font-medium text-[#2c6c24] hover:underline"
                >
                  Gửi lại (thử email khác)
                </button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // --- TRẠNG THÁI FORM NHẬP ---
          <Card className="rounded-2xl border border-gray-100 shadow-xl bg-white">
            <CardHeader className="space-y-1 pb-6">
              <div className="flex justify-center mb-4">
                 
              </div>
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Quên mật khẩu?</CardTitle>
              <CardDescription className="text-center text-gray-500">
                Nhập email của bạn để lấy lại quyền truy cập
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="font-medium text-gray-700">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    className="h-11 rounded-xl border-gray-300 focus:border-[#2c6c24] focus:ring-[#2c6c24]"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 rounded-xl bg-[#2c6c24] hover:bg-[#2c6c24]/90 text-white font-medium transition-all hover:scale-[1.01]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Đang gửi...
                    </>
                  ) : (
                    "Gửi liên kết đặt lại"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-[#2c6c24] transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
        
      </div>
    </div>
  );
}