"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

// Tách Component Form ra để bọc Suspense 
function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Lấy token và email từ URL (do Laravel gửi sang)
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  // Nếu link không hợp lệ (thiếu token)
  if (!token || !email) {
    return (
      <div className="text-center text-red-600">
        Link không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirmation) {
      setStatus("error");
      setMessage("Mật khẩu xác nhận không khớp!");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.email || "Có lỗi xảy ra");
      }

      setStatus("success");
      setMessage("Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng sau 3 giây.");
      
      // Chuyển hướng về trang login sau 3s
      setTimeout(() => router.push("/login"), 3000);

    } catch (error: any) {
      setStatus("error");
      setMessage(error.message || "Link reset có thể đã hết hạn.");
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          Đặt lại mật khẩu
        </h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Nhập mật khẩu mới cho tài khoản {email}
        </p>
      </div>

      {status === "success" ? (
        <div className="rounded-md bg-green-50 p-4 text-green-700 text-center">
          <p>{message}</p>
          <Link href="/login" className="underline mt-2 block">Đăng nhập ngay</Link>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4 rounded-md shadow-sm">
            <div>
              <Label htmlFor="password">Mật khẩu mới</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tối thiểu 8 ký tự"
              />
            </div>
            <div>
              <Label htmlFor="password_confirmation">Xác nhận mật khẩu</Label>
              <Input
                id="password_confirmation"
                type="password"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>
          </div>

          {status === "error" && (
            <div className="text-sm text-red-600 text-center">{message}</div>
          )}

          <Button type="submit" className="w-full" disabled={status === "loading"}>
            {status === "loading" ? "Đang xử lý..." : "Đổi mật khẩu"}
          </Button>
        </form>
      )}
    </div>
  );
}

// Component chính bọc Suspense để tránh lỗi build Next.js
export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <Suspense fallback={<div>Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}