"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/lib/utils";
import { Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "./cart-item";

export function CartContent() {
  const { items, getTotalAmount, getTotalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto w-24 h-24 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
        <p className="text-muted-foreground mb-6">
          Bạn chưa thêm sản phẩm nào vào giỏ hàng
        </p>
        <Link href="/products">
          <Button className="rounded-2xl">Khám phá sản phẩm</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Sản phẩm ({getTotalItems()})
          </h2>
          <Button
            variant="outline"
            size="sm"
            className="rounded-2xl bg-transparent text-destructive hover:text-destructive"
            onClick={clearCart}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Xóa tất cả
          </Button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur sticky top-8">
          <CardContent className="p-6 space-y-6">
            <h3 className="text-xl font-semibold">Tóm tắt đơn hàng</h3>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Tạm tính</span>
                <span>{formatCurrency(getTotalAmount())}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bảo hiểm</span>
                <span>{formatCurrency(getTotalAmount() * 0.05)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span className="text-primary">
                  {formatCurrency(getTotalAmount() * 1.05)}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/checkout">
                <Button size="lg" className="w-full rounded-2xl">
                  Tiến hành thanh toán
                </Button>
              </Link>
              <Link href="/products">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full rounded-2xl bg-transparent"
                >
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </div>

            {/* Features */}
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Miễn phí giao hàng</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Bảo hiểm toàn diện</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>Hỗ trợ 24/7</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
