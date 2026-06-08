"use client";

import Link from "next/link";
import { useState } from "react";
import { formatPrice } from "@/utils/format";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";

interface FeaturedProduct {
  id: string;
  slug: string;
  name: string;
  artist: string;
  price: number;
  compareAt?: number;
  image: string;
  images?: string[];
  category: string;
  subcategory: string;
  origin: string;
  stock: number;
}

function ProductCard({ p, handleAdd }: { p: FeaturedProduct; handleAdd: any }) {
  const displayImages = p.images && p.images.length > 0 ? p.images : [p.image];
  const hasSecondaryImage = displayImages.length > 1;

  return (
    <Link
      href={`/product/${p.slug}`}
      className="product-card group block glass-card overflow-hidden"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[3/4] bg-black/5">
        {/* Primary Image (Catalog Shot) */}
        <img
          src={displayImages[0]}
          alt={p.name}
          className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
            hasSecondaryImage ? "lg:group-hover:opacity-0" : ""
          }`}
        />

        {/* Secondary Image (Lifestyle Shot) */}
        {hasSecondaryImage && (
          <img
            src={displayImages[1]}
            alt={`${p.name} detail`}
            className="absolute inset-0 w-full h-full object-cover opacity-0 lg:group-hover:opacity-100 transition-opacity duration-700 ease-in-out pointer-events-none"
          />
        )}

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
          style={{ background: "linear-gradient(0deg, rgba(8,6,4,0.6) 0%, transparent 50%)" }}
        />

        {/* Category badge */}
        <span
          className="absolute top-3 left-3 font-body text-[9px] tracking-[0.2em] uppercase px-2.5 py-1 z-10"
          style={{
            backgroundColor: "rgba(8,6,4,0.75)",
            color: "var(--gold)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border)",
          }}
        >
          {p.category.replace("-", " ")}
        </span>

        {/* Quick add */}
        <button
          onClick={(e) => handleAdd(e, p)}
          className="absolute bottom-0 left-0 right-0 py-3 font-body text-[10px] tracking-[0.2em] uppercase
                     translate-y-full group-hover:translate-y-0 transition-transform duration-400
                     flex items-center justify-center gap-2 z-10"
          style={{ backgroundColor: "var(--gold)", color: "#080604" }}
        >
          <ShoppingBag size={12} />
          Add to Cart
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="font-body text-[9px] tracking-[0.25em] uppercase mb-1" style={{ color: "var(--gold)", opacity: 0.6 }}>
          {p.origin}
        </p>
        <h3 className="product-name font-display text-xl leading-tight mb-1">
          {p.name}
        </h3>
        <p className="font-body text-[11px] mb-3" style={{ color: "var(--text-faint)" }}>
          {p.artist}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <p className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
              {formatPrice(p.price)}
            </p>
            {p.compareAt && (
              <p className="font-body text-[11px] line-through" style={{ color: "var(--text-faint)" }}>
                {formatPrice(p.compareAt)}
              </p>
            )}
          </div>
          <ArrowUpRight
            size={14}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: "var(--gold)" }}
          />
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProducts({ initialProducts = [] }: { initialProducts: FeaturedProduct[] }) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent, p: FeaturedProduct) => {
    e.preventDefault();
    const displayImages = p.images && p.images.length > 0 ? p.images : [p.image];
    addItem({
      id: p.id, slug: p.slug, name: p.name, description: "",
      price: p.price, categories: [p.category], images: displayImages,
      stock: p.stock, status: "active", is_featured: true, tags: [],
      artist: p.artist, origin: p.origin, created_at: "", updated_at: "",
    } as any);
    toast.success(`Added to cart`);
  };

  if (initialProducts.length === 0) return null;

  // Build infinite scrolling marquee items
  let baseProducts = [...initialProducts];
  // Pad array to ensure we have at least 12 items to cover typical viewport widths smoothly
  while (baseProducts.length < 12) {
    baseProducts = [...baseProducts, ...initialProducts];
  }
  // Duplicate for a seamless infinite loop transition
  const marqueeProducts = [...baseProducts, ...baseProducts];

  // Dynamic marquee loop speed (takes 45-60 seconds for a full loop cycle)
  const loopDuration = Math.max(45, Math.min(60, baseProducts.length * 4.5));

  return (
    <section className="pt-12 pb-16 overflow-hidden" style={{ background: "var(--bg-featured)" }}>
      {/* Subtle top border line */}
      <div className="w-full h-px mb-0" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-8">
        <div className="flex items-end justify-between mb-10 md:mb-12">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <p className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--gold)" }}>
                Handpicked
              </p>
            </div>
            <h2 className="font-display text-5xl md:text-6xl" style={{ color: "var(--text)" }}>
              Featured<br />
              <span className="text-gold-shimmer">Works</span>
            </h2>
          </div>
          <Link href="/shop" className="btn-ghost hidden md:inline-flex">
            View All
          </Link>
        </div>
      </div>

      {/* Marquee Wrapper - edge to edge on desktop, touch-scroll on mobile */}
      <div className="featured-marquee-wrapper px-6 lg:px-0">
        <div
          className="featured-marquee-container"
          style={{ "--marquee-speed": `${loopDuration}s` } as React.CSSProperties}
        >
          {marqueeProducts.map((p, idx) => (
            <div key={`${p.id}-${idx}`} className="featured-card-wrapper">
              <ProductCard p={p} handleAdd={handleAdd} />
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px mt-12" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
    </section>
  );
}



