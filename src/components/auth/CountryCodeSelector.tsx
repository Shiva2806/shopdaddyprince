"use client";

import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export interface CountryCode {
  code: string;
  flag: string;
  name: string;
  dialCode: string;
}

export const COUNTRIES: CountryCode[] = [
  { code: "IN", flag: "🇮🇳", name: "India", dialCode: "+91" },
  { code: "US", flag: "🇺🇸", name: "United States", dialCode: "+1" },
  { code: "GB", flag: "🇬🇧", name: "United Kingdom", dialCode: "+44" },
  { code: "AE", flag: "🇦🇪", name: "United Arab Emirates", dialCode: "+971" },
  { code: "SG", flag: "🇸🇬", name: "Singapore", dialCode: "+65" },
  { code: "AU", flag: "🇦🇺", name: "Australia", dialCode: "+61" },
  { code: "CA", flag: "🇨🇦", name: "Canada", dialCode: "+1" },
];

interface CountryCodeSelectorProps {
  selected: CountryCode;
  onChange: (country: CountryCode) => void;
}

export default function CountryCodeSelector({ selected, onChange }: CountryCodeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-3 font-body text-sm transition-all focus:outline-none h-full border-r"
        style={{
          backgroundColor: "var(--bg-subtle)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <span className="font-semibold">{selected.dialCode}</span>
        <ChevronDown size={12} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-faint)" }} />
      </button>

      {isOpen && (
        <div
          className="absolute z-50 mt-1 left-0 w-56 border shadow-2xl overflow-y-auto max-h-60"
          style={{
            backgroundColor: "var(--bg-subtle)",
            borderColor: "var(--border)",
          }}
        >
          {COUNTRIES.map((country) => (
            <button
              key={`${country.code}-${country.dialCode}`}
              type="button"
              onClick={() => {
                onChange(country);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 font-body text-xs text-left transition-colors hover:text-gold"
              style={{
                color: "var(--text-muted)",
                backgroundColor: country.code === selected.code && country.dialCode === selected.dialCode ? "var(--gold-glow)" : "transparent",
              }}
              onMouseEnter={(e) => {
                if (country.code !== selected.code) {
                  e.currentTarget.style.backgroundColor = "rgba(201,168,76,0.05)";
                }
              }}
              onMouseLeave={(e) => {
                if (country.code !== selected.code) {
                  e.currentTarget.style.backgroundColor = "transparent";
                }
              }}
            >
              <div className="flex items-center gap-2">
                <span>{country.flag}</span>
                <span>{country.name}</span>
              </div>
              <span className="font-semibold" style={{ color: "var(--text-faint)" }}>
                {country.dialCode}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
