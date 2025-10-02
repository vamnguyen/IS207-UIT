import axiosInstance from "@/lib/axiosInstance";
import { Product } from "@/lib/types";

export const getProducts = async (): Promise<Product[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products`
  );
  return response.data.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  );
  return response.data;
};

export const getProductsByCategoryId = async (
  categoryId: string
): Promise<Product[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/products`
  );
  return response.data.data;
};
