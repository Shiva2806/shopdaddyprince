"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const emailParam = searchParams.get("email");
    const tokenParam = searchParams.get("token");
    if (emailParam) {
      setEmail(emailParam);
    }
    if (tokenParam) {
      setToken(tokenParam);
    }
  }, [searchParams]);

  const handleUnsubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/newsletter?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to unsubscribe. Please try again.");
      } else {
        toast.success("Successfully unsubscribed.");
        setSuccess(true);
      }
    } catch (err) {
      toast.error("Network error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card max-w-md w-full p-8 text-center animate-fade-up">
      <div className="flex flex-col items-center gap-2 mb-6">
        <img
          src="/favicon.png"
          alt="Daddy Prince Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="font-display text-2xl text-[var(--gold)] tracking-widest uppercase">
          Daddy Prince
        </h1>
        <p className="font-body text-[10px] text-[var(--text-faint)] tracking-[0.2em] uppercase">
          Collector's Circle Opt-Out
        </p>
      </div>

      {success ? (
        <div>
          <h2 className="font-display text-xl mb-4" style={{ color: "var(--text-heading)" }}>
            Successfully Unsubscribed
          </h2>
          <p className="font-body text-sm mb-8 leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Your email <strong>{email}</strong> has been removed from our acquisitions announcements and collectors newsletter.
          </p>
          <Link href="/" className="btn-gold justify-center w-full">
            Return to Gallery
          </Link>
        </div>
      ) : (
        <form onSubmit={handleUnsubscribe} className="space-y-6">
          <p className="font-body text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Confirm your email address below to unsubscribe from our notifications and collector announcements.
          </p>

          <div className="text-left">
            <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all"
              style={{
                backgroundColor: "var(--bg-subtle)",
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold w-full justify-center disabled:opacity-50"
          >
            {loading ? "PROCESSING..." : "UNSUBSCRIBE FROM LIST"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundColor: "var(--bg)",
        backgroundImage: "var(--mesh-1), var(--mesh-2), var(--mesh-3)",
      }}
    >
      <Suspense fallback={
        <div className="text-center font-display text-xl" style={{ color: "var(--gold)" }}>
          Loading opt-out details...
        </div>
      }>
        <UnsubscribeContent />
      </Suspense>
    </div>
  );
}
