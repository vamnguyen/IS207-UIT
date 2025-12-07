import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, FileText, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 border-b py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-6">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 text-foreground">
            Chính sách bảo mật
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn và minh bạch về
            cách chúng tôi thu thập, sử dụng và chia sẻ dữ liệu.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Cập nhật lần cuối: 01/12/2025
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid gap-12">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              1. Giới thiệu
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Chào mừng bạn đến với Rerent ("chúng tôi", "của chúng tôi"). Tại
                Rerent, chúng tôi coi trọng quyền riêng tư của bạn và cam kết
                bảo vệ thông tin cá nhân của bạn. Chính sách bảo mật này giải
                thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông
                tin của bạn khi bạn truy cập trang web và sử dụng dịch vụ của
                chúng tôi.
              </p>
              <p>
                Vui lòng đọc kỹ Chính sách bảo mật này. Nếu bạn không đồng ý với
                các điều khoản của chính sách này, vui lòng không truy cập trang
                web hoặc sử dụng dịch vụ của chúng tôi.
              </p>
            </div>
          </section>

          {/* Data Collection */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              2. Thông tin chúng tôi thu thập
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Chúng tôi có thể thu thập thông tin về bạn theo nhiều cách khác
                nhau. Thông tin chúng tôi có thể thu thập trên Trang web bao
                gồm:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong className="text-foreground">Dữ liệu cá nhân:</strong>{" "}
                  Thông tin nhận dạng cá nhân, chẳng hạn như tên, địa chỉ giao
                  hàng, địa chỉ email và số điện thoại, và thông tin nhân khẩu
                  học, chẳng hạn như độ tuổi, giới tính, quê quán và sở thích
                  của bạn, mà bạn tự nguyện cung cấp cho chúng tôi khi bạn đăng
                  ký trên Trang web hoặc khi bạn chọn tham gia vào các hoạt động
                  khác nhau liên quan đến Trang web.
                </li>
                <li>
                  <strong className="text-foreground">
                    Dữ liệu phái sinh:
                  </strong>{" "}
                  Thông tin mà máy chủ của chúng tôi tự động thu thập khi bạn
                  truy cập Trang web, chẳng hạn như địa chỉ IP, loại trình
                  duyệt, hệ điều hành, thời gian truy cập và các trang bạn đã
                  xem trực tiếp trước và sau khi truy cập Trang web.
                </li>
                <li>
                  <strong className="text-foreground">
                    Dữ liệu tài chính:
                  </strong>{" "}
                  Thông tin tài chính, chẳng hạn như dữ liệu liên quan đến
                  phương thức thanh toán của bạn (ví dụ: số thẻ tín dụng hợp lệ,
                  thương hiệu thẻ, ngày hết hạn) mà chúng tôi có thể thu thập
                  khi bạn mua, đặt hàng, trả lại, trao đổi hoặc yêu cầu thông
                  tin về các dịch vụ của chúng tôi từ Trang web.
                </li>
              </ul>
            </div>
          </section>

          {/* Data Usage */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              3. Sử dụng thông tin của bạn
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Việc có thông tin chính xác về bạn cho phép chúng tôi cung cấp
                cho bạn trải nghiệm mượt mà, hiệu quả và tùy chỉnh. Cụ thể,
                chúng tôi có thể sử dụng thông tin thu thập về bạn qua Trang web
                để:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tạo và quản lý tài khoản của bạn.</li>
                <li>Xử lý các đơn đặt hàng và thanh toán của bạn.</li>
                <li>
                  Gửi email cho bạn về tài khoản hoặc đơn đặt hàng của bạn.
                </li>
                <li>
                  Thực hiện và quản lý các giao dịch mua, đơn đặt hàng, thanh
                  toán và các giao dịch khác liên quan đến Trang web.
                </li>
                <li>
                  Ngăn chặn các giao dịch gian lận, theo dõi chống trộm cắp và
                  bảo vệ chống lại hoạt động tội phạm.
                </li>
                <li>Hỗ trợ thực thi pháp luật và đáp ứng trát đòi hầu tòa.</li>
                <li>
                  Biên soạn dữ liệu thống kê ẩn danh và phân tích để sử dụng nội
                  bộ hoặc với bên thứ ba.
                </li>
              </ul>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              4. Bảo mật thông tin
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Chúng tôi sử dụng các biện pháp bảo mật hành chính, kỹ thuật và
                vật lý để giúp bảo vệ thông tin cá nhân của bạn. Mặc dù chúng
                tôi đã thực hiện các bước hợp lý để bảo mật thông tin cá nhân
                bạn cung cấp cho chúng tôi, xin lưu ý rằng không có biện pháp
                bảo mật nào là hoàn hảo hoặc không thể xuyên thủng, và không có
                phương thức truyền dữ liệu nào có thể được đảm bảo chống lại mọi
                hành vi chặn hoặc loại hình lạm dụng khác.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-muted/50 p-8 rounded-xl border">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Mail className="h-6 w-6 text-primary" />
              5. Liên hệ với chúng tôi
            </h2>
            <p className="text-muted-foreground mb-6">
              Nếu bạn có câu hỏi hoặc nhận xét về Chính sách bảo mật này, vui
              lòng liên hệ với chúng tôi tại:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild>
                <Link href="/contact">Liên hệ ngay</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="mailto:privacy@rerent.vn">privacy@rerent.vn</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
