"use client";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/chat/Chatbot"), { ssr: false });

export default function ChatbotSection() {
  return <Chatbot />;
}
