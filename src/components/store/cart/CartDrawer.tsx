"use client";

import { useEffect } from "react";
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import Link from "next/link";
import Image from "next/image";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCartStore();

  // Lock body scroll when open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const shipping = totalPrice() >= 500000 ? 0 : 9900; // free above ₹5000
  const grandTotal = totalPrice() + shipping;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-opacity duration-400"
        style={{
          backgroundColor: "rgba(8,6,4,0.7)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-md flex flex-col transition-transform duration-500 ease-out"
        style={{
          backgroundColor: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          transform: open ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} style={{ color: "var(--gold)" }} />
            <p className="font-display text-xl" style={{ color: "var(--text)" }}>
              Your Cart
            </p>
            {totalItems() > 0 && (
              <span
                className="font-body text-[10px] px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "var(--gold-glow)", color: "var(--gold)", border: "1px solid var(--border)" }}
              >
                {totalItems()}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-5 px-6 text-center">
            <div
              className="w-20 h-20 flex items-center justify-center rounded-full"
              style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)" }}
            >
              <ShoppingBag size={28} style={{ color: "var(--text-faint)" }} />
            </div>
            <div>
              <p className="font-display text-2xl mb-2" style={{ color: "var(--text-muted)" }}>
                Your cart is empty
              </p>
              <p className="font-body text-sm" style={{ color: "var(--text-faint)" }}>
                Discover our curated collection of heritage Indian arts.
              </p>
            </div>
            <button onClick={onClose}>
              <Link href="/shop/paintings" className="btn-gold">
                Explore Collection
              </Link>
            </button>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
              {items.map(({ product: p, quantity }) => (
                <div
                  key={p.id}
                  className="flex gap-4 pb-5"
                  style={{ borderBottom: "1px solid var(--border)" }}
                >
                  {/* Image */}
                  <Link href={`/product/${p.slug}`} onClick={onClose}>
                    <div
                      className="w-20 h-24 overflow-hidden shrink-0"
                      style={{ border: "1px solid var(--border)" }}
                    >
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link href={`/product/${p.slug}`} onClick={onClose}>
                      <h3
                        className="font-display text-lg leading-tight mb-1 hover:text-gold-theme transition-colors truncate"
                        style={{ color: "var(--text)" }}
                      >
                        {p.name}
                      </h3>
                    </Link>
                    <p className="font-body text-[10px] mb-3" style={{ color: "var(--text-faint)" }}>
                      {p.artist} · {p.origin}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Qty controls */}
                      <div
                        className="flex items-center"
                        style={{ border: "1px solid var(--border)" }}
                      >
                        <button
                          onClick={() => updateQuantity(p.id, quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center transition-colors"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                        >
                          <Minus size={11} />
                        </button>
                        <span
                          className="w-7 h-7 flex items-center justify-center font-body text-xs"
                          style={{ color: "var(--text)", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}
                        >
                          {quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(p.id, quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center transition-colors"
                          style={{ color: "var(--text-muted)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                        >
                          <Plus size={11} />
                        </button>
                      </div>

                      <div className="flex items-center gap-3">
                        <p className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
                          {formatPrice(p.price * quantity)}
                        </p>
                        <button
                          onClick={() => removeItem(p.id)}
                          className="transition-colors"
                          style={{ color: "var(--text-faint)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#E05030")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div
              className="px-6 py-5"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              {/* Free shipping nudge */}
              {totalPrice() < 500000 && (
                <div
                  className="flex items-center gap-2 px-4 py-3 mb-4 text-center"
                  style={{ backgroundColor: "var(--bg-subtle)", border: "1px solid var(--border)" }}
                >
                  <p className="font-body text-xs w-full" style={{ color: "var(--text-muted)" }}>
                    Add{" "}
                    <span style={{ color: "var(--gold)" }}>
                      {formatPrice(500000 - totalPrice())}
                    </span>{" "}
                    more for free shipping
                  </p>
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-2 mb-5">
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
                <div
                  className="flex justify-between pt-3"
                  style={{ borderTop: "1px solid var(--border)" }}
                >
                  <span className="font-body text-sm font-medium" style={{ color: "var(--text)" }}>Total</span>
                  <span className="font-display text-xl text-gold-shimmer">{formatPrice(grandTotal)}</span>
                </div>
              </div>

              {/* Checkout button */}
              <Link
                href="/checkout"
                onClick={onClose}
                className="btn-gold w-full justify-center"
              >
                Proceed to Checkout
                <ArrowRight size={15} />
              </Link>

              <Link
                href="/cart"
                onClick={onClose}
                className="block text-center font-body text-xs tracking-widest uppercase mt-3 transition-colors"
                style={{ color: "var(--text-faint)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
}
