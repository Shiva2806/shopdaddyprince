"use client";

const items = [
  "Authenticated Heritage Pieces",
  "Ships Worldwide",
  "Handpicked by Experts",
  "Direct from Artisan Families",
  "Est. 2024",
  "100% Genuine Craftsmanship",
  "Insured Delivery",
  "Certified Origins",
  "10,000+ Happy Collectors",
];

export default function MarqueeTicker() {
  const repeated = [...items, ...items];
  return (
    <div
      className="overflow-hidden py-3 select-none relative"
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "linear-gradient(90deg, var(--bg-card), var(--bg-subtle), var(--bg-card))",
      }}
    >
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, var(--bg), transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, var(--bg), transparent)" }} />

      <div className="flex gap-0 animate-marquee whitespace-nowrap">
        {repeated.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-5 font-body text-[10px] tracking-[0.25em] uppercase px-5"
            style={{ color: "var(--text-muted)" }}
          >
            {item}
            <span style={{ color: "var(--gold)", fontSize: "5px", opacity: 0.8 }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
