import { ChatConversation } from "@/lib/types";

export function chatDisplayName(conversation: ChatConversation): string {
  if (conversation.title && conversation.title.trim().length > 0) {
    return conversation.title.trim();
  }

  const latest = conversation.latest_message?.content;
  if (latest && latest.trim().length > 0) {
    return latest.trim().slice(0, 40) + (latest.length > 40 ? "…" : "");
  }

  return `Cuộc trò chuyện #${conversation.id}`;
}

export function formatConversationDate(input: string): string {
  const timestamp = Date.parse(input);
  if (Number.isNaN(timestamp)) {
    return "";
  }

  const date = new Date(timestamp);
  const now = new Date();

  const sameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (sameDay) {
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
