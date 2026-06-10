"use client";

import { useState, useEffect, useRef } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface OtpVerificationProps {
  phoneNumber: string;
  onBack: () => void;
}

export default function OtpVerification({ phoneNumber, onBack }: OtpVerificationProps) {
  const router = useRouter();
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  
  const inputRefs = useRef<HTMLInputElement[]>([]);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [timer]);

  // Handle character input
  const handleChange = (element: HTMLInputElement, index: number) => {
    const value = element.value.replace(/[^\d]/g, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input
    if (index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle keypresses (Backspace/Arrow keys)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Focus previous input
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0 && inputRefs.current[index - 1]) {
        inputRefs.current[index - 1].focus();
      }
    } else if (e.key === "ArrowRight") {
      if (index < 5 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/[^\d]/g, "").substring(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      toast.error("Please enter a 6-digit verification code");
      return;
    }

    setVerifying(true);
    try {
      // Sign in using next-auth Credentials provider
      const result = await signIn("credentials", {
        phone: phoneNumber,
        otp: otpCode,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      toast.success("Signed in successfully!");
      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Invalid or expired verification code";
      toast.error(errorMessage);
      console.error("Verification error:", err);
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success("New verification code sent!");
      setTimer(30);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend verification code";
      toast.error(errorMessage);
    } finally {
      setResending(false);
    }
  };

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="text-center mb-2">
        <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
          Verification code sent to{" "}
          <span className="font-semibold" style={{ color: "var(--text)" }}>
            {phoneNumber}
          </span>
        </p>
        <button
          type="button"
          onClick={onBack}
          className="font-body text-[10px] tracking-widest uppercase mt-1 transition-colors hover:text-gold"
          style={{ color: "var(--gold)" }}
        >
          Change Phone Number
        </button>
      </div>

      <div>
        <label className="block font-body text-[10px] tracking-[0.2em] uppercase text-center mb-4" style={{ color: "var(--text-faint)" }}>
          Enter 6-Digit OTP
        </label>
        
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              ref={(el) => {
                if (el) inputRefs.current[idx] = el;
              }}
              onChange={(e) => handleChange(e.target, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={handlePaste}
              className="w-10 h-12 sm:w-12 sm:h-14 font-display text-lg sm:text-xl text-center focus:outline-none transition-all duration-300 border font-semibold"
              style={{
                backgroundColor: "var(--bg-subtle)",
                borderColor: digit ? "var(--gold)" : "var(--border)",
                color: "var(--text)",
              }}
              onFocus={(e) => {
                const element = e.currentTarget;
                element.style.borderColor = "var(--gold)";
                element.style.boxShadow = "0 0 8px var(--gold-glow)";
              }}
              onBlur={(e) => {
                const element = e.currentTarget;
                element.style.borderColor = digit ? "var(--gold)" : "var(--border)";
                element.style.boxShadow = "none";
              }}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        {timer > 0 ? (
          <p className="font-body text-[11px]" style={{ color: "var(--text-faint)" }}>
            Resend verification code in{" "}
            <span className="font-semibold" style={{ color: "var(--text-muted)" }}>
              {timer}s
            </span>
          </p>
        ) : (
          <button
            type="button"
            disabled={resending}
            onClick={handleResend}
            className="font-body text-[11px] tracking-wider font-semibold transition-colors uppercase hover:text-gold"
            style={{ color: "var(--gold)" }}
          >
            {resending ? "Resending…" : "Resend Code"}
          </button>
        )}
      </div>

      <button
        type="submit"
        disabled={verifying || otp.some((d) => !d)}
        className="w-full btn-gold py-4 justify-center disabled:opacity-60 disabled:cursor-not-allowed text-sm uppercase tracking-widest font-semibold"
        style={{
          border: "1px solid var(--gold)",
        }}
      >
        {verifying ? "Verifying…" : "Verify & Sign In"}
      </button>
    </form>
  );
}
