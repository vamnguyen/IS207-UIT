import axiosInstance from "@/lib/axiosInstance";
import { Category } from "@/lib/types";

export const getCategories = async (): Promise<Category[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`
  );
  return response.data;
};

export const getCategoryById = async (id: string): Promise<Category> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
  );
  return response.data;
};

export const createCategory = async (payload: {
  name: string;
  description?: string;
  image_url?: string;
}): Promise<Category> => {
  const res = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`,
    payload
  );
  return res.data;
};

export const updateCategory = async (
  id: number,
  payload: { name: string; description?: string; image_url?: string }
): Promise<Category> => {
  const res = await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`,
    payload
  );
  return res.data;
};

export const deleteCategory = async (id: number) => {
  const res = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
  );
  return res.data;
};
