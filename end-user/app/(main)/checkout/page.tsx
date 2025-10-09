import { CheckoutContent } from "@/components/checkout/checkout-content";

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              Thanh toán
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Hoàn tất thông tin để xác nhận đơn thuê
            </p>
          </div>
        </div>

        <CheckoutContent />
      </div>
    </div>
  );
}
