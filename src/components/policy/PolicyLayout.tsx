import { ReactNode } from "react";

interface PolicyLayoutProps {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}

export default function PolicyLayout({ title, lastUpdated, children }: PolicyLayoutProps) {
  return (
    <div className="relative pt-32 pb-24 overflow-hidden animate-fade-in" style={{ backgroundColor: "var(--bg)" }}>
      {/* Soft luxury background lighting */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at top center, rgba(201, 168, 76, 0.03) 0%, transparent 60%)",
        }}
      />
      
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-6 h-[1px] bg-[var(--gold)]" />
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]">Legal & Support</p>
            <div className="w-6 h-[1px] bg-[var(--gold)]" />
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-[var(--text)] font-light leading-tight mb-4">
            {title}
          </h1>
          {lastUpdated && (
            <p className="font-body text-[9px] text-[var(--text-faint)] tracking-widest uppercase">
              Last Updated: {lastUpdated}
            </p>
          )}
        </div>

        {/* Content Wrapper */}
        <div className="glass-card p-8 sm:p-12 border border-[var(--border)] leading-relaxed space-y-12">
          {children}
        </div>
      </div>
    </div>
  );
}
