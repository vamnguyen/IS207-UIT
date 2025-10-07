import Cookies from "js-cookie";
import { updateCartItemParams } from "@/lib/params";
import { CartItem } from "@/lib/types";
import {
  addProductToCart,
  clearCart,
  deleteCartItem,
  getCart,
  updateCartItem,
} from "@/services/cart";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getCart,
    enabled: !!Cookies.get("auth_token"),
    retry: 1,
  });
};

export const useAddProductToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addProductToCart,
    onSuccess: (data: CartItem) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Thêm ${data.product.name} vào giỏ hàng thành công`);
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      cartId,
      data,
    }: {
      cartId: number;
      data: updateCartItemParams;
    }) => updateCartItem(cartId, data),
    // Optimistic UI
    onMutate: async ({ cartId, data }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartItem[]>(["cart"]);
      // Optimistically update cart item quantity
      if (previousCart) {
        queryClient.setQueryData<CartItem[]>(["cart"], (prev) =>
          prev?.map((item) =>
            item.id === cartId ? { ...item, quantity: data.quantity } : item
          )
        );
      }
      return { previousCart };
    },
    onError: (err, variables, context) => {
      // Rollback nếu lỗi
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
      toast.error("Cập nhật giỏ hàng thất bại");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onSuccess: (data: CartItem) => {
      toast.success(`Cập nhật ${data.product.name} trong giỏ hàng thành công`);
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: number) => deleteCartItem(cartId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Xoá khỏi giỏ hàng thành công`);
    },
  });
};

export const useClearCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`Xoá tất cả sản phẩm trong giỏ hàng thành công`);
    },
  });
};
