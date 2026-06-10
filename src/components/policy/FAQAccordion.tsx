"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string | React.ReactNode;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className="border transition-all duration-300"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: isOpen ? "var(--gold)" : "var(--border)",
              boxShadow: isOpen ? "0 4px 20px var(--gold-glow)" : "none",
            }}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              className="w-full flex justify-between items-center text-left p-6 font-display text-base sm:text-lg transition-colors hover:text-gold focus:outline-none"
              style={{ color: isOpen ? "var(--gold)" : "var(--text)" }}
            >
              <span>{item.question}</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 shrink-0 ${isOpen ? "rotate-180" : ""}`}
                style={{ color: isOpen ? "var(--gold)" : "var(--text-faint)" }}
              />
            </button>
            <div
              className={`transition-all duration-300 overflow-hidden ${
                isOpen ? "max-h-[500px] border-t" : "max-h-0"
              }`}
              style={{ borderColor: "var(--border)" }}
            >
              <div className="p-6 font-body text-sm text-[var(--text-muted)] leading-relaxed bg-[var(--bg-subtle)]">
                {item.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
