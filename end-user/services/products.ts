import axiosInstance from "@/lib/axiosInstance";
import { PaginatedResponse } from "@/lib/response";
import { Product } from "@/lib/types";

export const getProducts = async (
  page: number = 1,
  per_page: number = 6
): Promise<PaginatedResponse<Product>> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    {
      params: {
        page,
        per_page,
      },
    }
  );
  return response.data;
};

export const getProductById = async (id: string): Promise<Product> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  );
  return response.data;
};

export const getProductsByCategoryId = async (
  categoryId: string,
  page: number = 1,
  per_page: number = 9
): Promise<PaginatedResponse<Product>> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${categoryId}/products`,
    {
      params: {
        page,
        per_page,
      },
    }
  );
  return response.data;
};
