import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legacy & Heritage",
  description: "Discover the history, craftsmanship, and founding vision behind Daddy Prince since 1984.",
};

const timeline = [
  {
    year: "1984",
    title: "Founded by Shri Satyam Talasila",
    desc: "Established by Prince Satyam to champion classical Indian artisan families and preserve traditional art forms.",
  },
  {
    year: "1995",
    title: "Mastery in Curation & Framing",
    desc: "Established unmatched standards in archival screen printing and custom museum-grade framing.",
  },
  {
    year: "2010",
    title: "Expanding the Vision",
    desc: "Subha Lakshmi elevates the legacy, transforming the workshop into Prince Arts & Frames to represent fine paintings and heritage works.",
  },
  {
    year: "2024",
    title: "A Global Heritage Destination",
    desc: "Rebranded as Daddy Prince, curating authentic paintings, hand-carved brass, and rare regional arts for collectors worldwide.",
  },
  {
    year: "Today",
    title: "Preserving India's Masterpieces",
    desc: "Continuing to bridge the gap between generational artisan families and global connoisseurs.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* 1. Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/legacy/img-1.webp"
            alt="Store Hero Image"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.4] contrast-[1.05]"
          />
          {/* Subtle gradient overlay to match Collector's Charcoal base */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(28, 24, 22, 0.45) 0%, #1C1816 100%)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-4xl mx-auto px-6 text-center pt-12">
          <p
            className="font-body text-[11px] tracking-[0.5em] uppercase mb-6 animate-fade-in"
            style={{ color: "var(--gold)" }}
          >
            Since 1984
          </p>
          <h1
            className="font-display text-4xl md:text-7xl font-light leading-[1.15] text-[var(--text)] tracking-wide animate-fade-in"
          >
            A Legacy of Art,<br />
            <span className="text-gold-shimmer font-normal">Craftsmanship & Memories</span>
          </h1>
        </div>
      </section>

      {/* 2. Founder Story Section */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          background: "var(--bg-category)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column - Portrait */}
            <div className="col-span-1 lg:col-span-5 flex justify-center">
              <div
                className="relative w-full max-w-[400px] aspect-[3/4] overflow-hidden shadow-2xl"
                style={{
                  border: "1px solid var(--border-hover)",
                  boxShadow: "0 24px 50px rgba(0, 0, 0, 0.4)",
                }}
              >
                <Image
                  src="/images/legacy/img-2.webp"
                  alt="Shri Satyam Talasila Portrait"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover object-center"
                  style={{
                    objectPosition: "center 20%", // Keep face centered and clear
                  }}
                />
              </div>
            </div>

            {/* Right Column - Story Content */}
            <div className="col-span-1 lg:col-span-7">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[var(--gold)]" />
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                  The Founder
                </p>
              </div>

              <h2 className="font-display text-4xl md:text-5xl mb-6 text-[var(--text)] font-light leading-tight">
                The Man Behind <br />
                <span className="text-gold-shimmer">The Legacy</span>
              </h2>

              <p className="font-display text-xl italic mb-2" style={{ color: "var(--gold-light)" }}>
                Shri Satyam Talasila
              </p>
              <p className="font-body text-xs tracking-wider uppercase mb-8" style={{ color: "var(--text-muted)" }}>
                Prince Satyam · Founder • 1984
              </p>

              <div className="space-y-6 font-body text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl">
                <p>
                  In 1984, Shri Satyam Talasila—affectionately known as Prince Satyam—envisioned a sanctuary for India's classical artisan families. Observing that ancient fine paintings, metal casting techniques, and heirloom framing methodologies were rapidly disappearing under the pressures of mass industrialization, he set out to create a bridge between master craftsmen and connoisseurs who value heritage.
                </p>
                <p>
                  Operating with a core belief that art is the ultimate carrier of culture, his early curation house and custom framing workshops in Andhra Pradesh earned a legendary reputation. He believed art pieces were not mere decorative products, but deep, physical containers of memory, legacy, and human history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quote Section */}
      <section
        className="py-24 text-center relative overflow-hidden"
        style={{ background: "var(--bg-hero)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(212, 175, 55, 0.04) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <span className="text-5xl text-[var(--gold)] opacity-40 font-display block mb-6">“</span>
          <blockquote
            className="font-display text-3xl md:text-[2.6rem] italic leading-relaxed text-[var(--text)] mb-8"
          >
            We don't just sell art;<br />
            we curate memories.
          </blockquote>
          <div className="w-8 h-px bg-[var(--gold)] mx-auto mb-4" />
          <cite
            className="font-body text-xs tracking-[0.3em] uppercase not-italic block"
            style={{ color: "var(--gold)" }}
          >
            — Subha Lakshmi
          </cite>
        </div>
      </section>

      {/* 4. Vision & Craftsmanship */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          background: "var(--bg-featured)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="col-span-1 lg:col-span-7 order-2 lg:order-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-8 h-px bg-[var(--gold)]" />
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                  Vision & Visionaries
                </p>
              </div>

              <h2 className="font-display text-4xl md:text-5xl mb-6 text-[var(--text)] font-light leading-tight">
                Preservation of Art <br />
                <span className="text-gold-shimmer">& Memories</span>
              </h2>

              <p className="font-display text-xl italic mb-6" style={{ color: "var(--gold-light)" }}>
                Excellence in Craftsmanship
              </p>

              <div className="space-y-6 font-body text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl">
                <p>
                  Under the stewardship of Subha Lakshmi, the house transitioned to Prince Arts & Frames, expanding its preservation vision. Our dedicated restoration and custom framing workshops remain central guardians of Indian artistic heritage.
                </p>
                <p>
                  Our craftsmen work closely with generational artists from Kalamkari, Madhubani, Warli, and Tanjore lineages. Using natural stone pigments, hand-spun fabrics, and hand-carved framing techniques, we ensure that the soul and longevity of each masterpiece are preserved for generations.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="col-span-1 lg:col-span-5 order-1 lg:order-2 flex justify-center">
              <div
                className="relative w-full max-w-[420px] aspect-[4/5] overflow-hidden shadow-2xl"
                style={{
                  border: "1px solid var(--border-hover)",
                  boxShadow: "0 24px 50px rgba(0, 0, 0, 0.4)",
                }}
              >
                <Image
                  src="/images/legacy/img-3.webp"
                  alt="Artisan Craftsmanship"
                  fill
                  sizes="(max-width: 768px) 100vw, 420px"
                  className="object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Timeline Section */}
      <section
        className="py-32 relative overflow-hidden"
        style={{
          background: "var(--bg-promise)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-6 h-px bg-[var(--gold)]" />
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                Our Journey
              </p>
              <div className="w-6 h-px bg-[var(--gold)]" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl text-[var(--text)] font-light">
              Heritage <span className="text-gold-shimmer">Timeline</span>
            </h2>
          </div>

          {/* Timeline Tree */}
          <div className="relative border-l border-[var(--border)] ml-4 md:ml-32 space-y-16 py-4">
            {timeline.map((item, idx) => (
              <div key={idx} className="relative pl-8 md:pl-16 group">
                {/* Brass Dot node */}
                <div
                  className="absolute -left-[6px] top-1.5 w-3 h-3 rounded-full transition-transform duration-300 group-hover:scale-125 border border-[var(--bg)]"
                  style={{ backgroundColor: "var(--gold)" }}
                />
                
                {/* Year Label */}
                <div className="absolute left-[-96px] md:left-[-160px] top-0 text-right w-20 md:w-32 hidden md:block">
                  <span className="font-display text-2xl font-light text-[var(--gold)]">{item.year}</span>
                </div>

                <div className="max-w-2xl">
                  {/* Year Mobile only */}
                  <span className="font-display text-2xl font-light text-[var(--gold)] md:hidden block mb-1">
                    {item.year}
                  </span>
                  <h3 className="font-display text-xl mb-3 text-[var(--text)]">{item.title}</h3>
                  <p className="font-body text-sm leading-relaxed text-[var(--text-muted)]">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Legacy Continues Section */}
      <section
        className="relative py-44 w-full flex items-center justify-center overflow-hidden"
        style={{ background: "var(--bg-newsletter)" }}
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/legacy/img-4.webp"
            alt="Legacy Continues Image"
            fill
            sizes="100vw"
            className="object-cover object-center brightness-[0.35] contrast-[1.05]"
          />
          {/* Top and Bottom ambient blend shadows */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, #201B18 0%, rgba(28,24,22,0.3) 30%, rgba(28,24,22,0.3) 70%, #1C1816 100%)",
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-20 max-w-3xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-6 h-px bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
              Culmination
            </p>
            <div className="w-6 h-px bg-[var(--gold)]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl text-[var(--text)] font-light mb-6">
            A Legacy That <span className="text-gold-shimmer">Continues</span>
          </h2>
          <p className="font-body text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl mx-auto">
            Today, Daddy Prince honors the creative foundations established decades ago. As we extend our collections globally, our promise remains unchanged: to curate pieces that represent centuries of craft, storytelling, and authentic Indian artistry.
          </p>
        </div>
      </section>

      {/* 7. Final CTA Section */}
      <section
        className="py-32 text-center relative overflow-hidden"
        style={{ background: "var(--bg-hero)" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at top, rgba(212, 175, 55, 0.05) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-2xl mx-auto px-6 relative z-10">
          <h2 className="font-display text-4xl md:text-5xl mb-4 text-[var(--text)] font-light">
            Continue the <span className="text-gold-shimmer">Journey</span>
          </h2>
          <p className="font-body text-sm mb-12 leading-relaxed text-[var(--text-muted)] max-w-md mx-auto">
            Step into our digital gallery or visit our physical boutique in Visakhapatnam to experience classical heritage in person.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/shop" className="btn-gold px-8 py-4 text-xs tracking-[0.2em] uppercase w-full sm:w-auto">
              Explore Our Collection
            </Link>
            <Link href="/about" className="btn-ghost px-8 py-4 text-xs tracking-[0.2em] uppercase w-full sm:w-auto">
              Visit Our Store
            </Link>
          </div>

          <div className="mt-16 text-[var(--text-faint)] font-body text-[10px] tracking-widest uppercase">
            Visakhapatnam · Andhra Pradesh · India
          </div>
        </div>
      </section>
    </div>
  );
}
