"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import toast from "react-hot-toast";

interface Message { role: "user" | "assistant"; content: string; }

const SUGGESTIONS = [
  "Write a product description for a Madhubani painting from Bihar",
  "Suggest SEO tags for a brass Ganesha idol",
  "What's the best category for a Kondapalli toy?",
  "Write a luxury description for an antique bronze vessel",
];

export default function AdminAgent() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Namaste! I'm your Daddy Prince AI agent. I can help you write product descriptions, suggest tags and categories, generate SEO titles, and answer questions about your inventory. What can I help you with today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text?: string) => {
    const message = text || input.trim();
    if (!message || loading) return;
    setInput("");

    const userMsg: Message = { role: "user", content: message };
    const history = [...messages, userMsg];
    setMessages(history);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history: messages }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMessages([...history, { role: "assistant", content: data.reply }]);
    } catch {
      toast.error("Agent failed to respond");
      setMessages(history);
    }
    setLoading(false);
  };

  const reset = () => {
    setMessages([{
      role: "assistant",
      content: "Chat cleared. How can I help you with your products today?",
    }]);
  };

  return (
    <div className="flex flex-col h-screen" style={{ backgroundColor: "var(--bg)" }}>
      {/* Header */}
      <div className="px-8 py-5 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 flex items-center justify-center" style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--border)" }}>
              <Bot size={16} style={{ color: "var(--gold)" }} />
            </div>
            <h1 className="font-display text-2xl" style={{ color: "var(--text)" }}>AI Agent</h1>
            <span className="flex items-center gap-1.5 font-body text-[10px] px-2 py-1" style={{ backgroundColor: "rgba(76,175,108,0.12)", border: "1px solid rgba(76,175,108,0.2)", color: "#4CAF6C" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Online
            </span>
          </div>
          <p className="font-body text-xs ml-11" style={{ color: "var(--text-muted)" }}>
            Powered by Claude · Trained on Indian art & heritage context
          </p>
        </div>
        <button onClick={reset} className="flex items-center gap-2 font-body text-xs tracking-widest uppercase transition-colors"
          style={{ color: "var(--text-faint)" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
          <RotateCcw size={13} /> Clear Chat
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-4 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
            {/* Avatar */}
            <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full"
              style={{
                backgroundColor: m.role === "assistant" ? "var(--gold-glow)" : "var(--bg-card)",
                border: "1px solid var(--border)",
              }}>
              {m.role === "assistant"
                ? <Bot size={14} style={{ color: "var(--gold)" }} />
                : <User size={14} style={{ color: "var(--text-muted)" }} />
              }
            </div>

            {/* Bubble */}
            <div
              className="max-w-[75%] px-5 py-4 font-body text-sm leading-relaxed"
              style={{
                backgroundColor: m.role === "assistant" ? "var(--bg-card)" : "var(--gold-glow)",
                border: `1px solid ${m.role === "assistant" ? "var(--border)" : "rgba(201,168,76,0.3)"}`,
                color: "var(--text)",
              }}
            >
              {m.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex gap-4">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 rounded-full"
              style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--border)" }}>
              <Bot size={14} style={{ color: "var(--gold)" }} />
            </div>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--gold)", animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--gold)", animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ backgroundColor: "var(--gold)", animationDelay: "300ms" }} />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-8 pb-4">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-3" style={{ color: "var(--text-faint)" }}>
            <Sparkles size={10} className="inline mr-1.5" style={{ color: "var(--gold)" }} />
            Try asking
          </p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)}
                className="font-body text-xs px-3 py-2 transition-all duration-200"
                style={{ border: "1px solid var(--border)", color: "var(--text-muted)", backgroundColor: "var(--bg-card)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-8 py-5" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask me to write a description, suggest tags, categorise a product…"
            className="flex-1 font-body text-sm px-4 py-3 focus:outline-none transition-all"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow)"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "none"; }}
            disabled={loading}
          />
          <button
            onClick={() => send()}
            disabled={loading || !input.trim()}
            className="btn-gold disabled:opacity-50 px-5"
          >
            <Send size={15} />
          </button>
        </div>
        <p className="font-body text-[10px] mt-2" style={{ color: "var(--text-faint)" }}>
          Press Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}
