"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Star, Heart } from "lucide-react";
import { useState } from "react";
import { ProductStatus } from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import { getProductsByCategoryId } from "@/services/products";
import PaginationControl from "@/components/pagination-control";

export default function CategoryProducts({
  categoryId,
}: {
  categoryId: string;
}) {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [page, setPage] = useState(1);

  const { data: paginated, isLoading } = useQuery({
    queryKey: ["categoryProducts", categoryId, page],
    queryFn: () => getProductsByCategoryId(categoryId, page, 6),
    staleTime: Infinity,
  });

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (paginated?.data.length === 0 || !paginated)
    return <div>Không có sản phẩm nào.</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginated.data.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur overflow-hidden"
          >
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-4/3 overflow-hidden bg-linear-to-br from-muted/50 to-muted/20">
                  <img
                    src={product.image_url || "/file.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Status Badge */}
              <Badge
                className={`absolute top-3 left-3 ${
                  product.status === ProductStatus.IN_STOCK
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {product.status === ProductStatus.IN_STOCK
                  ? "Còn hàng"
                  : "Đang cho thuê"}
              </Badge>

              {/* Favorite Button */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-3 right-3 rounded-full w-8 h-8 p-0 bg-background/80 backdrop-blur hover:bg-background"
                onClick={() => toggleFavorite(product.id)}
              >
                <Heart
                  className={`h-4 w-4 ${
                    favorites.includes(product.id)
                      ? "fill-red-500 text-red-500"
                      : ""
                  }`}
                />
              </Button>
            </div>

            <CardContent className="p-6">
              <div className="space-y-3">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-balance line-clamp-2">
                    {product.name}
                  </h3>
                </Link>

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

                {/* Stock Info */}
                <div className="text-sm text-muted-foreground">
                  Còn lại:{" "}
                  <span className="font-medium text-foreground">
                    {product.stock}
                  </span>{" "}
                  sản phẩm
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(product.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">/ ngày</div>
                  </div>

                  <div className="flex space-x-2">
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" className="rounded-2xl">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div>
        <PaginationControl
          current_page={paginated.current_page}
          last_page={paginated.last_page}
          onChange={(p: number) => setPage(p)}
        />
      </div>
    </div>
  );
}
