"use client";

import { useState, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import ProductGrid from "./ProductGrid";
import { getCollectionDetail } from "@/utils/collectionContent";
import EmptyCollectionState from "./EmptyCollectionState";

interface UIProduct {
  id: string;
  slug: string;
  name: string;
  artist: string;
  price: number;
  compareAt?: number;
  image: string;
  images: string[];
  category: string;
  subcategory: string;
  origin: string;
  stock: number;
  description: string;
  dimensions: string;
  medium: string;
  year: string;
  tags: string[];
}

interface Props {
  initialProducts: UIProduct[];
  activeSort: string;
}

const SORT_OPTIONS = [
  { value: "newest",      label: "Newest First" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

export default function SaleClient({ initialProducts = [], activeSort }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const products = useMemo(() => {
    let list = [...initialProducts];
    if (activeSort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (activeSort === "price-desc") list.sort((a, b) => b.price - a.price);
    return list;
  }, [initialProducts, activeSort]);

  const setParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    router.push(`${pathname}?${params.toString()}`);
  };

  const detail = getCollectionDetail("sale");

  // FUTURE LOGIC:
  // if (products.length > 0) { ... } else { ... }
  // FOR LAUNCH: Force Coming Soon placeholder page regardless of product count.
  const forceComingSoon = true;

  if (forceComingSoon) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 py-20 bg-theme">
        <EmptyCollectionState
          isSale={true}
          eyebrow="SPECIAL OFFERS"
          heading="Exclusive Offers Coming Soon"
          description={
            <>
              We are preparing special offers on selected handcrafted artworks, heritage décor, and collector pieces.
              <br />
              <span className="block mt-2">Join us soon for curated savings without compromising craftsmanship.</span>
            </>
          }
          buttonText="Explore Collections"
          buttonLink="/shop"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: "var(--bg)" }}>
      {/* Section 1: Editorial Collection Introduction */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Large Hero Image */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] md:aspect-[4/3] lg:aspect-[16/11] overflow-hidden rounded-lg group shadow-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
            <Image
              src={detail.image}
              alt={detail.title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
              className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
            />
            {/* Elegant overlay shadow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Category Content */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <span className="font-body text-[10px] tracking-[0.35em] uppercase font-semibold text-[var(--gold)]">
                Collection
              </span>
            </div>
            
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-[var(--text-heading)] font-light leading-tight mb-5">
              The Archive <span className="text-gold-shimmer font-normal">Sale</span>
            </h1>
            
            <p className="font-body text-base leading-relaxed text-[var(--text-muted)] font-light mb-8 max-w-xl">
              {detail.description}
            </p>
            
            <div className="flex items-center gap-2 font-body text-xs tracking-wider text-[var(--text-faint)]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--gold)" }} />
              <span>{products.length} {products.length === 1 ? "Curated Work" : "Curated Works"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Elegant Divider */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8" aria-hidden="true">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-5 bg-theme text-[var(--gold)] text-xs tracking-[0.5em] font-light">
            ◆
          </span>
        </div>
      </div>

      {/* Section 3: Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24">
        {products.length > 0 ? (
          <>
            {/* Controls and Sort Select */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border)]">
              <p className="font-body text-xs text-[var(--text-faint)]">
                Showing {products.length} {products.length === 1 ? "piece" : "pieces"}
              </p>

              <div className="flex items-center gap-3">
                <select
                  value={activeSort}
                  onChange={(e) => setParam("sort", e.target.value)}
                  className="font-body text-[10px] tracking-wider uppercase px-4 py-2 focus:outline-none cursor-pointer glass-card"
                  style={{ color: "var(--text-muted)", minWidth: "150px" }}
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <ProductGrid products={products} />
          </>
        ) : (
          <EmptyCollectionState isSale={true} />
        )}
      </div>
    </div>
  );
}
