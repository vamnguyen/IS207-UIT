import { CartContent } from "@/components/cart/cart-content";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6 mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              Giỏ hàng
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Xem lại các sản phẩm bạn muốn thuê
            </p>
          </div>
        </div>

        <CartContent />
      </div>
    </div>
  );
}
