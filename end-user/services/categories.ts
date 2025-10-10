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
