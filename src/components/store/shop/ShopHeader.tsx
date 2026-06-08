"use client";

import { SlidersHorizontal } from "lucide-react";

const SORT_OPTIONS = [
  { value: "newest",      label: "Newest First" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

interface Props {
  label: string; count: number; activeSort: string;
  onSort: (val: string) => void; onToggleSidebar: () => void;
}

export default function ShopHeader({ label, count, activeSort, onSort, onToggleSidebar }: Props) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px" style={{ backgroundColor: "var(--gold)" }} />
              <p className="font-body text-[10px] tracking-[0.35em] uppercase" style={{ color: "var(--gold)" }}>
                Collection
              </p>
            </div>
            <h1 className="font-display text-5xl md:text-6xl" style={{ color: "var(--text)" }}>
              {label}
            </h1>
            <p className="font-body text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              {count} {count === 1 ? "piece" : "pieces"} available
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 font-body text-xs tracking-widest uppercase transition-colors glass-card"
              style={{ color: "var(--text-muted)" }}
            >
              <SlidersHorizontal size={13} />
              Filter
            </button>

            <select
              value={activeSort}
              onChange={(e) => onSort(e.target.value)}
              className="font-body text-xs tracking-wider px-4 py-2.5 focus:outline-none cursor-pointer glass-card"
              style={{ color: "var(--text-muted)", minWidth: "160px" }}
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
