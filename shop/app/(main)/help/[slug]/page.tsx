import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function HelpTopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Simple mapping for demo purposes
  const titles: Record<string, string> = {
    account: "Tài khoản & Bảo mật",
    payment: "Thanh toán & Đặt cọc",
    shipping: "Vận chuyển & Nhận đồ",
    policies: "Chính sách & Quy định",
    "guide-for-beginners": "Hướng dẫn thuê đồ cho người mới bắt đầu",
    "return-process": "Quy trình trả đồ và nhận lại tiền cọc",
    "damage-policy": "Làm gì khi vô tình làm hỏng đồ thuê?",
    "change-booking": "Cách thay đổi lịch thuê hoặc hủy đơn",
    "payment-methods": "Các phương thức thanh toán được chấp nhận",
    "order-status": "Kiểm tra tình trạng đơn hàng",
  };

  const title = titles[slug] || "Bài viết hỗ trợ";

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            asChild
            className="pl-0 hover:pl-2 transition-all"
          >
            <Link href="/help">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Quay lại Trung tâm trợ giúp
            </Link>
          </Button>
        </div>

        <article className="max-w-none">
          <h1 className="text-3xl font-bold mb-4">{title}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Đây là nội dung chi tiết cho chủ đề <strong>{title}</strong>.
          </p>
          <div className="space-y-4 text-foreground/80">
            <p>
              Hiện tại, nội dung này đang được cập nhật. Chúng tôi đang nỗ lực
              biên soạn các hướng dẫn chi tiết nhất để hỗ trợ bạn.
            </p>
            <p>
              Trong thời gian chờ đợi, nếu bạn có câu hỏi cụ thể, vui lòng liên
              hệ trực tiếp với đội ngũ hỗ trợ của chúng tôi.
            </p>
          </div>

          <div className="bg-muted p-6 rounded-lg mt-8">
            <h3 className="text-lg font-semibold mb-2">Cần hỗ trợ gấp?</h3>
            <p className="text-muted-foreground mb-4">
              Gọi ngay cho hotline của chúng tôi để được giải đáp nhanh nhất.
            </p>
            <Button>Gọi 1900 1234</Button>
          </div>
        </article>
      </div>
    </div>
  );
}
