import { ReactNode } from "react";

interface PolicySectionProps {
  title: string;
  children: ReactNode;
}

export default function PolicySection({ title, children }: PolicySectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl sm:text-2xl text-[var(--text)] border-b border-gold/10 pb-2 mb-4">
        {title}
      </h2>
      <div className="font-body text-sm text-[var(--text-muted)] space-y-3 leading-relaxed">
        {children}
      </div>
    </div>
  );
}
