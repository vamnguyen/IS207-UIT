"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { CartItem as CartItemType } from "@/lib/types";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Minus, Plus, Trash2, Calendar } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity >= 1 && newQuantity <= item.product.stock) {
      updateQuantity(item.id, newQuantity);
    }
  };

  return (
    <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {/* Product Image */}
          <Link href={`/products/${item.product.id}`}>
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 flex-shrink-0">
              <img
                src={item.product.image_url || "/file.svg"}
                alt={item.product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </Link>

          {/* Product Info */}
          <div className="flex-1 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <Link href={`/products/${item.product.id}`}>
                  <h3 className="font-semibold text-lg hover:text-primary transition-colors text-balance">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground">
                  {formatCurrency(item.product.price)} / ngày
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive rounded-2xl"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Rental Period */}
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(item.start_date)} - {formatDate(item.end_date)} (
                {item.days} ngày)
              </span>
            </div>

            {/* Quantity and Price */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl bg-transparent w-8 h-8 p-0"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={item.quantity <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="font-medium w-8 text-center">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl bg-transparent w-8 h-8 p-0"
                  onClick={() => handleQuantityChange(1)}
                  disabled={item.quantity >= item.product.stock}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>

              <div className="text-right">
                <div className="font-semibold text-lg text-primary">
                  {formatCurrency(item.total_price)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {item.quantity} x {item.days} ngày
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
