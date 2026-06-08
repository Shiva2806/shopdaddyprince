"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, ArrowLeft, X, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface Props {
  params: { id: string };
}

export default function EditProduct({ params }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [form, setForm] = useState({
    name: "", artist: "", origin: "", price: "", compare_at_price: "",
    subcategory: "", stock: "", description: "", medium: "",
    dimensions: "", year: "", tags: "", status: "active",
  });

  const supabase = createClient() as any;

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const fetchProduct = async () => {
    try {
      setFetching(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        toast.error("Product not found");
        router.push("/admin/products");
        return;
      }

      setForm({
        name: data.name || "",
        artist: data.artist || "",
        origin: data.origin || "",
        price: data.price ? (data.price / 100).toString() : "",
        compare_at_price: data.compare_at_price ? (data.compare_at_price / 100).toString() : "",
        subcategory: data.subcategory || "",
        stock: data.stock ? data.stock.toString() : "0",
        description: data.description || "",
        medium: data.dimensions?.medium || "",
        dimensions: data.dimensions?.text || "",
        year: data.dimensions?.year || "",
        tags: data.tags ? data.tags.join(", ") : "",
        status: data.status || "active",
      });
      setCategories(data.categories || []);
      setIsFeatured(data.is_featured || false);
      setImages(data.images || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load product details");
      router.push("/admin/products");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [params.id]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    const filesArray = Array.from(files);

    // Validate files
    for (const file of filesArray) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !validExtensions.includes(ext)) {
        toast.error(`Invalid format for "${file.name}". JPG, JPEG, PNG, WEBP are accepted.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds 5MB size limit.`);
        return;
      }
    }

    // Sequentially upload files
    for (const file of filesArray) {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileName = `${uniqueId}.${fileExt}`;
      const filePath = fileName;

      setUploadingFiles((prev) => ({ ...prev, [fileName]: 0 }));

      try {
        const { data, error } = await supabase.storage
          .from("product-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
            onUploadProgress: (progress: any) => {
              const pct = Math.round((progress.loaded / progress.total) * 100);
              setUploadingFiles((prev) => ({ ...prev, [fileName]: pct }));
            },
          });

        if (error) throw error;

        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(filePath);

        setImages((prev) => [...prev, urlData.publicUrl]);
        toast.success(`"${file.name}" uploaded successfully`);
      } catch (err: any) {
        toast.error(`Failed to upload "${file.name}": ${err.message}`);
      } finally {
        setUploadingFiles((prev) => {
          const next = { ...prev };
          delete next[fileName];
          return next;
        });
      }
    }
  };

  const removeImage = async (url: string) => {
    const parts = url.split("product-images/");
    const fileName = parts[parts.length - 1];

    setImages((prev) => prev.filter((img) => img !== url));

    if (fileName) {
      try {
        await supabase.storage.from("product-images").remove([fileName]);
      } catch (err) {
        console.error("Failed to delete from storage:", err);
      }
    }
  };

  const generateDescription = async () => {
    if (!form.name || categories.length === 0) {
      toast.error("Enter product name and select at least one category first");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Write a rich product description for: "${form.name}" — a ${form.subcategory || categories.join("/")} piece by ${form.artist || "an Indian artisan"} from ${form.origin || "India"}. Medium: ${form.medium || "unspecified"}. Year: ${form.year || "contemporary"}. Return only the description paragraph, no preamble.`,
          history: [],
        }),
      });
      const data = await res.json();
      set("description", data.reply);
      toast.success("AI description generated");
    } catch {
      toast.error("AI generation failed");
    }
    setAiLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || categories.length === 0) {
      toast.error("Name, price and at least one category are required");
      return;
    }
    setLoading(true);

    try {
      // Prices conversion (Rupees -> Paise)
      const pricePaise = Math.round(parseFloat(form.price) * 100);
      const compareAtPricePaise = form.compare_at_price ? Math.round(parseFloat(form.compare_at_price) * 100) : null;
      const stockQty = form.stock ? parseInt(form.stock) : 0;

      // Tags parsing
      const tags = form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [];

      // Dimensions JSONB
      const dimensions = {
        text: form.dimensions || "",
        medium: form.medium || "",
        year: form.year || "",
      };

      const res = await fetch(`/api/products/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          artist: form.artist || null,
          origin: form.origin || null,
          price: pricePaise,
          compare_at_price: compareAtPricePaise,
          categories,
          subcategory: form.subcategory || null,
          images,
          stock: stockQty,
          status: form.status,
          is_featured: isFeatured,
          tags,
          dimensions,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to update product");
      }

      toast.success("Product updated successfully!");
      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full font-body text-sm px-4 py-3 focus:outline-none transition-all";
  const inputStyle = {
    backgroundColor: "var(--bg-subtle)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  };
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--gold)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow)";
  };
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.boxShadow = "none";
  };

  const label = (text: string, required = false) => (
    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
      {text}{required && <span style={{ color: "var(--gold)" }}> *</span>}
    </label>
  );

  const subs = categories.flatMap(cat => CATEGORIES[cat as keyof typeof CATEGORIES]?.subcategories || []);

  if (fetching) {
    return (
      <div className="glass-card flex flex-col items-center justify-center py-40 min-h-screen" style={{ backgroundColor: "var(--bg)" }}>
        <Loader2 size={36} className="animate-spin mb-3" style={{ color: "var(--gold)" }} />
        <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>Loading product details...</p>
      </div>
    );
  }

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/admin/products" className="transition-colors" style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-faint)")}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <p className="font-body text-[10px] tracking-[0.3em] uppercase" style={{ color: "var(--gold)" }}>Products</p>
            <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Edit Product</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Main details */}
            <div className="lg:col-span-2 space-y-6">

              {/* Basic info */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display text-xl mb-2" style={{ color: "var(--text)" }}>Basic Information</h2>
                <div>
                  {label("Product Name", true)}
                  <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Rajasthani Miniature" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {label("Artist / Maker")}
                    <input value={form.artist} onChange={(e) => set("artist", e.target.value)} placeholder="Artist name" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    {label("Origin")}
                    <input value={form.origin} onChange={(e) => set("origin", e.target.value)} placeholder="e.g. Jaipur, Rajasthan" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    {label("Medium")}
                    <input value={form.medium} onChange={(e) => set("medium", e.target.value)} placeholder="e.g. Oil on canvas" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div>
                    {label("Year / Period")}
                    <input value={form.year} onChange={(e) => set("year", e.target.value)} placeholder="e.g. Circa 1980s" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                  <div className="col-span-2">
                    {label("Dimensions")}
                    <input value={form.dimensions} onChange={(e) => set("dimensions", e.target.value)} placeholder="e.g. 24 × 18 cm" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl" style={{ color: "var(--text)" }}>Description</h2>
                  <button
                    type="button"
                    onClick={generateDescription}
                    disabled={aiLoading}
                    className="flex items-center gap-2 px-4 py-2 font-body text-xs tracking-widest uppercase transition-all disabled:opacity-50"
                    style={{ border: "1px solid var(--border)", color: "var(--gold)", backgroundColor: "var(--gold-glow)" }}
                  >
                    <Sparkles size={13} />
                    {aiLoading ? "Generating…" : "AI Generate"}
                  </button>
                </div>
                <textarea
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Rich product description — tell the story of this piece…"
                  rows={6}
                  className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Images */}
              <div className="glass-card p-6">
                <h2 className="font-display text-xl mb-4" style={{ color: "var(--text)" }}>Images</h2>
                <input
                  id="product-file-input"
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div
                  className="border-2 border-dashed flex flex-col items-center justify-center py-14 gap-3 cursor-pointer transition-colors"
                  style={{ borderColor: "var(--border)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  onClick={() => document.getElementById("product-file-input")?.click()}
                >
                  <Upload size={28} style={{ color: "var(--text-faint)" }} />
                  <p className="font-body text-sm" style={{ color: "var(--text-muted)" }}>
                    Click to upload images
                  </p>
                  <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>
                    PNG, JPG, JPEG, WEBP up to 5MB each · First image is the cover
                  </p>
                </div>

                {/* Uploading progress states */}
                {Object.entries(uploadingFiles).map(([name, pct]) => (
                  <div key={name} className="mt-3 p-3 bg-theme-subtle border border-theme flex items-center justify-between text-xs font-body animate-pulse">
                    <span className="truncate max-w-[200px]" style={{ color: "var(--text-muted)" }}>Uploading: {name}</span>
                    <div className="flex items-center gap-2">
                      <Loader2 size={12} className="animate-spin" style={{ color: "var(--gold)" }} />
                      <span style={{ color: "var(--gold)" }}>{pct}%</span>
                    </div>
                  </div>
                ))}

                {/* Uploaded images previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-6">
                    {images.map((url, idx) => (
                      <div key={url} className="relative group aspect-[3/4] border overflow-hidden bg-theme-card" style={{ borderColor: "var(--border)" }}>
                        <img src={url} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 font-body text-[8px] tracking-widest uppercase px-1.5 py-0.5"
                            style={{ backgroundColor: "var(--gold)", color: "#000" }}>
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(url)}
                          className="absolute top-1.5 right-1.5 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right sidebar */}
            <div className="space-y-6">

              {/* Pricing */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display text-xl mb-2" style={{ color: "var(--text)" }}>Pricing</h2>
                <div>
                  {label("Price (₹)", true)}
                  <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} placeholder="e.g. 18000" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <p className="font-body text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>Enter in rupees — stored as paise</p>
                </div>
                <div>
                  {label("Compare-at Price (₹)")}
                  <input type="number" value={form.compare_at_price} onChange={(e) => set("compare_at_price", e.target.value)} placeholder="Original price (optional)" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  {label("Stock Quantity", true)}
                  <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} placeholder="e.g. 1" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>

              {/* Category */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display text-xl mb-2" style={{ color: "var(--text)" }}>Categories</h2>
                <div className="space-y-2">
                  {Object.entries(CATEGORIES).map(([slug, info]) => {
                    const checked = categories.includes(slug);
                    return (
                      <label key={slug} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            if (checked) {
                              setCategories(categories.filter((c) => c !== slug));
                            } else {
                              setCategories([...categories, slug]);
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500 bg-theme-subtle"
                        />
                        <span className="font-body text-sm text-theme-text group-hover:text-gold transition-colors" style={{ color: "var(--text)" }}>
                          {info.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
                {subs.length > 0 && (
                  <div>
                    {label("Subcategory")}
                    <select value={form.subcategory} onChange={(e) => set("subcategory", e.target.value)} className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                      <option value="">Select subcategory</option>
                      {subs.map((s) => <option key={s} value={s.toLowerCase()}>{s}</option>)}
                    </select>
                  </div>
                )}
                <div>
                  {label("Tags")}
                  <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="e.g. gold, rajasthan, folk" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                  <p className="font-body text-[10px] mt-1" style={{ color: "var(--text-faint)" }}>Comma separated</p>
                </div>
              </div>

              {/* Status & Visibility */}
              <div className="glass-card p-6 space-y-4">
                <h2 className="font-display text-xl mb-2" style={{ color: "var(--text)" }}>Status & Visibility</h2>
                <div>
                  {label("Publish Status")}
                  <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="sold_out">Sold Out</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <label className="flex items-center gap-3 cursor-pointer group mt-4">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={() => setIsFeatured(!isFeatured)}
                    className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                  />
                  <div>
                    <span className="font-body text-sm font-semibold text-theme-text group-hover:text-gold transition-colors" style={{ color: "var(--text)" }}>
                      Featured Product
                    </span>
                    <p className="font-body text-[10px] text-theme-text-muted" style={{ color: "var(--text-faint)" }}>
                      Display this piece in the Featured Works section.
                    </p>
                  </div>
                </label>
              </div>

              {/* Actions */}
              <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-60">
                {loading ? "Saving…" : "Save Changes"}
              </button>
              <Link href="/admin/products" className="btn-ghost w-full justify-center block text-center">
                Cancel
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
