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
