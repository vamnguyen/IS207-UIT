import axiosInstance from "@/lib/axiosInstance";

export const getCategories = async () => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/categories`
  );
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`
  );
  return response.data;
};
