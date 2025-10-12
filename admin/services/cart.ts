import axiosInstance from "@/lib/axiosInstance";
import { addProductToCartParams, updateCartItemParams } from "@/lib/params";
import { CartItem } from "@/lib/types";

export const getCart = async (): Promise<CartItem[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/cart`
  );
  return response.data.data;
};

export const addProductToCart = async (data: addProductToCartParams) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/cart`,
    data
  );
  return response.data.data;
};

export const updateCartItem = async (
  cartId: number,
  data: updateCartItemParams
) => {
  const response = await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`,
    data
  );
  return response.data.data;
};

export const deleteCartItem = async (cartId: number) => {
  const response = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/cart/${cartId}`
  );
  return response.data;
};

export const clearCart = async () => {
  const response = await axiosInstance.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/cart`
  );
  return response.data;
};
