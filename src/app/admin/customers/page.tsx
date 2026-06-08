"use client";

import { useState, useEffect } from "react";
import { Search, Mail, ShoppingBag, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

function formatPrice(p: number) {
  return "₹" + (p / 100).toLocaleString("en-IN");
}

export default function AdminCustomers() {
  const [search, setSearch] = useState("");
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/customers");
      if (!res.ok) {
        throw new Error(`Failed to fetch customers: ${res.statusText}`);
      }
      const json = await res.json();
      if (json.error) {
        throw new Error(json.error);
      }
      setCustomers(json.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load customers");
      toast.error("Error loading customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="mb-8">
        <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>Community</p>
        <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Customers</h1>
        <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
          {loading ? "Loading..." : `${customers.length} registered collectors`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total Customers", value: customers.length },
          { label: "Total Orders", value: customers.reduce((s, c) => s + c.orders, 0) },
          { label: "Total Revenue", value: formatPrice(customers.reduce((s, c) => s + c.spent, 0)) },
        ].map((s) => (
          <div key={s.label} className="glass-card p-5 text-center">
            <p className="font-display text-3xl mb-1" style={{ color: "var(--text)" }}>{s.value}</p>
            <p className="font-body text-xs tracking-wider" style={{ color: "var(--text-muted)" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…"
          className="w-full pl-9 pr-4 py-2.5 font-body text-sm focus:outline-none"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")} />
      </div>

      {/* Table & main states */}
      {loading ? (
        <div className="glass-card flex flex-col items-center justify-center py-32">
          <Loader2 size={36} className="animate-spin mb-3" style={{ color: "var(--gold)" }} />
          <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Fetching registered collectors...</p>
        </div>
      ) : error ? (
        <div className="glass-card flex flex-col items-center justify-center py-32 border" style={{ borderColor: "rgba(220,80,50,0.2)" }}>
          <p className="font-display text-2xl mb-2" style={{ color: "#E05030" }}>Failed to load customers</p>
          <p className="font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>{error}</p>
          <button onClick={fetchCustomers} className="btn-ghost text-[10px] py-2">Try Again</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Customer", "Location", "Orders", "Total Spent", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-faint)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-medium shrink-0"
                        style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--border)", color: "var(--gold)" }}>
                        {c.avatar}
                      </div>
                      <div>
                        <p className="font-body text-sm" style={{ color: "var(--text)" }}>{c.name}</p>
                        <p className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>{c.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-sm" style={{ color: "var(--text-muted)" }}>{c.city}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <ShoppingBag size={12} style={{ color: "var(--text-faint)" }} />
                      <span className="font-body text-sm" style={{ color: "var(--text)" }}>{c.orders}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-body text-sm font-medium" style={{ color: "var(--gold)" }}>{formatPrice(c.spent)}</td>
                  <td className="px-5 py-4 font-body text-xs" style={{ color: "var(--text-faint)" }}>{c.joined}</td>
                  <td className="px-5 py-4">
                    <a href={`mailto:${c.email}`} className="flex items-center gap-1.5 transition-colors font-body text-xs"
                      style={{ color: "var(--text-faint)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                      <Mail size={13} /> Email
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-2xl mb-2" style={{ color: "var(--text-faint)" }}>No customers found</p>
              <p className="font-body text-sm" style={{ color: "var(--text-faint)" }}>Try a different search criteria</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
