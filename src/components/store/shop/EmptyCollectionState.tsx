"use client";

import Link from "next/link";
import { Sparkles, Bell } from "lucide-react";
import toast from "react-hot-toast";

interface EmptyCollectionStateProps {
  isSale?: boolean;
  eyebrow?: string;
  heading?: string;
  description?: React.ReactNode;
  buttonText?: string;
  buttonLink?: string;
}

export default function EmptyCollectionState({ 
  isSale = false,
  eyebrow,
  heading,
  description,
  buttonText,
  buttonLink,
}: EmptyCollectionStateProps) {
  const handleNotifyMe = () => {
    toast.success("Thank you! You will be notified as soon as new pieces arrive.", {
      style: {
        background: "var(--bg-card)",
        color: "var(--text)",
        border: "1px solid var(--gold)",
        fontFamily: "var(--font-jost)",
        fontSize: "13px",
      },
      iconTheme: {
        primary: "var(--gold)",
        secondary: "var(--bg-card)",
      },
    });
  };

  return (
    <div className="relative w-full py-16 md:py-24 px-4 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-[var(--border)] glass-card bg-[var(--bg-subtle)] text-center max-w-4xl mx-auto shadow-2xl animate-fade-in z-10">
      
      {/* Golden spotlight ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[var(--gold)]/10 to-transparent rounded-full filter blur-[50px] pointer-events-none z-0" />
      
      {/* Floating particles background decoration */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] left-[15%] w-1.5 h-1.5 rounded-full bg-[var(--gold)]/40 animate-float-particle delay-100" />
        <div className="absolute top-[60%] left-[80%] w-1 h-1 rounded-full bg-[var(--gold)]/30 animate-float-particle delay-300" style={{ animationDuration: "12s" }} />
        <div className="absolute top-[80%] left-[25%] w-2 h-2 rounded-full bg-[var(--gold)]/20 animate-float-particle delay-500" style={{ animationDuration: "10s" }} />
        <div className="absolute top-[30%] left-[75%] w-1.5 h-1.5 rounded-full bg-[var(--gold)]/50 animate-float-particle delay-200" style={{ animationDuration: "7s" }} />
      </div>

      {/* Decorative pulse badge */}
      <div className="relative z-10 mb-8 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[var(--gold)]/30 bg-[var(--gold-glow)] text-[10px] md:text-xs font-body tracking-[0.2em] uppercase text-[var(--gold-light)] animate-gold-pulse">
        <Sparkles size={11} className="text-[var(--gold-light)]" />
        <span>New Pieces Arriving</span>
      </div>

      {/* Main visual composition (SVG framed brass artifacts outline) */}
      <div className="relative z-10 w-44 h-44 mb-8 flex items-center justify-center">
        {/* Soft backglow */}
        <div className="absolute w-36 h-36 bg-gradient-to-tr from-[var(--gold)]/15 via-transparent to-transparent rounded-full filter blur-[10px] pointer-events-none" />
        
        {/* Elegant outer SVG border frame */}
        <svg className="absolute w-full h-full text-[var(--gold)]/30" viewBox="0 0 100 100">
          <rect x="5" y="5" width="90" height="90" fill="none" stroke="currentColor" strokeWidth="0.5" rx="10" />
          <rect x="9" y="9" width="82" height="82" fill="none" stroke="currentColor" strokeWidth="0.25" rx="8" />
          {/* Decorative corner accents */}
          <path d="M 5 15 L 15 5 M 95 15 L 85 5 M 5 85 L 15 95 M 95 85 L 85 95" stroke="currentColor" strokeWidth="0.5" />
        </svg>

        {/* Brass lamp / Urli SVG outline */}
        <svg className="w-20 h-20 text-[var(--gold)]/80 drop-shadow-[0_0_12px_rgba(199,154,59,0.3)] animate-pulse" style={{ animationDuration: "3s" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1">
          {/* Custom brass artifact design (lamp with flame) */}
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C12 2 9.5 5.5 9.5 7.5C9.5 8.88071 10.6193 10 12 10C13.3807 10 14.5 8.88071 14.5 7.5C14.5 5.5 12 2 12 2Z" fill="currentColor" className="text-[var(--gold-light)] opacity-70" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 14C4 18 8 21 12 21C16 21 20 18 20 14C20 11.5 18 10 12 10C6 10 4 11.5 4 14Z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M2 14H22M6 14C6 14 9 17 12 17C15 17 18 14 18 14" />
          <path d="M12 10V4" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-xl mx-auto px-4">
        <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold-light)] mb-3">
          {eyebrow || "CURATED COLLECTION"}
        </p>
        
        <h2 className="font-display text-3xl md:text-4xl text-[var(--text-heading)] font-light leading-tight mb-5">
          {heading || (isSale ? "Exclusive Offers Coming Soon" : "Coming Soon")}
        </h2>
        
        <div className="font-body text-sm md:text-base leading-relaxed text-[var(--text-muted)] font-light mb-8 max-w-lg mx-auto">
          {description || (isSale ? (
            <>
              We are preparing special offers on selected handcrafted pieces.
              <br />
              <span className="block mt-2 text-xs text-[var(--text-faint)]">Check back soon for exclusive collector pricing.</span>
            </>
          ) : (
            <>
              Our curators are carefully preparing this collection.
              <br />
              <span className="block mt-2 text-xs text-[var(--text-faint)]">New handcrafted pieces, heritage artworks, and exclusive finds will be available soon.</span>
            </>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href={buttonLink || "/shop"} className="btn-gold w-full sm:w-auto justify-center text-center">
            {buttonText || (isSale ? "Browse Collections" : "Explore Other Collections")}
          </Link>
          
          {!isSale && (
            <button 
              onClick={handleNotifyMe}
              className="btn-ghost w-full sm:w-auto justify-center text-center group"
            >
              <Bell size={13} className="transition-transform group-hover:rotate-12" />
              Notify Me
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
