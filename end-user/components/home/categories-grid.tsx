import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { mockCategories } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export function CategoriesGrid() {
  return (
    <section className="py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-balance">
            Khám phá danh mục sản phẩm
          </h2>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Từ thiết bị công nghệ hiện đại đến đồ gia dụng thiết yếu, chúng tôi
            có mọi thứ bạn cần.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockCategories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur">
                <CardContent className="p-6">
                  <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-primary/10 to-primary/5">
                    <img
                      src={category.image_url}
                      alt={category.category_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {category.category_name}
                    </h3>
                    <p className="text-sm text-muted-foreground text-pretty">
                      {category.description}
                    </p>
                    <div className="flex items-center text-primary text-sm font-medium pt-2">
                      Xem thêm
                      <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
