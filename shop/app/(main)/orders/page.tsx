import type { Metadata } from "next";
import { OrdersClient } from "@/components/orders/orders-client";

export const metadata: Metadata = {
  title: "Đơn hàng | ReRent Shop",
  description: "Quản lý đơn hàng của shop",
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Đơn hàng</h1>
        <p className="text-muted-foreground mt-1">
          Xem và quản lý đơn hàng chứa sản phẩm của bạn
        </p>
      </div>
      <OrdersClient />
    </div>
  );
}
