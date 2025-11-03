// end-user/services/chatbot.ts
import axios from "axios";

const CHATBOT_API = "https://unapportioned-karena-galvanoplastically.ngrok-free.dev/chat";

export const sendMessageToChatbot = async (message: string) => {
  const response = await axios.post(CHATBOT_API, { message });
  return response.data;
};
