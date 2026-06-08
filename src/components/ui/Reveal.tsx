"use client";

import React, { useRef, useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}

export default function Reveal({ children, className = "", delayMs = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delayMs > 0) {
            setTimeout(() => setVisible(true), delayMs);
          } else {
            setVisible(true);
          }
          observer.unobserve(el);
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      if (el) observer.unobserve(el);
    };
  }, [delayMs]);

  return (
    <div
      ref={ref}
      className={`reveal-init ${visible ? "reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
