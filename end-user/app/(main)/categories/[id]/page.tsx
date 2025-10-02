import { ProductsGrid } from "@/components/products/products-grid";
import { getCategoryById } from "@/services/categories";
import { getProductsByCategoryId } from "@/services/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { id } = await params;
  const category = await getCategoryById(id);
  return {
    title: `${category?.name}`,
    description: category?.description || "",
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category) {
    notFound();
  }

  const categoryProducts = await getProductsByCategoryId(id);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              {category.name}
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
