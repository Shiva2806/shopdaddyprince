"use client";

import { useState } from "react";
import PolicyLayout from "@/components/policy/PolicyLayout";
import { Loader2, Package } from "lucide-react";
import toast from "react-hot-toast";

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !email) {
      toast.error("Please fill in both fields");
      return;
    }
    
    setLoading(true);
    // Simulate API delay for a premium feel
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success("Query submitted successfully");
    }, 1200);
  };

  return (
    <PolicyLayout title="Track Your Order" lastUpdated="June 9, 2026">
      <div className="max-w-md mx-auto space-y-8">
        <div className="text-center space-y-2">
          <p className="font-body text-sm text-[var(--text-muted)]">
            Enter your details below to check the real-time status of your shipment.
          </p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label 
                className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" 
                style={{ color: "var(--text-faint)" }}
              >
                Order ID <span style={{ color: "var(--gold)" }}>*</span>
              </label>
              <div
                className="flex items-center overflow-hidden transition-all duration-300 w-full"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => {
                  const container = e.currentTarget;
                  container.style.borderColor = "var(--gold)";
                  container.style.boxShadow = "0 0 10px var(--gold-glow)";
                }}
                onBlur={(e) => {
                  const container = e.currentTarget;
                  container.style.borderColor = "var(--border)";
                  container.style.boxShadow = "none";
                }}
              >
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={(e) => setOrderId(e.target.value)}
                  placeholder="e.g. DP-100234"
                  className="w-full font-body text-sm px-4 py-3 bg-transparent text-white focus:outline-none placeholder-stone-600"
                />
              </div>
            </div>

            <div>
              <label 
                className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" 
                style={{ color: "var(--text-faint)" }}
              >
                Email Address <span style={{ color: "var(--gold)" }}>*</span>
              </label>
              <div
                className="flex items-center overflow-hidden transition-all duration-300 w-full"
                style={{
                  backgroundColor: "var(--bg-subtle)",
                  border: "1px solid var(--border)",
                }}
                onFocus={(e) => {
                  const container = e.currentTarget;
                  container.style.borderColor = "var(--gold)";
                  container.style.boxShadow = "0 0 10px var(--gold-glow)";
                }}
                onBlur={(e) => {
                  const container = e.currentTarget;
                  container.style.borderColor = "var(--border)";
                  container.style.boxShadow = "none";
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. customer@example.com"
                  className="w-full font-body text-sm px-4 py-3 bg-transparent text-white focus:outline-none placeholder-stone-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !orderId || !email}
              className="w-full btn-gold py-4 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-widest font-semibold transition-all duration-300"
              style={{
                border: "1px solid var(--gold)",
              }}
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                "Track Order"
              )}
            </button>
          </form>
        ) : (
          <div 
            className="p-8 border text-center space-y-6 animate-fade-in"
            style={{ 
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--gold)",
              boxShadow: "0 4px 20px var(--gold-glow)"
            }}
          >
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-gold/10 border border-gold/20">
                <Package size={32} className="text-[var(--gold)]" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-display text-lg text-white font-medium">Tracking Status</h3>
              <p className="font-body text-sm text-[var(--gold)] tracking-wide uppercase">
                Order tracking integration coming soon
              </p>
              <p className="font-body text-xs text-[var(--text-faint)] leading-relaxed">
                Thank you for your inquiry. For immediate status updates, please reach out to us at{" "}
                <a href="mailto:hello@shopdaddyprince.com" className="text-[var(--gold)] hover:underline">
                  hello@shopdaddyprince.com
                </a>{" "}
                referencing Order ID <span className="font-mono text-white">{orderId}</span>.
              </p>
            </div>
            
            <button
              onClick={() => {
                setSubmitted(false);
                setOrderId("");
              }}
              className="font-body text-[10px] tracking-[0.2em] uppercase text-[var(--gold)] hover:underline block mx-auto"
            >
              Track Another Order
            </button>
          </div>
        )}
      </div>
    </PolicyLayout>
  );
}
