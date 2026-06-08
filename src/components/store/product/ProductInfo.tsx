"use client";

import { useState } from "react";
import { ShoppingBag, Heart, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";
import type { Product } from "@/types";

interface ProductData {
  id: string; slug: string; name: string; artist: string;
  price: number; compareAt?: number; images: string[];
  category: string; subcategory: string; origin: string;
  stock: number; description: string;
  dimensions: string; medium: string; year: string;
}

export default function ProductInfo({ product }: { product: ProductData }) {
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const discount = product.compareAt
    ? Math.round((1 - product.price / product.compareAt) * 100)
    : null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        price: product.price,
        categories: [product.category],
        images: product.images,
        stock: product.stock,
        status: "active",
        is_featured: false,
        tags: [],
        artist: product.artist,
        origin: product.origin,
        created_at: "",
        updated_at: "",
      });
    }
    toast.success(`${qty > 1 ? `${qty}× ` : ""}${product.name} added to cart`);
  };

  return (
    <div className="flex flex-col">
      {/* Category + origin */}
      <div className="flex items-center gap-3 mb-4">
        <span
          className="font-body text-[9px] tracking-[0.3em] uppercase px-3 py-1.5"
          style={{ border: "1px solid var(--border)", color: "var(--gold)", backgroundColor: "var(--gold-glow)" }}
        >
          {product.category.replace("-", " ")}
        </span>
        <span className="font-body text-[10px] tracking-wider" style={{ color: "var(--text-faint)" }}>
          {product.subcategory}
        </span>
      </div>

      {/* Name */}
      <h1 className="font-display text-4xl md:text-5xl leading-[1.05] mb-3" style={{ color: "var(--text)" }}>
        {product.name}
      </h1>

      {/* Artist */}
      <p className="font-body text-sm mb-1" style={{ color: "var(--text-muted)" }}>
        by <span style={{ color: "var(--gold)" }}>{product.artist}</span>
      </p>
      <p className="font-body text-xs mb-8" style={{ color: "var(--text-faint)" }}>
        {product.origin} · {product.year}
      </p>

      {/* Divider */}
      <div className="h-px mb-8" style={{ background: "linear-gradient(90deg, var(--border), transparent)" }} />

      {/* Price */}
      <div className="flex items-baseline gap-4 mb-8">
        <p className="font-display text-3xl text-gold-shimmer">
          {formatPrice(product.price)}
        </p>
        {product.compareAt && (
          <>
            <p className="font-body text-lg line-through" style={{ color: "var(--text-faint)" }}>
              {formatPrice(product.compareAt)}
            </p>
            <span
              className="font-body text-xs tracking-widest uppercase px-2 py-1"
              style={{ backgroundColor: "rgba(180,60,20,0.15)", color: "#E87050", border: "1px solid rgba(180,60,20,0.25)" }}
            >
              {discount}% off
            </span>
          </>
        )}
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: product.stock > 2 ? "#4CAF6C" : product.stock > 0 ? "#E8A030" : "#E05030" }}
        />
        <p className="font-body text-xs tracking-wide" style={{ color: "var(--text-muted)" }}>
          {product.stock === 0
            ? "Sold out"
            : product.stock === 1
            ? "Last piece available"
            : product.stock <= 3
            ? `Only ${product.stock} left`
            : "In stock"}
        </p>
      </div>

      {/* Quantity + Add to cart */}
      {product.stock > 0 && (
        <div className="flex gap-3 mb-6">
          {/* Qty selector */}
          <div
            className="flex items-center gap-0"
            style={{ border: "1px solid var(--border)" }}
          >
            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
              className="w-10 h-12 flex items-center justify-center transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Minus size={14} />
            </button>
            <span
              className="w-10 h-12 flex items-center justify-center font-body text-sm"
              style={{ color: "var(--text)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
            >
              {qty}
            </span>
            <button
              onClick={() => setQty(Math.min(product.stock, qty + 1))}
              className="w-10 h-12 flex items-center justify-center transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
            >
              <Plus size={14} />
            </button>
          </div>

          {/* Add to cart */}
          <button onClick={handleAdd} className="btn-gold flex-1 justify-center">
            <ShoppingBag size={15} />
            Add to Cart
          </button>

          {/* Wishlist */}
          <button
            onClick={() => setWishlisted(!wishlisted)}
            className="w-12 h-12 flex items-center justify-center transition-all duration-300"
            style={{
              border: "1px solid var(--border)",
              color: wishlisted ? "#E05030" : "var(--text-muted)",
              backgroundColor: wishlisted ? "rgba(224,80,48,0.08)" : "transparent",
            }}
          >
            <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
          </button>
        </div>
      )}

      {/* Trust strip */}
      <div
        className="grid grid-cols-3 gap-0 mb-8"
        style={{ border: "1px solid var(--border)" }}
      >
        {[
          { icon: Shield, label: "Authenticated", sub: "Certificate included" },
          { icon: Truck, label: "Insured Shipping", sub: "Pan India & worldwide" },
          { icon: RotateCcw, label: "Easy Returns", sub: "7 day return policy" },
        ].map(({ icon: Icon, label, sub }, i) => (
          <div
            key={label}
            className="flex flex-col items-center text-center p-4 gap-2"
            style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none" }}
          >
            <Icon size={16} style={{ color: "var(--gold)" }} />
            <div>
              <p className="font-body text-[10px] font-medium tracking-wide" style={{ color: "var(--text)" }}>
                {label}
              </p>
              <p className="font-body text-[9px]" style={{ color: "var(--text-faint)" }}>{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick details */}
      <div className="space-y-2.5">
        {[
          { label: "Medium", value: product.medium },
          { label: "Dimensions", value: product.dimensions },
          { label: "Origin", value: product.origin },
          { label: "Year", value: product.year },
        ].map(({ label, value }) => (
          <div key={label} className="flex gap-4">
            <span className="font-body text-[10px] tracking-[0.15em] uppercase w-24 shrink-0 pt-0.5" style={{ color: "var(--text-faint)" }}>
              {label}
            </span>
            <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
