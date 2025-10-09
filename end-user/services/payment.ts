import axiosInstance from "@/lib/axiosInstance";
import { CheckoutByCardResponse } from "@/lib/response";

export const checkoutByCard = async (): Promise<CheckoutByCardResponse> => {
  const response = await axiosInstance.post("/checkout/card");
  return response.data;
};
