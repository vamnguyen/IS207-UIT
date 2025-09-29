"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Vui lòng nhập email");
      return false;
    }
    if (!formData.email.includes("@")) {
      toast.error("Email không hợp lệ");
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
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock authentication - in real app, this would call your auth API
      if (
        formData.email === "admin@renthub.vn" &&
        formData.password === "admin123"
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "1",
            full_name: "Admin User",
            email: formData.email,
            role: "admin",
          })
        );
        toast.success("Đăng nhập thành công!");
        router.push("/admin");
      } else if (
        formData.email === "user@renthub.vn" &&
        formData.password === "user123"
      ) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: "2",
            full_name: "Nguyễn Văn An",
            email: formData.email,
            role: "customer",
          })
        );
        toast.success("Đăng nhập thành công!");
        router.push("/");
      } else {
        toast.error("Email hoặc mật khẩu không đúng");
      }
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={formData.rememberMe}
                onCheckedChange={(checked) =>
                  handleInputChange("rememberMe", checked as boolean)
                }
                disabled={isLoading}
              />
              <Label htmlFor="remember" className="text-sm cursor-pointer">
                Ghi nhớ đăng nhập
              </Label>
            </div>
            <Button
              variant="link"
              className="p-0 h-auto text-sm"
              disabled={isLoading}
            >
              Quên mật khẩu?
            </Button>
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
                Đang đăng nhập...
              </>
            ) : (
              "Đăng nhập"
            )}
          </Button>

          {/* Demo Accounts */}
          <div className="space-y-3 pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              Tài khoản demo:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-muted/50 text-center">
                <div className="font-medium">Admin</div>
                <div className="text-muted-foreground">admin@renthub.vn</div>
                <div className="text-muted-foreground">admin123</div>
              </div>
              <div className="p-2 rounded-xl bg-muted/50 text-center">
                <div className="font-medium">User</div>
                <div className="text-muted-foreground">user@renthub.vn</div>
                <div className="text-muted-foreground">user123</div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
