"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

export default function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if dismissed previously
    const dismissed = localStorage.getItem("dp-welcome-dismissed");
    if (!dismissed) {
      // 6 seconds delay as requested (5-8 range)
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("dp-welcome-dismissed", "true");
    setIsOpen(false);
  };

  const handleExplore = () => {
    localStorage.setItem("dp-welcome-dismissed", "true");
    setIsOpen(false);
    router.push("/shop");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.6, ease: "easeOut" }}
            className="glass-card max-w-md w-full rounded-2xl border shadow-2xl relative overflow-hidden text-center p-8 md:p-10 z-[9999]"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-glass)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* Top Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors p-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing gold background accent */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[var(--gold-glow)] rounded-full blur-3xl pointer-events-none -z-10" />

            {/* Icon decoration */}
            <div 
              className="w-12 h-12 rounded-full border mx-auto flex items-center justify-center mb-6"
              style={{
                backgroundColor: "var(--gold-glow)",
                borderColor: "rgba(212, 175, 55, 0.3)",
              }}
            >
              <Sparkles className="w-5 h-5 text-[var(--gold)] animate-pulse" />
            </div>

            {/* Content */}
            <h2 
              className="text-3xl md:text-4xl text-[var(--text-heading)] mb-3 tracking-wide"
              style={{ fontFamily: "var(--font-cormorant)", fontWeight: 300 }}
            >
              Welcome to Daddy Prince
            </h2>
            
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-8 max-w-xs mx-auto">
              Discover handcrafted Indian art, heritage décor, and timeless collectibles curated for the modern luxury space.
            </p>

            {/* Action buttons */}
            <div className="space-y-3">
              <button
                onClick={handleExplore}
                className="btn-gold w-full justify-center py-3.5 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase"
              >
                Explore Collection
              </button>
              <button
                onClick={handleClose}
                className="btn-ghost w-full justify-center py-3.5 rounded-lg text-xs font-semibold tracking-[0.15em] uppercase"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
