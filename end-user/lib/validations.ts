import { z } from "zod";
import { Role } from "./enum";

export const registerSchema = z.object({
  name: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  password_confirmation: z.string().min(6, "Vui lòng xác nhận mật khẩu"),
  role: z.enum(Role).optional(),
});
export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().min(1, "Vui lòng nhập email"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});
export type LoginFormData = z.infer<typeof loginSchema>;
