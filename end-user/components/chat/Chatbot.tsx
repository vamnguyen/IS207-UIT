"use client";
import { useState } from "react";
import { sendMessageToChatbot } from "@/services/chatbot";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setLoading(true);
    try {
      const res = await sendMessageToChatbot(input);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: res.reply || res.answer || JSON.stringify(res) },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Lỗi khi kết nối chatbot." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "24px auto",
        background: "var(--card)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "0 4px 24px 0 #0001",
        padding: 0,
        border: "1.5px solid var(--border)",
        overflow: "hidden"
      }}
    >
      <div style={{
        background: "var(--primary)",
        color: "var(--primary-foreground)",
        padding: "16px 0 12px 0",
        textAlign: "center",
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: 1,
        borderBottom: "1.5px solid var(--border)"
      }}>
        Hỗ trợ viên AI
      </div>
      <div
        style={{
          minHeight: 220,
          border: "none",
          padding: 16,
          marginBottom: 0,
          background: "var(--background)",
          borderRadius: 0,
          maxHeight: 320,
          overflowY: "auto"
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              textAlign: msg.role === "user" ? "right" : "left",
              margin: "8px 0",
              display: "flex",
              flexDirection: msg.role === "user" ? "row-reverse" : "row",
              alignItems: "flex-end"
            }}
          >
            <div
              style={{
                background: msg.role === "user" ? "var(--primary)" : "var(--secondary)",
                color: msg.role === "user" ? "var(--primary-foreground)" : "var(--secondary-foreground)",
                borderRadius: msg.role === "user"
                  ? "16px 4px 16px 16px"
                  : "4px 16px 16px 16px",
                padding: "8px 14px",
                maxWidth: "80%",
                fontSize: 15,
                boxShadow: "0 1px 4px #0001"
              }}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ margin: "8px 0", color: "var(--muted-foreground)" }}><i>Đang trả lời...</i></div>}
      </div>
      <div style={{
        display: "flex",
        gap: 8,
        borderTop: "1.5px solid var(--border)",
        background: "var(--card)",
        padding: "12px 12px 12px 12px"
      }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Nhập câu hỏi..."
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--border)",
            background: "var(--input)",
            color: "var(--foreground)",
            fontSize: 15
          }}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={loading || !input.trim()}
          style={{
            padding: "10px 20px",
            borderRadius: "var(--radius-md)",
            background: "var(--primary)",
            color: "var(--primary-foreground)",
            border: "none",
            fontWeight: 600,
            fontSize: 15,
            cursor: loading || !input.trim() ? "not-allowed" : "pointer",
            opacity: loading || !input.trim() ? 0.7 : 1
          }}
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
