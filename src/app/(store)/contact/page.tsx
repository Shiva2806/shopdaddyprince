"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/daddyprince.official/",
    ariaLabel: "Follow Daddy Prince on Instagram",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    name: "Pinterest",
    href: "https://www.pinterest.com/daddyprince_official/",
    ariaLabel: "Follow Daddy Prince on Pinterest",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.102-.947-.195-2.4.04-3.434.21-.93 1.357-5.75 1.357-5.75s-.346-.689-.346-1.713c0-1.605.932-2.802 2.087-2.802 1.03 0 1.528.773 1.528 1.699 0 1.036-.66 2.585-.999 4.02-.284 1.205.602 2.189 1.79 2.189 2.15 0 3.8-2.268 3.8-5.541 0-2.9-2.084-4.928-5.06-4.928-3.447 0-5.47 2.585-5.47 5.258 0 1.04.4 2.157.9 2.76.098.118.112.222.083.334-.09.378-.292 1.192-.331 1.352-.053.21-.175.254-.404.148-1.5-.7-2.438-2.898-2.438-4.662 0-3.799 2.76-7.29 7.96-7.29 4.18 0 7.428 2.977 7.428 6.96 0 4.152-2.617 7.494-6.25 7.494-1.22 0-2.368-.635-2.76-1.38l-.752 2.87c-.27 1.04-.6 1.94-.85 2.37A12.01 12.01 0 0012.017 24c6.62 0 11.986-5.367 11.986-11.987C24.003 5.367 18.637 0 12.017 0z"/>
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@daddyprince.official",
    ariaLabel: "Subscribe to Daddy Prince on YouTube",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61573133973719",
    ariaLabel: "Like Daddy Prince on Facebook",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/916301206401",
    ariaLabel: "Chat with Daddy Prince on WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.495-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z"/>
      </svg>
    ),
  },
];

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === "#bulk-enquiry") {
        const element = document.getElementById("bulk-enquiry");
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 150);
        }
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const scrollToForm = () => {
    const formElement = document.getElementById("contact-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API request
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Thank you. We will contact you shortly.");
    setName("");
    setEmail("");
    setMessage("");
    setLoading(false);
  };

  return (
    <div className="relative pt-32 pb-24 overflow-hidden" style={{ background: "var(--bg-hero)" }}>
      {/* Soft ambient lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top center, rgba(212, 175, 55, 0.04) 0%, transparent 60%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        {/* Header */}
        <div className="mb-20">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
              Get in Touch
            </p>
          </div>
          <h1 className="font-display text-5xl md:text-6xl text-[var(--text)] font-light leading-tight">
            Connect With <span className="text-gold-shimmer font-normal">Us</span>
          </h1>
        </div>

        {/* Bulk Enquiry Section */}
        <div
          id="bulk-enquiry"
          className="mb-24 p-8 md:p-12 border border-[var(--border)] bg-[var(--bg-card)] relative scroll-mt-24"
          style={{
            background: "radial-gradient(circle at top right, rgba(199, 154, 59, 0.03), transparent 70%), var(--bg-card)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-px bg-[var(--gold)]" />
                <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">
                  Custom Orders
                </p>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-[var(--text)] font-light leading-tight">
                Bulk Orders & <span className="text-gold-shimmer font-normal">Corporate Enquiries</span>
              </h2>
              <p className="font-body text-sm text-[var(--text-muted)] leading-relaxed max-w-xl">
                Planning a large purchase, hospitality project, corporate gifting program, temple installation, or interior design project? Our team would be delighted to assist.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 items-center">
                <button
                  onClick={scrollToForm}
                  className="btn-gold px-6 py-3.5 text-[10px] tracking-[0.2em] uppercase transition-all duration-300 font-medium active:scale-95"
                >
                  Discuss Your Requirement
                </button>
                <a
                  href="https://wa.me/916301206401?text=Hello%2C%20I%20am%20interested%20in%20a%20bulk%20enquiry%20with%20Daddy%20Prince."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 border border-[#25D366]/40 bg-[#25D366]/10 text-[10px] tracking-[0.2em] uppercase font-medium text-[#25D366] hover:bg-[#25D366]/20 hover:border-[#25D366] transition-all duration-300 active:scale-95"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.495-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z" />
                  </svg>
                  WhatsApp Bulk Enquiry
                </a>
              </div>
              <div className="pt-4 border-t border-[var(--border)]/60 text-xs text-[var(--text-muted)] space-y-2">
                <p>
                  <strong className="text-[var(--gold)] uppercase tracking-wider text-[10px]">For Physical Consultation:</strong>
                </p>
                <p className="leading-relaxed font-body">
                  Daddy Prince Store, Shop No. 20, Guptas Midtown, Beside Chennai Shopping Mall, Ongole, Andhra Pradesh 523001, India
                </p>
                <a
                  href="https://www.google.com/maps/search/daddyprince/@15.5169276,80.0473075,21z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[var(--gold)] hover:underline"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Locate Us on Google Maps
                </a>
              </div>
            </div>

            {/* Right Column: Grid of Categories */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: "Hotels & Resorts", desc: "Curated heritage art & decor for luxury hospitality suites." },
                { title: "Corporate Gifting", desc: "Artisanal, custom-branded tokens for partners and executives." },
                { title: "Interior Designers", desc: "Collaborative staging pieces for residential & commercial models." },
                { title: "Temples & Cultural Institutions", desc: "Traditional brassware, custom idols, and legacy art commissions." },
                { title: "Event & Wedding Gifting", desc: "Exquisite hand-carved souvenirs for celebratory events." },
                { title: "Large Quantity Purchases", desc: "Preferred terms for private collectors & high-volume orders." },
              ].map((domain) => (
                <div
                  key={domain.title}
                  className="p-4 border border-[var(--border)] bg-[var(--bg)]/40 hover:border-[var(--gold)] transition-all duration-300 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--gold)] mb-2 group-hover:scale-125 transition-transform" />
                  <h4 className="font-display text-sm text-[var(--text)] font-medium mb-1 tracking-wide">
                    {domain.title}
                  </h4>
                  <p className="font-body text-[11px] text-[var(--text-muted)] leading-relaxed">
                    {domain.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Editorial Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Contact details & Address & Socials */}
          <div className="col-span-1 lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <h2 className="font-display text-2xl text-[var(--text)]">Boutique & Curation House</h2>
              
              <div className="space-y-4 font-body text-sm leading-relaxed text-[var(--text-muted)]">
                <div>
                  <p className="text-[var(--gold)] text-xs tracking-wider uppercase mb-1">Our Residence</p>
                  <p className="text-[var(--text)] font-medium">Daddy Prince</p>
                  <p>Shop No. 20, Guptas Midtown</p>
                  <p>Beside Chennai Shopping Mall</p>
                  <p>Ongole, Andhra Pradesh 523001</p>
                  <p>India</p>
                  
                  <div className="flex flex-wrap gap-3 mt-4">
                    <a
                      href="https://www.google.com/maps/search/daddyprince/@15.5169276,80.0473075,21z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-[var(--border)] bg-[var(--bg-card)] text-xs tracking-wider uppercase font-medium text-[var(--text)] hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all duration-300 active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-[var(--gold)]">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      Open in Maps
                    </a>
                    <a
                      href="https://www.google.com/maps/search/daddyprince/@15.5169276,80.0473075,21z"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--gold)] text-xs tracking-wider uppercase font-medium text-black hover:bg-white hover:text-black transition-all duration-300 active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" />
                      </svg>
                      Get Directions
                    </a>
                  </div>
                </div>
                <div className="pt-4 border-t border-[var(--border)]/60">
                  <p className="text-[var(--gold)] text-xs tracking-wider uppercase mb-2">Direct Correspondence</p>
                  <p className="mb-1">
                    <span className="text-[var(--text-muted)]">Email: </span>
                    <a href="mailto:support@shopdaddyprince.com" className="text-[var(--text)] hover:text-[var(--gold)] transition-colors">
                      support@shopdaddyprince.com
                    </a>
                  </p>
                  <p className="mb-3">
                    <span className="text-[var(--text-muted)]">Phone / WhatsApp: </span>
                    <a href="https://wa.me/916301206401" className="text-[var(--text)] hover:text-[var(--gold)] transition-colors">
                      +91 63012 06401
                    </a>
                  </p>
                  <a
                    href="https://wa.me/916301206401"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-[#25D366]/40 bg-[#25D366]/10 text-xs tracking-wider uppercase font-medium text-[#25D366] hover:bg-[#25D366]/20 hover:border-[#25D366] transition-all duration-300 active:scale-95"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.495-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z"/>
                    </svg>
                    WhatsApp Contact
                  </a>
                </div>
              </div>
            </div>

            {/* Socials section */}
            <div className="space-y-6 pt-6 border-t border-[var(--border)]">
              <h3 className="font-display text-xl text-[var(--text)]">Official Social Circles</h3>
              <p className="font-body text-xs text-[var(--text-muted)] leading-relaxed max-w-sm">
                Follow our legacy updates, watch generational craftsmen at work, and explore museum exhibitions.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {SOCIALS.map((soc) => (
                  <a
                    key={soc.name}
                    href={soc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={soc.ariaLabel}
                    className="flex items-center gap-3 p-3.5 border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text)] hover:border-[var(--gold)] transition-all duration-300 group"
                  >
                    <span className="text-[var(--gold)] transition-transform duration-300 group-hover:scale-105">
                      {soc.icon}
                    </span>
                    <span className="font-body text-xs tracking-widest uppercase font-medium">
                      {soc.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="col-span-1 lg:col-span-7">
            <div
              id="contact-form"
              className="p-8 md:p-10 border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl relative scroll-mt-24"
              style={{
                boxShadow: "0 20px 48px rgba(0, 0, 0, 0.4)",
              }}
            >
              <h2 className="font-display text-2xl text-[var(--text)] mb-8">Send A Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block font-body text-xs tracking-wider uppercase mb-2 text-[var(--text-muted)]">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Arjun Sharma"
                    className="w-full font-body text-sm px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block font-body text-xs tracking-wider uppercase mb-2 text-[var(--text-muted)]">
                    Your Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="arjun@example.com"
                    className="w-full font-body text-sm px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block font-body text-xs tracking-wider uppercase mb-2 text-[var(--text-muted)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Inquire about an antique, request custom framing advice, or share your art preferences..."
                    className="w-full font-body text-sm px-4 py-3 bg-[var(--bg)] border border-[var(--border)] text-[var(--text)] focus:outline-none focus:border-[var(--gold)] transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full py-4 text-xs tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-50"
                >
                  {loading ? "Sending Message..." : "Submit Inquiry"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
