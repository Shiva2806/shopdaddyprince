"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  Loader2, 
  FileText, 
  Layers, 
  Search, 
  RefreshCw,
  Upload,
  Save,
  Trash2,
  AlertCircle
} from "lucide-react";
import toast from "react-hot-toast";
import { createClient } from "@/lib/supabase/client";

type ActiveTab = "visual-lister" | "collection" | "seo";

export default function AdminAgent() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>("visual-lister");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  const supabase = createClient() as any;

  // Visual Lister Flow States
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [publicImageUrl, setPublicImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [price, setPrice] = useState("");

  // Visual Lister Generated & Editable States
  const [metadata, setMetadata] = useState({
    productName: "",
    category: "paintings",
    subcategory: "",
    material: "",
    style: "",
    regionOfOrigin: "",
    suggestedDimensions: "",
    tags: "",
    keywords: "",
  });

  const [narratives, setNarratives] = useState({
    productTitle: "",
    shortDescription: "",
    longDescription: "",
    heritageStory: "",
    keyHighlights: "",
  });

  const [seo, setSeo] = useState({
    seoTitle: "",
    metaDescription: "",
    keywords: "",
    slug: "",
  });

  // Collection Tab Form & Results
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    category: "paintings",
    region: "",
  });
  const [collectionResult, setCollectionResult] = useState<any | null>(null);

  // SEO Tab Form & Results
  const [seoForm, setSeoForm] = useState({
    name: "",
    category: "paintings",
    description: "",
  });
  const [seoResult, setSeoResult] = useState<any | null>(null);

  // Clipboard Copier Helper
  const copyToClipboard = (text: string, fieldId: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopiedField(null), 2000);
  };

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
              name: metadata.productName || undefined,
              dimensions: metadata.suggestedDimensions || undefined,
              material: metadata.material || undefined,
              category: metadata.category || undefined,
              region: metadata.regionOfOrigin || undefined,
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
      setMetadata({
        productName: result.detectedMetadata.productName || "",
        category: result.detectedMetadata.category || "paintings",
        subcategory: result.detectedMetadata.subcategory || "",
        material: result.detectedMetadata.material || "",
        style: result.detectedMetadata.style || "",
        regionOfOrigin: result.detectedMetadata.regionOfOrigin || "",
        suggestedDimensions: result.detectedMetadata.suggestedDimensions || "",
        tags: result.detectedMetadata.tags ? result.detectedMetadata.tags.join(", ") : "",
        keywords: result.detectedMetadata.keywords ? result.detectedMetadata.keywords.join(", ") : "",
      });

      setNarratives({
        productTitle: result.narrative.productTitle || "",
        shortDescription: result.narrative.shortDescription || "",
        longDescription: result.narrative.longDescription || "",
        heritageStory: result.narrative.heritageStory || "",
        keyHighlights: result.narrative.keyHighlights ? result.narrative.keyHighlights.join("\n") : "",
      });

      setSeo({
        seoTitle: result.seo.seoTitle || "",
        metaDescription: result.seo.metaDescription || "",
        keywords: result.seo.keywords ? result.seo.keywords.join(", ") : "",
        slug: result.seo.slugSuggestions ? result.seo.slugSuggestions[0] : "",
      });

      toast.success("AI analysis complete! Review metadata below.", { id: loadToast });
    } catch (err: any) {
      toast.error(err.message || "Product analysis failed. Check API configurations.", { id: loadToast, duration: 6000 });
    } finally {
      setLoading(false);
    }
  };

  // Step 6: Save Product
  const handleSaveProduct = async () => {
    if (!publicImageUrl) {
      toast.error("Product image is required. Please upload an image.");
      return;
    }
    if (!metadata.productName) {
      toast.error("Product Name is required. Ensure Claude generated it or write a title.");
      return;
    }
    if (!price) {
      toast.error("Price is required.");
      return;
    }

    setSaving(true);
    const saveToast = toast.loading("Saving and listing product in catalog...");

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: metadata.productName,
          price: price,
          compare_at_price: "",
          stock: "1",
          status: "active",
          categories: [metadata.category],
          subcategory: metadata.subcategory,
          images: [publicImageUrl],
          dimensions: metadata.suggestedDimensions,
          medium: metadata.material,
          year: "Contemporary",
          description: narratives.longDescription,
          tags: metadata.tags,
          artist: metadata.style,
          origin: metadata.regionOfOrigin,
          is_featured: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Failed to create product listings");

      toast.success("Product successfully saved & listed live!", { id: saveToast });
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message || "Failed to list product.", { id: saveToast });
    } finally {
      setSaving(false);
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
      setPrice("48500");

      setMetadata({
        productName: result.detectedMetadata.productName || "",
        category: result.detectedMetadata.category || "paintings",
        subcategory: result.detectedMetadata.subcategory || "",
        material: result.detectedMetadata.material || "",
        style: result.detectedMetadata.style || "",
        regionOfOrigin: result.detectedMetadata.regionOfOrigin || "",
        suggestedDimensions: result.detectedMetadata.suggestedDimensions || "",
        tags: result.detectedMetadata.tags.join(", "),
        keywords: result.detectedMetadata.keywords.join(", "),
      });

      setNarratives({
        productTitle: result.narrative.productTitle || "",
        shortDescription: result.narrative.shortDescription || "",
        longDescription: result.narrative.longDescription || "",
        heritageStory: result.narrative.heritageStory || "",
        keyHighlights: result.narrative.keyHighlights.join("\n"),
      });

      setSeo({
        seoTitle: result.seo.seoTitle || "",
        metaDescription: result.seo.metaDescription || "",
        keywords: result.seo.keywords.join(", "),
        slug: result.seo.slugSuggestions[0] || "",
      });

      toast.success("Mock verification test complete! Form populated.", { id: testToast });
    } catch (err: any) {
      toast.error(err.message || "Verification test failed.", { id: testToast });
    } finally {
      setLoading(false);
    }
  };

  // Tab 2: Collection Copywriter Generator
  const handleGenerateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collectionForm.name) {
      toast.error("Collection Name is required");
      return;
    }
    setLoading(true);
    setCollectionResult(null);

    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "collection", params: collectionForm }),
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }
      if (!res.ok || data.error) throw new Error(data.error || "Failed to generate collection");
      setCollectionResult(data.data);
      toast.success("Collection campaign narrative compiled!");
    } catch (err: any) {
      toast.error(err.message || "Generation failed.");
    } finally {
      setLoading(false);
    }
  };

  // Tab 3: Quick SEO Configurator
  const handleGenerateSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seoForm.name || !seoForm.description) {
      toast.error("Name and Description are required");
      return;
    }
    setLoading(true);
    setSeoResult(null);

    try {
      const res = await fetch("/api/admin/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "seo", params: seoForm }),
      });
      let data;
      try {
        data = await res.json();
      } catch (e) {
        throw new Error(`Server returned HTTP ${res.status}: ${res.statusText}`);
      }
      if (!res.ok || data.error) throw new Error(data.error || "Failed to generate SEO");
      setSeoResult(data.data);
      toast.success("SEO tags compiled!");
    } catch (err: any) {
      toast.error(err.message || "Generation failed.");
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
              Upload a product image to automatically identify cultural origins and draft luxury copywriting descriptions
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

        {/* Tab Selection */}
        <div className="flex border-b mb-8 overflow-x-auto" style={{ borderColor: "var(--border)" }}>
          {[
            { id: "visual-lister", label: "Image-First Product Lister", icon: Bot },
            { id: "collection", label: "Campaign Collection Builder", icon: Layers },
            { id: "seo", label: "SEO Configurator", icon: Search },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className="flex items-center gap-2 px-6 py-3 border-b-2 font-body text-xs tracking-widest uppercase transition-all whitespace-nowrap focus:outline-none"
                style={{
                  borderColor: active ? "var(--gold)" : "transparent",
                  color: active ? "var(--gold)" : "var(--text-faint)",
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* WORKFLOW 1: VISUAL PRODUCT LISTER */}
        {activeTab === "visual-lister" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-up">
            
            {/* Left Column: Image Upload, Price, and Metadata (Auto-detected) */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Step 1 & 2: Required inputs card */}
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

              {/* Step 5: Auto-detected Metadata fields (Admin reviews and edits) */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-display text-lg mb-2 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold border border-gold/20">2</span>
                  Auto-Detected Metadata
                </h3>

                <div>
                  {renderLabel("Product Name (Optional Clue)")}
                  <input
                    type="text"
                    placeholder="Enter or edit generated name"
                    value={metadata.productName}
                    onChange={(e) => setMetadata({ ...metadata, productName: e.target.value })}
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
                      value={metadata.category}
                      onChange={(e) => setMetadata({ ...metadata, category: e.target.value })}
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
                      value={metadata.subcategory}
                      onChange={(e) => setMetadata({ ...metadata, subcategory: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {renderLabel("Material / Medium")}
                    <input
                      type="text"
                      placeholder="e.g. Cast bronze, copper"
                      value={metadata.material}
                      onChange={(e) => setMetadata({ ...metadata, material: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  <div>
                    {renderLabel("Art Style / School")}
                    <input
                      type="text"
                      placeholder="e.g. Chola Style, Deccani"
                      value={metadata.style}
                      onChange={(e) => setMetadata({ ...metadata, style: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {renderLabel("Region of Origin")}
                    <input
                      type="text"
                      placeholder="e.g. Jaipur, Rajasthan"
                      value={metadata.regionOfOrigin}
                      onChange={(e) => setMetadata({ ...metadata, regionOfOrigin: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  <div>
                    {renderLabel("Suggested Dimensions")}
                    <input
                      type="text"
                      placeholder="e.g. 18 x 12 x 8 in"
                      value={metadata.suggestedDimensions}
                      onChange={(e) => setMetadata({ ...metadata, suggestedDimensions: e.target.value })}
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
                    value={metadata.tags}
                    onChange={(e) => setMetadata({ ...metadata, tags: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  {renderLabel("Keywords")}
                  <input
                    type="text"
                    placeholder="e.g. chola bronze finial, deccan bell"
                    value={metadata.keywords}
                    onChange={(e) => setMetadata({ ...metadata, keywords: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Descriptions & SEO Configs */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Product Narrative Card */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-display text-lg mb-2 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold border border-gold/20">3</span>
                  Editorial Narrative
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("Product Title")}
                    <button onClick={() => copyToClipboard(narratives.productTitle, "copy-title")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-title" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={narratives.productTitle}
                    onChange={(e) => setNarratives({ ...narratives, productTitle: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("Short Description")}
                    <button onClick={() => copyToClipboard(narratives.shortDescription, "copy-short")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-short" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={narratives.shortDescription}
                    onChange={(e) => setNarratives({ ...narratives, shortDescription: e.target.value })}
                    className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("Editorial Narrative (Long Description)")}
                    <button onClick={() => copyToClipboard(narratives.longDescription, "copy-long")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-long" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={narratives.longDescription}
                    onChange={(e) => setNarratives({ ...narratives, longDescription: e.target.value })}
                    className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("Heritage & Origin Story")}
                    <button onClick={() => copyToClipboard(narratives.heritageStory, "copy-heritage")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-heritage" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    value={narratives.heritageStory}
                    onChange={(e) => setNarratives({ ...narratives, heritageStory: e.target.value })}
                    className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("Key Highlights (Bullet Points)")}
                    <button onClick={() => copyToClipboard(narratives.keyHighlights, "copy-highlights")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-highlights" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Enter highlights, one per line"
                    value={narratives.keyHighlights}
                    onChange={(e) => setNarratives({ ...narratives, keyHighlights: e.target.value })}
                    className="w-full font-body text-xs px-4 py-3 focus:outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>
              </div>

              {/* SEO Config Card */}
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-display text-lg mb-2 flex items-center gap-2" style={{ color: "var(--text)" }}>
                  <span className="w-5 h-5 rounded-full bg-gold/10 text-gold flex items-center justify-center text-xs font-bold border border-gold/20">4</span>
                  SEO Meta Configuration
                </h3>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("SEO Title")}
                    <button onClick={() => copyToClipboard(seo.seoTitle, "copy-seotitle")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-seotitle" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={seo.seoTitle}
                    onChange={(e) => setSeo({ ...seo, seoTitle: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    {renderLabel("Meta Description")}
                    <button onClick={() => copyToClipboard(seo.metaDescription, "copy-seodesc")} className="text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors focus:outline-none">
                      {copiedField === "copy-seodesc" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={seo.metaDescription}
                    onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
                    className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    {renderLabel("SEO Keywords")}
                    <input
                      type="text"
                      value={seo.keywords}
                      onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                  <div>
                    {renderLabel("URL Slug Suggestion")}
                    <input
                      type="text"
                      value={seo.slug}
                      onChange={(e) => setSeo({ ...seo, slug: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>
              </div>

              {/* Step 6: Save Product Action Panel */}
              <div className="glass-card p-6 flex items-center justify-between gap-4 border" style={{ borderColor: "var(--border)" }}>
                <div>
                  <h4 className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>Ready to list?</h4>
                  <p className="font-body text-[10px]" style={{ color: "var(--text-muted)" }}>
                    Saves all details and lists the product in active catalog
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  disabled={saving || !publicImageUrl || !metadata.productName || !price}
                  className="btn-gold px-8 py-3.5 flex items-center gap-2 uppercase tracking-widest text-xs disabled:opacity-40 focus:outline-none"
                >
                  {saving ? (
                    <>
                      <Loader2 size={13} className="animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={13} />
                      Save & List Product
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WORKFLOW 2: COLLECTION NARRATIVE GENERATOR */}
        {activeTab === "collection" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-up">
            <div className="glass-card p-6 space-y-6">
              <form onSubmit={handleGenerateCollection} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <Layers size={16} style={{ color: "var(--gold)" }} />
                  <h3 className="font-display text-lg" style={{ color: "var(--text)" }}>Describe Your Collection</h3>
                </div>

                <div>
                  {renderLabel("Collection Name", true)}
                  <input
                    type="text"
                    required
                    placeholder="e.g. The Deccan Heritage Bronze Collection"
                    value={collectionForm.name}
                    onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {renderLabel("Main Category", true)}
                    <select
                      value={collectionForm.category}
                      onChange={(e) => setCollectionForm({ ...collectionForm, category: e.target.value })}
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
                    {renderLabel("Origin Region (Optional)")}
                    <input
                      type="text"
                      placeholder="e.g. Southern Deccan, India"
                      value={collectionForm.region}
                      onChange={(e) => setCollectionForm({ ...collectionForm, region: e.target.value })}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={onFocus}
                      onBlur={onBlur}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full justify-center mt-6 py-3 flex items-center gap-2 uppercase tracking-widest text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating Collection Story...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate Collection Campaign
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Collection Outputs */}
            <div className="space-y-6">
              {!collectionResult && !loading && (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <Bot size={36} className="mb-4" style={{ color: "var(--text-faint)" }} />
                  <h3 className="font-display text-xl mb-1" style={{ color: "var(--text)" }}>Awaiting Input</h3>
                  <p className="font-body text-xs max-w-sm" style={{ color: "var(--text-muted)" }}>
                    Enter collection parameters on the left to compose campaign copy options.
                  </p>
                </div>
              )}

              {loading && (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 size={36} className="animate-spin mb-4" style={{ color: "var(--gold)" }} />
                  <h3 className="font-display text-xl mb-1" style={{ color: "var(--text)" }}>Consulting Claude...</h3>
                </div>
              )}

              {collectionResult && !loading && (
                <div className="space-y-6 animate-fade-in">
                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Collection Introduction</span>
                      <button onClick={() => copyToClipboard(collectionResult.introduction, "c-intro")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "c-intro" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "var(--text)" }}>{collectionResult.introduction}</p>
                  </div>

                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Heritage Story & Origin</span>
                      <button onClick={() => copyToClipboard(collectionResult.heritageStory, "c-heritage")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "c-heritage" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="font-body text-sm leading-relaxed whitespace-pre-line" style={{ color: "var(--text-muted)" }}>{collectionResult.heritageStory}</p>
                  </div>

                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Formal Description</span>
                      <button onClick={() => copyToClipboard(collectionResult.description, "c-desc")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "c-desc" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{collectionResult.description}</p>
                  </div>

                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>SEO Campaign Copy</span>
                      <button onClick={() => copyToClipboard(collectionResult.seoCopy, "c-seo")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "c-seo" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="font-body text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>{collectionResult.seoCopy}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* WORKFLOW 3: QUICK SEO CONFIGURATOR */}
        {activeTab === "seo" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start animate-fade-up">
            <div className="glass-card p-6 space-y-6">
              <form onSubmit={handleGenerateSeo} className="space-y-4">
                <div className="flex items-center gap-2 mb-4 pb-2 border-b" style={{ borderColor: "var(--border)" }}>
                  <Search size={16} style={{ color: "var(--gold)" }} />
                  <h3 className="font-display text-lg" style={{ color: "var(--text)" }}>SEO Generation Criteria</h3>
                </div>

                <div>
                  {renderLabel("Product/Collection Name", true)}
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kalamkari Tree of Life Panel"
                    value={seoForm.name}
                    onChange={(e) => setSeoForm({ ...seoForm, name: e.target.value })}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <div>
                  {renderLabel("Category", true)}
                  <select
                    value={seoForm.category}
                    onChange={(e) => setSeoForm({ ...seoForm, category: e.target.value })}
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
                  {renderLabel("Item Description / Story excerpt", true)}
                  <textarea
                    required
                    rows={5}
                    placeholder="Provide description snippet to generate SEO metadata from..."
                    value={seoForm.description}
                    onChange={(e) => setSeoForm({ ...seoForm, description: e.target.value })}
                    className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                    style={inputStyle}
                    onFocus={onFocus}
                    onBlur={onBlur}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full justify-center mt-6 py-3 flex items-center gap-2 uppercase tracking-widest text-xs"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Generating SEO Configs...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} />
                      Generate SEO Configurations
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* SEO Outputs */}
            <div className="space-y-6">
              {!seoResult && !loading && (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <Bot size={36} className="mb-4" style={{ color: "var(--text-faint)" }} />
                  <h3 className="font-display text-xl mb-1" style={{ color: "var(--text)" }}>Awaiting Input</h3>
                  <p className="font-body text-xs max-w-sm" style={{ color: "var(--text-muted)" }}>
                    Enter product context on the left to configure search metadata.
                  </p>
                </div>
              )}

              {loading && (
                <div className="glass-card p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <Loader2 size={36} className="animate-spin mb-4" style={{ color: "var(--gold)" }} />
                  <h3 className="font-display text-xl mb-1" style={{ color: "var(--text)" }}>Consulting Claude...</h3>
                </div>
              )}

              {seoResult && !loading && (
                <div className="space-y-6 animate-fade-in">
                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Optimized SEO Title</span>
                      <button onClick={() => copyToClipboard(seoResult.seoTitle, "s-title")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "s-title" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="font-display text-base" style={{ color: "var(--text)" }}>{seoResult.seoTitle}</p>
                  </div>

                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Meta Description</span>
                      <button onClick={() => copyToClipboard(seoResult.metaDescription, "s-desc")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "s-desc" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <p className="font-body text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{seoResult.metaDescription}</p>
                  </div>

                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>Keywords</span>
                      <button onClick={() => copyToClipboard(seoResult.keywords.join(", "), "s-kws")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "s-kws" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {seoResult.keywords.map((kw: string, index: number) => (
                        <span key={index} className="px-2.5 py-1 text-xs font-body rounded border bg-theme-subtle border-theme" style={{ color: "var(--text-muted)" }}>
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="glass-card p-5 relative">
                    <div className="flex justify-between items-center mb-3">
                      <span className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--gold)" }}>URL Slug Suggestions</span>
                      <button onClick={() => copyToClipboard(seoResult.slugSuggestions.join("\n"), "s-slugs")} className="text-theme-faint hover:text-gold-theme transition-colors focus:outline-none">
                        {copiedField === "s-slugs" ? <Check size={12} style={{ color: "#4CAF6C" }} /> : <Copy size={12} />}
                      </button>
                    </div>
                    <div className="space-y-1.5">
                      {seoResult.slugSuggestions.map((slug: string, index: number) => (
                        <div key={index} className="p-2 border font-body text-xs rounded break-all bg-theme-subtle border-theme" style={{ color: "var(--gold)" }}>
                          {slug}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
