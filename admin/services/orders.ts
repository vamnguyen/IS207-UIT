import axiosInstance from "@/lib/axiosInstance";
import { Order } from "@/lib/types";

export const getOrders = async (): Promise<Order[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`
  );
  return response.data;
};

export const getOrderById = async (id: number): Promise<Order> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`
  );
  return response.data;
};

export const getAllOrdersForAdmin = async (): Promise<Order[]> => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/admin/orders`
  );
  return response.data;
};

export const updateOrderStatus = async (
  id: number,
  status: string
): Promise<Order> => {
  const response = await axiosInstance.put(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/status`,
    { status }
  );
  return response.data;
};
