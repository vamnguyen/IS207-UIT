import type { Metadata } from "next";
import ClientProductsPage from "./client-page";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
};

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-64">
          <Spinner />
        </div>
      }
    >
      <ClientProductsPage />
    </Suspense>
  );
}
