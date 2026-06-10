import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, Clock, Plus, Edit, UserPlus, Trash2 } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice, formatOrderId } from "@/utils/format";
import { getRecentActivities } from "@/utils/activity";

const statusColors: Record<string, string> = {
  pending:    "rgba(200,150,30,0.15)",
  paid:       "rgba(76,175,108,0.15)",
  processing: "rgba(60,120,200,0.15)",
  shipped:    "rgba(140,80,200,0.15)",
  delivered:  "rgba(76,175,108,0.2)",
  cancelled:  "rgba(220,80,50,0.15)",
  refunded:   "rgba(100,100,100,0.15)",
};

const statusText: Record<string, string> = {
  pending: "#E8A030", paid: "#4CAF6C", processing: "#4080CC",
  shipped: "#9050CC", delivered: "#4CAF6C", cancelled: "#E05030", refunded: "#888888",
};

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-IN", { dateStyle: "short" });
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const supabase = createAdminClient() as any;

  // 1. Total products count
  const { count: totalProducts, error: prodErr } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true });

  // 2. Total orders count
  const { count: totalOrders, error: ordErr } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true });

  // 3. Customers count (role = 'customer')
  const { count: totalCustomers, error: custErr } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  // 4. Revenue calculation (sum total from non-pending, non-cancelled, non-refunded orders)
  const { data: revenueData, error: revErr } = await supabase
    .from("orders")
    .select("total")
    .in("status", ["paid", "processing", "shipped", "delivered"]);

  const totalRevenuePaise = (revenueData || []).reduce((sum: number, o: any) => sum + o.total, 0);

  // 5. Recent orders list
  const { data: recentOrders, error: recErr } = await supabase
    .from("orders")
    .select("id, total, status, created_at, shipping_address, items")
    .order("created_at", { ascending: false })
    .limit(5);

  // 6. Recent activities
  const recentActivities = await getRecentActivities();

  const stats = [
    { label: "Total Products", value: (totalProducts ?? 0).toString(), change: "Live inventory", icon: Package },
    { label: "Total Orders", value: (totalOrders ?? 0).toString(), change: "Placed by collectors", icon: ShoppingCart },
    { label: "Customers", value: (totalCustomers ?? 0).toString(), change: "Registered collectors", icon: Users },
    { label: "Revenue", value: formatPrice(totalRevenuePaise), change: "Paid transaction volume", icon: TrendingUp },
  ];

  const errors = prodErr || ordErr || custErr || revErr || recErr;

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="mb-10">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>
          Admin Panel
        </p>
        <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Dashboard</h1>
        <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          Welcome back, {session.user?.name?.split(" ")[0]}
        </p>
      </div>

      {errors && (
        <div className="mb-6 p-4 border" style={{ borderColor: "rgba(220,80,50,0.3)", backgroundColor: "rgba(220,80,50,0.05)" }}>
          <p className="font-body text-xs" style={{ color: "#E05030" }}>
            Warning: Database query failed. Stats may be incomplete.
          </p>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="glass-card p-6 animate-fade-up">
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 flex items-center justify-center"
                style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--border)" }}
              >
                <s.icon size={18} style={{ color: "var(--gold)" }} />
              </div>
              <ArrowUpRight size={14} style={{ color: "var(--text-faint)" }} />
            </div>
            <p className="font-display text-3xl mb-1 text-gold-shimmer">{s.value}</p>
            <p className="font-body text-xs mb-1" style={{ color: "var(--text)" }}>{s.label}</p>
            <p className="font-body text-[10px]" style={{ color: "var(--text-muted)" }}>{s.change}</p>
          </div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Recent orders */}
        <div className="lg:col-span-2 glass-card overflow-hidden flex flex-col justify-between animate-fade-up delay-100">
          <div>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="font-display text-2xl" style={{ color: "var(--text)" }}>Recent Orders</h2>
              <a href="/admin/orders" className="font-body text-xs tracking-widest uppercase transition-colors" style={{ color: "var(--gold)" }}>
                View All →
              </a>
            </div>
            <div className="overflow-x-auto">
              {(!recentOrders || recentOrders.length === 0) ? (
                <div className="py-16 text-center">
                  <p className="font-display text-lg mb-1" style={{ color: "var(--text-muted)" }}>No orders found</p>
                  <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Customer purchases will appear here</p>
                </div>
              ) : (
                <table className="w-full font-body text-sm">
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)" }}>
                      {["Order ID", "Customer", "Product", "Amount", "Status", "Date"].map((h) => (
                        <th key={h} className="px-6 py-3 text-left font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-faint)" }}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((o: any, i: number) => {
                      const customerName = o.shipping_address?.full_name || "Guest Collector";
                      const productName = o.items?.[0]?.product_name || "N/A";
                      const extraItems = o.items?.length > 1 ? ` + ${o.items.length - 1} more` : "";

                      return (
                        <tr
                          key={o.id}
                          style={{ borderBottom: i < recentOrders.length - 1 ? "1px solid var(--border)" : "none" }}
                        >
                          <td className="px-6 py-4 font-body text-xs" style={{ color: "var(--gold)" }}>
                            {formatOrderId(o.id)}
                          </td>
                          <td className="px-6 py-4" style={{ color: "var(--text)" }}>
                            {customerName}
                          </td>
                          <td className="px-6 py-4 font-body text-xs" style={{ color: "var(--text-muted)" }}>
                            {productName}{extraItems}
                          </td>
                          <td className="px-6 py-4 font-medium" style={{ color: "var(--text)" }}>
                            {formatPrice(o.total)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className="font-body text-[10px] tracking-widest uppercase px-2.5 py-1"
                              style={{ backgroundColor: statusColors[o.status] || "rgba(100,100,100,0.15)", color: statusText[o.status] || "#888888" }}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-body text-xs flex items-center gap-1.5" style={{ color: "var(--text-faint)" }}>
                            <Clock size={11} />
                            {new Date(o.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card flex flex-col p-6 animate-fade-up delay-150 justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4" style={{ borderBottom: "1px solid var(--border)" }}>
              <h2 className="font-display text-2xl" style={{ color: "var(--text)" }}>Recent Activity</h2>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[380px] pr-1">
              {(!recentActivities || recentActivities.length === 0) ? (
                <div className="py-16 text-center flex flex-col items-center justify-center">
                  <p className="font-display text-lg mb-1" style={{ color: "var(--text-muted)" }}>No activities recorded</p>
                  <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Operations will appear here</p>
                </div>
              ) : (
                recentActivities.map((act) => {
                  let Icon = Package;
                  let iconColor = "var(--gold)";
                  let iconBg = "var(--gold-glow)";

                  if (act.type === "product_added") {
                    Icon = Plus;
                    iconColor = "#C79A3B";
                    iconBg = "rgba(199, 154, 59, 0.12)";
                  } else if (act.type === "product_updated") {
                    Icon = Edit;
                    iconColor = "#E8A030";
                    iconBg = "rgba(232, 160, 48, 0.12)";
                  } else if (act.type === "order_received") {
                    Icon = ShoppingCart;
                    iconColor = "#4CAF6C";
                    iconBg = "rgba(76, 175, 108, 0.12)";
                  } else if (act.type === "customer_registered") {
                    Icon = UserPlus;
                    iconColor = "#4080CC";
                    iconBg = "rgba(64, 128, 204, 0.12)";
                  } else if (act.type === "product_deleted") {
                    Icon = Trash2;
                    iconColor = "#E05030";
                    iconBg = "rgba(224, 80, 48, 0.12)";
                  }

                  return (
                    <div key={act.id} className="flex items-start gap-3.5 p-3 rounded hover:bg-white/[0.02] transition-colors">
                      <div
                        className="w-8 h-8 rounded-sm flex items-center justify-center shrink-0 border"
                        style={{
                          backgroundColor: iconBg,
                          borderColor: "rgba(212, 175, 55, 0.1)",
                        }}
                      >
                        <Icon size={14} style={{ color: iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-semibold" style={{ color: "var(--text)" }}>
                          {act.title}
                        </p>
                        <p className="font-body text-[11px] mt-0.5" style={{ color: "var(--text-muted)", lineBreak: "anywhere" }}>
                          {act.description}
                        </p>
                        <span className="font-body text-[9px] tracking-wider block mt-1 flex items-center gap-1" style={{ color: "var(--text-faint)" }}>
                          <Clock size={9} />
                          {formatRelativeTime(act.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-up delay-200">
        {[
          { label: "Add New Product", href: "/admin/products/new", desc: "List a new piece in the store" },
          { label: "Open AI Agent", href: "/admin/agent", desc: "Get help with product descriptions" },
          { label: "View Customers", href: "/admin/customers", desc: "Browse all registered collectors" },
        ].map((a) => (
          <a
            key={a.label}
            href={a.href}
            className="glass-card p-5 group transition-all duration-300 block"
          >
            <p className="font-display text-lg mb-1 group-hover:text-gold-theme transition-colors" style={{ color: "var(--text)" }}>
              {a.label}
            </p>
            <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
