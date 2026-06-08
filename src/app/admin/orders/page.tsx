"use client";

import { useState, useEffect } from "react";
import { Search, Eye, ChevronDown, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, formatOrderId } from "@/utils/format";
import Link from "next/link";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["all", "pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded"];

const statusColors: Record<string, string> = {
  pending: "rgba(200,150,30,0.15)",
  paid: "rgba(76,175,108,0.15)",
  processing: "rgba(60,120,200,0.15)",
  shipped: "rgba(140,80,200,0.15)",
  delivered: "rgba(76,175,108,0.2)",
  cancelled: "rgba(220,80,50,0.15)",
  refunded: "rgba(100,100,100,0.15)",
};

const statusText: Record<string, string> = {
  pending: "#E8A030",
  paid: "#4CAF6C",
  processing: "#4080CC",
  shipped: "#9050CC",
  delivered: "#4CAF6C",
  cancelled: "#E05030",
  refunded: "#888888",
};

export default function AdminOrders() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient() as any;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("orders")
        .select("*, profiles(email)")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load orders");
      toast.error("Error loading orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((o) => {
    const customerName = o.shipping_address?.full_name || "";
    const email = o.profiles?.email || "";
    const orderIdFormatted = formatOrderId(o.id);

    const matchSearch =
      customerName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      orderIdFormatted.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (updateError) throw updateError;

      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update order status");
    }
  };

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>Management</p>
        <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Orders</h1>
        <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {loading ? "Loading..." : `${orders.length} total orders`}
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, email, or order ID…"
            className="w-full pl-9 pr-4 py-2.5 font-body text-sm focus:outline-none"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="font-body text-xs px-4 py-2.5 focus:outline-none capitalize"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s === "all" ? "All Statuses" : s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass-card flex flex-col items-center justify-center py-32">
          <Loader2 size={36} className="animate-spin mb-3" style={{ color: "var(--gold)" }} />
          <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Fetching transaction orders...</p>
        </div>
      ) : error ? (
        <div className="glass-card flex flex-col items-center justify-center py-32 border" style={{ borderColor: "rgba(220,80,50,0.2)" }}>
          <p className="font-display text-2xl mb-2" style={{ color: "#E05030" }}>Failed to load orders</p>
          <p className="font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>{error}</p>
          <button onClick={fetchOrders} className="btn-ghost text-[10px] py-2">Try Again</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Order ID", "Customer", "Product", "Amount", "Status", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-faint)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((o, i) => {
                  const customerName = o.shipping_address?.full_name || "Guest Collector";
                  const customerCity = o.shipping_address?.city || "N/A";
                  const firstProductName = o.items?.[0]?.product_name || "N/A";
                  const totalItems = o.items?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;
                  const formattedDate = new Date(o.created_at).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  });

                  return (
                    <tr key={o.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <td className="px-5 py-4 font-body text-xs font-medium" style={{ color: "var(--gold)" }}>
                        {formatOrderId(o.id)}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-body text-sm font-semibold animate-fade-in" style={{ color: "var(--text)" }}>{customerName}</p>
                        <p className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>{customerCity}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-body text-xs text-ellipsis overflow-hidden max-w-[220px] whitespace-nowrap" style={{ color: "var(--text-muted)" }}>
                          {firstProductName}
                        </p>
                        <p className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>
                          {totalItems} item{totalItems > 1 ? "s" : ""}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-body text-sm font-medium" style={{ color: "var(--text)" }}>
                        {formatPrice(o.total)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative group inline-block">
                          <span className="font-body text-[10px] tracking-widest uppercase px-2.5 py-1.5 flex items-center gap-1 cursor-pointer select-none"
                            style={{ backgroundColor: statusColors[o.status] || "rgba(100,100,100,0.15)", color: statusText[o.status] || "#888888" }}>
                            {o.status} <ChevronDown size={10} />
                          </span>
                          <div className="absolute top-full left-0 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-[130px] border shadow-2xl"
                            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                            {STATUS_OPTIONS.filter((s) => s !== "all" && s !== o.status).map((s) => (
                              <button key={s} onClick={() => updateStatus(o.id, s)} className="block w-full text-left px-4 py-2.5 font-body text-xs capitalize transition-colors focus:outline-none"
                                style={{ color: "var(--text-muted)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}>
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-body text-xs" style={{ color: "var(--text-faint)" }}>
                        {formattedDate}
                      </td>
                      <td className="px-5 py-4">
                        <Link href={`/admin/orders/${o.id}`} className="transition-colors inline-block" style={{ color: "var(--text-faint)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-2xl mb-1" style={{ color: "var(--text-faint)" }}>No orders found</p>
              <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Try a different filter criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
