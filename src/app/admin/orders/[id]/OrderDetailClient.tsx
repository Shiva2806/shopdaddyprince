"use client";

import { useState } from "react";
import { formatPrice, formatOrderId } from "@/utils/format";
import { ChevronLeft, MapPin, Mail, Phone, Calendar, CreditCard } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

const statusText: Record<string, string> = {
  pending: "#E8A030",
  paid: "#4CAF6C",
  processing: "#4080CC",
  shipped: "#9050CC",
  delivered: "#4CAF6C",
  cancelled: "#E05030",
  refunded: "#888888",
};

interface OrderDetailClientProps {
  initialOrder: any;
}

export default function OrderDetailClient({ initialOrder }: OrderDetailClientProps) {
  const [order, setOrder] = useState(initialOrder);
  const [updating, setUpdating] = useState(false);

  const address = order.shipping_address;
  const items = order.items as any[];
  const formattedDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: order.id, status: newStatus }),
      });
      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update order status");
      }

      setOrder({ ...order, status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Back button */}
      <Link href="/admin/orders" className="flex items-center gap-1.5 font-body text-xs tracking-widest uppercase mb-8 transition-colors hover:text-gold" style={{ color: "var(--text-muted)" }}>
        <ChevronLeft size={16} />
        Back to Orders
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>Order Details</p>
          <h1 className="font-display text-3xl sm:text-4xl" style={{ color: "var(--text)" }}>{formatOrderId(order.id)}</h1>
          <p className="font-body text-xs mt-1" style={{ color: "var(--text-faint)" }}>Database ID: {order.id}</p>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3 p-3 border" style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border)" }}>
          <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Status:</span>
          <select
            value={order.status}
            disabled={updating}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="font-body text-xs px-3 py-1.5 focus:outline-none capitalize border cursor-pointer"
            style={{
              backgroundColor: "var(--bg)",
              borderColor: "var(--border)",
              color: statusText[order.status],
              fontWeight: "600",
            }}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status} style={{ color: statusText[status] }}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Items & Details) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="glass-card p-6 sm:p-8">
            <h2 className="font-display text-xl mb-6" style={{ color: "var(--text)" }}>Acquisition Items</h2>
            <div className="space-y-4">
              {items.map((item: any) => (
                <div key={item.product_id} className="flex gap-4 items-center pb-4" style={{ borderBottom: "1px solid var(--border)" }}>
                  {item.image && (
                    <div className="w-16 h-20 shrink-0 overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                      <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-lg truncate" style={{ color: "var(--text)" }}>{item.product_name}</p>
                    <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>Product ID: {item.product_id}</p>
                    <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Quantity: {item.quantity} · Price: {formatPrice(item.price)}</p>
                  </div>
                  <p className="font-body text-sm font-semibold" style={{ color: "var(--gold)" }}>
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="mt-6 space-y-2.5 max-w-xs ml-auto">
              <div className="flex justify-between font-body text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between font-body text-xs" style={{ color: "var(--text-muted)" }}>
                <span>Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <div className="h-[1px] my-2" style={{ backgroundColor: "var(--border)" }} />
              <div className="flex justify-between font-body text-sm font-semibold" style={{ color: "var(--text)" }}>
                <span>Total Amount</span>
                <span style={{ color: "var(--gold)" }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Payment metadata */}
          <div className="glass-card p-6">
            <h2 className="font-display text-xl mb-4" style={{ color: "var(--text)" }}>Gateway Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-4 border" style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border)" }}>
                <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Razorpay Order ID</p>
                <p className="font-body text-sm font-medium mt-1" style={{ color: "var(--text)" }}>{order.razorpay_order_id || "N/A"}</p>
              </div>
              <div className="p-4 border" style={{ backgroundColor: "var(--bg-subtle)", borderColor: "var(--border)" }}>
                <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Razorpay Payment ID</p>
                <p className="font-body text-sm font-medium mt-1" style={{ color: "var(--text)" }}>{order.razorpay_payment_id || "N/A"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Collector Details & Shipping) */}
        <div className="space-y-6">
          {/* Customer Profile */}
          <div className="glass-card p-6">
            <h2 className="font-display text-xl mb-4" style={{ color: "var(--text)" }}>Collector Profile</h2>
            <div className="space-y-3">
              <div>
                <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>Collector ID</p>
                <p className="font-body text-xs mt-0.5" style={{ color: "var(--text)" }}>{order.user_id}</p>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={12} style={{ color: "var(--gold)" }} />
                <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{order.profiles?.email || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={12} style={{ color: "var(--gold)" }} />
                <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{address.phone || "N/A"}</p>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={12} style={{ color: "var(--gold)" }} />
                <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{formattedDate}</p>
              </div>
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={16} style={{ color: "var(--gold)" }} />
              <h2 className="font-display text-xl" style={{ color: "var(--text)" }}>Delivery Address</h2>
            </div>
            <div className="font-body text-xs space-y-1.5" style={{ color: "var(--text-muted)" }}>
              <p className="font-semibold" style={{ color: "var(--text)" }}>{address.full_name}</p>
              <p>{address.line1}</p>
              {address.line2 && <p>{address.line2}</p>}
              <p>{address.city}, {address.state}</p>
              <p className="font-semibold" style={{ color: "var(--gold)" }}>{address.pincode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
