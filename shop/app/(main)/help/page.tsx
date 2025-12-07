import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  User,
  CreditCard,
  Truck,
  ShieldAlert,
  HelpCircle,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

export default function HelpPage() {
  const categories = [
    {
      icon: User,
      title: "Tài khoản & Bảo mật",
      description: "Quản lý tài khoản, đăng nhập và bảo mật thông tin.",
      href: "/help/account",
    },
    {
      icon: CreditCard,
      title: "Thanh toán & Đặt cọc",
      description: "Phương thức thanh toán, hoàn tiền và quy định đặt cọc.",
      href: "/help/payment",
    },
    {
      icon: Truck,
      title: "Vận chuyển & Nhận đồ",
      description: "Phí vận chuyển, thời gian giao hàng và địa điểm nhận.",
      href: "/help/shipping",
    },
    {
      icon: ShieldAlert,
      title: "Chính sách & Quy định",
      description: "Quy định thuê, chính sách hủy và đền bù thiệt hại.",
      href: "/help/policies",
    },
  ];

  const popularArticles = [
    {
      title: "Hướng dẫn thuê đồ cho người mới bắt đầu",
      href: "/help/guide-for-beginners",
    },
    {
      title: "Quy trình trả đồ và nhận lại tiền cọc",
      href: "/help/return-process",
    },
    {
      title: "Làm gì khi vô tình làm hỏng đồ thuê?",
      href: "/help/damage-policy",
    },
    {
      title: "Cách thay đổi lịch thuê hoặc hủy đơn",
      href: "/help/change-booking",
    },
    {
      title: "Các phương thức thanh toán được chấp nhận",
      href: "/help/payment-methods",
    },
    {
      title: "Kiểm tra tình trạng đơn hàng",
      href: "/help/order-status",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/30 py-16 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Trung tâm trợ giúp
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Chúng tôi có thể giúp gì cho bạn hôm nay?
          </p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm câu hỏi, chủ đề..."
              className="pl-12 h-14 text-lg shadow-sm rounded-full border-muted-foreground/20 focus-visible:ring-primary"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 space-y-16">
        {/* Categories Grid */}
        <section>
          <h2 className="text-2xl font-bold mb-8 text-center">
            Khám phá theo chủ đề
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Link href={category.href} key={index} className="group">
                <Card className="h-full hover:shadow-md transition-all duration-200 border-muted hover:border-primary/50">
                  <CardHeader className="text-center pt-8">
                    <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <category.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center text-muted-foreground">
                    {category.description}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            Bài viết phổ biến
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <Link
                href={article.href}
                key={index}
                className="flex items-center p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors group"
              >
                <HelpCircle className="h-5 w-5 text-muted-foreground mr-3 group-hover:text-primary transition-colors" />
                <span className="font-medium group-hover:text-primary transition-colors">
                  {article.title}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Vẫn chưa tìm thấy câu trả lời?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc của
            bạn. Hãy liên hệ ngay!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="gap-2" asChild>
              <Link href="/contact">
                <Phone className="h-4 w-4" />
                Liên hệ hỗ trợ
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="gap-2" asChild>
              <Link href="mailto:support@rerent.vn">
                <Mail className="h-4 w-4" />
                Gửi email cho chúng tôi
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
