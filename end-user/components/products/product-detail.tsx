"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { Product } from "@/lib/types";
import { formatCurrency, calculateDays } from "@/lib/utils";
import { useAddProductToCart } from "@/hooks/use-cart";
import {
  Star,
  Heart,
  ShoppingCart,
  Calendar,
  Minus,
  Plus,
  Shield,
  Truck,
  RotateCcw,
} from "lucide-react";
import { ProductImageGallery } from "./product-image-gallery";
import { toast } from "sonner";
import { ProductStatus } from "@/lib/enum";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const { mutate: addToCart } = useAddProductToCart();

  const days = startDate && endDate ? calculateDays(startDate, endDate) : 1;
  const totalPrice = product.price * quantity * days;

  const handleAddToCart = () => {
    if (!startDate || !endDate) {
      toast.error("Vui lòng chọn ngày thuê");
      return;
    }

    if (quantity > product.stock) {
      toast.error("Số lượng vượt quá tồn kho");
      return;
    }

    addToCart({
      product_id: product.id,
      quantity,
      start_date: startDate,
      end_date: endDate,
      days,
    });
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12">
      {/* Product Images */}
      <div>
        <ProductImageGallery product={product} />
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl lg:text-4xl font-bold text-balance">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-2">
                    (4.8) • 127 đánh giá
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-2xl bg-transparent"
              onClick={() => setIsFavorite(!isFavorite)}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorite ? "fill-red-500 text-red-500" : ""
                }`}
              />
            </Button>
          </div>

          {/* Status & Stock */}
          <div className="flex items-center space-x-4">
            <Badge
              className={`${
                product.status === ProductStatus.IN_STOCK
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {product.status === ProductStatus.IN_STOCK
                ? "Còn hàng"
                : "Đang thuê"}
            </Badge>
            <span className="text-sm text-muted-foreground">
              Còn lại:{" "}
              <span className="font-medium text-foreground">
                {product.stock}
              </span>{" "}
              sản phẩm
            </span>
          </div>

          {/* Price */}
          <div className="space-y-1">
            <div className="text-3xl font-bold text-primary">
              {formatCurrency(product.price)}
            </div>
            <div className="text-muted-foreground">/ ngày</div>
          </div>
        </div>

        <Separator />

        {/* Description */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Mô tả sản phẩm</h3>
          <p className="text-muted-foreground text-pretty leading-relaxed">
            {product.description}
          </p>
        </div>

        <Separator />

        {/* Rental Configuration */}
        <Card className="rounded-2xl border-0 bg-muted/20">
          <CardContent className="p-6 space-y-6">
            <h3 className="font-semibold text-lg">Cấu hình thuê</h3>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start-date">Ngày bắt đầu</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-10 rounded-2xl"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">Ngày kết thúc</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="pl-10 rounded-2xl"
                    min={startDate || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Số lượng</Label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl bg-transparent w-10 h-10 p-0"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium text-lg w-12 text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-2xl bg-transparent w-10 h-10 p-0"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Rental Summary */}
            {startDate && endDate && (
              <div className="space-y-3 p-4 bg-background/60 rounded-2xl">
                <h4 className="font-medium">Tóm tắt thuê</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Giá thuê ({days} ngày)</span>
                    <span>{formatCurrency(product.price * days)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Số lượng</span>
                    <span>{quantity}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-medium text-base">
                    <span>Tổng cộng</span>
                    <span className="text-primary">
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            size="lg"
            className="w-full rounded-2xl"
            onClick={handleAddToCart}
            disabled={product.status !== ProductStatus.IN_STOCK}
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Thêm vào giỏ hàng
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="w-full rounded-2xl bg-transparent"
          >
            Thuê ngay
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Bảo hiểm</div>
              <div className="text-muted-foreground">Toàn diện</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Truck className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Giao hàng</div>
              <div className="text-muted-foreground">Miễn phí</div>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
              <RotateCcw className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Đổi trả</div>
              <div className="text-muted-foreground">7 ngày</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
