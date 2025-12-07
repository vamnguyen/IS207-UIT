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

export const getOrderEvidences = async (orderId: number) => {
  const response = await axiosInstance.get(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/evidences`
  );
  return response.data;
};

export const uploadOrderEvidence = async (
  orderId: number,
  data: { type: string; media_url: string; note?: string }
) => {
  const response = await axiosInstance.post(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/evidences`,
    data
  );
  return response.data;
};
