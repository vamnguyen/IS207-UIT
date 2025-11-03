"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const Chatbot = dynamic(() => import("@/components/chat/Chatbot"), { ssr: false });

export default function ChatbotFloating() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Nút mở chat cố định góc phải dưới */}
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          position: "fixed",
          bottom: 32,
          right: 32,
          zIndex: 1000,
          background: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 56,
          height: 56,
          boxShadow: "0 2px 8px #aaa",
          fontSize: 28,
          cursor: "pointer"
        }}
        aria-label="Mở chatbot"
      >
        💬
      </button>
      {/* Hộp chat nổi */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 100,
            right: 32,
            zIndex: 1001,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 4px 24px #0002",
            width: 380,
            maxWidth: "90vw",
            padding: 0,
            overflow: "hidden"
          }}
        >
          <div style={{ display: "flex", justifyContent: "flex-end", padding: 8 }}>
            <button
              onClick={() => setOpen(false)}
              style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer" }}
              aria-label="Đóng chatbot"
            >
              ×
            </button>
          </div>
          <Chatbot onClose={() => setOpen(false)} />
        </div>
      )}
    </>
  );
}
