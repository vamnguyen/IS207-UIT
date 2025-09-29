"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, User, Mail, Phone, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Email không hợp lệ");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return false;
    }
    if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      toast.error("Số điện thoại không hợp lệ");
      return false;
    }
    if (!formData.password.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return false;
    }
    if (formData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return false;
    }
    if (!formData.agreeTerms) {
      toast.error("Vui lòng đồng ý với điều khoản sử dụng");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock registration - in real app, this would call your auth API
      const newUser = {
        id: Date.now().toString(),
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        role: "customer",
      };

      localStorage.setItem("user", JSON.stringify(newUser));
      toast.success("Đăng ký thành công!");
      router.push("/");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName">Họ và tên</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="fullName"
                type="text"
                placeholder="Nguyễn Văn An"
                value={formData.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                className="pl-10 rounded-2xl"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="pl-10 rounded-2xl"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="phone"
                type="tel"
                placeholder="0123456789"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="pl-10 rounded-2xl"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className="pl-10 pr-10 rounded-2xl"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                className="pl-10 pr-10 rounded-2xl"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full rounded-2xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              "Đăng ký"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
