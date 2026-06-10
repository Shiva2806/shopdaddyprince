"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const categories = [
  {
    label: "Paintings",
    slug: "paintings",
    image: "/images/categories/painting.webp",
    sub: "Traditional · Abstracts · Portraits",
    accent: "rgba(200,168,107,0.15)",
  },
  {
    label: "Home Decor",
    slug: "home-decor",
    image: "/images/categories/walldecor.webp",
    sub: "Masks · Jharokhas · Hangings",
    accent: "rgba(200,168,107,0.15)",
  },
  {
    label: "Regional Arts",
    slug: "regional-arts",
    image: "/images/categories/regional arts.webp",
    sub: "Kalamkari · Warli · Patachitra",
    accent: "rgba(200,168,107,0.12)",
  },
  {
    label: "Brass",
    slug: "brass",
    image: "/images/categories/brass.webp",
    sub: "Idols · Artifacts · Hangings",
    accent: "rgba(200,168,107,0.15)",
  },
  {
    label: "Vintage",
    slug: "vintage",
    image: "/images/categories/vintage.webp",
    sub: "Antiques · Furniture · Stools",
    accent: "rgba(200,168,107,0.15)",
  },
];

export default function FeaturedCategories() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} style={{ background: "var(--bg-category)" }}>
      <div className="pt-24 pb-16 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-4">
          <div className="w-8 h-px bg-[var(--gold)]" />
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
            Curated For You
          </p>
        </div>
        <div className="flex items-end justify-between mb-14 relative overflow-visible">
          <div className="spotlight-glow" style={{ left: "20%", width: "380px", height: "380px" }} />
          <h2 className="font-display text-5xl md:text-6xl text-[var(--text-heading)] relative z-10">
            Shop by<br />
            <span className="text-gold-shimmer">Category</span>
          </h2>
          <Link
            href="/shop"
            className="hidden md:flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase transition-all hover:gap-3 duration-300 text-[var(--text-muted)] relative z-10"
          >
            All Collections <span className="text-[var(--gold)]">→</span>
          </Link>
        </div>

        {/* Mobile layout - stack paintings hero on top, 2-column grid for others */}
        <div className="flex flex-col gap-5 md:hidden">
          {/* Paintings — Hero Banner */}
          <CategoryCard cat={categories[0]} className="w-full aspect-[16/10]" />
          
          {/* Remaining 4 categories in a clean 2-column grid */}
          <div className="grid grid-cols-2 gap-4">
            <CategoryCard cat={categories[1]} className="aspect-square" />
            <CategoryCard cat={categories[3]} className="aspect-square" />
            <CategoryCard cat={categories[2]} className="aspect-square" />
            <CategoryCard cat={categories[4]} className="aspect-square" />
          </div>
        </div>

        {/* Bento grid layout for Desktop */}
        <div className="hidden md:grid grid-cols-12 grid-rows-2 gap-5 h-[640px]">
          {/* Paintings — large left */}
          <CategoryCard cat={categories[0]} className="col-span-5 row-span-2" />
          {/* Home Decor — top middle */}
          <CategoryCard cat={categories[1]} className="col-span-4 row-span-1" />
          {/* Brass — top right */}
          <CategoryCard cat={categories[3]} className="col-span-3 row-span-1" />
          {/* Regional — bottom middle */}
          <CategoryCard cat={categories[2]} className="col-span-3 row-span-1" />
          {/* Vintage — bottom right wide */}
          <CategoryCard cat={categories[4]} className="col-span-4 row-span-1" />
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  cat,
  className = "",
}: {
  cat: (typeof categories)[0];
  className?: string;
}) {
  const cardRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lowPerformance, setLowPerformance] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    
    const memory = (navigator as any).deviceMemory;
    const cores = navigator.hardwareConcurrency;
    const isLow = (memory && memory < 4) || (cores && cores < 4);
    setLowPerformance(isLow);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const rawY = useTransform(scrollYProgress, [0, 1], [-15, 15]);
  const rawScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.1]);

  const yVal = useTransform(rawY, (v) => {
    if (prefersReducedMotion || lowPerformance) return 0;
    return isMobile ? v * 0.35 : v;
  });

  const scaleVal = useTransform(rawScale, (v) => {
    if (prefersReducedMotion || lowPerformance) return 1.0;
    return isMobile ? 1.0 + (v - 1.0) * 0.35 : v;
  });

  const y = useSpring(yVal, { stiffness: 100, damping: 25, mass: 0.5 });
  const scale = useSpring(scaleVal, { stiffness: 100, damping: 25, mass: 0.5 });

  return (
    <Link
      ref={cardRef}
      href={`/shop/${cat.slug}`}
      className={`group category-card relative overflow-hidden block ${className}`}
    >
      {/* Image */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <motion.div style={{ y, scale }} className="w-full h-full relative">
          <Image
            src={cat.image}
            alt={cat.label}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Strong dark gradient overlay for text readability */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(180deg, rgba(8,6,4,0.15) 0%, rgba(8,6,4,0.45) 50%, rgba(8,6,4,0.85) 100%)" }}
      />

      {/* Gold accent glow on hover */}
      <div
        className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(ellipse at bottom left, ${cat.accent} 0%, transparent 70%)` }}
      />

      {/* Text Info */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6 z-30">
        <p className="font-display text-2xl md:text-3xl text-white mb-1 transition-transform duration-300 group-hover:-translate-y-1">
          {cat.label}
        </p>
        <p
          className="font-body text-[10px] md:text-[11px] tracking-[0.15em] uppercase transition-all duration-300 opacity-80 group-hover:opacity-100"
          style={{ color: "var(--gold-light)" }}
        >
          {cat.sub}
        </p>
      </div>

      {/* Arrow — appears on hover */}
      <div
        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center z-30
                   opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0
                   transition-all duration-300"
        style={{ border: "1px solid rgba(201,168,76,0.5)", color: "var(--gold)" }}
      >
        <span className="text-xs">→</span>
      </div>
    </Link>
  );
}
