"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Access localStorage inside useEffect to avoid SSR mismatch
    const consent = localStorage.getItem("dp-cookie-consent");
    if (!consent) {
      // Small delay for natural entrance
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("dp-cookie-consent", "accepted");
    setShowBanner(false);
    toast.success("Thank you for accepting our cookies!", {
      duration: 3000,
      icon: "🍪",
    });
  };

  const handleManage = () => {
    localStorage.setItem("dp-cookie-consent", "accepted");
    setShowBanner(false);
    toast.success("Essential preferences saved successfully.", {
      duration: 3000,
    });
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 md:left-auto md:right-6 md:max-w-md z-[9999] animate-fade-up">
      <div 
        className="glass-card p-6 rounded-2xl border shadow-2xl relative overflow-hidden"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-glass)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
        }}
      >
        {/* Decorative subtle gold accent line at the top */}
        <div 
          className="absolute top-0 left-0 right-0 h-[3px]"
          style={{
            background: "linear-gradient(90deg, var(--gold-dark), var(--gold-light), var(--gold-dark))",
          }}
        />

        <div className="flex gap-4 items-start">
          <div 
            className="p-3 rounded-xl flex items-center justify-center border"
            style={{
              backgroundColor: "var(--gold-glow)",
              borderColor: "rgba(212, 175, 55, 0.2)",
            }}
          >
            <Cookie className="w-5 h-5 text-[var(--gold)]" strokeWidth={1.5} />
          </div>

          <div className="flex-1">
            <h3 
              className="text-lg font-medium leading-6 mb-1 text-[var(--text-heading)]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              We Value Your Privacy
            </h3>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
              We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic.
            </p>

            <div className="flex gap-3 items-center justify-end">
              <button
                onClick={handleManage}
                className="btn-ghost py-2.5 px-4 rounded-lg text-[10px] tracking-[0.1em] font-medium"
              >
                Manage Preferences
              </button>
              <button
                onClick={handleAccept}
                className="btn-gold py-2.5 px-5 rounded-lg text-[10px] tracking-[0.1em] font-medium"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
