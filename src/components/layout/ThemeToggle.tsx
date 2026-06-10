"use client";

import { useTheme } from "./ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Only render after mount to avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-full border"
        style={{ borderColor: "rgba(212, 175, 55, 0.2)", backgroundColor: "transparent" }}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 group focus:outline-none"
      style={{
        borderColor: "rgba(212, 175, 55, 0.4)",
        backgroundColor: "transparent",
        boxShadow: "0 0 0 transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--gold)";
        e.currentTarget.style.boxShadow = "0 0 12px rgba(212, 175, 55, 0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(212, 175, 55, 0.4)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {isDark ? (
        <Sun size={14} className="text-[var(--gold)] transition-transform duration-500 rotate-0 group-hover:rotate-45" strokeWidth={1.75} />
      ) : (
        <Moon size={14} className="text-[var(--gold)] transition-transform duration-500 rotate-0 group-hover:-rotate-12" strokeWidth={1.75} />
      )}
    </button>
  );
}
