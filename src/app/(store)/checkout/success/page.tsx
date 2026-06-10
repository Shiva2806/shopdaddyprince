import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Check, ShoppingBag, ArrowRight, MapPin, CreditCard } from "lucide-react";
import { formatPrice, formatOrderId } from "@/utils/format";

export const metadata = {
  title: "Acquisition Confirmed | Daddy Prince",
  description: "Your fine art acquisition has been successfully processed.",
};

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const orderId = searchParams.id;
  if (!orderId) {
    redirect("/");
  }

  const supabase = createAdminClient();
  const { data: order, error } = (await supabase
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .eq("user_id", session.user.id)
    .single()) as any;

  if (error || !order) {
    redirect("/account?tab=orders");
  }

  const items = order.items as any[];
  const address = order.shipping_address as any;
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="min-h-screen pt-24 pb-16 flex items-center justify-center" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-2xl w-full mx-6 glass-card p-8 sm:p-12 text-center relative overflow-hidden animate-fade-up">
        {/* Subtle decorative background element */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px]" style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }} />
        
        {/* Circle Icon */}
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-8 animate-scale-in" style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--gold)" }}>
          <Check size={28} style={{ color: "var(--gold)" }} />
        </div>

        <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-2" style={{ color: "var(--gold)" }}>
          Acquisition Successful
        </p>
        <h1 className="font-display text-3xl sm:text-4xl mb-4" style={{ color: "var(--text)" }}>
          Rare Piece Secured
        </h1>
        <p className="font-body text-sm mb-8 max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
          Thank you for your acquisition. We are preparing the secure packaging and fully insured transport of your curated Indian art piece.
        </p>

        {/* Order Details Card */}
        <div className="text-left p-6 sm:p-8 mb-8" style={{ border: "1px solid var(--border)", backgroundColor: "var(--bg-subtle)" }}>
          <div className="flex flex-col sm:flex-row justify-between gap-2 pb-4 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
            <div>
              <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Order Identifier</p>
              <p className="font-body text-sm font-semibold mt-0.5" style={{ color: "var(--gold)" }}>{formatOrderId(order.id)}</p>
            </div>
            <div>
              <p className="font-body text-[9px] tracking-widest uppercase sm:text-right" style={{ color: "var(--text-faint)" }}>Acquisition Date</p>
              <p className="font-body text-sm mt-0.5 sm:text-right" style={{ color: "var(--text)" }}>{formattedDate}</p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-4 mb-6">
            <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Items</p>
            {items.map((item: any) => (
              <div key={item.product_id} className="flex gap-4 items-center">
                {item.product_image && (
                  <div className="w-10 h-12 shrink-0 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                    <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium truncate" style={{ color: "var(--text)" }}>{item.product_name}</p>
                  <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Qty: {item.quantity}</p>
                </div>
                <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Delivery & Payment grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6" style={{ borderTop: "1px solid var(--border)" }}>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <MapPin size={12} style={{ color: "var(--gold)" }} />
                <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Delivery To</p>
              </div>
              <p className="font-body text-xs" style={{ color: "var(--text)" }}>{address.full_name}</p>
              <p className="font-body text-[11px] mt-0.5" style={{ color: "var(--text-muted)", lineHeight: "1.4" }}>
                {address.line1}{address.line2 ? `, ${address.line2}` : ""}<br />
                {address.city}, {address.state} — {address.pincode}
              </p>
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <CreditCard size={12} style={{ color: "var(--gold)" }} />
                <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Payment Reference</p>
              </div>
              <p className="font-body text-xs" style={{ color: "var(--text)" }}>Razorpay Secure</p>
              <p className="font-body text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                ID: {order.razorpay_payment_id || "N/A"}<br />
                Total Paid: <span className="font-semibold" style={{ color: "var(--gold)" }}>{formatPrice(order.total)}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/account?tab=orders" className="btn-gold w-full sm:w-auto justify-center">
            <ShoppingBag size={14} />
            View My Orders
          </Link>
          <Link href="/shop" className="w-full sm:w-auto text-center font-body text-xs tracking-widest uppercase px-6 py-3 transition-colors flex items-center justify-center gap-2 hover:text-gold" style={{ color: "var(--text-muted)" }}>
            Explore More Works
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
