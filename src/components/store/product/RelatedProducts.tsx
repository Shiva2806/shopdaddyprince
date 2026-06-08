"use client";

import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { ArrowUpRight } from "lucide-react";

interface Product {
  id: string; slug: string; name: string; artist: string;
  price: number; images: string[]; category: string; origin: string;
}

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <section className="py-20" style={{ backgroundColor: "var(--bg-subtle)" }}>
      <div className="w-full h-px mb-0" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-8 h-px" style={{ backgroundColor: "var(--gold)" }} />
          <p className="font-body text-[10px] tracking-[0.4em] uppercase" style={{ color: "var(--gold)" }}>
            From the Same Collection
          </p>
        </div>
        <h2 className="font-display text-4xl mb-12" style={{ color: "var(--text)" }}>
          You May Also Like
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link key={p.id} href={`/product/${p.slug}`} className="product-card group block glass-card overflow-hidden">
              <div className="relative overflow-hidden aspect-[3/4]">
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(0deg, rgba(8,6,4,0.6) 0%, transparent 55%)" }}
                />
              </div>
              <div className="p-4">
                <p className="font-body text-[9px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold)", opacity: 0.6 }}>
                  {p.origin}
                </p>
                <h3 className="product-name font-display text-lg leading-tight mb-1">{p.name}</h3>
                <p className="font-body text-[11px] mb-3" style={{ color: "var(--text-faint)" }}>{p.artist}</p>
                <div className="flex items-center justify-between">
                  <p className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
                    {formatPrice(p.price)}
                  </p>
                  <ArrowUpRight size={13} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--gold)" }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
