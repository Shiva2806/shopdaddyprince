"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, 
  Sparkles, 
  Loader2, 
  RefreshCw,
  Upload,
  ArrowRight,
  Trash2
} from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

export default function AdminAgent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [transferring, setTransferring] = useState(false);
  
  const supabase = createClient() as any;

  // Visual Lister Flow States
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [publicImageUrl, setPublicImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [price, setPrice] = useState("");

  // Visual Lister Aligned States
  const [generatedProduct, setGeneratedProduct] = useState({
    productName: "",
    description: "",
    tags: "",
    category: "paintings",
    subcategory: "",
    variants: [] as {
      dimension: string;
      price: string;
      sale_price?: string;
      stock: string;
      color?: string;
      sku?: string;
    }[],
    isFeatured: false,
  });

  // Image Upload File Handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const validExtensions = ["jpg", "jpeg", "png", "webp"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !validExtensions.includes(ext)) {
      toast.error("Invalid format. Only JPG, JPEG, PNG, and WEBP are accepted.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image file size exceeds the 5MB limit.");
      return;
    }

    // Convert file locally to base64 for Vision API
    const reader = new FileReader();
    reader.onloadend = () => {
      setBase64Image(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage for DB URL reference
    setUploading(true);
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const fileName = `${uniqueId}.${ext}`;

    try {
      const { data, error } = await supabase.storage
        .from("product-images")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(fileName);

      setPublicImageUrl(urlData.publicUrl);
      toast.success("Product image uploaded successfully");
    } catch (err: any) {
      toast.error(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const clearImage = () => {
    setBase64Image(null);
    setPublicImageUrl(null);
  };

  // Step 3: Analyze Product
  const handleAnalyzeProduct = async () => {
    if (!base64Image) {
      toast.error("Please upload an image first.");
      return;
    }
    if (!price) {
      toast.error("Please enter the product price.");
      return;
    }

    setLoading(true);
    const loadToast = toast.loading("Analyzing heritage item with Claude Vision...");

    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "vision",
          params: {
            image: base64Image,
            price,
            optionalParams: {
              name: generatedProduct.productName || undefined,
              category: generatedProduct.category || undefined,
            }
          }
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }
      if (!res.ok || data.error) throw new Error(data.error || "Failed to analyze product");

      const result = data.data;

      // Populate Editable Fields
      setGeneratedProduct({
        productName: result.productName || "",
        description: result.description || "",
        tags: result.tags ? result.tags.join(", ") : "",
        category: result.category || "paintings",
        subcategory: result.subcategory || "",
        variants: result.variants || [],
        isFeatured: !!result.isFeatured,
      });

      if (result.priceSuggestion) {
        setPrice(result.priceSuggestion.toString());
      }

      toast.success("AI analysis complete! Review product data below.", { id: loadToast });
    } catch (err: any) {
      toast.error(err.message || "Product analysis failed. Check API configurations.", { id: loadToast, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  // Transfer generated product draft to products new page
  const handleSendToProductForm = () => {
    if (!publicImageUrl) {
      toast.error("Product image is required. Please upload an image.");
      return;
    }
    if (!generatedProduct.productName) {
      toast.error("Product Name is required.");
      return;
    }
    if (!price) {
      toast.error("Price is required.");
      return;
    }

    setTransferring(true);
    try {
      const draftData = {
        name: generatedProduct.productName,
        description: generatedProduct.description,
        tags: generatedProduct.tags,
        category: generatedProduct.category,
        subcategory: generatedProduct.subcategory,
        price: price,
        images: [publicImageUrl],
        variants: generatedProduct.variants,
        isFeatured: generatedProduct.isFeatured,
      };

      localStorage.setItem("ai_draft_product", JSON.stringify(draftData));
      toast.success("Draft sent to form!");
      router.push("/admin/products/new");
    } catch (err: any) {
      toast.error("Failed to transfer draft details.");
    } finally {
      setTransferring(false);
    }
  };

  // Test Claude integration with pre-filled mock response
  const handleRunTest = async () => {
    setLoading(true);
    const testToast = toast.loading("Testing connection structure...");

    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "test" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Test integration failed");

      const result = data.data;
      setBase64Image("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==");
      setPublicImageUrl("https://shopdaddyprince.com/banner.png");

      setGeneratedProduct({
        productName: result.productName || "",
        description: result.description || "",
        tags: result.tags ? result.tags.join(", ") : "",
        category: result.category || "paintings",
        subcategory: result.subcategory || "",
        variants: result.variants || [],
        isFeatured: !!result.isFeatured,
      });

      if (result.priceSuggestion) {
        setPrice(result.priceSuggestion.toString());
      }

      toast.success("Mock verification test complete! Form populated.", { id: testToast });
    } catch (err: any) {
      toast.error(err.message || "Verification test failed.", { id: testToast });
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

  const renderLabel = (text: string, required = false) => (
    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
      {text}{required && <span style={{ color: "var(--gold)" }}> *</span>}
    </label>
  );

  const categoriesList = [
    { value: "paintings", label: "Paintings" },
    { value: "home-decor", label: "Home Decor" },
    { value: "regional-arts", label: "Regional Arts" },
    { value: "brass", label: "Brass Artifacts" },
    { value: "vintage", label: "Vintage Collectibles" },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 animate-fade-in" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 flex items-center justify-center border" style={{ backgroundColor: "var(--gold-glow)", borderColor: "rgba(212, 175, 55, 0.2)" }}>
                <Bot size={16} style={{ color: "var(--gold)" }} />
              </div>
              <h1 className="font-display text-3xl" style={{ color: "var(--text)" }}>AI Copywriter & Vision Agent</h1>
            </div>
            <p className="font-body text-xs text-theme-muted" style={{ color: "var(--text-muted)", marginLeft: "44px" }}>
              Upload a product image to identify details and prefill your product catalog parameters
            </p>
          </div>

          <button
            onClick={handleRunTest}
            disabled={loading}
            className="btn-ghost px-5 py-2.5 font-body text-xs tracking-widest uppercase flex items-center gap-2"
          >
            {loading ? <Loader2 size={13} className="animate-spin" /> : <RefreshCw size={13} />}
            Load Test Ramayana Case
          </button>
        </div>

        {/* WORKFLOW: VISUAL PRODUCT LISTER */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-up">
          
          {/* Left Column: Image Upload, Price, and Metadata (Auto-detected) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Setup core details */}
            <div className="glass-card p-6 space-y-5">
              <h3 className="font-display text-lg mb-3 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold border border-gold/20">1</span>
                Setup Core Details
              </h3>

              {/* Image upload */}
              <div>
                {renderLabel("Product Image", true)}
                <input
                  id="agent-image-uploader"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />

                {base64Image ? (
                  <div className="relative border overflow-hidden aspect-[4/3] rounded bg-theme-subtle" style={{ borderColor: "var(--border)" }}>
                    <img src={base64Image} alt="Uploaded Item Preview" className="w-full h-full object-contain" />
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2.5 right-2.5 p-2 bg-black/80 text-white rounded-full hover:bg-red-600 transition-colors focus:outline-none"
                      title="Remove Image"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => document.getElementById("agent-image-uploader")?.click()}
                    className="border-2 border-dashed flex flex-col items-center justify-center py-10 gap-3 cursor-pointer rounded transition-colors bg-theme-subtle/30"
                    style={{ borderColor: "var(--border)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--gold)")}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  >
                    {uploading ? (
                      <Loader2 size={24} className="animate-spin text-gold" style={{ color: "var(--gold)" }} />
                    ) : (
                      <Upload size={24} style={{ color: "var(--text-faint)" }} />
                    )}
                    <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                      {uploading ? "Uploading image..." : "Upload item photo"}
                    </p>
                    <p className="font-body text-[9px]" style={{ color: "var(--text-faint)" }}>
                      Supports JPEG, PNG, WEBP up to 5MB
                    </p>
                  </div>
                )}
              </div>

              {/* Price input */}
              <div>
                {renderLabel("Price (₹)", true)}
                <div className="relative flex items-center">
                  <span className="absolute left-4 font-body text-sm text-theme-muted" style={{ color: "var(--text-muted)" }}>₹</span>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 18500"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className={inputClass + " pl-8"}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {/* Analyze Trigger */}
              <button
                type="button"
                onClick={handleAnalyzeProduct}
                disabled={loading || !base64Image || !price}
                className="btn-gold w-full justify-center py-3 flex items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-40"
              >
                {loading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Analyzing with Claude Vision...
                  </>
                ) : (
                  <>
                    <Sparkles size={13} />
                    Analyze Product
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Descriptions & Review Generated Fields */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Generated & Editable product information */}
            <div className="glass-card p-6 space-y-4">
              <h3 className="font-display text-lg mb-2 flex items-center gap-2" style={{ color: "var(--text)" }}>
                <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold border border-gold/20">2</span>
                Review Generated Details
              </h3>

              <div>
                {renderLabel("Product Name")}
                <input
                  type="text"
                  placeholder="Review generated product name"
                  value={generatedProduct.productName}
                  onChange={(e) => setGeneratedProduct({ ...generatedProduct, productName: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  {renderLabel("Category")}
                  <select
                    value={generatedProduct.category}
                    onChange={(e) => setGeneratedProduct({ ...generatedProduct, category: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  >
                    {categoriesList.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  {renderLabel("Subcategory")}
                  <input
                    type="text"
                    placeholder="e.g. Srikalahasti, Dhokra"
                    value={generatedProduct.subcategory}
                    onChange={(e) => setGeneratedProduct({ ...generatedProduct, subcategory: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              <div>
                {renderLabel("Product Tags (Comma Separated)")}
                <input
                  type="text"
                  placeholder="e.g. bronze, idol, worship"
                  value={generatedProduct.tags}
                  onChange={(e) => setGeneratedProduct({ ...generatedProduct, tags: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              <div>
                {renderLabel("Product Description")}
                <textarea
                  rows={6}
                  value={generatedProduct.description}
                  onChange={(e) => setGeneratedProduct({ ...generatedProduct, description: e.target.value })}
                  className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>

              {/* Variant suggestions */}
              {generatedProduct.variants && generatedProduct.variants.length > 0 && (
                <div>
                  {renderLabel("Suggested Variants")}
                  <div className="border rounded overflow-hidden" style={{ borderColor: "var(--border)" }}>
                    <table className="w-full font-body text-xs text-left" style={{ color: "var(--text-muted)" }}>
                      <thead style={{ backgroundColor: "var(--bg-subtle)" }}>
                        <tr className="border-b" style={{ borderColor: "var(--border)" }}>
                          <th className="px-4 py-2">Size/Dimension</th>
                          <th className="px-4 py-2">Price</th>
                          <th className="px-4 py-2">Stock</th>
                          <th className="px-4 py-2">Color</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {generatedProduct.variants.map((v, i) => (
                          <tr key={i}>
                            <td className="px-4 py-2">{v.dimension}</td>
                            <td className="px-4 py-2">₹{v.price}</td>
                            <td className="px-4 py-2">{v.stock}</td>
                            <td className="px-4 py-2">{v.color || "None"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Featured Recommendation */}
              <label className="flex items-center gap-3 cursor-pointer group mt-4">
                <input
                  type="checkbox"
                  checked={generatedProduct.isFeatured}
                  onChange={(e) => setGeneratedProduct({ ...generatedProduct, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-gold-500 focus:ring-gold-500"
                />
                <div>
                  <span className="font-body text-sm font-semibold text-theme-text group-hover:text-gold transition-colors" style={{ color: "var(--text)" }}>
                    Featured Product Recommendation
                  </span>
                  <p className="font-body text-[10px] text-theme-text-muted" style={{ color: "var(--text-faint)" }}>
                    Suggests putting this artwork in the Featured collections marquee.
                  </p>
                </div>
              </label>
            </div>

            {/* Action Panel */}
            <div className="glass-card p-6 flex items-center justify-between gap-4 border" style={{ borderColor: "var(--border)" }}>
              <div>
                <h4 className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>Ready to list?</h4>
                <p className="font-body text-[10px]" style={{ color: "var(--text-muted)" }}>
                  Send details directly to the Product Management Form to complete editing.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSendToProductForm}
                disabled={transferring || !publicImageUrl || !generatedProduct.productName || !price}
                className="btn-gold px-8 py-3.5 flex items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-40 focus:outline-none"
              >
                {transferring ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <span>Send to Product Form</span>
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
