"use client";


import { useState } from "react";

export default function FAQPageClient() {
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

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 text-black">Frequently Asked Questions</h1>
        <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
          Tìm kiếm những câu hỏi thường gặp về sản phẩm và dịch vụ tại Rerent.
        </p>

        <div className="space-y-5">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full px-6 py-5 text-left font-semibold text-gray-800 flex justify-between items-center"
              >
                <span>{faq.q}</span>
                <span
                  className={`transform transition-transform duration-300 text-xl ${
                    openIndex === index ? "rotate-180" : "rotate-0"
                  }`}
                >
                  ▼
                </span>
              </button>

              {openIndex === index && (
                <div className="px-6 py-5 border-t border-gray-200 text-gray-600 leading-relaxed animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}