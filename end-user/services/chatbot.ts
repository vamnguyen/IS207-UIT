// end-user/services/chatbot.ts
import axios from "axios";

const CHATBOT_API = "https://api.deepseek.com/chat/completions";
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

export const sendMessageToChatbot = async (message: string) => {
  const response = await axios.post(
    CHATBOT_API,
    {
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `
Bạn là trợ lý ảo của ReRent — nền tảng cho thuê thiết bị sự kiện (máy ảnh, ánh sáng, âm thanh). 
Trả lời tiếng Việt, ngắn gọn, style genz. 
Nếu hỏi giá, kêu lên website coi.
Giảm 10% khi thuê >4 ngày. Cọc 10%/sản phẩm. 
Hướng dẫn khách chọn sản phẩm theo loại sự kiện, số ngày, số lượng. 
Nhớ tìm cách dẫn dụ khách thuê đồ trên website ReRent.
Nếu không chắc, khuyên kiểm tra website hoặc liên hệ 0338610581 (Anh Việt Phương). 
Nếu câu hỏi ngoài dịch vụ thuê, lịch sự nhắc bạn chỉ cung cấp thông tin thuê thiết bị.
Nếu khách đồng ý thuê, hãy kêu khách vào website thuê rồi đặt hàng. Sau đó cảm ơn khách.
    `
        },
        { role: "user", content: message }
      ],
      stream: false

    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${DEEPSEEK_API_KEY}`
      }
    }
  );
  return response.data;
};
