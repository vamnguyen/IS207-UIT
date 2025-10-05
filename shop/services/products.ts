import axiosInstance from "@/lib/axiosInstance";
import { PaginatedResponse } from "@/lib/response";
import { Product } from "@/lib/types";

export const getProducts = async (
  page: number = 1,
  per_page: number = 9
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

export const getProductsByShopId = async (
  shopId: string,
  page: number,
  per_page: number
): Promise<PaginatedResponse<Product>> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/shops/${shopId}/products`,
    {
      params: {
        page,
        per_page,
      },
    }
  );
  return response.data;
};

export const createProduct = async (data: Partial<Product>) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    data
  );
  return response.data;
};

export const updateProduct = async (id: number, data: Partial<Product>) => {
  const response = await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`,
    data
  );
  return response.data;
};

export const deleteProduct = async (id: number) => {
  const response = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}`
  );
  return response.data;
};
