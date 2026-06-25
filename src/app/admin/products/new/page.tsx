"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, Sparkles, ArrowLeft, X, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/types";
import toast from "react-hot-toast";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function NewProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, number>>({});
  const [form, setForm] = useState({
    name: "", artist: "", price: "", compare_at_price: "",
    subcategory: "", stock: "", description: "", medium: "",
    dimensions: "", tags: "", status: "active",
  });
  const [categories, setCategories] = useState<string[]>(["paintings"]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [variants, setVariants] = useState<any[]>([]);

  const supabase = createClient() as any;

  const set = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  // Load from AI Draft in localStorage if available
  useEffect(() => {
    const rawDraft = localStorage.getItem("ai_draft_product");
    if (rawDraft) {
      try {
        const draft = JSON.parse(rawDraft);
        setForm((f) => ({
          ...f,
          name: draft.name || "",
          description: draft.description || "",
          tags: draft.tags || "",
          subcategory: draft.subcategory || "",
          price: draft.price ? draft.price.toString() : "",
        }));
        if (draft.category) {
          setCategories([draft.category]);
        }
        if (draft.images) {
          setImages(draft.images);
        }
        if (draft.variants) {
          setVariants(draft.variants.map((v: any) => ({
            dimension: v.dimension || "",
            price: v.price ? v.price.toString() : "",
            sale_price: v.sale_price ? v.sale_price.toString() : "",
            stock: v.stock ? v.stock.toString() : "1",
            sku: v.sku || "",
            color: v.color || "",
          })));
        }
        if (draft.isFeatured !== undefined) {
          setIsFeatured(draft.isFeatured);
        }
        localStorage.removeItem("ai_draft_product");
        toast.success("AI draft details loaded!");
      } catch (err) {
        console.error("Failed to parse AI draft product from localStorage", err);
      }
    }
  }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB

    const filesArray = Array.from(files);

    // Validate all files first
    for (const file of filesArray) {
      const ext = file.name.split(".").pop()?.toLowerCase();
      if (!ext || !validExtensions.includes(ext)) {
        toast.error(`Invalid file format for "${file.name}". JPG, JPEG, PNG, WEBP are accepted.`);
        return;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`"${file.name}" exceeds the 5MB size limit.`);
        return;
      }
    }

    // Process uploads sequentially
    for (const file of filesArray) {
      const fileExt = file.name.split(".").pop()?.toLowerCase();
      const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
      const fileName = `${uniqueId}.${fileExt}`;
      const filePath = fileName;

      // Add to uploading progress state
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
        // Remove from progress state
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
          message: `Generate details for: "${form.name}" — a ${form.subcategory || categories.join("/")} piece by ${form.artist || "an Indian artisan"}. Medium: ${form.medium || "unspecified"}.
          Please return a JSON object with:
          {
            "description": "A rich product description (1-2 paragraphs detailing the story and craftsmanship)",
            "tags": ["comma", "separated", "list", "of", "relevant", "tags", "for", "this", "product"]
          }
          Return ONLY this raw JSON object. Do not include markdown code block syntax.`,
          history: [],
        }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }

      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to generate AI details");
      }

      let replyText = data.reply.trim();
      if (replyText.startsWith("```")) {
        replyText = replyText.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
      }

      try {
        const parsed = JSON.parse(replyText);
        if (parsed.description) set("description", parsed.description);
        if (parsed.tags) {
          const tagsStr = Array.isArray(parsed.tags) ? parsed.tags.join(", ") : parsed.tags;
          set("tags", tagsStr);
        }
        toast.success("AI description and tags generated");
      } catch (e) {
        // Fallback: if not valid JSON, set description to the reply
        set("description", data.reply);
        toast.success("AI description generated");
      }
    } catch (err: any) {
      toast.error(err.message || "AI generation failed");
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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          categories,
          is_featured: isFeatured,
          images,
          variants,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Failed to create product");
      }

      toast.success("Product saved!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
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
            <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Add New Product</h1>
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
                    {label("Medium")}
                    <input value={form.medium} onChange={(e) => set("medium", e.target.value)} placeholder="e.g. Oil on canvas" className={inputClass} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
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

              {/* Image upload placeholder */}
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

              {/* Product Variants */}
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-xl" style={{ color: "var(--text)" }}>Product Variants (Dimensions & Sizes)</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setVariants([...variants, { dimension: "", price: "", sale_price: "", stock: "1", sku: "", color: "" }]);
                    }}
                    className="flex items-center gap-2 px-4 py-2 font-body text-xs tracking-widest uppercase transition-all"
                    style={{ border: "1px solid var(--border)", color: "var(--gold)", backgroundColor: "var(--gold-glow)" }}
                  >
                    + Add Variant
                  </button>
                </div>

                {variants.length === 0 ? (
                  <p className="font-body text-xs text-center py-6" style={{ color: "var(--text-faint)" }}>
                    No variants added. The product will use the main price and stock details from the sidebar.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {variants.map((v, idx) => (
                      <div key={idx} className="p-4 border rounded space-y-3 relative" style={{ borderColor: "var(--border)", backgroundColor: "var(--bg-subtle)" }}>
                        <div className="flex justify-between items-center">
                          <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Variant #{idx + 1}</span>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => {
                                const list = [...variants];
                                const temp = list[idx];
                                list[idx] = list[idx - 1];
                                list[idx - 1] = temp;
                                setVariants(list);
                              }}
                              className="text-xs px-2 py-1 border hover:border-gold disabled:opacity-30"
                              style={{ borderColor: "var(--border)", color: "var(--text)" }}
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              disabled={idx === variants.length - 1}
                              onClick={() => {
                                const list = [...variants];
                                const temp = list[idx];
                                list[idx] = list[idx + 1];
                                list[idx + 1] = temp;
                                setVariants(list);
                              }}
                              className="text-xs px-2 py-1 border hover:border-gold disabled:opacity-30"
                              style={{ borderColor: "var(--border)", color: "var(--text)" }}
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setVariants(variants.filter((_, i) => i !== idx));
                              }}
                              className="text-xs px-2 py-1 border border-red-500/30 hover:bg-red-500/10 text-red-500"
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                          <div className="col-span-2">
                            {label("Size/Dimension", true)}
                            <input
                              value={v.dimension}
                              onChange={(e) => {
                                const list = [...variants];
                                list[idx].dimension = e.target.value;
                                setVariants(list);
                              }}
                              placeholder="e.g. 12x16 inches"
                              className={inputClass}
                              style={inputStyle}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              required
                            />
                          </div>
                          <div>
                            {label("Price (₹)", true)}
                            <input
                              type="number"
                              value={v.price}
                              onChange={(e) => {
                                const list = [...variants];
                                list[idx].price = e.target.value;
                                setVariants(list);
                              }}
                              placeholder="8999"
                              className={inputClass}
                              style={inputStyle}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              required
                            />
                          </div>
                          <div>
                            {label("Sale Price (₹)")}
                            <input
                              type="number"
                              value={v.sale_price}
                              onChange={(e) => {
                                const list = [...variants];
                                list[idx].sale_price = e.target.value;
                                setVariants(list);
                              }}
                              placeholder="7999"
                              className={inputClass}
                              style={inputStyle}
                              onFocus={onFocus}
                              onBlur={onBlur}
                            />
                          </div>
                          <div>
                            {label("Stock", true)}
                            <input
                              type="number"
                              value={v.stock}
                              onChange={(e) => {
                                const list = [...variants];
                                list[idx].stock = e.target.value;
                                setVariants(list);
                              }}
                              placeholder="5"
                              className={inputClass}
                              style={inputStyle}
                              onFocus={onFocus}
                              onBlur={onBlur}
                              required
                            />
                          </div>
                          <div>
                            {label("SKU / Color")}
                            <div className="flex gap-1">
                              <input
                                value={v.sku}
                                onChange={(e) => {
                                  const list = [...variants];
                                  list[idx].sku = e.target.value;
                                  setVariants(list);
                                }}
                                placeholder="SKU"
                                className={inputClass}
                                style={{ ...inputStyle, minWidth: "0" }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                              />
                              <input
                                value={v.color || ""}
                                onChange={(e) => {
                                  const list = [...variants];
                                  list[idx].color = e.target.value;
                                  setVariants(list);
                                }}
                                placeholder="Color"
                                className={inputClass}
                                style={{ ...inputStyle, minWidth: "0" }}
                                onFocus={onFocus}
                                onBlur={onBlur}
                              />
                            </div>
                          </div>
                        </div>
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

              {/* Categories */}
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

              {/* Save */}
              <button type="submit" disabled={loading} className="btn-gold w-full justify-center disabled:opacity-60">
                {loading ? "Saving…" : "Save Product"}
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
