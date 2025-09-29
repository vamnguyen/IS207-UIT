import { ProductsGrid } from "@/components/products/products-grid";
import { ProductsFilters } from "@/components/products/products-filters";
import { ProductsHeader } from "@/components/products/products-header";
import { mockProducts } from "@/lib/mock-data";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ProductsHeader />

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProductsFilters />
          </div>

          <div className="lg:col-span-3">
            <ProductsGrid products={mockProducts} />
          </div>
        </div>
      </div>
    </div>
  );
}
