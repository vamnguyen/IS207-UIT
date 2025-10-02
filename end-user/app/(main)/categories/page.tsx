import type { Metadata } from "next";
import { getCategories } from "@/services/categories";
import { CategoriesList } from "@/components/categories/categories-list";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm",
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              Danh mục sản phẩm
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Khám phá các danh mục sản phẩm đa dạng của chúng tôi
            </p>
          </div>
        </div>
        <CategoriesList categories={categories} />
      </div>
    </div>
  );
}
