"use client";

import { useState } from "react";

interface ProductData {
  description: string; medium: string; dimensions: string;
  year: string; origin: string; artist: string;
}

const tabs = ["Description", "Details", "Shipping & Returns"];

export default function ProductTabs({ product }: { product: ProductData }) {
  const [active, setActive] = useState(0);

  return (
    <div>
      {/* Divider */}
      <div className="h-px mb-0" style={{ background: "linear-gradient(90deg, transparent, var(--border), transparent)" }} />

      {/* Tab headers */}
      <div className="flex gap-0" style={{ borderBottom: "1px solid var(--border)" }}>
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActive(i)}
            className="relative px-6 py-4 font-body text-xs tracking-[0.2em] uppercase transition-colors"
            style={{ color: active === i ? "var(--gold)" : "var(--text-muted)" }}
          >
            {tab}
            {active === i && (
              <span
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ backgroundColor: "var(--gold)" }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="py-10 max-w-2xl">
        {active === 0 && (
          <p className="font-body text-sm leading-[1.9]" style={{ color: "var(--text-muted)" }}>
            {product.description}
          </p>
        )}

        {active === 1 && (
          <div className="space-y-4">
            {[
              { label: "Medium", value: product.medium },
              { label: "Dimensions", value: product.dimensions },
              { label: "Year / Period", value: product.year },
              { label: "Origin", value: product.origin },
              { label: "Artist / Maker", value: product.artist },
              { label: "Authenticity", value: "Certificate of authenticity included with every purchase" },
              { label: "Condition", value: "Excellent — inspected and approved by our curators" },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-6 pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <span
                  className="font-body text-[10px] tracking-[0.2em] uppercase w-32 shrink-0 pt-0.5"
                  style={{ color: "var(--text-faint)" }}
                >
                  {label}
                </span>
                <span className="font-body text-sm" style={{ color: "var(--text-muted)" }}>{value}</span>
              </div>
            ))}
          </div>
        )}

        {active === 2 && (
          <div className="space-y-8">
            {[
              {
                title: "Shipping",
                body: "All pieces are professionally packed by our in-house conservation team using archival materials. Domestic delivery takes 5–8 business days. International shipping to 50+ countries takes 10–18 business days. All shipments are fully insured at the purchase value.",
              },
              {
                title: "Returns",
                body: "We offer a 7-day return policy from date of delivery. If your piece arrives damaged or is significantly not as described, we will arrange a full refund or replacement at no cost. To initiate a return, contact us at returns@shopdaddyprince.com within 7 days.",
              },
              {
                title: "Authenticity Guarantee",
                body: "Every piece sold through Daddy Prince comes with a physical certificate of authenticity signed by our chief curator. Large antiques and artworks above ₹50,000 are additionally verified by third-party art experts before listing.",
              },
            ].map(({ title, body }) => (
              <div key={title}>
                <p className="font-display text-xl mb-3" style={{ color: "var(--text)" }}>{title}</p>
                <p className="font-body text-sm leading-[1.9]" style={{ color: "var(--text-muted)" }}>{body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
