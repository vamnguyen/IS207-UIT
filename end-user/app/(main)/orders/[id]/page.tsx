import type { Metadata } from "next";
import { DetailsOrderClient } from "./client-page";

export const metadata: Metadata = {
  title: "Chi tiết đơn hàng | ReRent",
  description: "Xem chi tiết đơn hàng thuê",
};

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto px-4 py-8">
      <DetailsOrderClient id={Number(id)} />
    </div>
  );
}
