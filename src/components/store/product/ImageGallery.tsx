"use client";

import { useState } from "react";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  images: string[];
  name: string;
  activeImage: number;
  setActiveImage: (i: number) => void;
}

export default function ImageGallery({ images, name, activeImage, setActiveImage }: Props) {
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const prev = () => setActiveImage((activeImage - 1 + images.length) % images.length);
  const next = () => setActiveImage((activeImage + 1) % images.length);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div
        className="relative overflow-hidden group cursor-zoom-in"
        style={{
          aspectRatio: "4/5",
          border: "1px solid var(--border)",
          backgroundColor: "var(--bg-card)",
        }}
        onClick={() => setZoomed(!zoomed)}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setZoomed(false)}
      >
        <img
          src={images[activeImage]}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700"
          style={{
            transform: zoomed
              ? `scale(2) translate(${(50 - mousePos.x) * 0.5}%, ${(50 - mousePos.y) * 0.5}%)`
              : "scale(1)",
            transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
          }}
        />

        {/* Zoom hint */}
        {!zoomed && (
          <div
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ backgroundColor: "rgba(8,6,4,0.7)", backdropFilter: "blur(8px)", border: "1px solid var(--border)" }}
          >
            <ZoomIn size={12} style={{ color: "var(--gold)" }} />
            <span className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
              Hover to zoom
            </span>
          </div>
        )}

        {/* Nav arrows (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(8,6,4,0.7)", backdropFilter: "blur(4px)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: "rgba(8,6,4,0.7)", backdropFilter: "blur(4px)", border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <ChevronRight size={16} />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className="relative overflow-hidden transition-all duration-200"
              style={{
                width: "72px",
                aspectRatio: "1",
                border: i === activeImage ? "1px solid var(--gold)" : "1px solid var(--border)",
                opacity: i === activeImage ? 1 : 0.55,
              }}
            >
              <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
