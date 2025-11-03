import axiosInstance from "@/lib/axiosInstance";
import {
  ChatAssistantResponse,
  ChatConversationsResponse,
  ChatMessagesResponse,
} from "@/lib/types";

export const getChatConversations = async (
  params?: Partial<{ page: number; per_page: number }>
): Promise<ChatConversationsResponse> => {
  const response = await axiosInstance.get("/chat/conversations", {
    params,
  });

  return response.data as ChatConversationsResponse;
};

export const createChatConversation = async (
  payload?: Partial<{ title: string | null }>
) => {
  const response = await axiosInstance.post("/chat/conversations", payload);
  return response.data.data;
};

export const updateChatConversation = async (
  conversationId: number,
  payload: Partial<{ title: string | null }>
) => {
  const response = await axiosInstance.patch(
    `/chat/conversations/${conversationId}`,
    payload
  );

  return response.data.data;
};

export const deleteChatConversation = async (conversationId: number) => {
  await axiosInstance.delete(`/chat/conversations/${conversationId}`);
};

export const getChatMessages = async (
  conversationId: number,
  params?: Partial<{ before_id: number; limit: number }>
): Promise<ChatMessagesResponse> => {
  const response = await axiosInstance.get(
    `/chat/conversations/${conversationId}/messages`,
    {
      params,
    }
  );

  return response.data as ChatMessagesResponse;
};

export const sendChatMessage = async (
  payload: Partial<{ conversation_id: number }> & { message: string }
): Promise<ChatAssistantResponse> => {
  const response = await axiosInstance.post("/chat/assistant", payload);

  return response.data as ChatAssistantResponse;
};
