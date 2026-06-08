"use client";

import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  const shipping = totalPrice() >= 500000 ? 0 : 9900;
  const grandTotal = totalPrice() + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
        <div className="text-center">
          <div
            className="w-24 h-24 flex items-center justify-center rounded-full mx-auto mb-6"
            style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-card)" }}
          >
            <ShoppingBag size={32} style={{ color: "var(--text-faint)" }} />
          </div>
          <h1 className="font-display text-4xl mb-3" style={{ color: "var(--text)" }}>Your cart is empty</h1>
          <p className="font-body text-sm mb-8" style={{ color: "var(--text-muted)" }}>
            Discover our curated collection of heritage Indian arts.
          </p>
          <Link href="/shop/paintings" className="btn-gold">Explore Collection</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-6 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <p className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--gold)" }}>
                Your Selection
              </p>
            </div>
            <h1 className="font-display text-5xl" style={{ color: "var(--text)" }}>Cart</h1>
          </div>
          <button
            onClick={clearCart}
            className="font-body text-xs tracking-widest uppercase transition-colors"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#E05030")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
          >
            Clear All
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-0">
            {/* Column headers */}
            <div
              className="hidden md:grid grid-cols-12 gap-4 pb-3 mb-2"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              {["Product", "", "Qty", "Price"].map((h, i) => (
                <p
                  key={i}
                  className={`font-body text-[10px] tracking-[0.2em] uppercase ${
                    i === 0 ? "col-span-6" : i === 1 ? "col-span-2" : i === 2 ? "col-span-2" : "col-span-2 text-right"
                  }`}
                  style={{ color: "var(--text-faint)" }}
                >
                  {h}
                </p>
              ))}
            </div>

            {items.map(({ product: p, quantity }) => (
              <div
                key={p.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 items-center"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                {/* Image + name */}
                <div className="md:col-span-6 flex gap-4 items-start">
                  <Link href={`/product/${p.slug}`}>
                    <div className="w-20 h-24 shrink-0 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  </Link>
                  <div>
                    <Link href={`/product/${p.slug}`}>
                      <h3 className="font-display text-xl leading-tight mb-1 hover:text-gold-theme transition-colors" style={{ color: "var(--text)" }}>
                        {p.name}
                      </h3>
                    </Link>
                    <p className="font-body text-[10px] mb-1" style={{ color: "var(--text-faint)" }}>{p.artist}</p>
                    <p className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>{p.origin}</p>
                    <p className="font-body text-xs mt-2 md:hidden font-medium" style={{ color: "var(--gold)" }}>
                      {formatPrice(p.price)}
                    </p>
                  </div>
                </div>

                {/* Unit price (desktop) */}
                <div className="hidden md:block md:col-span-2">
                  <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>{formatPrice(p.price)}</p>
                </div>

                {/* Quantity */}
                <div className="md:col-span-2 flex items-center gap-3">
                  <div className="flex items-center" style={{ border: "1px solid var(--border)" }}>
                    <button
                      onClick={() => updateQuantity(p.id, quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      <Minus size={12} />
                    </button>
                    <span
                      className="w-8 h-8 flex items-center justify-center font-body text-sm"
                      style={{ color: "var(--text)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(p.id, quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center transition-colors"
                      style={{ color: "var(--text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                    >
                      <Plus size={12} />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(p.id)}
                    className="transition-colors"
                    style={{ color: "var(--text-faint)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#E05030")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                {/* Line total (desktop) */}
                <div className="hidden md:block md:col-span-2 text-right">
                  <p className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
                    {formatPrice(p.price * quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="font-display text-2xl mb-6" style={{ color: "var(--text)" }}>Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Subtotal</span>
                  <span className="font-body text-sm" style={{ color: "var(--text)" }}>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Shipping</span>
                  <span className="font-body text-sm" style={{ color: shipping === 0 ? "#4CAF6C" : "var(--text)" }}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Tax (GST)</span>
                  <span className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Included</span>
                </div>
              </div>

              {totalPrice() < 500000 && (
                <div
                  className="px-4 py-3 mb-5 text-center"
                  style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                >
                  <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                    Add <span style={{ color: "var(--gold)" }}>{formatPrice(500000 - totalPrice())}</span> for free shipping
                  </p>
                </div>
              )}

              <div
                className="flex justify-between py-4 mb-6"
                style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
              >
                <span className="font-body text-sm font-medium" style={{ color: "var(--text)" }}>Total</span>
                <span className="font-display text-2xl text-gold-shimmer">{formatPrice(grandTotal)}</span>
              </div>

              <Link href="/checkout" className="btn-gold w-full justify-center mb-3">
                Checkout <ArrowRight size={15} />
              </Link>

              <Link
                href="/shop"
                className="block text-center font-body text-xs tracking-widest uppercase transition-colors mt-3"
                style={{ color: "var(--text-faint)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
