import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  const faqs = [
    {
      q: "Rerent là gì?",
      a: "Rerent là nền tảng cho thuê thiết bị sự kiện như loa, mái che, sân khấu... giúp bạn đặt thuê nhanh chóng và tiện lợi.",
    },
    {
      q: "Làm sao để đặt thuê thiết bị?",
      a: "Bạn chỉ cần chọn sản phẩm, ngày thuê và gửi yêu cầu. Đội ngũ Rerent sẽ liên hệ để xác nhận đơn.",
    },
    {
      q: "Tôi có thể hủy đơn thuê không?",
      a: "Bạn có thể hủy miễn phí trước 24 giờ. Sau thời gian này có thể phát sinh phí hủy.",
    },
    {
      q: "Phương thức thanh toán như thế nào?",
      a: "Bạn có thể thanh toán qua chuyển khoản, tiền mặt hoặc ví điện tử tùy theo thỏa thuận.",
    },
    {
      q: "Rerent có hỗ trợ giao nhận tận nơi không?",
      a: "Có. Rerent hỗ trợ giao – nhận tận nơi với chi phí hợp lý tùy địa điểm.",
    },
    {
      q: "Tôi có thể xem thiết bị trước khi thuê không?",
      a: "Hoàn toàn được. Bạn có thể đặt lịch xem trực tiếp tại kho hoặc yêu cầu gửi hình ảnh, video.",
    },
    {
      q: "Thiết bị có được bảo trì trước khi giao không?",
      a: "Tất cả thiết bị đều được kiểm tra và bảo trì kỹ lưỡng trước khi giao cho khách hàng.",
    },
    {
      q: "Rerent có hoàn tiền không?",
      a: "Rerent hoàn tiền trong các trường hợp thiết bị không đúng mô tả hoặc gặp lỗi do nhà cung cấp.",
    },
  ];

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-foreground">
          Câu hỏi thường gặp
        </h1>
        <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
          Tìm kiếm những câu hỏi thường gặp về sản phẩm và dịch vụ tại Rerent.
        </p>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-card border border-border rounded-xl px-6 shadow-sm hover:shadow transition-all duration-200"
            >
              <AccordionTrigger className="text-lg font-semibold text-foreground hover:no-underline py-5">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
