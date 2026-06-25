"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";


interface HeroSlide {
  image: string;
  tag: string;
  heading: string[];
  sub: string;
  cta?: { label: string; href: string };
  ctas?: { label: string; href: string }[];
  objectPosition?: string;
}

const desktopSlides: HeroSlide[] = [
  {
    image: "/images/hero/hero-1.webp",
    tag: "Sacred Artistry",
    heading: ["The Sacred", "Collection"],
    sub: "Discover divine artistry, temple treasures, and timeless spiritual masterpieces.",
    cta: { label: "Explore Collection", href: "/shop/brass" },
    objectPosition: "center",
  },
  {
    image: "/images/hero/hero-2.webp",
    tag: "Devotional Paintings",
    heading: ["Faith Framed", "in Art"],
    sub: "Sacred stories, devotion, and tradition brought to life through exceptional craftsmanship.",
    cta: { label: "View Artworks", href: "/shop/paintings" },
    objectPosition: "center",
  },
  {
    image: "/images/hero/hero-3.webp",
    tag: "Vintage Treasures",
    heading: ["Inspired by", "the Past"],
    sub: "Curated vintage treasures and timeless pieces that celebrate history and character.",
    cta: { label: "Discover Treasures", href: "/shop/vintage" },
    objectPosition: "center",
  },
  {
    image: "/images/hero/hero-4.webp",
    tag: "Established 1985",
    heading: ["Visit Our", "Store"],
    sub: "Visit our Hyderabad store, trusted by collectors. Experience our curated collections in person.",
    ctas: [
      { label: "Visit Store", href: "/about" },
      { label: "Get Directions", href: "https://maps.google.com/?q=Daddy+Prince+Hyderabad" },
    ],
    objectPosition: "center",
  },
];

const mobileSlides: HeroSlide[] = [
  {
    image: "/images/hero/hero-mobile-1.webp",
    tag: "Sacred Artistry",
    heading: ["The Sacred", "Collection"],
    sub: "Divine artistry, temple treasures, and spiritual masterpieces.",
    cta: { label: "Explore Collection", href: "/shop/brass" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-2.webp",
    tag: "Artisan Decor",
    heading: ["Artful", "Living"],
    sub: "Handcrafted décor and timeless accents for refined spaces.",
    cta: { label: "View Decor", href: "/shop/home-decor" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-3.webp",
    tag: "Vintage Collectibles",
    heading: ["Inspired By", "the Past"],
    sub: "Stories, tradition, and craftsmanship preserved through art.",
    cta: { label: "Explore Vintage", href: "/shop/vintage" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-4.webp",
    tag: "Brass Craftsmanship",
    heading: ["The Golden", "Heritage"],
    sub: "Masterfully crafted brass creations inspired by enduring traditions.",
    cta: { label: "Explore Brass", href: "/shop/brass" },
    objectPosition: "center 30%",
  },
  {
    image: "/images/hero/hero-mobile-5.webp",
    tag: "Established 1985",
    heading: ["Visit Our", "Store"],
    sub: "Visit our Ongole store, trusted by collectors. Experience our curated collections in person.",
    ctas: [
      { label: "Visit Store", href: "/about" },
      { label: "Get Directions", href: "https://maps.google.com/?q=Daddy+Prince+Hyderabad" },
    ],
    objectPosition: "center 30%",
  },
];


import { useRef } from "react";

interface ParallaxImageWrapperProps {
  image: string;
  tag: string;
  isActive: boolean;
  isStoreSlide: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  lowPerformance: boolean;
  imageFilter: string;
  objectPosition?: string;
  priority: boolean;
}

function ParallaxImageWrapper({
  image,
  tag,
  isActive,
  imageFilter,
  objectPosition,
  priority,
}: ParallaxImageWrapperProps) {
  return (
    <div className="absolute inset-0">
      <Image
        src={image}
        alt={tag}
        fill
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        sizes="100vw"
        className="object-cover"
        style={{
          transform: isActive ? "scale(1.06)" : "scale(1.0)",
          transition: "transform 8000ms cubic-bezier(0.25, 1, 0.5, 1)",
          filter: imageFilter,
          objectPosition: objectPosition || "center",
        }}
      />
    </div>
  );
}

interface ParallaxContentWrapperProps {
  children: React.ReactNode;
  isStoreSlide: boolean;
  isMobile: boolean;
  prefersReducedMotion: boolean;
  lowPerformance: boolean;
  className?: string;
}

function ParallaxContentWrapper({
  children,
  className = "",
}: ParallaxContentWrapperProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lowPerformance, setLowPerformance] = useState(false);

  // Swipe gesture refs
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);
  const touchStartTime = useRef<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current || !touchStartY.current || !touchEndY.current) return;

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const duration = Date.now() - touchStartTime.current;

    // Minimum swipe distance threshold (50px), direction validation (horizontal movement must exceed vertical movement) and timeout limit
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY) && duration < 500) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }

    // Reset coordinates
    touchStartX.current = null;
    touchEndX.current = null;
    touchStartY.current = null;
    touchEndY.current = null;
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    const isLow = (memory && memory < 4) || (cores && cores < 4);
    setLowPerformance(isLow);
  }, []);



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

  const overlayBackground = "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.30) 50%, rgba(0,0,0,0.10) 100%)";

  const imageFilter = "brightness(1.12) contrast(1.06) saturate(1.03)";

  return (
    <section 
      data-theme="dark"
      className="relative h-[100dvh] min-h-[680px] w-full flex items-end pb-28 md:items-center md:pb-0 overflow-hidden" 
      style={{ background: "var(--bg-hero)" }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {slides.map((s, idx) => {
        const isActive = idx === current;
        return (
          <div
            key={idx}
            className="absolute inset-0 overflow-hidden"
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 1 : 0,
              transition: "opacity 1200ms cubic-bezier(0.25, 1, 0.5, 1)",
              pointerEvents: isActive ? "auto" : "none",
            }}
          >
            <ParallaxImageWrapper
              image={s.image}
              tag={s.tag}
              isActive={isActive}
              isStoreSlide={isMobile ? idx === 4 : idx === 3}
              isMobile={isMobile}
              prefersReducedMotion={prefersReducedMotion}
              lowPerformance={lowPerformance}
              imageFilter={imageFilter}
              objectPosition={s.objectPosition}
              priority={idx === 0}
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
        <ParallaxContentWrapper
          key={current}
          isStoreSlide={isMobile ? current === 4 : current === 3}
          isMobile={isMobile}
          prefersReducedMotion={prefersReducedMotion}
          lowPerformance={lowPerformance}
          className="max-w-2xl animate-fade-in relative"
        >
          {/* Tag */}
          <div className="flex items-center gap-3 mb-6 animate-fade-up" style={{ opacity: 0 }}>
            <div className="w-8 h-px bg-[var(--gold)]" />
            <p 
              className="font-body text-[10px] tracking-[0.4em] uppercase"
              style={{ color: "var(--gold)" }}
            >
              {slide.tag}
            </p>
          </div>

          {/* Heading */}
          <h1 className="font-display leading-[1.05] sm:leading-[0.95] mb-8">
            <span
              className="block text-[clamp(2.1rem,7vw,5.5rem)] animate-fade-up delay-100 font-light"
              style={{ color: "var(--text-heading)", opacity: 0 }}
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
            {slide.ctas ? (
              slide.ctas.map((cta, i) => (
                <Link
                  key={i}
                  href={cta.href}
                  className={`${
                    i === 0 
                      ? "btn-gold" 
                      : "btn-ghost border border-[var(--border-hover)] hover:border-[var(--gold)] text-[var(--gold)]"
                  } px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]`}
                >
                  {cta.label}
                </Link>
              ))
            ) : (
              <>
                {slide.cta && (
                  <Link href={slide.cta.href} className="btn-gold px-8 py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:scale-[1.02]">
                    {slide.cta.label}
                  </Link>
                )}
                <Link
                  href="/shop"
                  className="font-body text-xs tracking-[0.2em] uppercase flex items-center gap-2 transition-all duration-300 hover:gap-3 group/link"
                  style={{ color: "var(--text-muted)" }}
                >
                  All Collections
                  <span className="text-[var(--gold)] transition-transform duration-300 group-hover/link:translate-x-1">→</span>
                </Link>
              </>
            )}
          </div>
        </ParallaxContentWrapper>
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
