"use client";

import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "@/services/orders";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Package, Loader2 } from "lucide-react";
import { OrderDetail } from "@/components/orders/order-detail";

export function DetailsOrderClient({ id }: { id: number }) {
  const {
    data: order,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders", id],
    queryFn: () => getOrderById(id),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Đang tải chi tiết đơn hàng...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
          <p className="text-muted-foreground">
            Không thể tải chi tiết đơn hàng. Vui lòng thử lại sau.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="text-muted-foreground">
            Khi bạn đặt hàng, chúng sẽ xuất hiện ở đây.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <OrderDetail order={order} />;
}
