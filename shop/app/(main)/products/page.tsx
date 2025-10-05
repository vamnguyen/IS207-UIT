import { ProductsGrid } from "@/components/products/products-grid";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsHeader } from "@/components/products/products-header";
import type { Metadata } from "next";
import { getCategories } from "@/services/categories";
import { getProducts } from "@/services/products";

export const metadata: Metadata = {
  title: "Danh sách sản phẩm",
};

export default async function ProductsPage() {
  const categories = await getCategories();
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProductsHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductsFilters categories={categories} />
          </div>

          <div className="lg:col-span-3">
            <ProductsGrid products={products} />
          </div>
        </div>
      </div>
    </div>
  );
}
