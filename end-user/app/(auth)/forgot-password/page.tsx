"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.email || "Có lỗi xảy ra");
      }

      setStatus("success");
      setMessage("Chúng tôi đã gửi link đặt lại mật khẩu vào email của bạn. Vui lòng kiểm tra hộp thư!");
    } catch (error: any) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Quên mật khẩu?
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Nhập email để lấy lại mật khẩu
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-md bg-green-50 p-4 text-green-700 border border-green-200">
            <p>{message}</p>
            <div className="mt-4 text-center">
              <Link href="/login" className="font-medium text-green-700 underline hover:text-green-600">
                Quay lại đăng nhập
              </Link>
            </div>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md shadow-sm">
              <div>
                <Label htmlFor="email-address" className="sr-only">
                  Email
                </Label>
                <Input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="Nhập địa chỉ email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={status === "loading"}
                />
              </div>
            </div>

            {status === "error" && (
              <div className="text-sm text-red-600 text-center">{message}</div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
              </Button>
            </div>

            <div className="text-center text-sm">
              <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}