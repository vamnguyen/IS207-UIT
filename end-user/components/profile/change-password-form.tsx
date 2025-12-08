"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Cookies from "js-cookie"; 

export function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Lấy token từ Cookies
    const token = Cookies.get("auth_token"); 
    
    if (!token) {
        setError("Bạn chưa đăng nhập! (Không tìm thấy token)");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Gửi kèm Token
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.current_password || "Đổi mật khẩu thất bại");
      }

      setSuccess("Đổi mật khẩu thành công!");
      toast.success("Đổi mật khẩu thành công!");
      // Reset form
      setFormData({ current_password: "", password: "", password_confirmation: "" });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-card text-card-foreground shadow-sm mt-6">
      <h3 className="text-lg font-semibold mb-4">Đổi mật khẩu</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <div className="space-y-2">
          <Label htmlFor="current_password">Mật khẩu hiện tại</Label>
          <Input
            id="current_password"
            type="password"
            placeholder="••••••••"
            required
            value={formData.current_password}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu mới</Label>
            <Input
                id="password"
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                required
                value={formData.password}
                onChange={handleChange}
            />
            </div>

            <div className="space-y-2">
            <Label htmlFor="password_confirmation">Xác nhận mật khẩu mới</Label>
            <Input
                id="password_confirmation"
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                required
                value={formData.password_confirmation}
                onChange={handleChange}
            />
            </div>
        </div>

        {/* Thông báo lỗi/thành công */}
        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
        {success && <div className="text-green-500 text-sm font-medium">{success}</div>}

        <Button type="submit" disabled={loading}>
          {loading ? "Đang lưu..." : "Cập nhật mật khẩu"}
        </Button>
      </form>
    </div>
  );
}