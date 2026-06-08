// Razorpay is loaded client-side via script tag (no npm import needed on frontend)
// This util handles loading the script and opening the payment modal

export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as Window & { Razorpay?: unknown }).Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface RazorpayOptions {
  orderId: string;
  amount: number; // paise
  currency?: string;
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (paymentId: string, orderId: string, signature: string) => void;
  onFailure: (error: unknown) => void;
}

export async function openRazorpayCheckout(opts: RazorpayOptions) {
  const loaded = await loadRazorpayScript();
  if (!loaded) throw new Error("Razorpay SDK failed to load");

  const rzp = new (
    (window as unknown as Window & { Razorpay: new (o: unknown) => { open: () => void } }).Razorpay
  )({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: opts.amount,
    currency: opts.currency ?? "INR",
    name: opts.name ?? "Daddy Prince",
    description: opts.description ?? "Heritage Indian Arts",
    order_id: opts.orderId,
    prefill: opts.prefill,
    theme: { color: "#C9A84C" },
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      opts.onSuccess(
        response.razorpay_payment_id,
        response.razorpay_order_id,
        response.razorpay_signature
      );
    },
  });

  rzp.open();
}
