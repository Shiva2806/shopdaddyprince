const pillars = [
  { number: "01", title: "Authenticated", body: "Every piece is verified for origin, age, and craftsmanship before it reaches our collection." },
  { number: "02", title: "Ethically Sourced", body: "We work directly with artisan families and certified dealers across India." },
  { number: "03", title: "Insured Shipping", body: "All orders are carefully packed and fully insured for delivery anywhere in the world." },
];

export default function HeritageStrip() {
  return (
    <section className="pt-16 pb-20 relative overflow-hidden" style={{ background: "var(--bg-promise)" }}>
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(201,168,76,0.04) 0%, transparent 70%)"
      }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Centered divider */}
        <div className="flex items-center gap-6 mb-12">
          <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, var(--border))" }} />
          <p className="font-display text-lg italic" style={{ color: "var(--gold)" }}>
            The Daddy Prince Promise
          </p>
          <div className="flex-1 h-px" style={{ background: "linear-gradient(-90deg, transparent, var(--border))" }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          {pillars.map((p, i) => (
            <div
              key={p.number}
              className="text-center px-8 py-10 relative group glass-card"
              style={{ borderRadius: "2px" }}
            >
              {/* Number watermark */}
              <p
                className="font-display text-8xl absolute top-4 left-1/2 -translate-x-1/2 select-none pointer-events-none transition-opacity duration-300 group-hover:opacity-[0.12]"
                style={{ color: "var(--gold)", opacity: 0.06, lineHeight: 1 }}
              >
                {p.number}
              </p>
              <div className="relative z-10">
                <div className="w-8 h-px mx-auto mb-6" style={{ backgroundColor: "var(--gold)" }} />
                <h3 className="font-display text-2xl mb-4" style={{ color: "var(--text)" }}>{p.title}</h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{p.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div className="mt-16 text-center max-w-3xl mx-auto">
          <p className="font-display text-[11px] tracking-[0.4em] uppercase mb-6" style={{ color: "var(--gold)", opacity: 0.5 }}>
            Words to live by
          </p>
          <blockquote
            className="font-display text-3xl md:text-[2.6rem] italic leading-[1.2]"
            style={{ color: "var(--text-faint)" }}
          >
            "Art is not what you see,<br />but what you make others see."
          </blockquote>
          <p className="font-body text-xs tracking-widest uppercase mt-5" style={{ color: "var(--text-faint)" }}>
            — Edgar Degas
          </p>
        </div>
      </div>
    </section>
  );
}
