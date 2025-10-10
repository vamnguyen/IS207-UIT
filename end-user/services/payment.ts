import axiosInstance from "@/lib/axiosInstance";
import { CheckoutByCardResponse } from "@/lib/response";

export const checkoutByCard = async ({
  address,
}: {
  address: string;
}): Promise<CheckoutByCardResponse> => {
  const response = await axiosInstance.post("/checkout/card", { address });
  return response.data;
};

export const checkoutByCash = async ({
  address,
}: {
  address: string;
}): Promise<{ message: string; order_id: string }> => {
  const response = await axiosInstance.post("/checkout/cash", { address });
  return response.data;
};
