import axiosInstance from "@/lib/axiosInstance";
import { ProductStatus } from "@/lib/enum";
import { PaginatedResponse } from "@/lib/response";
import { Product, ProductFilters } from "@/lib/types";

export const getProducts = async (
  page: number = 1,
  per_page: number = 6,
  filters?: ProductFilters
): Promise<PaginatedResponse<Product>> => {
  const params: any = { page, per_page };

  if (filters) {
    if (filters.min_price) params.min_price = filters.min_price;
    if (filters.max_price) params.max_price = filters.max_price;
    if (filters.q) params.q = filters.q;
    if (filters.categories && filters.categories.length)
      params.categories = filters.categories.join(",");
    if (filters.status && filters.status.length)
      params.status = filters.status.join(",");
    if (filters.sort) params.sort = filters.sort;
  }

  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/products`,
    {
      params,
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
        status: ProductStatus.IN_STOCK,
      },
    }
  );
  return response.data;
};
