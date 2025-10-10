import type { Metadata } from "next";
import ClientProductsPage from "./client-page";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
};

export default function ProductsPage() {
  return <ClientProductsPage />;
}
