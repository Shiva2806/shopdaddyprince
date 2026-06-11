"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";
import OtpVerification from "@/components/auth/OtpVerification";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl: "/" });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(201,168,76,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10 flex flex-col items-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-3 group"
          >
            <img
              src="/favicon.png"
              alt="Daddy Prince Logo"
              className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span
              className="font-display text-3xl tracking-widest uppercase text-gold-shimmer"
              style={{ color: "var(--gold)" }}
            >
              Daddy Prince
            </span>
          </Link>
          <p
            className="font-body text-[10px] tracking-[0.35em] uppercase mt-2"
            style={{ color: "var(--text-faint)" }}
          >
            Fine Indian Arts & Crafts
          </p>
        </div>

        {/* Card */}
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <h1
              className="font-display text-3xl mb-2"
              style={{ color: "var(--text)" }}
            >
              Welcome Back
            </h1>
            <p
              className="font-body text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Sign in to your collector account
            </p>
          </div>

          {/* Divider */}
          <div
            className="h-px mb-8"
            style={{
              background:
                "linear-gradient(90deg, transparent, var(--border), transparent)",
            }}
          />

          {/* Google sign in */}
          <div className="space-y-6">
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 font-body text-sm tracking-wider transition-all duration-300 disabled:opacity-60"
              style={{
                border: "1px solid var(--border)",
                color: "var(--text)",
                backgroundColor: "var(--bg-subtle)",
              }}
              onMouseEnter={(e) => {
                const element = e.currentTarget;
                element.style.borderColor = "var(--gold)";
                element.style.boxShadow = "0 0 20px var(--gold-glow)";
              }}
              onMouseLeave={(e) => {
                const element = e.currentTarget;
                element.style.borderColor = "var(--border)";
                element.style.boxShadow = "none";
              }}
            >
              {/* Google SVG */}
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {loading ? "Signing in…" : "Continue with Google"}
            </button>

            {/* Mobile/OTP Login disabled for launch 
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(90deg, transparent, var(--border))" }} />
              <span className="font-body text-[9px] tracking-[0.25em] uppercase whitespace-nowrap" style={{ color: "var(--text-faint)" }}>
                OR CONTINUE WITH MOBILE
              </span>
              <div className="flex-1 h-[1px]" style={{ background: "linear-gradient(270deg, transparent, var(--border))" }} />
            </div>
            
            {!phoneNumber ? (
              <PhoneLoginForm onOtpSent={setPhoneNumber} />
            ) : (
              <OtpVerification phoneNumber={phoneNumber} onBack={() => setPhoneNumber(null)} />
            )}
            */}
          </div>

          {/* Terms note */}
          <p
            className="font-body text-[10px] text-center mt-6 leading-relaxed"
            style={{ color: "var(--text-faint)" }}
          >
            By signing in, you agree to our{" "}
            <Link href="/terms-and-conditions" className="underline hover:text-gold-theme transition-colors">
              Terms & Conditions
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline hover:text-gold-theme transition-colors">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to shop */}
        <div className="text-center mt-6">
          <Link
            href="/shop"
            className="font-body text-xs tracking-widest uppercase transition-colors"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
          >
            ← Continue as Guest
          </Link>
        </div>
      </div>
    </div>
  );
}
