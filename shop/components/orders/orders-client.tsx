"use client";

import { useQuery } from "@tanstack/react-query";
import { getShopOrders } from "@/services/orders";
import { OrdersList } from "./orders-list";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Package, Loader2 } from "lucide-react";

export function OrdersClient() {
  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: getShopOrders,
    retry: 1,
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Loader2 className="h-8 w-8 mx-auto animate-spin text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Đang tải danh sách đơn hàng...
          </p>
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
            Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            Bạn chưa có đơn hàng nào
          </h3>
          <p className="text-muted-foreground">
            Khi bạn có đơn hàng được đặt, chúng sẽ xuất hiện ở đây.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <OrdersList orders={orders} />;
}
