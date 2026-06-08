"use client";

import { useState } from "react";
import toast from "react-hot-toast";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    toast.success("You're on the list.");
    setEmail("");
    setLoading(false);
  };

  return (
    <section className="relative pt-14 pb-8 md:pb-12 overflow-hidden" style={{ background: "var(--bg-newsletter)" }}>
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: "128px",
        }}
      />
      {/* Gold radial glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 60% 70% at 50% 100%, rgba(201,168,76,0.06) 0%, transparent 65%)"
      }} />

      <div className="relative z-10 max-w-xl mx-auto px-6 text-center">
        <div className="flex items-center justify-center gap-4 mb-4">
          <div className="w-6 h-px" style={{ backgroundColor: "var(--gold)" }} />
          <p className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--gold)" }}>
            BECOME A COLLECTOR
          </p>
          <div className="w-6 h-px" style={{ backgroundColor: "var(--gold)" }} />
        </div>

        <h2 className="font-display text-4xl md:text-5xl mb-4" style={{ color: "var(--text)" }}>
          Rare Pieces<br />
          <span className="text-gold-shimmer">Arrive Only Once</span>
        </h2>

        <p className="font-body text-sm mb-10 leading-relaxed" style={{ color: "var(--text-muted)" }}>
          Join our circle of collectors and receive first access to heritage acquisitions,
          artisan discoveries, and curated stories from across India.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 font-body text-sm px-4 py-3.5 focus:outline-none transition-all"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "var(--gold)";
              e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.boxShadow = "none";
            }}
          />
          <button type="submit" disabled={loading} className="btn-gold disabled:opacity-50 whitespace-nowrap">
            {loading ? "JOINING…" : "JOIN THE CIRCLE"}
          </button>
        </form>

        <p className="font-body text-[10px] mt-4 tracking-wide" style={{ color: "var(--text-faint)" }}>
          No spam. Only meaningful arrivals.
        </p>
      </div>
    </section>
  );
}
