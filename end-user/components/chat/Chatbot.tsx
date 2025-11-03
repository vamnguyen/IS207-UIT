"use client";
import { useState } from "react";
import { sendMessageToChatbot } from "@/services/chatbot";

export default function Chatbot({ onClose }: { onClose?: () => void }) {
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
      // DeepSeek API trả về content ở res.choices[0].message.content
      const botContent = res?.choices?.[0]?.message?.content || "(Không có phản hồi)";
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: botContent },
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
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.18)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 440,
          height: "100vh",
          maxHeight: "100dvh",
          background: "var(--card)",
          borderRadius: "var(--radius-xl)",
          boxShadow: "0 2px 8px #0001",
          padding: 0,
          border: "1.5px solid var(--border)",
          overflow: "hidden",
          fontFamily: 'Inter, Arial, sans-serif',
          display: "flex",
          flexDirection: "column",
          marginRight: 40,
        }}
      >
        <div style={{
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          padding: "18px 0 14px 0",
          textAlign: "center",
          fontWeight: 700,
          fontSize: 19,
          letterSpacing: 1,
          borderBottom: "1.5px solid var(--border)",
          boxShadow: "0 2px 8px #0001",
          position: "relative"
        }}>
          Hỗ trợ viên Rerent
          {onClose && (
            <button
              onClick={onClose}
              style={{
                position: "absolute",
                top: 8,
                right: 16,
                background: "none",
                border: "none",
                color: "var(--primary-foreground)",
                fontSize: 40,
                fontWeight: 700,
                cursor: "pointer",
                opacity: 0.7,
                transition: "opacity 0.2s",
                lineHeight: 1,
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              aria-label="Đóng chatbot"
              onMouseOver={e => (e.currentTarget.style.opacity = "1")}
              onMouseOut={e => (e.currentTarget.style.opacity = "0.7")}
            >
              ×
            </button>
          )}
        </div>
        <div
          style={{
            flex: 1,
            border: "none",
            padding: 16,
            marginBottom: 0,
            background: "var(--background)",
            borderRadius: 0,
            maxHeight: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                display: "flex",
                flexDirection: msg.role === "user" ? "row-reverse" : "row",
                alignItems: "flex-end",
                margin: "8px 0",
              }}
            >
              <div
                style={{
          background: msg.role === "user"
            ? "var(--primary)"
            : "var(--secondary)",
                  color: msg.role === "user"
                    ? "var(--primary-foreground)"
                    : "var(--secondary-foreground)",
                  borderRadius: msg.role === "user"
                    ? "18px 8px 18px 18px"
                    : "8px 18px 18px 18px",
                  padding: "10px 16px",
                  maxWidth: "70%",
                  fontSize: 15,
                  boxShadow: "0 2px 8px #0001",
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  whiteSpace: "pre-line"
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
          padding: "14px 14px 14px 14px"
        }}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Nhập câu hỏi..."
            style={{
              flex: 1,
              padding: "12px 14px",
              borderRadius: "var(--radius-lg)",
              border: "1.5px solid var(--border)",
              background: "var(--input)",
              color: "var(--foreground)",
              fontSize: 15,
              boxShadow: "0 1px 4px #0001"
            }}
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            style={{
              padding: "12px 22px",
              borderRadius: "var(--radius-lg)",
              background: "var(--primary)",
              color: "var(--primary-foreground)",
              border: "none",
              fontWeight: 700,
              fontSize: 15,
              cursor: loading || !input.trim() ? "not-allowed" : "pointer",
              opacity: loading || !input.trim() ? 0.7 : 1,
              boxShadow: "0 2px 8px #0001"
            }}
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}
