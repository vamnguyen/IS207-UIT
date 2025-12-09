import { z } from "zod";
import { PaymentMethod, Role } from "./enum";

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

export const customerInfoSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ tên"),
  email: z.email("Email không hợp lệ").min(1, "Vui lòng nhập email"),
  address: z.string().min(1, "Vui lòng nhập địa chỉ"),
  notes: z.string().optional(),
  paymentMethod: z.enum(PaymentMethod),
});
export type CustomerInfo = z.infer<typeof customerInfoSchema>;

export const changePasswordSchema = z
  .object({
    current_password: z.string().optional(),
    password: z.string().min(8, "Mật khẩu mới phải có ít nhất 8 ký tự"),
    password_confirmation: z.string().min(8, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["password_confirmation"],
  });
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
});
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    password_confirmation: z.string().min(8, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Mật khẩu không khớp",
    path: ["password_confirmation"],
  });
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
