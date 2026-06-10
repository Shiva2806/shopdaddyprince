"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import CountryCodeSelector, { COUNTRIES, CountryCode } from "./CountryCodeSelector";
import toast from "react-hot-toast";

interface PhoneLoginFormProps {
  onOtpSent: (phoneNumber: string) => void;
}

export default function PhoneLoginForm({ onOtpSent }: PhoneLoginFormProps) {
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRIES[0]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic phone number length verification
    const cleanNumber = phone.replace(/[^\d]/g, "");
    if (!cleanNumber) {
      toast.error("Please enter a valid phone number");
      return;
    }

    if (selectedCountry.code === "IN" && cleanNumber.length !== 10) {
      toast.error("Please enter a 10-digit Indian mobile number");
      return;
    }

    const fullPhoneNumber = `${selectedCountry.dialCode}${cleanNumber}`;
    setLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone: fullPhoneNumber,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("Verification code sent!");
      onOtpSent(fullPhoneNumber);
    } catch (err: any) {
      toast.error(err.message || "Failed to send verification code");
      console.error("Phone OTP error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
          Phone Number <span style={{ color: "var(--gold)" }}>*</span>
        </label>
        
        <div
          className="flex items-center overflow-hidden transition-all duration-300 w-full"
          style={{
            backgroundColor: "var(--bg-subtle)",
            border: "1px solid var(--border)",
          }}
          onFocus={(e) => {
            const container = e.currentTarget;
            container.style.borderColor = "var(--gold)";
            container.style.boxShadow = "0 0 10px var(--gold-glow)";
          }}
          onBlur={(e) => {
            const container = e.currentTarget;
            container.style.borderColor = "var(--border)";
            container.style.boxShadow = "none";
          }}
        >
          {/* Country code selector */}
          <CountryCodeSelector selected={selectedCountry} onChange={setSelectedCountry} />
          
          {/* Phone number input */}
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="XXXXX XXXXX"
            className="w-full font-body text-sm px-4 py-3 bg-transparent text-white focus:outline-none placeholder-stone-600"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading || !phone}
        className="w-full btn-gold py-4 justify-center disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-widest font-semibold"
        style={{
          border: "1px solid var(--gold)",
        }}
      >
        {loading ? "Sending OTP…" : "Send Verification Code"}
      </button>
    </form>
  );
}
