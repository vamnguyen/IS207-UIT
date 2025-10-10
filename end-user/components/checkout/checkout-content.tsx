"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useGetCart } from "@/hooks/use-cart";
import {
  CreditCard,
  Banknote,
  Building2,
  ShieldCheck,
  Truck,
  Calendar,
} from "lucide-react";
import { CheckoutSummary } from "./checkout-summary";
import { toast } from "sonner";
import { PaymentMethod } from "@/lib/enum";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/services/auth";
import { clearCart } from "@/services/cart";
import { CustomerInfo, customerInfoSchema } from "@/lib/validations";
import { checkoutByCard } from "@/services/payment";
import { checkoutByCash } from "@/services/payment";

export function CheckoutContent() {
  const router = useRouter();
  const { data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
  });
  const { data: items } = useGetCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      fullName: user?.name || "",
      email: user?.email || "",
      address: user?.address || "",
      notes: "",
      paymentMethod: PaymentMethod.CARD,
    },
  });

  // Keep payment method in sync with radio group
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
    if (user) {
      setValue("fullName", user.name || "");
      setValue("email", user.email || "");
      setValue("address", user.address || "");
    }
  }, [user, setValue]);

  const onSubmit = async (data: CustomerInfo) => {
    setIsProcessing(true);
    try {
      if (data.paymentMethod === PaymentMethod.CARD) {
        const response = await checkoutByCard({ address: data.address });
        router.push(response.url);
      } else if (data.paymentMethod === PaymentMethod.CASH) {
        const response = await checkoutByCash({ address: data.address });
        toast.success(
          response.message ||
            "Đặt thuê thành công! Vui lòng chuẩn bị tiền mặt khi nhận hàng."
        );
        if (response.order_id) {
          router.push(`/orders/${response.order_id}`);
        } else {
          router.push("/orders");
        }
      } else if (data.paymentMethod === PaymentMethod.BANK_TRANSFER) {
        toast.success(
          "Tính năng đang được phát triển. Vui lòng chọn phương thức khác."
        );
        return;
      }

      clearCart();
    } catch (error: any) {
      toast.error("Có lỗi xảy ra: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">Giỏ hàng trống</h3>
        <p className="text-muted-foreground mb-6">
          Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán
        </p>
        <Button
          onClick={() => router.push("/products")}
          className="rounded-2xl"
        >
          Khám phá sản phẩm
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <span>Thông tin khách hàng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên *</Label>
                  <Input
                    id="fullName"
                    placeholder="Nguyễn Văn An"
                    {...register("fullName")}
                    className="rounded-2xl"
                    disabled
                  />
                  {errors.fullName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nguyen.van.an@email.com"
                    {...register("email")}
                    className="rounded-2xl"
                    disabled
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ giao hàng *</Label>
                <Textarea
                  id="address"
                  placeholder="123 Nguyễn Huệ, Quận 1, TP.HCM"
                  {...register("address")}
                  className="rounded-2xl"
                  rows={3}
                />
                {errors.address && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                <Textarea
                  id="notes"
                  placeholder="Ghi chú thêm về đơn hàng..."
                  {...register("notes")}
                  className="rounded-2xl"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <span>Phương thức thanh toán</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) =>
                  setValue("paymentMethod", value as PaymentMethod)
                }
              >
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-4 rounded-2xl border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label
                      htmlFor="cash"
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <Banknote className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium">Tiền mặt</div>
                        <div className="text-sm text-muted-foreground">
                          Thanh toán khi nhận hàng
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-2xl border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                    <Label
                      htmlFor="bank_transfer"
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <Building2 className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-medium">
                          Chuyển khoản ngân hàng
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Chuyển khoản trước khi giao hàng
                        </div>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 rounded-2xl border hover:bg-muted/50 transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center space-x-3 cursor-pointer flex-1"
                    >
                      <CreditCard className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-medium">Thẻ tín dụng/ghi nợ</div>
                        <div className="text-sm text-muted-foreground">
                          Thanh toán online an toàn
                        </div>
                      </div>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
              {errors.paymentMethod && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.paymentMethod.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Service Features */}
          <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-green-100 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Giao hàng miễn phí
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Trong nội thành
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Bảo hiểm toàn diện
                    </div>
                    <div className="text-xs text-muted-foreground">
                      An tâm sử dụng
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-purple-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-sm">
                      Linh hoạt thời gian
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Gia hạn dễ dàng
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <CheckoutSummary
            items={items}
            totalAmount={items.reduce(
              (total, item) => total + Number(item.total_price),
              0
            )}
            paymentMethod={paymentMethod as PaymentMethod}
            onSubmit={handleSubmit(onSubmit)}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </form>
  );
}
