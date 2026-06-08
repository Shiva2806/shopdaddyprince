import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/910000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contact Daddy Prince on WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full flex items-center justify-center border border-[var(--border-hover)] bg-[var(--bg-glass)] text-[var(--gold)] shadow-2xl transition-all duration-300 hover:scale-110 hover:border-[var(--gold)] hover:bg-[var(--bg-card)] focus:outline-none focus:ring-2 focus:ring-[var(--gold)] focus:ring-offset-2 focus:ring-offset-[var(--bg)] active:scale-95 group"
        style={{
          backdropFilter: "blur(12px)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 transition-transform duration-300 group-hover:scale-105">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.458L0 24zm6.59-4.846c1.666.988 3.31 1.494 5.358 1.495 5.564 0 10.093-4.52 10.096-10.086 0-2.698-1.05-5.236-2.956-7.147C17.24 1.503 14.707.452 12.01.451 6.444.451 1.913 4.972 1.91 10.54c0 2.043.53 4.02 1.547 5.762L2.43 20.25l4.217-1.096zM17.54 14.88c-.3-.15-1.77-.874-2.045-.974-.276-.102-.477-.152-.677.15-.2.302-.777.974-.952 1.176-.176.201-.351.226-.651.075-.3-.15-1.267-.467-2.414-1.492-.893-.796-1.78-1.67-2.08-.175-.302-.019-.465.131-.615.136-.135.301-.352.451-.528.15-.175.2-.301.3-.502.1-.2.05-.377-.025-.527-.075-.15-.677-1.633-.927-2.235-.244-.587-.49-.508-.677-.518-.174-.008-.375-.01-.576-.01-.2 0-.527.075-.802.376-.276.302-1.053 1.03-1.053 2.512 0 1.48 1.079 2.913 1.229 3.114.15.2 2.124 3.242 5.146 4.545.72.311 1.28.497 1.716.636.723.23 1.382.197 1.902.12.58-.087 1.77-.724 2.02-1.383.25-.658.25-1.225.175-1.38-.075-.15-.275-.25-.575-.4z"/>
        </svg>
      </a>
    </div>
  );
}
