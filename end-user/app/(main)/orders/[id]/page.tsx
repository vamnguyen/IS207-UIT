import type { Metadata } from "next";
import { DetailsOrderClient } from "./client-page";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | RentHub",
  description: "Xem chi tiết đơn hàng thuê",
};

export default function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <DetailsOrderClient id={Number(params.id)} />
    </div>
  );
}
