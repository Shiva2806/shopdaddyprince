"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useAuthModalStore } from "@/store/authModal";
import { motion, AnimatePresence } from "framer-motion";
import { X, LogIn } from "lucide-react";

export default function LoginModal() {
  const { isOpen, redirectTo, close } = useAuthModalStore();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  // Automatically close modal if user signs in
  useEffect(() => {
    if (session && isOpen) {
      close();
    }
  }, [session, isOpen, close]);

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signIn("google", { callbackUrl: redirectTo || "/checkout" });
    } catch (error) {
      console.error("Google Sign In Error:", error);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/75 backdrop-blur-md"
          />

          {/* Modal Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", duration: 0.5, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#2B241F] text-[#F5EFE4] rounded-2xl border p-8 md:p-10 shadow-2xl text-center overflow-hidden"
            style={{
              borderColor: "rgba(199, 154, 59, 0.3)", // gold border accent
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={close}
              disabled={loading}
              className="absolute top-4 right-4 text-[#F5EFE4]/40 hover:text-[var(--gold)] transition-colors p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing gold background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-[var(--gold-glow)] rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Logo and title */}
            <div className="flex flex-col items-center mb-8">
              <img
                src="/favicon.png"
                alt="Daddy Prince Logo"
                className="w-10 h-10 object-contain mb-3"
              />
              <h2
                className="text-3xl text-[#FFF9F0] tracking-wide"
                style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
              >
                Join the Collection
              </h2>
              <p className="text-xs text-[#F5EFE4]/60 tracking-[0.2em] uppercase mt-1">
                Fine Indian Arts & Crafts
              </p>
            </div>

            {/* Main content area */}
            <div className="space-y-6 my-6">
              <p className="text-sm text-[#F5EFE4]/80 leading-relaxed max-w-xs mx-auto">
                Sign in to secure your exclusive pieces, view custom orders, and proceed to checkout.
              </p>

              {/* Google Button */}
              <button
                onClick={handleGoogle}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 px-6 py-3.5 font-body text-xs font-semibold tracking-widest uppercase transition-all duration-300 bg-[#1C1816] border border-[#F5EFE4]/10 text-[#F5EFE4] hover:border-[var(--gold)] hover:shadow-[0_0_20px_var(--gold-glow)] disabled:opacity-60 disabled:pointer-events-none"
              >
                {/* Google SVG */}
                <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {loading ? "Connecting to Google..." : "Continue with Google"}
              </button>
            </div>

            {/* Divider */}
            <div
              className="h-[1px] my-6"
              style={{
                background: "linear-gradient(90deg, transparent, rgba(245,239,228,0.1), transparent)",
              }}
            />

            {/* Guest navigation / Continue Browsing */}
            <div>
              <button
                onClick={close}
                disabled={loading}
                className="text-xs text-[#F5EFE4]/40 hover:text-[var(--gold)] uppercase tracking-widest transition-colors font-medium focus:outline-none"
              >
                Continue Browsing
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
