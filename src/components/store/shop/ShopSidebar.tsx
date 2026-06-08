"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CATEGORIES, type ProductCategory } from "@/types";
import { cn } from "@/utils/cn";

interface Props {
  category: ProductCategory;
  subcategories: string[];
  activeSub?: string;
  onSubChange: (sub: string | null) => void;
}

export default function ShopSidebar({ category, subcategories, activeSub, onSubChange }: Props) {
  const pathname = usePathname();

  return (
    <div className="space-y-8">
      {/* All categories */}
      <div>
        <p
          className="font-body text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: "var(--gold)" }}
        >
          Categories
        </p>
        <ul className="space-y-1">
          {Object.entries(CATEGORIES).map(([slug, info]) => (
            <li key={slug}>
              <Link
                href={`/shop/${slug}`}
                className="block font-body text-xs tracking-wide py-1.5 transition-colors"
                style={{
                  color: slug === category ? "var(--gold)" : "var(--text-muted)",
                  fontWeight: slug === category ? "500" : "400",
                }}
              >
                {slug === category && (
                  <span className="mr-2" style={{ color: "var(--gold)" }}>›</span>
                )}
                {info.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      {/* Subcategories */}
      <div>
        <p
          className="font-body text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: "var(--gold)" }}
        >
          Filter by Type
        </p>
        <ul className="space-y-1">
          {/* All */}
          <li>
            <button
              onClick={() => onSubChange(null)}
              className="block w-full text-left font-body text-xs tracking-wide py-1.5 transition-colors"
              style={{ color: !activeSub ? "var(--gold)" : "var(--text-muted)" }}
            >
              {!activeSub && <span className="mr-2">›</span>}
              All
            </button>
          </li>
          {subcategories.map((sub) => {
            const isActive = activeSub === sub.toLowerCase();
            return (
              <li key={sub}>
                <button
                  onClick={() => onSubChange(sub.toLowerCase())}
                  className="block w-full text-left font-body text-xs tracking-wide py-1.5 transition-colors"
                  style={{ color: isActive ? "var(--gold)" : "var(--text-muted)" }}
                >
                  {isActive && <span className="mr-2">›</span>}
                  {sub}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: "var(--border)" }} />

      {/* Price range hint */}
      <div>
        <p
          className="font-body text-[10px] tracking-[0.25em] uppercase mb-3"
          style={{ color: "var(--gold)" }}
        >
          Price Range
        </p>
        <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>
          ₹500 — ₹1,00,000+
        </p>
        <p className="font-body text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>
          Use sort to order by price
        </p>
      </div>
    </div>
  );
}
