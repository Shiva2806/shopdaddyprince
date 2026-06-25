import Link from "next/link";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  return (
    <footer className="relative border-t overflow-hidden min-h-[500px] flex flex-col justify-between"
      style={{
        backgroundColor: "#1C1816",
        borderColor: "rgba(199, 154, 59, 0.2)",
      }}
    >
      
      {/* Cinematic Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10000ms] hover:scale-105"
        style={{
          backgroundImage: 'url("/images/categories/footer.webp")',
        }}
      />
      
      {/* Strong Dark Overlay for text legibility */}
      <div 
        className="absolute inset-0 z-10 bg-[#080604]/80 pointer-events-none"
      />

      {/* Footer Content */}
      <Reveal className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 w-full flex-1 flex flex-col justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 pb-12 border-b" style={{ borderColor: "rgba(199, 154, 59, 0.1)" }}>

          {/* Brand Column (Left) */}
          <div className="col-span-1">
            <div className="flex items-center gap-3.5 mb-4">
              <img
                src="/favicon.ico"
                alt="Daddy Prince Logo"
                className="w-14 h-14 object-contain"
              />
              <span className="font-display text-xl text-[#C79A3B] tracking-widest uppercase">
                DADDY PRINCE
              </span>
            </div>
            
            <div className="mt-4 text-[#CDC5A5] font-body text-[13px] leading-relaxed max-w-[300px]">
              <p className="italic">
                Established in 1984 by <span className="text-[#C79A3B] font-medium">Prince Satyam</span>.
              </p>
              <p className="mt-2 text-[#CDC5A5]/80 text-[11px] uppercase tracking-widest leading-loose">
                Continuing a Legacy of Art, Heritage, and Timeless Craftsmanship.
              </p>
            </div>
            
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4 text-[#CDC5A5]">
              <a
                href="https://www.instagram.com/daddyprince.official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Daddy Prince on Instagram"
                className="hover:text-[#C79A3B] transition-colors duration-300"
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
                className="hover:text-[#C79A3B] transition-colors duration-300"
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
                className="hover:text-[#C79A3B] transition-colors duration-300"
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
                className="hover:text-[#C79A3B] transition-colors duration-300"
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
                className="hover:text-[#C79A3B] transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.495-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Column (Center-Left) */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#C79A3B] mb-4">Shop</p>
            <ul className="space-y-2 text-sm text-[#F5EFE4]/80 font-body">
              {[
                { label: "Paintings", href: "/shop/paintings" },
                { label: "Home Decor", href: "/shop/home-decor" },
                { label: "Regional Heritage", href: "/shop/regional-arts" },
                { label: "Brass Collection", href: "/shop/brass" },
                { label: "Vintage Collection", href: "/shop/vintage" },
                { label: "Sale", href: "/sale" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-[#C79A3B] transition-colors font-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Column (Center) */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#C79A3B] mb-4">Customer Care</p>
            <ul className="space-y-2 text-sm text-[#F5EFE4]/80 font-body">
              {[
                { label: "Track Order", href: "/track-order" },
                { label: "Shipping Policy", href: "/shipping-policy" },
                { label: "Return Policy", href: "/return-policy" },
                { label: "FAQ", href: "/faq" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[#C79A3B] transition-colors font-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column (Center-Right) */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-[#C79A3B] mb-4">Company</p>
            <ul className="space-y-2 text-sm text-[#F5EFE4]/80 font-body">
              {[
                { label: "About Us", href: "/about" },
                { label: "Privacy Policy", href: "/privacy-policy" },
                { label: "Terms & Conditions", href: "/terms-and-conditions" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-[#C79A3B] transition-colors font-light">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Boutique & Gallery (Right Column) */}
          <div className="col-span-1">
            <p className="font-body text-xs tracking-widest uppercase text-[#C79A3B] mb-4">Boutique & Gallery</p>
            <div className="text-sm text-[#F5EFE4]/85 font-body leading-relaxed space-y-2 font-light">
              <p className="font-medium text-[#F5EFE4] font-display tracking-wide">Daddy Prince</p>
              <p>Shop No. 20, Guptas Midtown</p>
              <p>Beside Chennai Shopping Mall</p>
              <p>Ongole, Andhra Pradesh 523001</p>
              <p className="pt-2">
                <a
                  href="https://www.google.com/maps/search/daddyprince/@15.5169276,80.0473075,21z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[#C79A3B] hover:underline font-normal"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  Get Directions
                </a>
              </p>
            </div>
          </div>

        </div>

        {/* Footer Bottom (Copyrights / Policy links) */}
        <div 
          className="mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[#CDC5A5]/80 font-body text-xs tracking-wider border-t"
          style={{ borderColor: "rgba(245, 239, 228, 0.1)" }}
        >
          <p>© {new Date().getFullYear()} Daddy Prince. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-[#C79A3B] transition-colors">Privacy Policy</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#C79A3B] transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
