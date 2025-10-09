"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Package,
  Calendar,
  CreditCard,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          {/* Success Icon */}
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          {/* Success Message */}
          <div className="space-y-4">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              Đặt thuê thành công!
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Cảm ơn bạn đã tin tưởng RentHub. Chúng tôi sẽ liên hệ với bạn
              trong thời gian sớm nhất.
            </p>
          </div>

          {/* Order Info */}
          <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Xác nhận đơn hàng</div>
                      <div className="text-sm text-muted-foreground">
                        Trong 2 giờ
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="mx-auto w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <div className="font-medium">Giao hàng</div>
                      <div className="text-sm text-muted-foreground">
                        1-2 ngày làm việc
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Bước tiếp theo</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Package className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Theo dõi đơn hàng</div>
                    <div className="text-sm text-muted-foreground">
                      Kiểm tra trạng thái đơn hàng
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-2xl bg-transparent"
                    onClick={() => router.push("/orders")}
                  >
                    Xem đơn hàng
                  </Button>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-0 bg-background/60 backdrop-blur">
                <CardContent className="p-6 text-center space-y-3">
                  <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Tiếp tục mua sắm</div>
                    <div className="text-sm text-muted-foreground">
                      Khám phá thêm sản phẩm
                    </div>
                  </div>
                  <Link href="/products">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-2xl bg-transparent"
                    >
                      Xem sản phẩm
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Auto Redirect */}
          <div className="text-sm text-muted-foreground">
            Tự động chuyển về trang chủ sau {countdown} giây
          </div>
        </div>
      </div>
    </div>
  );
}
