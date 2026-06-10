"use client";

import { useTheme } from "@/components/layout/ThemeProvider";
import { useEffect, useState } from "react";

const items = [
  "Curated Masterpieces",
  "Ships Worldwide",
  "Handpicked by Experts",
  "Direct from Artisan Families",
  "Est. 1984",
  "100% Genuine Craftsmanship",
  "Insured Delivery",
  "Certified Origins",
  "Heritage Since 1984",
];

export default function MarqueeTicker() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const repeated = [...items, ...items];
  const isLight = mounted && theme === "light";

  return (
    <div
      className="overflow-hidden py-3 select-none relative"
      style={{
        borderTop: isLight ? "1px solid rgba(199, 154, 59, 0.2)" : "1px solid var(--border)",
        borderBottom: isLight ? "1px solid rgba(199, 154, 59, 0.2)" : "1px solid var(--border)",
        background: isLight 
          ? "#5B1C1C" 
          : "linear-gradient(90deg, var(--bg-card), var(--bg-subtle), var(--bg-card))",
      }}
    >
      {/* Fade edges */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ 
          background: `linear-gradient(90deg, ${isLight ? "#5B1C1C" : "var(--bg)"}, transparent)` 
        }} 
      />
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ 
          background: `linear-gradient(-90deg, ${isLight ? "#5B1C1C" : "var(--bg)"}, transparent)` 
        }} 
      />

      <div className="flex gap-0 animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-5 font-body text-[10px] tracking-[0.25em] uppercase px-5"
            style={{ color: isLight ? "#F5EFE4" : "var(--text-muted)" }}
          >
            {item}
            <span style={{ color: isLight ? "#C79A3B" : "var(--gold)", fontSize: "5px", opacity: 0.8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
