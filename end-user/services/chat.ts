import axiosInstance from "@/lib/axiosInstance";
import Cookies from "js-cookie";
import { ChatConversationsResponse, ChatMessagesResponse } from "@/lib/types";
import type { ChatStreamEvent, ChatStreamResult } from "@/lib/types";

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

export type StreamChatMessageParams = {
  payload: Partial<{ conversation_id: number }> & { message: string };
  onConversation?: (conversationId: number) => void;
  onDelta?: (chunk: string) => void;
  onDone?: (result: ChatStreamResult) => void;
  onError?: (message: string) => void;
};

export const streamChatMessage = async ({
  payload,
  onConversation,
  onDelta,
  onDone,
  onError,
}: StreamChatMessageParams): Promise<ChatStreamResult> => {
  const baseURL = (axiosInstance.defaults.baseURL ?? "").replace(/\/$/, "");
  const url = `${baseURL}/chat/assistant`;
  const token = Cookies.get("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    Accept: "text/event-stream",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    credentials: "include",
  });

  if (!response.ok || !response.body) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      errorText || `Request failed with status ${response.status}`
    );
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let doneReceived = false;
  let errorMessage: string | null = null;
  let result: ChatStreamResult | null = null;

  const processEvent = (event: ChatStreamEvent) => {
    switch (event.event) {
      case "conversation":
        onConversation?.(event.conversation_id);
        break;
      case "delta":
        onDelta?.(event.content);
        break;
      case "done":
        result = {
          conversation_id: event.conversation_id,
          message: event.message,
          metadata: event.metadata,
          usage: event.usage,
        };
        onDone?.(result);
        doneReceived = true;
        break;
      case "error":
        errorMessage = event.message;
        onError?.(event.message);
        doneReceived = true;
        break;
    }
  };

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      const remaining = decoder.decode();
      if (remaining) {
        buffer += remaining;
      }
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    let boundaryMatch = buffer.match(/\r?\n\r?\n/);
    while (boundaryMatch && boundaryMatch.index !== undefined) {
      const boundaryIndex = boundaryMatch.index;
      const rawEvent = buffer.slice(0, boundaryIndex);
      buffer = buffer.slice(boundaryIndex + boundaryMatch[0].length);
      boundaryMatch = buffer.match(/\r?\n\r?\n/);

      const lines = rawEvent.split(/\r?\n/);
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const data = trimmed.slice(5).trim();
        if (!data) {
          continue;
        }

        try {
          const parsed = JSON.parse(data) as ChatStreamEvent;
          processEvent(parsed);
        } catch (error) {
          console.error("Failed to parse chat stream event", error, data);
        }
      }
    }

    if (doneReceived) {
      await reader.cancel();
      break;
    }
  }

  if (errorMessage) {
    throw new Error(errorMessage);
  }

  if (buffer.trim() !== "") {
    const lines = buffer.split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) {
        continue;
      }

      const data = trimmed.slice(5).trim();
      if (!data) {
        continue;
      }

      try {
        const parsed = JSON.parse(data) as ChatStreamEvent;
        processEvent(parsed);
      } catch (error) {
        console.error(
          "Failed to parse trailing chat stream event",
          error,
          data
        );
      }
    }
  }

  if (!result) {
    throw new Error("Assistant did not respond.");
  }

  return result;
};
