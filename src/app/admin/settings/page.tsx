"use client";

import { useState } from "react";
import { 
  Building2, 
  Truck, 
  CreditCard, 
  Share2, 
  Globe, 
  Save,
  Sliders
} from "lucide-react";
import toast from "react-hot-toast";

type TabType = "brand" | "shipping" | "payment" | "social" | "seo";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("brand");
  const [loading, setLoading] = useState(false);

  // Default placeholders/values
  const [brandForm, setBrandForm] = useState({
    storeName: "Daddy Prince",
    tagline: "Fine Indian Arts & Gallery",
    supportEmail: "support@shopdaddyprince.com",
    supportPhone: "+91 63012 06401",
    footerText: "© 2026 Daddy Prince. All Rights Reserved."
  });

  const [shippingForm, setShippingForm] = useState({
    baseDomesticRate: "150",
    baseIntlRate: "1500",
    freeShippingThreshold: "5000",
    shippingPartners: "BlueDart, DHL, FedEx",
  });

  const [paymentForm, setPaymentForm] = useState({
    razorpayKeyId: "rzp_test_SzE8uuduZMqsJv",
    razorpayWebhookSecret: "whsec_0hamC8CMoYl5vAdPRsoI3TAL",
    mode: "sandbox",
    currency: "INR"
  });

  const [socialForm, setSocialForm] = useState({
    instagram: "https://www.instagram.com/daddyprince.official/",
    youtube: "https://www.youtube.com/@daddyprince.official",
    pinterest: "https://www.pinterest.com/daddyprince_official/",
    facebook: "https://www.facebook.com/profile.php?id=61573133973719",
    whatsapp: "https://wa.me/916301206401"
  });

  const [seoForm, setSeoForm] = useState({
    metaTitle: "Daddy Prince | Fine Indian Arts & Gallery",
    metaDesc: "Discover rare traditional Indian artwork, handcrafted textiles, and timeless artifacts. Curated for collectors who value authenticity.",
    keywords: "indian art, handcrafted, paintings, artifacts, fine art",
    sitemapUrl: "https://shopdaddyprince.com/sitemap.xml"
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to save settings
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success("Settings saved successfully!");
    setLoading(false);
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

  const label = (text: string) => (
    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
      {text}
    </label>
  );

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: "brand", label: "Brand Settings", icon: Building2 },
    { id: "shipping", label: "Shipping Settings", icon: Truck },
    { id: "payment", label: "Payment Settings", icon: CreditCard },
    { id: "social", label: "Social Links", icon: Share2 },
    { id: "seo", label: "SEO Settings", icon: Globe },
  ];

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>
            Admin Panel
          </p>
          <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Settings</h1>
          <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Manage and configure store configurations and parameters
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Tabs */}
          <div className="w-full lg:w-64 shrink-0 flex flex-row lg:flex-col gap-1 overflow-x-auto pb-4 lg:pb-0">
            {tabs.map((t) => {
              const active = activeTab === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-3 px-4 py-3 rounded text-sm font-body tracking-wide transition-all whitespace-nowrap text-left shrink-0 focus:outline-none"
                  style={{
                    backgroundColor: active ? "var(--gold-glow)" : "transparent",
                    color: active ? "var(--gold)" : "var(--text-muted)",
                    border: active ? "1px solid rgba(199, 154, 59, 0.2)" : "1px solid transparent",
                  }}
                >
                  <Icon size={16} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Form Content */}
          <div className="flex-1">
            <form onSubmit={handleSave} className="glass-card p-8 space-y-6">
              
              {/* BRAND SETTINGS */}
              {activeTab === "brand" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-4 border-b border-theme flex items-center gap-2">
                    <Building2 size={20} className="text-gold-theme" style={{ color: "var(--gold)" }} />
                    <h2 className="font-display text-2xl text-theme">Brand Profile</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      {label("Store Name")}
                      <input
                        type="text"
                        value={brandForm.storeName}
                        onChange={(e) => setBrandForm({ ...brandForm, storeName: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div className="md:col-span-2">
                      {label("Brand Motto / Tagline")}
                      <input
                        type="text"
                        value={brandForm.tagline}
                        onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Contact / Support Email")}
                      <input
                        type="email"
                        value={brandForm.supportEmail}
                        onChange={(e) => setBrandForm({ ...brandForm, supportEmail: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Support Phone Number")}
                      <input
                        type="text"
                        value={brandForm.supportPhone}
                        onChange={(e) => setBrandForm({ ...brandForm, supportPhone: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div className="md:col-span-2">
                      {label("Footer Copyright Text")}
                      <input
                        type="text"
                        value={brandForm.footerText}
                        onChange={(e) => setBrandForm({ ...brandForm, footerText: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SHIPPING SETTINGS */}
              {activeTab === "shipping" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-4 border-b border-theme flex items-center gap-2">
                    <Truck size={20} className="text-gold-theme" style={{ color: "var(--gold)" }} />
                    <h2 className="font-display text-2xl text-theme">Shipping Configurations</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      {label("Domestic Base Rate (₹)")}
                      <input
                        type="number"
                        value={shippingForm.baseDomesticRate}
                        onChange={(e) => setShippingForm({ ...shippingForm, baseDomesticRate: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("International Base Rate (₹)")}
                      <input
                        type="number"
                        value={shippingForm.baseIntlRate}
                        onChange={(e) => setShippingForm({ ...shippingForm, baseIntlRate: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Free Shipping Threshold (₹)")}
                      <input
                        type="number"
                        value={shippingForm.freeShippingThreshold}
                        onChange={(e) => setShippingForm({ ...shippingForm, freeShippingThreshold: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Logistics Partners")}
                      <input
                        type="text"
                        value={shippingForm.shippingPartners}
                        onChange={(e) => setShippingForm({ ...shippingForm, shippingPartners: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT SETTINGS */}
              {activeTab === "payment" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-4 border-b border-theme flex items-center gap-2">
                    <CreditCard size={20} className="text-gold-theme" style={{ color: "var(--gold)" }} />
                    <h2 className="font-display text-2xl text-theme">Payment Gateway Settings</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      {label("Razorpay Key ID")}
                      <input
                        type="text"
                        value={paymentForm.razorpayKeyId}
                        onChange={(e) => setPaymentForm({ ...paymentForm, razorpayKeyId: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div className="md:col-span-2">
                      {label("Razorpay Webhook Secret")}
                      <input
                        type="password"
                        value={paymentForm.razorpayWebhookSecret}
                        onChange={(e) => setPaymentForm({ ...paymentForm, razorpayWebhookSecret: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Payment Gateway Mode")}
                      <select
                        value={paymentForm.mode}
                        onChange={(e) => setPaymentForm({ ...paymentForm, mode: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      >
                        <option value="sandbox">Sandbox (Test Mode)</option>
                        <option value="live">Live (Production)</option>
                      </select>
                    </div>
                    <div>
                      {label("Default Currency")}
                      <select
                        value={paymentForm.currency}
                        onChange={(e) => setPaymentForm({ ...paymentForm, currency: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      >
                        <option value="INR">INR (₹) Indian Rupee</option>
                        <option value="USD">USD ($) United States Dollar</option>
                        <option value="EUR">EUR (€) Euro</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* SOCIAL LINKS */}
              {activeTab === "social" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-4 border-b border-theme flex items-center gap-2">
                    <Share2 size={20} className="text-gold-theme" style={{ color: "var(--gold)" }} />
                    <h2 className="font-display text-2xl text-theme">Social Media Channels</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      {label("Instagram Account")}
                      <input
                        type="text"
                        value={socialForm.instagram}
                        onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("YouTube Channel")}
                      <input
                        type="text"
                        value={socialForm.youtube}
                        onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Pinterest Profile")}
                      <input
                        type="text"
                        value={socialForm.pinterest}
                        onChange={(e) => setSocialForm({ ...socialForm, pinterest: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Facebook Page")}
                      <input
                        type="text"
                        value={socialForm.facebook}
                        onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("WhatsApp API Contact Link")}
                      <input
                        type="text"
                        value={socialForm.whatsapp}
                        onChange={(e) => setSocialForm({ ...socialForm, whatsapp: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SEO SETTINGS */}
              {activeTab === "seo" && (
                <div className="space-y-6 animate-fade-in">
                  <div className="pb-4 border-b border-theme flex items-center gap-2">
                    <Globe size={20} className="text-gold-theme" style={{ color: "var(--gold)" }} />
                    <h2 className="font-display text-2xl text-theme">SEO Configuration</h2>
                  </div>
                  <div className="space-y-4">
                    <div>
                      {label("Meta Title Prefix / Site Title")}
                      <input
                        type="text"
                        value={seoForm.metaTitle}
                        onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Default Meta Description")}
                      <textarea
                        value={seoForm.metaDesc}
                        onChange={(e) => setSeoForm({ ...seoForm, metaDesc: e.target.value })}
                        rows={4}
                        className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all resize-none"
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Target Keywords (Comma Separated)")}
                      <input
                        type="text"
                        value={seoForm.keywords}
                        onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                    <div>
                      {label("Sitemap URL")}
                      <input
                        type="text"
                        value={seoForm.sitemapUrl}
                        onChange={(e) => setSeoForm({ ...seoForm, sitemapUrl: e.target.value })}
                        className={inputClass}
                        style={inputStyle}
                        onFocus={onFocus}
                        onBlur={onBlur}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-4 border-t border-theme flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold px-8 py-3 flex items-center gap-2 disabled:opacity-60 focus:outline-none"
                >
                  <Save size={14} />
                  {loading ? "Saving Settings…" : "Save Configurations"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
