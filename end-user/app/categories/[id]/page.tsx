import { ProductsGrid } from "@/components/products/products-grid";
import { mockCategories, mockProducts } from "@/lib/mock-data";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = mockCategories.find((c) => c.id === params.id);

  if (!category) {
    notFound();
  }

  // Filter products by category
  const categoryProducts = mockProducts.filter(
    (p) => p.category_id === category.id
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              {category.category_name}
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              {category.description}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị{" "}
              <span className="font-medium">{categoryProducts.length}</span> sản
              phẩm
            </p>
          </div>
        </div>

        {categoryProducts.length > 0 ? (
          <ProductsGrid products={categoryProducts} />
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              Chưa có sản phẩm nào trong danh mục này.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
