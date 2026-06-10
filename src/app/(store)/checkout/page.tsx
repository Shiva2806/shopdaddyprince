"use client";

import { useState } from "react";
import { useCartStore } from "@/store/cart";
import { formatPrice } from "@/utils/format";
import { ChevronRight, Shield, Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { openRazorpayCheckout } from "@/lib/razorpay/client";

type Step = "address" | "review" | "payment";

interface Address {
  full_name: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const STEPS: { key: Step; label: string }[] = [
  { key: "address", label: "Delivery" },
  { key: "review",  label: "Review" },
  { key: "payment", label: "Payment" },
];

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
  "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka",
  "Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram",
  "Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana",
  "Tripura","Uttar Pradesh","Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Delhi","Jammu and Kashmir",
  "Ladakh","Lakshadweep","Puducherry",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<Step>("address");
  const [loading, setLoading] = useState(false);

  const [address, setAddress] = useState<Address>({
    full_name: "", phone: "", line1: "", line2: "",
    city: "", state: "", pincode: "",
  });

  const shipping = totalPrice() >= 500000 ? 0 : 9900;
  const grandTotal = totalPrice() + shipping;

  // Redirect if cart empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
        <div className="text-center">
          <h1 className="font-display text-4xl mb-4" style={{ color: "var(--text)" }}>Your cart is empty</h1>
          <Link href="/shop" className="btn-gold">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["full_name","phone","line1","city","state","pincode"] as const;
    for (const field of required) {
      if (!address[field]) { toast.error("Please fill all required fields"); return; }
    }
    setStep("review");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // 1. Create order on Razorpay
      const res = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      
      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create order on payment gateway");
      }
      
      const razorpayOrder = data.data;
      
      // 2. Open Razorpay checkout
      await openRazorpayCheckout({
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Daddy Prince",
        description: "Collector Acquisition Payment",
        prefill: {
          name: address.full_name,
          contact: address.phone,
        },
        onSuccess: async (paymentId, orderId, signature) => {
          setLoading(true);
          try {
            toast.loading("Verifying payment...", { id: "payment-verify" });
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: orderId,
                razorpay_payment_id: paymentId,
                razorpay_signature: signature,
                items: items.map((item) => ({
                  product_id: item.product.id,
                  product_name: item.product.name,
                  quantity: item.quantity,
                  price: item.priceAtPurchase ?? item.product.price,
                  product_image: item.product.images[0] || "",
                  variant_id: item.variantId,
                  selected_dimension: item.selectedDimension,
                })),
                shipping_address: address,
                subtotal: totalPrice(),
                shipping,
                total: grandTotal,
              }),
            });
            
            const verifyData = await verifyRes.json();
            if (!verifyRes.ok || verifyData.error) {
              throw new Error(verifyData.error || "Payment verification failed");
            }
            
            toast.success("Payment verified! Order placed successfully.", { id: "payment-verify" });
            clearCart();
            router.push(`/checkout/success?id=${verifyData.order_id}`);
          } catch (err: any) {
            toast.error(err.message || "Payment verification failed", { id: "payment-verify" });
          } finally {
            setLoading(false);
          }
        },
        onFailure: (err) => {
          console.error("Razorpay payment failed:", err);
          toast.error("Payment was cancelled or failed. Please try again.");
          setLoading(false);
        },
      });
    } catch (err: any) {
      toast.error(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const field = (
    key: keyof Address,
    label: string,
    placeholder: string,
    required = true,
    half = false,
    type = "text"
  ) => (
    <div className={half ? "col-span-1" : "col-span-2"}>
      <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
        {label}{required && <span style={{ color: "var(--gold)" }}> *</span>}
      </label>
      <input
        type={type}
        value={address[key]}
        onChange={(e) => setAddress({ ...address, [key]: e.target.value })}
        placeholder={placeholder}
        className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all"
        style={{
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid var(--border)",
          color: "var(--text)",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--gold)";
          e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
          e.currentTarget.style.boxShadow = "none";
        }}
      />
    </div>
  );

  return (
    <div className="min-h-screen pt-20" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-12 py-12">

        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center">
          <Link href="/" className="flex flex-col items-center gap-2 group">
            <img
              src="/favicon.ico"
              alt="Daddy Prince Logo"
              className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-2xl tracking-widest uppercase" style={{ color: "var(--gold)" }}>
              Daddy Prince
            </span>
          </Link>
          <div className="flex items-center justify-center gap-2 mt-6">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-body text-[10px] transition-all duration-300"
                    style={{
                      backgroundColor: step === s.key ? "var(--gold)" : "transparent",
                      border: `1px solid ${step === s.key ? "var(--gold)" : "var(--border)"}`,
                      color: step === s.key ? "var(--bg)" : "var(--text-faint)",
                    }}
                  >
                    {i + 1}
                  </div>
                  <span
                    className="font-body text-xs tracking-widest uppercase"
                    style={{ color: step === s.key ? "var(--gold)" : "var(--text-faint)" }}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={12} style={{ color: "var(--text-faint)" }} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — steps */}
          <div className="lg:col-span-2">

            {/* Step 1 — Address */}
            {step === "address" && (
              <form onSubmit={handleAddressSubmit}>
                <div className="glass-card p-8">
                  <h2 className="font-display text-2xl mb-6" style={{ color: "var(--text)" }}>
                    Delivery Address
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    {field("full_name", "Full Name", "Your name", true, false)}
                    {field("phone", "Phone", "+91 XXXXX XXXXX", true, false, "tel")}
                    {field("line1", "Address Line 1", "House / Flat no., Street", true, false)}
                    {field("line2", "Address Line 2", "Landmark, Area (optional)", false, false)}
                    {field("city", "City", "City", true, true)}
                    {field("pincode", "Pincode", "6-digit pincode", true, true)}

                    {/* State dropdown */}
                    <div className="col-span-2">
                      <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                        State <span style={{ color: "var(--gold)" }}>*</span>
                      </label>
                      <select
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all"
                        style={{
                          backgroundColor: "var(--bg-subtle)",
                          border: "1px solid var(--border)",
                          color: address.state ? "var(--text)" : "var(--text-faint)",
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--gold)"; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
                      >
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button type="submit" className="btn-gold mt-8 w-full justify-center">
                    Continue to Review
                    <ChevronRight size={15} />
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 — Review */}
            {step === "review" && (
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl mb-6" style={{ color: "var(--text)" }}>Review Order</h2>

                {/* Address summary */}
                <div className="mb-6 p-4" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)" }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold)" }}>
                        Delivering to
                      </p>
                      <p className="font-body text-sm" style={{ color: "var(--text)" }}>{address.full_name}</p>
                      <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        {address.line1}{address.line2 ? `, ${address.line2}` : ""}
                      </p>
                      <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                        {address.city}, {address.state} — {address.pincode}
                      </p>
                      <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>{address.phone}</p>
                    </div>
                    <button
                      onClick={() => setStep("address")}
                      className="font-body text-[10px] tracking-widest uppercase transition-colors"
                      style={{ color: "var(--gold)" }}
                    >
                      Edit
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4 mb-8">
                  {items.map(({ product: p, quantity, variantId, selectedDimension, priceAtPurchase }) => (
                    <div key={`${p.id}-${variantId || ""}`} className="flex gap-4 items-center pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                      <div className="w-16 h-20 shrink-0 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display text-lg" style={{ color: "var(--text)" }}>{p.name}</p>
                        {selectedDimension && (
                          <p className="font-body text-[10px] uppercase mt-0.5" style={{ color: "var(--gold)" }}>Size: {selectedDimension}</p>
                        )}
                        <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Qty: {quantity}</p>
                      </div>
                      <p className="font-body text-sm font-medium" style={{ color: "var(--gold)" }}>
                        {formatPrice((priceAtPurchase ?? p.price) * quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <button onClick={() => setStep("payment")} className="btn-gold w-full justify-center">
                  Proceed to Payment
                  <ChevronRight size={15} />
                </button>
              </div>
            )}

            {/* Step 3 — Payment */}
            {step === "payment" && (
              <div className="glass-card p-8">
                <h2 className="font-display text-2xl mb-2" style={{ color: "var(--text)" }}>Payment</h2>
                <p className="font-body text-sm mb-8" style={{ color: "var(--text-muted)" }}>
                  You'll be redirected to Razorpay's secure payment gateway.
                </p>

                {/* Razorpay placeholder */}
                <div
                  className="flex items-center gap-4 p-5 mb-8"
                  style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)" }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--border)" }}
                  >
                    <Lock size={16} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <p className="font-body text-sm font-medium" style={{ color: "var(--text)" }}>
                      Razorpay Secure Checkout
                    </p>
                    <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      UPI · Cards · Net Banking · Wallets — all accepted
                    </p>
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 mb-8">
                  <Shield size={12} style={{ color: "var(--gold)" }} />
                  <p className="font-body text-[10px] tracking-wide" style={{ color: "var(--text-faint)" }}>
                    256-bit SSL encryption. Your payment details are never stored on our servers.
                  </p>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-gold w-full justify-center disabled:opacity-60"
                >
                  {loading ? "Processing…" : `Pay ${formatPrice(grandTotal)}`}
                </button>

                <button
                  onClick={() => setStep("review")}
                  className="w-full text-center font-body text-xs tracking-widest uppercase mt-4 transition-colors"
                  style={{ color: "var(--text-faint)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}
                >
                  ← Back to Review
                </button>
              </div>
            )}
          </div>

          {/* Right — order summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-display text-xl mb-5" style={{ color: "var(--text)" }}>
                Order Summary
              </h3>

              {/* Mini item list */}
              <div className="space-y-3 mb-5">
                {items.map(({ product: p, quantity, variantId, selectedDimension, priceAtPurchase }) => (
                  <div key={`${p.id}-${variantId || ""}`} className="flex items-center gap-3">
                    <div className="relative w-10 h-12 shrink-0 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      <span
                        className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-body text-[9px]"
                        style={{ backgroundColor: "var(--gold)", color: "var(--bg)" }}
                      >
                        {quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body text-xs truncate" style={{ color: "var(--text-muted)" }}>{p.name}</p>
                      {selectedDimension && (
                        <p className="font-body text-[9px] uppercase tracking-wide" style={{ color: "var(--gold)" }}>{selectedDimension}</p>
                      )}
                    </div>
                    <p className="font-body text-xs shrink-0" style={{ color: "var(--text)" }}>
                      {formatPrice((priceAtPurchase ?? p.price) * quantity)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="h-px mb-5" style={{ backgroundColor: "var(--border)" }} />

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between">
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Subtotal</span>
                  <span className="font-body text-sm" style={{ color: "var(--text)" }}>{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Shipping</span>
                  <span className="font-body text-sm" style={{ color: shipping === 0 ? "#4CAF6C" : "var(--text)" }}>
                    {shipping === 0 ? "Free" : formatPrice(shipping)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <span className="font-body text-sm font-medium" style={{ color: "var(--text)" }}>Total</span>
                <span className="font-display text-xl text-gold-shimmer">{formatPrice(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
