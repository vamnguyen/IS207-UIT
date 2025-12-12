"use client";

import { useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { LoginFormData, loginSchema } from "@/lib/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
  const BASE_URL = API_URL.replace(/\/api\/?$/, ""); 

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormData) => {
    try {
      const data = await login(values);
      Cookies.set("auth_token", data.access_token);
      toast.success("Đăng nhập thành công!");
      router.push("/");
    } catch (error: any) {
      toast.error("Đăng nhập thất bại: " + error.message);
    }
  };

  return (
    <Card className="rounded-2xl border bg-card/80 backdrop-blur-sm shadow-sm">
      <CardContent className="p-8 space-y-6"> {/* Thêm space-y-6 để giãn cách đẹp */}
        
        {/* 1. PHẦN TIÊU ĐỀ */}
        <div className="space-y-2 text-center">
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Đăng nhập
          </h1>
          <p className="text-sm text-muted-foreground">
            Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
          </p>
        </div>

        {/* 2. SOCIAL LOGIN */}
        <div className="grid grid-cols-2 gap-4">
          {/* Nút Google */}
          <a
            href={`${BASE_URL}/auth/google`}
            className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </a>
          {/* Nút Facebook */}
          <a
            href={`${BASE_URL}/auth/facebook`}
            className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-accent hover:text-accent-foreground transition-colors text-sm font-medium"
          >
            <svg className="h-4 w-4 text-[#1877F2] fill-current" viewBox="0 0 24 24"><path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036c-2.148 0-2.797 1.66-2.797 3.54v.437h4.064l-.679 3.667h-3.385v7.98h-5.017Z" /></svg>
            Facebook
          </a>
        </div>

        {/* 3. DIVIDER (Hoặc đăng nhập bằng email) */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-4 text-muted-foreground font-medium">
              hoặc đăng nhập bằng email
            </span>
          </div>
        </div>

        {/* 4. FORM NHẬP LIỆU */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        className="pl-10 rounded-2xl"
                        disabled={form.formState.isSubmitting}
                        placeholder="example@gmail.com"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        className="pl-10 pr-10 rounded-2xl"
                        type={showPassword ? "text" : "password"}
                        disabled={form.formState.isSubmitting}
                        placeholder="••••••••"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={form.formState.isSubmitting}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-[#2c6c24] hover:text-[#2c6c24]/80 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#2c6c24] hover:bg-[#2c6c24]/90 text-white" 
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Đăng nhập
            </Button>
          </form>
        </Form>
      <div className="text-center text-sm">
          <span className="text-muted-foreground">Chưa có tài khoản? </span>
          <Link
            href="/register"
            className="font-medium text-[#2c6c24] hover:underline hover:text-[#2c6c24]/90"
          >
            Đăng ký ngay
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}