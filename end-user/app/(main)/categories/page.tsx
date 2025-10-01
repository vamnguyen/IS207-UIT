import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { mockCategories } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Danh mục sản phẩm",
};

export default function CategoriesPage() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur">
                <CardContent className="p-6">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src={category.image_url || "/file.svg"}
                      alt={category.category_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-xl group-hover:text-primary transition-colors">
                      {category.category_name}
                    </h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium pt-2">
                      Xem sản phẩm
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
