"use client";

import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { ShoppingBag, ArrowUpRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";
import type { Product } from "@/types";
import Reveal from "@/components/ui/Reveal";


import { trackAddToCart } from "@/lib/analytics";

interface PlaceholderProduct {
  id: string; slug: string; name: string; artist: string;
  price: number; image: string; images?: string[]; category: string;
  subcategory: string; origin: string; stock: number;
}

export default function ProductGrid({ products }: { products: PlaceholderProduct[] }) {
  const addItem = useCartStore((s) => s.addItem);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-display text-6xl mb-4" style={{ color: "var(--text-faint)" }}>∅</p>
        <p className="font-display text-3xl mb-2" style={{ color: "var(--text-muted)" }}>No pieces found</p>
        <p className="font-body text-sm" style={{ color: "var(--text-faint)" }}>
          Try a different filter or browse another category.
        </p>
      </div>
    );
  }

  const handleAdd = (e: React.MouseEvent, p: PlaceholderProduct) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: p.id,
      slug: p.slug,
      name: p.name,
      description: "",
      price: p.price,
      categories: [p.category],
      images: [p.image],
      stock: p.stock,
      status: "active",
      is_featured: false,
      tags: [],
      artist: p.artist,
      created_at: "",
      updated_at: "",
    } as any);
    trackAddToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      category: p.category,
      artist: p.artist
    }, 1);
    toast.success(`${p.name} added`);
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
        {products.map((p, i) => (
          <Reveal key={p.id} delayMs={(i % 3) * 100}>
            <Link
              href={`/product/${p.slug}`}
              className="product-shop-card group block glass-card overflow-hidden"
            >
            {/* Image */}
            <div className="relative overflow-hidden aspect-[3/4]">
              {p.images && p.images.length >= 2 ? (
                <>
                  {/* Primary Image */}
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out group-hover:scale-[1.06] lg:group-hover:opacity-0"
                  />
                  {/* Hover Image */}
                  <img
                    src={p.images[1]}
                    alt={p.name}
                    className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-in-out opacity-0 lg:group-hover:opacity-100 lg:group-hover:scale-[1.06] pointer-events-none"
                  />
                </>
              ) : (
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              )}

              {/* Sold out overlay */}
              {p.stock === 0 && (
                <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: "rgba(8,6,4,0.75)" }}>
                  <span className="font-body text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)" }}>Sold Out</span>
                </div>
              )}

              {/* Gradient on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{ background: "linear-gradient(0deg, rgba(8,6,4,0.7) 0%, transparent 55%)" }}
              />

              {/* Stock badge */}
              {p.stock === 1 && (
                <span
                  className="absolute top-3 right-3 font-body text-[9px] tracking-widest uppercase px-2 py-1"
                  style={{ backgroundColor: "rgba(180,60,20,0.85)", color: "#F0E6D0", backdropFilter: "blur(4px)" }}
                >
                  Last One
                </span>
              )}

              {/* Quick add */}
              {p.stock > 0 && (
                <button
                  onClick={(e) => handleAdd(e, p)}
                  className="absolute bottom-0 left-0 right-0 py-2.5 font-body text-[9px] tracking-[0.2em] uppercase
                             translate-y-full group-hover:translate-y-0 transition-transform duration-400
                             flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: "var(--gold)", color: "#080604" }}
                >
                  <ShoppingBag size={11} />
                  Quick Add
                </button>
              )}
            </div>

            {/* Info */}
            <div className="p-3.5">
              <h3 className="product-shop-name font-display text-lg leading-tight">
                {p.name}
              </h3>
              {p.artist && !/unknown/i.test(p.artist) && (
                <p className="font-body text-[10px] mt-0.5 mb-2.5" style={{ color: "var(--text-faint)" }}>
                  by {p.artist}
                </p>
              )}
              <div className="flex items-center justify-between">
                <p className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
                  {formatPrice(p.price)}
                </p>
                <ArrowUpRight
                  size={13}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: "var(--gold)" }}
                />
              </div>
            </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
