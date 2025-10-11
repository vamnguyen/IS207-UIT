import type { Metadata } from "next";
import { OrdersClient } from "@/components/orders/orders-client";

export const metadata: Metadata = {
  title: "Đơn hàng của tôi | ReRent",
  description: "Quản lý và theo dõi đơn hàng thuê của bạn",
};

export default function OrdersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-balance">Đơn hàng của tôi</h1>
        <p className="mt-2 text-muted-foreground">
          Theo dõi và quản lý tất cả đơn hàng thuê của bạn
        </p>
      </div>
      <OrdersClient />
    </div>
  );
}
