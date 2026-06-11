"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cart";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/types";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "./ThemeProvider";
import CartDrawer from "@/components/store/cart/CartDrawer";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Paintings", href: "/shop/paintings", category: "paintings" as const },
  { label: "Home Decor", href: "/shop/home-decor", category: "home-decor" as const },
  { label: "Regional", href: "/shop/regional-arts", category: "regional-arts" as const },
  { label: "Brass", href: "/shop/brass", category: "brass" as const },
  { label: "Vintage", href: "/shop/vintage", category: "vintage" as const },
  { label: "Sale", href: "/sale" },
  { label: "Bulk Orders", href: "/contact#bulk-enquiry" },
  { label: "Legacy", href: "/about" },
];

const REGIONAL_MEGA_MENU = [
  {
    column: 1,
    states: [
      {
        name: "Andhra Pradesh",
        items: [
          { label: "Kalamkari Paintings", sub: "kalamkari" },
          { label: "Kondapalli Toys", sub: "kondapalli" },
        ],
      },
      {
        name: "Telangana",
        items: [
          { label: "Cheriyal Masks", sub: "cherial" },
        ],
      },
    ],
  },
  {
    column: 2,
    states: [
      {
        name: "Bihar",
        items: [
          { label: "Bistar Art", sub: "bistar" },
        ],
      },
      {
        name: "Gujarat",
        items: [
          { label: "Lippan Art", sub: "lippan" },
        ],
      },
    ],
  },
  {
    column: 3,
    states: [
      {
        name: "Maharashtra",
        items: [
          { label: "Warli Paintings", sub: "warli" },
        ],
      },
      {
        name: "Odisha",
        items: [
          { label: "Patachitra", sub: "patachitra" },
        ],
      },
    ],
  },
];

export default function Navbar() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: session } = useSession();
  const cartItems = useCartStore((s) => s.items);
  const totalItems = cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300"
        style={{
          backgroundColor: "var(--navbar-bg)",
          borderColor: "var(--border)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`flex items-center justify-between transition-all duration-300 ease-in-out ${scrolled ? "h-[68px]" : "h-20"}`}>

            {/* Logo */}
            <Link
              href="/"
              className="flex items-center shrink-0 group"
            >
              <img
                src={mounted && theme === "light" ? "/favicon.png" : "/favicon.ico"}
                alt="Daddy Prince Logo"
                className={`object-contain transition-all duration-300 group-hover:scale-105 ${scrolled ? "w-10 h-10" : "w-12 h-12"}`}
              />
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {NAV_LINKS.map((link) => {
                const hasSubs = link.category && CATEGORIES[link.category];
                return (
                  <div key={link.href} className="relative group flex items-center">
                    <Link
                      href={link.href}
                      className="px-1.5 xl:px-3 py-2 font-body text-[10px] xl:text-[11px] tracking-widest uppercase transition-colors"
                      style={{ color: "var(--navbar-text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                    >
                      {link.label}
                    </Link>
                    {hasSubs && (
                      <span
                        className="px-2 py-2 -ml-2 cursor-pointer transition-colors"
                        style={{ color: "var(--navbar-text-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                      >
                        <ChevronDown size={10} className="opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                      </span>
                    )}

                    {hasSubs && (
                      link.category === "regional-arts" ? (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
                          <div
                            className="shadow-2xl w-[520px] p-5 grid grid-cols-3 gap-5 rounded-sm border"
                            style={{
                              background: theme === "light"
                                ? "var(--bg-card)"
                                : "radial-gradient(circle at top center, rgba(199, 154, 59, 0.05), transparent 75%), var(--bg-card)",
                              borderColor: theme === "light" ? "rgba(184, 138, 58, 0.25)" : "rgba(199, 154, 59, 0.2)",
                            }}
                          >
                            {REGIONAL_MEGA_MENU.map((col) => (
                              <div key={col.column} className="space-y-3.5">
                                {col.states.map((state) => (
                                  <div key={state.name} className="space-y-1">
                                    <Link
                                      href={`/shop/regional-arts?state=${encodeURIComponent(state.name)}`}
                                      className="block font-display text-[11px] tracking-widest uppercase transition-colors"
                                      style={{ color: "var(--gold)" }}
                                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gold)")}
                                    >
                                      {state.name}
                                    </Link>
                                    <div className="h-px bg-white/5 my-1" style={{ backgroundColor: "var(--border)" }} />
                                    <div className="space-y-1 pl-0.5">
                                      {state.items.map((item) => (
                                        <Link
                                          key={item.label}
                                          href={`/shop/regional-arts?sub=${item.sub}`}
                                          className="block font-body text-xs transition-colors"
                                          style={{ color: "var(--navbar-text-muted)" }}
                                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                                        >
                                          {item.label}
                                        </Link>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="absolute top-full left-0 pt-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                          <div
                            className="shadow-2xl min-w-[170px] py-2 border"
                            style={{
                              background: theme === "light"
                                ? "var(--bg-card)"
                                : "radial-gradient(circle at top center, rgba(199, 154, 59, 0.05), transparent 75%), var(--bg-card)",
                              borderColor: theme === "light" ? "rgba(184, 138, 58, 0.25)" : "rgba(199, 154, 59, 0.2)",
                            }}
                          >
                            <Link
                              href={link.href}
                              className="block px-4 py-2 font-body text-xs tracking-widest uppercase transition-colors"
                              style={{ color: "var(--gold)" }}
                              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--gold)")}
                            >
                              All
                            </Link>
                            <div className="h-px my-1" style={{ backgroundColor: "var(--border)" }} />
                            {CATEGORIES[link.category!].subcategories.map((sub) => (
                              <Link
                                key={sub}
                                href={`/shop/${link.category}?sub=${sub.toLowerCase()}`}
                                className="block px-4 py-2 font-body text-xs tracking-wider transition-colors"
                                style={{ color: "var(--navbar-text-muted)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                              >
                                {sub}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-3">
              <ThemeToggle />

              {/* Cart icon — opens drawer */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative transition-colors"
                style={{ color: "var(--navbar-text-muted)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
              >
                <ShoppingBag size={18} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 text-[9px] font-body font-semibold w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--gold)", color: "var(--bg)" }}
                  >
                    {totalItems}
                  </span>
                )}
              </button>

              {/* User */}
              {session ? (
                <div className="relative group hidden lg:block">
                  <button className="flex items-center focus:outline-none transition-transform active:scale-95">
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-7 h-7 rounded-full object-cover border"
                        style={{ borderColor: "var(--gold)" }}
                      />
                    ) : (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center font-body text-xs font-semibold"
                        style={{
                          backgroundColor: "var(--gold-glow)",
                          border: "1px solid var(--gold)",
                          color: "var(--gold)",
                        }}
                      >
                        {session.user?.name?.charAt(0).toUpperCase() || <User size={13} />}
                      </div>
                    )}
                  </button>
                  <div
                    className="absolute right-0 top-full pt-1.5 w-44 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border"
                    style={{
                      background: theme === "light"
                        ? "var(--bg-card)"
                        : "radial-gradient(circle at top center, rgba(199, 154, 59, 0.05), transparent 75%), var(--bg-card)",
                      borderColor: theme === "light" ? "rgba(184, 138, 58, 0.25)" : "rgba(199, 154, 59, 0.2)",
                    }}
                  >
                    {[
                      { label: "My Account", href: "/account" },
                      { label: "My Orders", href: "/account?tab=orders" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-3 text-xs tracking-wider font-body transition-colors"
                        style={{ color: "var(--navbar-text-muted)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                        onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-3 text-xs tracking-wider font-body transition-colors border-t"
                      style={{ color: "var(--navbar-text-muted)", borderColor: "var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden lg:block text-[11px] font-body tracking-widest uppercase transition-colors"
                  style={{ color: "var(--navbar-text-muted)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                >
                  Login
                </Link>
              )}

              <button className="lg:hidden transition-colors" style={{ color: "var(--navbar-text-muted)" }} onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden border-t max-h-[80vh] overflow-y-auto" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
            {NAV_LINKS.map((link) => {
              const hasSubs = link.category && CATEGORIES[link.category];
              const isOpen = mobileExpanded === link.href;
              return (
                <div key={link.href} className="border-b" style={{ borderColor: "var(--border)" }}>
                  <div className="flex items-center justify-between">
                    <Link
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className="flex-1 px-5 py-4 font-body text-xs tracking-widest uppercase transition-colors"
                      style={{ color: "var(--navbar-text-muted)" }}
                    >
                      {link.label}
                    </Link>
                    {hasSubs && (
                      <button
                        onClick={() => setMobileExpanded(isOpen ? null : link.href)}
                        className="px-5 py-4 border-l"
                        style={{ color: "var(--text-faint)", borderColor: "var(--border)" }}
                      >
                        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                      </button>
                    )}
                  </div>
                  {hasSubs && isOpen && (
                    <div className="pb-2" style={{ backgroundColor: "var(--bg-subtle)" }}>
                      {link.category === "regional-arts" ? (
                        <div className="space-y-4 px-8 py-3">
                          {REGIONAL_MEGA_MENU.flatMap((col) => col.states).map((state) => (
                            <div key={state.name} className="space-y-1">
                              <Link
                                href={`/shop/regional-arts?state=${encodeURIComponent(state.name)}`}
                                onClick={() => setMenuOpen(false)}
                                className="block font-display text-xs tracking-wider uppercase"
                                style={{ color: "var(--gold)" }}
                              >
                                {state.name}
                              </Link>
                              <div className="pl-3 space-y-1 border-l" style={{ borderColor: "var(--border)" }}>
                                {state.items.map((item) => (
                                  <Link
                                    key={item.label}
                                    href={`/shop/regional-arts?sub=${item.sub}`}
                                    onClick={() => setMenuOpen(false)}
                                    className="block font-body text-xs py-1"
                                    style={{ color: "var(--text-muted)" }}
                                  >
                                    {item.label}
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        CATEGORIES[link.category!].subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/shop/${link.category}?sub=${sub.toLowerCase()}`}
                            onClick={() => setMenuOpen(false)}
                            className="block px-8 py-2.5 font-body text-xs transition-colors"
                            style={{ color: "var(--text-faint)" }}
                          >
                            {sub}
                          </Link>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="px-5 py-4 border-t" style={{ borderColor: "var(--border)" }}>
              {session ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                    {session.user?.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="w-8 h-8 rounded-full object-cover border"
                        style={{ borderColor: "var(--gold)" }}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center font-body text-xs font-semibold"
                        style={{
                          backgroundColor: "var(--gold-glow)",
                          border: "1px solid var(--gold)",
                          color: "var(--gold)",
                        }}
                      >
                        {session.user?.name?.charAt(0).toUpperCase() || <User size={14} />}
                      </div>
                    )}
                    <div>
                      <p className="font-body text-xs font-semibold" style={{ color: "var(--navbar-text)" }}>
                        {session.user?.name}
                      </p>
                      <p className="font-body text-[10px]" style={{ color: "var(--navbar-text-muted)" }}>
                        {session.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="block font-body text-xs tracking-widest uppercase transition-colors"
                      style={{ color: "var(--navbar-text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                    >
                      My Account
                    </Link>
                    <Link
                      href="/account?tab=orders"
                      onClick={() => setMenuOpen(false)}
                      className="block font-body text-xs tracking-widest uppercase transition-colors"
                      style={{ color: "var(--navbar-text-muted)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left font-body text-xs tracking-widest uppercase transition-colors pt-2 border-t"
                      style={{ color: "var(--navbar-text-muted)", borderColor: "var(--border)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--navbar-hover)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--navbar-text-muted)")}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block w-full text-center font-body text-xs tracking-widest uppercase transition-colors py-2"
                  style={{ color: "var(--navbar-text-muted)", border: "1px solid var(--border)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--navbar-hover)";
                    e.currentTarget.style.color = "var(--navbar-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--navbar-text-muted)";
                  }}
                >
                  Login
                </Link>
              )}
            </div>
            {/* Mobile Menu Socials */}
            <div className="px-5 py-4 border-t flex items-center justify-center gap-6 text-[var(--navbar-text-muted)] animate-fade-in" style={{ borderColor: "var(--border)" }}>
              <a
                href="https://www.instagram.com/daddyprince.official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Daddy Prince on Instagram"
                className="hover:text-[var(--navbar-hover)] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.pinterest.com/daddyprince_official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Daddy Prince on Pinterest"
                className="hover:text-[var(--navbar-hover)] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.41 7.61 11.162-.102-.947-.195-2.4.04-3.434.21-.93 1.357-5.75 1.357-5.75s-.346-.689-.346-1.713c0-1.605.932-2.802 2.087-2.802 1.03 0 1.528.773 1.528 1.699 0 1.036-.66 2.585-.999 4.02-.284 1.205.602 2.189 1.79 2.189 2.15 0 3.8-2.268 3.8-5.541 0-2.9-2.084-4.928-5.06-4.928-3.447 0-5.47 2.585-5.47 5.258 0 1.04.4 2.157.9 2.76.098.118.112.222.083.334-.09.378-.292 1.192-.331 1.352-.053.21-.175.254-.404.148-1.5-.7-2.438-2.898-2.438-4.662 0-3.799 2.76-7.29 7.96-7.29 4.18 0 7.428 2.977 7.428 6.96 0 4.152-2.617 7.494-6.25 7.494-1.22 0-2.368-.635-2.76-1.38l-.752 2.87c-.27 1.04-.6 1.94-.85 2.37A12.01 12.01 0 0012.017 24c6.62 0 11.986-5.367 11.986-11.987C24.003 5.367 18.637 0 12.017 0z"/>
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@daddyprince.official"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Subscribe to Daddy Prince on YouTube"
                className="hover:text-[var(--navbar-hover)] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61573133973719"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Like Daddy Prince on Facebook"
                className="hover:text-[var(--navbar-hover)] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/916301206401"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Daddy Prince on WhatsApp"
                className="hover:text-[var(--navbar-hover)] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.495-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z"/>
                </svg>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Cart drawer */}
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
