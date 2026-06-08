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
    // Render a static placeholder with same dimensions
    return (
      <div className="w-12 h-6 rounded-full border"
        style={{ borderColor: "var(--border)", backgroundColor: "transparent" }}
      />
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="relative w-12 h-6 rounded-full border transition-all duration-300 flex items-center px-1"
      style={{ borderColor: "var(--border-hover)", backgroundColor: "transparent" }}
    >
      <span
        className={`absolute inset-0 rounded-full transition-all duration-300 ${
          theme === "light" ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundColor: "var(--gold-glow)" }}
      />
      <span
        className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center
                    transition-all duration-300 shadow-sm
                    ${theme === "light"
                      ? "translate-x-6"
                      : "translate-x-0"
                    }`}
        style={{
          backgroundColor: theme === "light" ? "var(--gold)" : "rgba(240,230,208,0.15)",
          color: theme === "light" ? "#080604" : "var(--text-muted)",
        }}
      >
        {theme === "light"
          ? <Sun size={9} strokeWidth={2.5} />
          : <Moon size={9} strokeWidth={2.5} />
        }
      </span>
    </button>
  );
}
