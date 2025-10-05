import type { Metadata } from "next";
import ClientMyProductsPage from "./client-page";

export const metadata: Metadata = {
  title: "Sản phẩm cho thuê của tôi",
};

export default function MyProductsPage() {
  return (
    <div>
      <ClientMyProductsPage />
    </div>
  );
}
