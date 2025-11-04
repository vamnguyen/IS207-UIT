import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { formatCurrency } from "@/lib/utils";
import { Star } from "lucide-react";
import { Product } from "@/lib/types";

export function FeaturedProducts({ products }: { products: Product[] }) {
  // Get first 6 products as featured
  const featuredProducts = products.slice(0, 6);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl font-bold text-balance">
              Sản phẩm nổi bật
            </h2>
            <p className="text-lg text-muted-foreground text-pretty max-w-2xl">
              Những sản phẩm được yêu thích nhất, chất lượng cao và giá cả hợp
              lý.
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="rounded-2xl bg-transparent">
              Xem tất cả
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card
              key={product.id}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur overflow-hidden"
            >
              <div className="relative">
                <div className="aspect-4/3 overflow-hidden bg-linear-to-br from-muted/50 to-muted/20">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Status Badge */}
                <Badge className="absolute top-3 left-3 bg-green-500 hover:bg-green-600">
                  Còn hàng
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-balance">
                      {product.name}
                    </h3>
                  </div>

                  <p className="text-sm text-muted-foreground text-pretty line-clamp-2">
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                    <span className="text-sm text-muted-foreground ml-2">
                      (4.8)
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(product.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        / ngày
                      </div>
                    </div>

                    <Link href={`/products/${product.id}`}>
                      <Button className="rounded-2xl">Thuê ngay</Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
