import {
  loginParams,
  registerParams,
  changePasswordParams,
  forgotPasswordParams,
  resetPasswordParams,
} from "@/lib/params";
import axiosInstance from "@/lib/axiosInstance";
import { User } from "@/lib/types";
import { LoginResponse, RegisterResponse } from "@/lib/response";

export const register = async (
  data: registerParams
): Promise<RegisterResponse> => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/register`,
    data
  );
  return response.data;
};

export const login = async (data: loginParams): Promise<LoginResponse> => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/login`,
    data
  );
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/logout`
  );
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user`
  );
  return response.data;
};

export const changePassword = async (data: changePasswordParams) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/change-password`,
    data
  );
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/forgot-password`,
    { email }
  );
  return response.data;
};

export const resetPassword = async (data: resetPasswordParams) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/reset-password`,
    data
  );
  return response.data;
};
