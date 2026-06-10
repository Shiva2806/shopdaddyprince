import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Legacy Story | Daddy Prince",
  description: "Discover the heritage, founding vision of Late Shri Talasila Satyanarayana (Prince Satyam), and our four-decade preservation of fine Indian art.",
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      
      {/* SECTION 1 — HERO */}
      <section 
        data-theme="dark"
        className="relative h-[90vh] min-h-[650px] w-full flex items-center justify-center overflow-hidden"
      >
        {/* Parallax Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/legacy/img-1.webp"
            alt="Daddy Prince Heritage Atelier"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center brightness-[0.7] contrast-[1.05]"
          />
          {/* Subtle vignette/gradient overlay */}
          <div
            className="absolute inset-0 z-10"
            style={{
              background: "linear-gradient(to bottom, rgba(10, 5, 2, 0.3) 0%, rgba(10, 5, 2, 0.75) 100%)",
            }}
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-6 text-center pt-12 space-y-6">
          <p
            className="font-body text-xs tracking-[0.5em] uppercase animate-fade-in"
            style={{
              color: "var(--gold)",
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.5)",
            }}
          >
            EST. 1984
          </p>
          <h1
            className="font-display text-4xl md:text-7xl font-light leading-[1.15] text-white tracking-wide animate-fade-in max-w-4xl mx-auto"
            style={{
              textShadow: "0 2px 16px rgba(0, 0, 0, 0.6)",
            }}
          >
            A Legacy of Art, Craftsmanship, <br className="hidden md:inline" />
            and <span className="text-gold-shimmer font-normal">Timeless Beauty</span> Since 1984
          </h1>
          <p
            className="font-body text-sm md:text-base text-cream/80 max-w-3xl mx-auto leading-relaxed"
            style={{
              textShadow: "0 1px 6px rgba(0, 0, 0, 0.4)",
            }}
          >
            From Prince Arts & Frames to Daddy Prince — over four decades of preserving art, celebrating craftsmanship, and bringing timeless beauty into homes across generations.
          </p>
          <div className="pt-8">
            <Link 
              href="/shop" 
              className="btn-gold px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium transition-all duration-300 inline-block active:scale-95"
            >
              Explore Our Collections
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE FOUNDER'S STORY */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at top right, rgba(44, 24, 9, 0.1), transparent 70%), var(--bg-category)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column - Portrait */}
            <div className="col-span-1 lg:col-span-5 flex justify-center">
              <div
                className="relative w-full max-w-[420px] aspect-[3/4] overflow-hidden p-3 bg-[#2c1809]/20 border border-[var(--gold)]/30 shadow-2xl"
                style={{
                  boxShadow: "0 30px 60px rgba(0, 0, 0, 0.35)",
                }}
              >
                <div className="relative w-full h-full overflow-hidden border border-[var(--gold)]/10">
                  <Image
                    src="/images/legacy/img-2.webp"
                    alt="Late Shri Talasila Satyanarayana - Prince Satyam"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-center grayscale brightness-95"
                    style={{
                      objectPosition: "center 20%",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Founder Story Content */}
            <div className="col-span-1 lg:col-span-7 space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[var(--gold)]" />
                  <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                    The Origin
                  </p>
                </div>
                <h2 className="font-display text-3xl md:text-5xl text-[var(--text)] font-light leading-tight">
                  Where It All <span className="text-gold-shimmer font-normal">Began</span>
                </h2>
              </div>

              <div className="space-y-6 font-body text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl">
                <p>
                  Every great story begins with a vision. Ours began in 1984 when Late Shri Talasila Satyanarayana, lovingly known as Prince Satyam, founded Prince Arts & Frames.
                </p>
                <p>
                  Driven by a passion for art and an unwavering commitment to quality, he built a business that became synonymous with exceptional screen printing, custom framing, and handcrafted artistic creations.
                </p>
                <p>
                  At a time when screen printing was a highly specialized craft, Prince Satyam mastered the art of transforming ideas into beautiful visual expressions. His dedication to precision, creativity, and customer satisfaction earned him the trust of generations of customers.
                </p>
                <p>
                  What started as a modest venture soon became a respected name in the world of art and custom creations. More than a business, Prince Arts & Frames was a reflection of his values—hard work, authenticity, craftsmanship, and a deep appreciation for artistic excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TIMELINE REPLACEMENT: SECTION 3 — FOUR DECADES OF CRAFTSMANSHIP */}
      <section
        className="py-24 md:py-32 relative overflow-hidden bg-black text-white"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          {/* Heritage Image */}
          <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden border border-white/10 shadow-2xl">
            <Image
              src="/images/legacy/img-4.webp"
              alt="Four Decades of Screen Art and Framing Craftsmanship"
              fill
              sizes="100vw"
              className="object-cover object-center brightness-75 transition-all duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
          </div>

          {/* Core Story Block */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            <div className="col-span-1 md:col-span-4">
              <h3 className="font-display text-3xl md:text-5xl font-light text-[var(--gold)] tracking-wide">
                1984 — Present
              </h3>
            </div>
            <div className="col-span-1 md:col-span-8 space-y-6">
              <p className="font-display text-xl md:text-2xl font-light text-cream/90 leading-relaxed italic">
                "For over four decades, the values established by Prince Satyam have remained unchanged: craftsmanship, authenticity, artistic excellence, and customer trust."
              </p>
              <p className="font-body text-sm md:text-base text-cream/60 leading-relaxed">
                Every artwork, every frame, and every collection continues to reflect the standards that built Prince Arts & Frames into a respected name across generations. This journey is a testament to the preservation of cultural heritage and the timeless beauty of manual creation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4 — CARRYING FORWARD A LEGACY */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at center, rgba(199, 154, 59, 0.02) 0%, transparent 80%), var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <div className="flex justify-center items-center gap-3">
            <div className="w-6 h-px bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
              Evolution
            </p>
            <div className="w-6 h-px bg-[var(--gold)]" />
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl text-[var(--text)] font-light leading-tight">
            From Prince Arts & Frames <br className="hidden md:inline" />
            to <span className="text-gold-shimmer font-normal">Daddy Prince</span>
          </h2>

          <div className="space-y-6 font-body text-sm md:text-base leading-relaxed text-[var(--text-muted)] text-justify md:text-center max-w-3xl mx-auto">
            <p>
              Today, we are honored to carry forward his vision through Daddy Prince, a new chapter built upon the strong foundation he created. Daddy Prince was born from a desire to preserve and expand the legacy of Prince Satyam while introducing customers to the rich artistic traditions of India.
            </p>
            <p>
              While our roots remain firmly grounded in the art of screen printing and custom artwork, we have broadened our collection to include carefully curated pieces that celebrate India's diverse cultural heritage.
            </p>
            <p>
              Every product in our gallery is chosen with the same attention to detail and commitment to quality that defined our founder's work. We believe that art is more than decoration—it tells stories, preserves traditions, and creates emotional connections that last for generations.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT WE OFFER */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
          background: "var(--bg-featured)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 space-y-16">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="w-8 h-px bg-[var(--gold)]" />
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                The Collections
              </p>
            </div>
            <h2 className="font-display text-3xl md:text-5xl text-[var(--text)] font-light">
              What We <span className="text-gold-shimmer font-normal">Offer</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Screen Art Collection",
                desc: "Our signature collection continues the screen-printing tradition established by Prince Satyam. These timeless artworks showcase intricate detailing, vibrant colors, and enduring craftsmanship."
              },
              {
                title: "Vintage Collection",
                desc: "Discover carefully selected vintage-inspired pieces that evoke nostalgia, elegance, and the charm of bygone eras."
              },
              {
                title: "Brass Collection",
                desc: "Our brass décor collection celebrates India's rich metalworking traditions through handcrafted pieces that bring heritage and sophistication into modern homes."
              },
              {
                title: "Regional Handicrafts",
                desc: "Handcrafted creations sourced from skilled artisans and craft communities across India, preserving centuries-old traditions."
              }
            ].map((card, i) => (
              <div
                key={i}
                className="p-8 border border-[var(--border)] bg-[var(--bg-card)]/30 hover:border-[var(--gold)] hover:bg-[#2c1809]/10 transition-all duration-500 flex flex-col justify-between group relative"
                style={{
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                }}
              >
                {/* Micro gold corner details */}
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-transparent group-hover:border-[var(--gold)] transition-all duration-300" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-transparent group-hover:border-[var(--gold)] transition-all duration-300" />

                <div className="space-y-4">
                  <span className="font-display text-xs text-[var(--gold)] tracking-widest block uppercase font-medium">
                    0{i + 1}
                  </span>
                  <h3 className="font-display text-xl text-[var(--text)] font-medium tracking-wide">
                    {card.title}
                  </h3>
                  <p className="font-body text-xs text-[var(--text-muted)] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — SUPPORTING ARTISANS */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at bottom left, rgba(44, 24, 9, 0.08), transparent 75%), var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            {/* Left Column - Copy */}
            <div className="col-span-1 lg:col-span-7 space-y-8 order-2 lg:order-1">
              <div className="space-y-3">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-px bg-[var(--gold)]" />
                  <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                    Patronage
                  </p>
                </div>
                <h2 className="font-display text-3xl md:text-5xl text-[var(--text)] font-light leading-tight">
                  Preserving India's <br className="hidden md:inline" />
                  <span className="text-gold-shimmer font-normal">Artistic Heritage</span>
                </h2>
              </div>

              <div className="space-y-6 font-body text-sm leading-relaxed text-[var(--text-muted)] max-w-2xl">
                <p>
                  Behind every handcrafted piece is a skilled artisan whose knowledge has been passed down through generations. We are committed to supporting these talented craftspeople by providing a platform for their work and helping preserve traditional art forms in an ever-changing world.
                </p>
                <p>
                  By choosing Daddy Prince, you are not only bringing home a beautiful work of art—you are also helping sustain India's rich craft heritage and supporting the communities that keep these traditions alive.
                </p>
              </div>
            </div>

            {/* Right Column - Image */}
            <div className="col-span-1 lg:col-span-5 flex justify-center order-1 lg:order-2">
              <div
                className="relative w-full max-w-[420px] aspect-[4/5] overflow-hidden p-2.5 bg-[#2c1809]/20 border border-[var(--border-hover)]/30 shadow-2xl"
                style={{
                  boxShadow: "0 25px 55px rgba(0, 0, 0, 0.3)",
                }}
              >
                <div className="relative w-full h-full overflow-hidden border border-white/5">
                  <Image
                    src="/images/legacy/img-3.webp"
                    alt="Generational Artisan at Work"
                    fill
                    sizes="(max-width: 768px) 100vw, 420px"
                    className="object-cover object-center brightness-[0.85] contrast-[1.05]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — OUR PHILOSOPHY */}
      <section
        className="py-28 relative overflow-hidden"
        style={{
          backgroundColor: "#0d0906",
          backgroundImage: "radial-gradient(circle at center, rgba(199, 154, 59, 0.05) 0%, transparent 70%)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
          <div className="flex justify-center items-center gap-3">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
              Our Philosophy
            </p>
            <div className="w-8 h-px bg-[var(--gold)]" />
          </div>

          <blockquote className="space-y-6">
            <p className="font-display text-2xl md:text-4xl text-white font-light italic leading-relaxed max-w-3xl mx-auto">
              "We believe that a home should tell a story."
            </p>
            <p className="font-body text-sm md:text-base text-cream/70 max-w-2xl mx-auto leading-relaxed">
              Whether it is a devotional artwork, a vintage treasure, a brass masterpiece, or a handcrafted regional artifact, every piece should inspire, connect, and create lasting memories.
            </p>
          </blockquote>

          <div className="pt-6 border-t border-white/10 max-w-md mx-auto space-y-2">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-[var(--gold)]">
              Our Mission
            </p>
            <p className="font-display text-lg text-white font-light tracking-wide">
              To preserve heritage, celebrate craftsmanship, and bring timeless art into modern homes.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 8 — LOOKING AHEAD */}
      <section
        className="py-24 md:py-32 relative overflow-hidden"
        style={{
          background: "radial-gradient(circle at center, rgba(199, 154, 59, 0.01) 0%, transparent 60%), var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center space-y-6">
          <div className="flex justify-center items-center gap-3">
            <div className="w-6 h-px bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
              Looking Ahead
            </p>
            <div className="w-6 h-px bg-[var(--gold)]" />
          </div>
          
          <h2 className="font-display text-3xl md:text-5xl text-[var(--text)] font-light">
            The Next <span className="text-gold-shimmer font-normal">Chapter</span>
          </h2>
          
          <div className="space-y-6 font-body text-sm leading-relaxed text-[var(--text-muted)] max-w-xl mx-auto pt-4">
            <p>
              As we continue our journey, we remain guided by the vision of our founder. Every artwork we create, every collection we curate, and every customer we serve is part of a legacy that began over four decades ago.
            </p>
            <p>
              From Prince Arts & Frames to Daddy Prince, our story is one of tradition, passion, and evolution. We invite you to become a part of that story.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL SIGNATURE SECTION */}
      <section
        className="py-32 text-center bg-[#070504]"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div className="max-w-xl mx-auto px-6 space-y-8">
          <p className="font-display text-6xl md:text-7xl font-light text-white tracking-[0.2em] uppercase mb-4 select-none">
            Daddy Prince
          </p>
          <div className="w-12 h-px bg-[var(--gold)] mx-auto" />
          <div className="space-y-2 text-cream/50 font-body text-xs tracking-[0.3em] uppercase">
            <p>Founded on Tradition.</p>
            <p>Curated with Passion.</p>
            <p>Crafted for Generations.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
