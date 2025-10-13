import axiosInstance from "@/lib/axiosInstance";
import type { PaginatedResponse } from "@/lib/response";
import type { User } from "@/lib/types";

export const getAdminUsers = async (
  page = 1,
  per_page = 20
): Promise<PaginatedResponse<User>> => {
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users?page=${page}&per_page=${per_page}`
  );
  return res.data;
};

export const getAdminUsersByRole = async (
  role: string,
  page = 1,
  per_page = 20
): Promise<User[]> => {
  const res = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/role/${role}?page=${page}&per_page=${per_page}`
  );
  return res.data.data;
};

export const updateUserRole = async (id: number, role: string) => {
  const res = await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role`,
    { role }
  );
  return res.data as User;
};

export const deleteUser = async (id: number) => {
  const res = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`
  );
  return res.data;
};
