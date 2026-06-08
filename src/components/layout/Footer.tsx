import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gold/10 bg-ink mt-8 md:mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 md:pt-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-3">
              <img
                src="/favicon.ico"
                alt="Daddy Prince Logo"
                className="w-8 h-8 object-contain"
              />
              <p className="font-display text-3xl text-gold tracking-widest uppercase">
                Daddy Prince
              </p>
            </div>
            <p className="mt-3 text-cream/50 font-body text-sm leading-relaxed max-w-xs">
              Curating the finest heritage Indian arts and artifacts for
              collectors and connoisseurs worldwide.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex items-center gap-4 text-cream/40">
              <a
                href="https://www.instagram.com/daddyprince.official/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Daddy Prince on Instagram"
                className="hover:text-gold transition-colors duration-300"
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
                className="hover:text-gold transition-colors duration-300"
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
                className="hover:text-gold transition-colors duration-300"
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
                className="hover:text-gold transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1V12h3v3h-3v6.8c4.56-.93 8-4.96 8-9.8z"/>
                </svg>
              </a>
              <a
                href="https://wa.me/910000000000"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Daddy Prince on WhatsApp"
                className="hover:text-gold transition-colors duration-300"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.495-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-gold/60 mb-4">Shop</p>
            <ul className="space-y-2 text-sm text-cream/50 font-body">
              {["Paintings", "Sculptures", "Textiles", "Jewelry", "Artifacts"].map((c) => (
                <li key={c}>
                  <Link
                    href={`/shop?category=${c.toLowerCase()}`}
                    className="hover:text-gold transition-colors"
                  >
                    {c}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-gold/60 mb-4">Help</p>
            <ul className="space-y-2 text-sm text-cream/50 font-body">
              {[
                { label: "About Us", href: "/about" },
                { label: "Shipping", href: "/shipping" },
                { label: "Returns", href: "/returns" },
                { label: "Contact", href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-gold transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-gold/10 flex flex-col md:flex-row items-center justify-between gap-4 text-cream/30 font-body text-xs tracking-wider">
          <p>© {new Date().getFullYear()} Daddy Prince. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gold transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
