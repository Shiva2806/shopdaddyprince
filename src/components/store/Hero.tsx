"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/components/layout/ThemeProvider";

const desktopSlides = [
  {
    image: "/images/hero/hero-1.webp",
    tag: "Fine Art Heritage",
    heading: ["Fine Art", "Heritage"],
    sub: "Masterpieces created by generational artisans, preserving the soul of Indian craftsmanship.",
    cta: { label: "Explore Collection", href: "/shop/paintings" },
    objectPosition: "center",
  },
  {
    image: "/images/hero/hero-2.webp",
    tag: "Sacred Heritage",
    heading: ["Sacred", "Heritage"],
    sub: "Divine brass sculptures and artifacts hand-carved to bring peace and history into your sanctuary.",
    cta: { label: "View Brass Collection", href: "/shop/brass" },
    objectPosition: "center",
  },
  {
    image: "/images/hero/hero-3.webp",
    tag: "Curated Heritage Living",
    heading: ["Heritage", "Living"],
    sub: "Exquisite hand-woven textiles and vintage wall decor to elevate the luxury home.",
    cta: { label: "View Home Decor", href: "/shop/home-decor" },
    objectPosition: "center",
  },
];

const mobileSlides = [
  {
    image: "/images/hero/hero-mobile-1.webp",
    tag: "Sacred Heritage",
    heading: ["Brass", "Collection"],
    sub: "Divine brass sculptures and artifacts hand-carved to bring peace and history into your sanctuary.",
    cta: { label: "View Brass Collection", href: "/shop/brass" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-2.webp",
    tag: "Fine Art Heritage",
    heading: ["Fine Art", "Heritage"],
    sub: "Masterpieces created by generational artisans, preserving the soul of Indian craftsmanship.",
    cta: { label: "Explore Collection", href: "/shop/paintings" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-3.webp",
    tag: "Curated Heritage Living",
    heading: ["Home", "Decor"],
    sub: "Exquisite hand-woven textiles and vintage wall decor to elevate the luxury home.",
    cta: { label: "View Home Decor", href: "/shop/home-decor" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-4.webp",
    tag: "Vintage Heritage",
    heading: ["Vintage", "Collection"],
    sub: "Discover timeless artifacts, historic colonial furniture, and ancient collectibles.",
    cta: { label: "View Vintage Collection", href: "/shop/vintage" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-5.webp",
    tag: "Experience Gallery",
    heading: ["Visit Our", "Store"],
    sub: "Experience Heritage In Person",
    cta: { label: "Visit Store", href: "/about" },
    objectPosition: "center 30%",
  },
];

export default function Hero() {
  const { theme } = useTheme();
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile((m) => {
        const nextM = window.innerWidth < 768;
        if (nextM !== m) {
          setCurrent(0);
        }
        return nextM;
      });
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const slides = mounted && isMobile ? mobileSlides : desktopSlides;

  const goTo = (idx: number) => {
    if (idx === current || transitioning) return;
    setTransitioning(true);
    setCurrent(idx);
    setTimeout(() => {
      setTransitioning(false);
    }, 1200); // matches the transition duration
  };

  const prevSlide = () => {
    goTo((current - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    goTo((current + 1) % slides.length);
  };

  useEffect(() => {
    const t = setInterval(() => {
      nextSlide();
    }, 7000); // Auto-rotate every 7 seconds
    return () => clearInterval(t);
  }, [current, transitioning, slides]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key === "ArrowRight") {
        nextSlide();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current, transitioning, slides]);

  const slide = slides[current] || slides[0];

  const overlayBackground = theme === "light"
    ? "linear-gradient(90deg, rgba(182, 161, 134, 0.15) 0%, transparent 100%)"
    : "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.10) 100%)";

  const imageFilter = theme === "light"
    ? "brightness(1.15) contrast(1.08) saturate(1.03)"
    : "brightness(1.12) contrast(1.06) saturate(1.03)";

  return (
    <section className="relative h-[100dvh] min-h-[680px] w-full flex items-end pb-28 md:items-center md:pb-0 overflow-hidden" style={{ background: "var(--bg-hero)" }}>
      {slides.map((s, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={idx}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              transition: "opacity 1200ms cubic-bezier(0.25, 1, 0.5, 1)",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <Image
              src={s.image}
              alt={s.tag}
              fill
              priority={idx === 0}
              loading={idx === 0 ? "eager" : "lazy"}
              sizes="100vw"
              className="object-cover"
              style={{
                transform: isActive ? "scale(1.06)" : "scale(1.0)",
                transition: "transform 8000ms cubic-bezier(0.25, 1, 0.5, 1)",
                filter: imageFilter,
                objectPosition: s.objectPosition || "center",
              }}
            />
          </div>
        );
      })}

      {/* Subtle luxury gradient overlay */}
      <div
        className="absolute inset-0 z-10 pointer-events-none transition-all duration-500"
        style={{
          background: overlayBackground,
        }}
      />

      {/* Floating Arrows */}
      <div className="absolute inset-x-6 md:inset-x-12 top-1/2 -translate-y-1/2 z-20 flex justify-between pointer-events-none">
        <button
          onClick={prevSlide}
          disabled={transitioning}
          aria-label="Previous slide"
          className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--gold)] transition-all duration-300 backdrop-blur-sm bg-[var(--bg-glass)] hover:scale-105 group pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          disabled={transitioning}
          aria-label="Next slide"
          className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--gold)] transition-all duration-300 backdrop-blur-sm bg-[var(--bg-glass)] hover:scale-105 group pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed hidden md:flex"
        >
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-16 w-full pt-32 pb-6 md:py-20">
        <div key={current} className="max-w-2xl animate-fade-in">
          {/* Tag */}
          <div className="flex items-center gap-3 mb-6 animate-fade-up" style={{ opacity: 0 }}>
            <div className="w-8 h-px bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
              {slide.tag}
            </p>
          </div>

          {/* Heading */}
          <h1 className="font-display leading-[1.05] sm:leading-[0.95] mb-8">
            <span
              className="block text-[clamp(2.1rem,7vw,5.5rem)] animate-fade-up delay-100 font-light"
              style={{ color: "var(--text)", opacity: 0 }}
            >
              {slide.heading[0]}
            </span>
            <span
              className="block text-[clamp(2.1rem,7vw,5.5rem)] animate-fade-up delay-200 text-gold-shimmer font-light"
              style={{ opacity: 0 }}
            >
              {slide.heading[1]}
            </span>
          </h1>

          {/* Sub */}
          <p
            className="font-body text-sm sm:text-base leading-relaxed mb-10 max-w-md animate-fade-up delay-300"
            style={{ color: "var(--text-muted)", opacity: 0 }}
          >
            {slide.sub}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 animate-fade-up delay-400" style={{ opacity: 0 }}>
            <Link href={slide.cta.href} className="btn-gold px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]">
              {slide.cta.label}
            </Link>
            <Link
              href="/shop/paintings"
              className="font-body text-xs tracking-[0.2em] uppercase flex items-center gap-2 transition-all duration-300 hover:gap-3 group/link"
              style={{ color: "var(--text-muted)" }}
            >
              All Collections
              <span className="text-[var(--gold)] transition-transform duration-300 group-hover/link:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators (Luxury Dashed Progress Style) */}
      <div className="absolute bottom-10 left-6 md:left-16 flex items-center gap-4 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="group relative py-4 focus:outline-none"
            aria-label={`Go to slide ${i + 1}`}
          >
            <div
              className={`h-[2px] transition-all duration-500 ease-out rounded-full`}
              style={{
                width: i === current ? "48px" : "24px",
                backgroundColor: i === current ? "var(--gold)" : "var(--border-hover)",
              }}
            />
          </button>
        ))}
      </div>

      {/* Slide number */}
      <div
        className="absolute bottom-10 right-6 md:right-16 z-20 font-body text-[10px] tracking-widest flex items-center gap-4"
        style={{ color: "var(--text-faint)" }}
      >
        <span className="text-[var(--text)] font-semibold">0{current + 1}</span>
        <span className="w-6 h-px bg-[var(--border)]" />
        <span>0{slides.length}</span>
      </div>

      {/* Scroll indicator */}
      <div className="absolute right-6 md:right-16 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
        <div className="w-px h-20 relative overflow-hidden" style={{ backgroundColor: "var(--border)" }}>
          <div
            className="absolute top-0 left-0 w-full bg-[var(--gold)]"
            style={{
              height: "40%",
              animation: "scrollIndicator 2s ease-in-out infinite",
            }}
          />
        </div>
        <p
          className="font-body text-[8px] tracking-[0.4em] uppercase"
          style={{
            color: "var(--text-faint)",
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
          }}
        >
          Scroll
        </p>
      </div>

      <style jsx global>{`
        @keyframes scrollIndicator {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </section>
  );
}
