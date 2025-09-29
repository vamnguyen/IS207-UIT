"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockProducts } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useState } from "react";
import { toast } from "sonner";
import { Product } from "@/lib/types";

export function ProductsGrid({
  products = mockProducts,
}: {
  products: Product[];
}) {
  const { addToCart } = useCart();
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleQuickRent = (product: any) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    addToCart(
      product,
      1,
      today.toISOString().split("T")[0],
      tomorrow.toISOString().split("T")[0]
    );

    toast.success("Đã thêm vào giỏ hàng");
  };

  return (
    <div className="space-y-6">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-2xl border-0 bg-background/60 backdrop-blur overflow-hidden"
          >
            <div className="relative">
              <Link href={`/products/${product.id}`}>
                <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20">
                  <img
                    src={product.image_url || "/file.svg"}
                    alt={product.product_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </Link>

              {/* Status Badge */}
              <Badge
                className={`absolute top-3 left-3 ${
                  product.status === "available"
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-yellow-500 hover:bg-yellow-600"
                }`}
              >
                {product.status === "available" ? "Còn hàng" : "Đang thuê"}
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
                    {product.product_name}
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
                      {formatCurrency(product.price_per_day)}
                    </div>
                    <div className="text-sm text-muted-foreground">/ ngày</div>
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-2xl bg-transparent"
                      onClick={() => handleQuickRent(product)}
                      disabled={product.status !== "available"}
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </Button>
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

      {/* Load More */}
      <div className="text-center pt-8">
        <Button
          variant="outline"
          size="lg"
          className="rounded-2xl bg-transparent"
        >
          Xem thêm sản phẩm
        </Button>
      </div>
    </div>
  );
}
