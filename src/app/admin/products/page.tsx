"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, Eye, Star, Loader2 } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils/format";
import { CATEGORIES } from "@/types";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient() as any;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;
      setProducts(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load products");
      toast.error("Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.artist?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || p.categories?.includes(catFilter);
    return matchSearch && matchCat;
  });

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update status");
      }
      
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      );
      toast.success(`Product status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update product status");
    }
  };

  const toggleFeatured = async (id: string, currentFeatured: boolean) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_featured: !currentFeatured }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update featured status");
      }
      
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, is_featured: !currentFeatured } : p))
      );
      toast.success(currentFeatured ? "Removed from featured works" : "Added to featured works");
    } catch (err: any) {
      toast.error(err.message || "Failed to update featured status");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${name}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success("Product deleted successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete product");
    }
  };

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>Inventory</p>
          <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Products</h1>
          <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {loading ? "Loading..." : `${products.length} total pieces`}
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-gold">
          <Plus size={15} /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-faint)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by title or artist…"
            className="w-full pl-9 pr-4 py-2.5 font-body text-sm focus:outline-none"
            style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text)" }}
            onFocus={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
            onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
          />
        </div>
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="font-body text-xs px-4 py-2.5 focus:outline-none"
          style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <option value="all">All Categories</option>
          {Object.entries(CATEGORIES).map(([slug, info]) => (
            <option key={slug} value={slug}>{info.label}</option>
          ))}
        </select>
      </div>

      {/* Main Panel Content */}
      {loading ? (
        <div className="glass-card flex flex-col items-center justify-center py-32">
          <Loader2 size={36} className="animate-spin mb-3" style={{ color: "var(--gold)" }} />
          <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Fetching inventory records...</p>
        </div>
      ) : error ? (
        <div className="glass-card flex flex-col items-center justify-center py-32 border" style={{ borderColor: "rgba(220,80,50,0.2)" }}>
          <p className="font-display text-2xl mb-2" style={{ color: "#E05030" }}>Failed to load inventory</p>
          <p className="font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>{error}</p>
          <button onClick={fetchProducts} className="btn-ghost text-[10px] py-2">Try Again</button>
        </div>
      ) : (
        <div className="glass-card overflow-hidden animate-fade-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Product", "Categories", "Price", "Stock", "Featured", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-faint)" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p, i) => (
                  <tr
                    key={p.id}
                    style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  >
                    {/* Product */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 overflow-hidden shrink-0 border" style={{ borderColor: "var(--border)" }}>
                          <img src={p.images?.[0] || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=80&q=60"} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="font-body text-sm font-semibold truncate max-w-[200px]" style={{ color: "var(--text)" }}>{p.name}</p>
                          <p className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>{p.subcategory || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {p.categories?.map((cat: string) => (
                          <span key={cat} className="font-body text-[9px] tracking-wider capitalize px-1.5 py-0.5"
                            style={{ backgroundColor: "var(--gold-glow)", border: "1px solid var(--border)", color: "var(--gold)" }}>
                            {cat.replace("-", " ")}
                          </span>
                        )) || <span className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>None</span>}
                      </div>
                    </td>
                    {/* Price */}
                    <td className="px-5 py-4 font-body text-sm" style={{ color: "var(--text)" }}>
                      {formatPrice(p.price)}
                    </td>
                    {/* Stock */}
                    <td className="px-5 py-4">
                      <span className="font-body text-sm" style={{ color: p.stock <= 0 ? "#E05030" : p.stock <= 2 ? "#E8A030" : "#4CAF6C" }}>
                        {p.stock}
                      </span>
                    </td>
                    {/* Featured */}
                    <td className="px-5 py-4">
                      <button onClick={() => toggleFeatured(p.id, p.is_featured)} className="flex items-center gap-1.5 focus:outline-none group">
                        <Star
                          size={15}
                          fill={p.is_featured ? "var(--gold)" : "none"}
                          className="transition-colors"
                          style={{ color: p.is_featured ? "var(--gold)" : "var(--text-faint)" }}
                        />
                        <span className="font-body text-[10px] tracking-wider" style={{ color: p.is_featured ? "var(--gold)" : "var(--text-faint)" }}>
                          {p.is_featured ? "Featured" : "Standard"}
                        </span>
                      </button>
                    </td>
                    {/* Status select */}
                    <td className="px-5 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => updateStatus(p.id, e.target.value)}
                        className="font-body text-xs px-2.5 py-1 focus:outline-none cursor-pointer border rounded-sm transition-colors"
                        style={{
                          backgroundColor: "var(--bg-card)",
                          borderColor: "var(--border)",
                          color: p.status === "active" ? "#4CAF6C" : p.status === "sold_out" ? "#E05030" : p.status === "draft" ? "#E8A030" : "var(--text-faint)"
                        }}
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="sold_out">Sold Out</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </td>
                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <Link href={`/product/${p.slug}`} target="_blank" className="transition-colors" style={{ color: "var(--text-faint)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                          <Eye size={15} />
                        </Link>
                        <Link href={`/admin/products/${p.id}`} className="transition-colors" style={{ color: "var(--text-faint)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                          <Edit2 size={15} />
                        </Link>
                        <button onClick={() => handleDelete(p.id, p.name)} className="transition-colors focus:outline-none" style={{ color: "var(--text-faint)" }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = "#E05030")}
                          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="font-display text-2xl mb-2" style={{ color: "var(--text-faint)" }}>No products found</p>
              <p className="font-body text-sm" style={{ color: "var(--text-faint)" }}>Try a different search or category filter</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
