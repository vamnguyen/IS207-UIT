"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { CartItem } from "@/lib/types";
import { formatCurrency, formatDate, getPaymentMethodLabel } from "@/lib/utils";
import { Calendar, Loader2 } from "lucide-react";
import { PaymentMethod } from "@/lib/enum";

interface CheckoutSummaryProps {
  items: CartItem[];
  totalAmount: number;
  paymentMethod: PaymentMethod;
  onSubmit: () => void;
  isProcessing: boolean;
}

export function CheckoutSummary({
  items,
  totalAmount,
  paymentMethod,
  onSubmit,
  isProcessing,
}: CheckoutSummaryProps) {
  const insuranceFee = totalAmount * 0.05;
  const finalTotal = totalAmount + insuranceFee;

  return (
    <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur sticky top-8">
      <CardHeader>
        <CardTitle>Tóm tắt đơn hàng</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Items */}
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-muted/50 to-muted/20 flex-shrink-0">
                <img
                  src={item.product.image_url || "/file.svg"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 space-y-1">
                <h4 className="font-medium text-sm line-clamp-2">
                  {item.product.name}
                </h4>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>
                    {formatDate(item.start_date)} - {formatDate(item.end_date)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.quantity} x {item.days} ngày
                  </span>
                  <span className="font-medium">
                    {formatCurrency(item.total_price)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        {/* Pricing Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span>Tạm tính</span>
            <span>{formatCurrency(totalAmount)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Phí vận chuyển</span>
            <span className="text-green-600">Miễn phí</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Bảo hiểm (5%)</span>
            <span>{formatCurrency(insuranceFee)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(finalTotal)}</span>
          </div>
        </div>

        <Separator />

        {/* Payment Method */}
        <div className="space-y-2">
          <div className="text-sm font-medium">Phương thức thanh toán</div>
          <div className="text-sm text-muted-foreground">
            {getPaymentMethodLabel(paymentMethod)}
          </div>
        </div>

        {/* Submit Button */}
        <Button
          size="lg"
          className="w-full rounded-2xl"
          onClick={onSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Xác nhận đặt thuê"
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center">
          Bằng cách đặt thuê, bạn đồng ý với{" "}
          <a href="/terms" className="text-primary hover:underline">
            Điều khoản sử dụng
          </a>{" "}
          và{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Chính sách bảo mật
          </a>{" "}
          của chúng tôi.
        </p>
      </CardContent>
    </Card>
  );
}
