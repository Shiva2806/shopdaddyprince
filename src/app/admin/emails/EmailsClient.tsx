"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Mail, Eye, Database, RefreshCw, Send, CheckCircle, AlertTriangle, Clock, Search, ExternalLink } from "lucide-react";
import { formatPrice } from "@/utils/format";
import { 
  getWelcomeEmail, 
  getNewsletterWelcomeEmail, 
  getOrderConfirmationEmail, 
  getOrderShippedEmail, 
  getOrderDeliveredEmail, 
  getAbandonedCartEmail, 
  getCollectionBroadcastEmail,
  getNewsletterCampaignEmail
} from "@/utils/emailTemplates";

interface Product {
  id: string;
  name: string;
  price: number;
  slug: string;
  images: string[];
}

interface EmailLog {
  id: string;
  recipient_email: string;
  recipient_name: string | null;
  email_type: string;
  subject: string;
  resend_id: string | null;
  status: string;
  metadata: any;
  error: string | null;
  created_at: string;
}

interface EmailsClientProps {
  initialProducts: Product[];
  initialLogs: EmailLog[];
  newsletterCount: number;
  registeredCount: number;
}

type Tab = "campaigns" | "previews" | "logs";

// Mock Data for previews
const mockOrder = {
  id: "order-9a2f-e813b0ccf48f",
  subtotal: 599800,
  shipping: 9900,
  total: 609700,
  items: [
    {
      product_name: "Kamadhenu Sacred Cow Head Wall Mask",
      selected_dimension: "12x15 inches",
      quantity: 1,
      price: 299900,
      product_image: "",
    },
    {
      product_name: "Dhyana Mudra Buddha Meditating Statue",
      selected_dimension: "Standard",
      quantity: 1,
      price: 299900,
      product_image: "",
    }
  ],
  shipping_address: {
    full_name: "Dev Patron",
    line1: "123 Heritage Lane",
    line2: "Art District",
    city: "Jaipur",
    state: "Rajasthan",
    pincode: "302001",
    phone: "+91 98765 43210"
  }
};

const mockProducts = [
  {
    name: "Kamadhenu Sacred Cow Head Wall Mask",
    price: 299900,
    slug: "kamadhenu-sacred-cow-head-wall-mask-pattachitra-painted-ritual-art-ji64",
    images: []
  },
  {
    name: "Dhyana Mudra Buddha Meditating Statue",
    price: 299900,
    slug: "dhyana-mudra-buddha-cobalt-ivory-meditation-statue-m5x6",
    images: []
  }
];

export default function EmailsClient({
  initialProducts,
  initialLogs,
  newsletterCount,
  registeredCount,
}: EmailsClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");
  const [logs, setLogs] = useState<EmailLog[]>(initialLogs);
  const [logsLoading, setLogsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Broadcast state
  const [broadcastType, setBroadcastType] = useState<"newsletter" | "collection">("newsletter");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [sending, setSending] = useState(false);

  // Preview state
  const [selectedTemplate, setSelectedTemplate] = useState<string>("welcome");
  const [previewHtml, setPreviewHtml] = useState("");

  // Update preview when template or text changes
  useEffect(() => {
    let htmlContent = "";
    switch (selectedTemplate) {
      case "welcome":
        htmlContent = getWelcomeEmail("Dev Patron", "dev@example.com").html;
        break;
      case "newsletter_welcome":
        htmlContent = getNewsletterWelcomeEmail("dev@example.com").html;
        break;
      case "order_confirmation":
        htmlContent = getOrderConfirmationEmail(mockOrder, "Dev Patron", "dev@example.com").html;
        break;
      case "order_shipped":
        htmlContent = getOrderShippedEmail(mockOrder, "Dev Patron", "dev@example.com").html;
        break;
      case "order_delivered":
        htmlContent = getOrderDeliveredEmail(mockOrder, "Dev Patron", "dev@example.com").html;
        break;
      case "abandoned_cart":
        htmlContent = getAbandonedCartEmail(mockOrder.items, "Dev Patron", "dev@example.com").html;
        break;
      case "collection_broadcast":
        const productsToAnnounce = initialProducts.slice(0, 2).map(p => ({
          name: p.name,
          price: p.price,
          slug: p.slug,
          images: p.images
        }));
        htmlContent = getCollectionBroadcastEmail(
          title || "The Rajasthan Collection",
          description || "A curated assembly of hand-carved jharokhas and miniature equestrian paintings from the desert lands of Jaipur.",
          productsToAnnounce.length > 0 ? productsToAnnounce : mockProducts,
          "dev@example.com"
        ).html;
        break;
      case "campaign":
        const formattedContent = content
          ? content.split("\n\n").map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, "<br />")}</p>`).join("")
          : "<p>Start writing your custom newsletter content in the Campaigns tab to preview it here.</p>";
        htmlContent = getNewsletterCampaignEmail(
          subject || "Collector's News & Discoveries",
          formattedContent,
          "dev@example.com"
        ).html;
        break;
      default:
        htmlContent = "Select a template";
    }
    setPreviewHtml(htmlContent);
  }, [selectedTemplate, subject, content, title, description, initialProducts]);

  const refreshLogs = async () => {
    setLogsLoading(true);
    try {
      const res = await fetch("/api/admin/emails/logs");
      const data = await res.json();
      if (res.ok && data.data) {
        setLogs(data.data);
      } else {
        toast.error("Failed to load logs");
      }
    } catch (e) {
      toast.error("Failed to fetch logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const handleProductSelect = (id: string) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter((pId) => pId !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const toastId = toast.loading("Preparing broadcast...");
    try {
      const payload: any = { type: broadcastType };
      if (broadcastType === "newsletter") {
        payload.subject = subject;
        // Format newline characters into simple HTML paragraphs
        payload.content = content.split("\n\n").map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, "<br />")}</p>`).join("");
      } else {
        payload.title = title;
        payload.description = description;
        payload.product_ids = selectedProductIds;
      }

      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        toast.error(data.error || "Failed to dispatch broadcast.", { id: toastId });
      } else {
        toast.success(`Sent to ${data.successCount} patrons successfully! (${data.failCount} failed)`, { id: toastId, duration: 6000 });
        // Clear forms
        setSubject("");
        setContent("");
        setTitle("");
        setDescription("");
        setSelectedProductIds([]);
        refreshLogs();
      }
    } catch (err) {
      toast.error("Network error. Could not complete broadcast.", { id: toastId });
    } finally {
      setSending(false);
    }
  };

  // Filter logs locally
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.recipient_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.email_type.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase px-2 py-0.5" style={{ backgroundColor: "rgba(76,175,108,0.15)", color: "#4CAF6C" }}>
            <CheckCircle size={10} />
            Delivered
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase px-2 py-0.5" style={{ backgroundColor: "rgba(220,80,50,0.15)", color: "#E05030" }}>
            <AlertTriangle size={10} />
            Failed
          </span>
        );
      case "sending":
        return (
          <span className="inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase px-2 py-0.5 animate-pulse" style={{ backgroundColor: "rgba(232,160,48,0.15)", color: "#E8A030" }}>
            <Clock size={10} />
            Sending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-body text-[10px] tracking-wider uppercase px-2 py-0.5" style={{ backgroundColor: "rgba(100,100,100,0.15)", color: "#888888" }}>
            Sent
          </span>
        );
    }
  };

  return (
    <div className="p-8" style={{ backgroundColor: "var(--bg)", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
        <div>
          <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>
            Admin Panel
          </p>
          <h1 className="font-display text-4xl" style={{ color: "var(--text)" }}>Email Hub</h1>
          <p className="font-body text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Manage layouts, review delivery logs, and broadcast announcements to your collectors.
          </p>
        </div>
        
        {/* Stats Summary */}
        <div className="flex gap-4">
          <div className="glass-card px-5 py-3 text-center">
            <p className="font-display text-lg text-gold-shimmer font-semibold">{newsletterCount + registeredCount}</p>
            <p className="font-body text-[9px] tracking-wider uppercase text-muted" style={{ color: "var(--text-faint)" }}>Total Circle Patrons</p>
          </div>
          <div className="glass-card px-5 py-3 text-center">
            <p className="font-display text-lg text-gold-shimmer font-semibold">{newsletterCount}</p>
            <p className="font-body text-[9px] tracking-wider uppercase text-muted" style={{ color: "var(--text-faint)" }}>Newsletter Subscribers</p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-[var(--border)] mb-8">
        {[
          { key: "campaigns", label: "Compose Campaigns", icon: Mail },
          { key: "previews", label: "Template Previews", icon: Eye },
          { key: "logs", label: "Delivery Logs", icon: Database },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key as Tab)}
            className="flex items-center gap-2 px-6 py-3 font-body text-xs tracking-widest uppercase transition-all border-b-2"
            style={{
              borderColor: activeTab === t.key ? "var(--gold)" : "transparent",
              color: activeTab === t.key ? "var(--gold)" : "var(--text-muted)",
              marginBottom: "-2px",
            }}
          >
            <t.icon size={14} />
            {t.label}
          </button>
        ))}
      </div>

      {/* 1. CAMPAIGNS TAB */}
      {activeTab === "campaigns" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="glass-card p-6">
            <h2 className="font-display text-2xl mb-6" style={{ color: "var(--text)" }}>Draft Announcement</h2>
            
            <div className="flex gap-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="broadcastType"
                  checked={broadcastType === "newsletter"}
                  onChange={() => setBroadcastType("newsletter")}
                  className="accent-[#c79a3b]"
                />
                <span className="font-body text-xs uppercase tracking-wider">Collector Newsletter</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="broadcastType"
                  checked={broadcastType === "collection"}
                  onChange={() => setBroadcastType("collection")}
                  className="accent-[#c79a3b]"
                />
                <span className="font-body text-xs uppercase tracking-wider">New Collection Launch</span>
              </label>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-6">
              {broadcastType === "newsletter" ? (
                <>
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                      Email Subject
                    </label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Curated Discoveries: Original Pattachitra Ritual Art"
                      className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all bg-[var(--bg-subtle)] border border-[var(--border)]"
                      style={{ color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                      Content (Markdown-style paragraph spacing with double enter)
                    </label>
                    <textarea
                      required
                      rows={8}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write your email content here. Separate paragraphs with a blank line..."
                      className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all bg-[var(--bg-subtle)] border border-[var(--border)]"
                      style={{ color: "var(--text)" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                      Collection Title
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Original Tanjore Masterpieces"
                      className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all bg-[var(--bg-subtle)] border border-[var(--border)]"
                      style={{ color: "var(--text)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                      Description & Background Story
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Share the history and craft behind this collection..."
                      className="w-full font-body text-sm px-4 py-3 focus:outline-none transition-all bg-[var(--bg-subtle)] border border-[var(--border)]"
                      style={{ color: "var(--text)" }}
                    />
                  </div>
                  
                  {/* Select Products */}
                  <div>
                    <label className="block font-body text-[10px] tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                      Select Products to Feature (Maximum 4 recommended)
                    </label>
                    <div className="max-h-56 overflow-y-auto border border-[var(--border)] p-2 space-y-1 bg-[var(--bg-card)]">
                      {initialProducts.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => handleProductSelect(p.id)}
                          className={`flex items-center gap-3 p-2 cursor-pointer transition-colors text-xs font-body ${
                            selectedProductIds.includes(p.id) ? "bg-[var(--gold-glow)] text-[var(--gold)]" : "hover:bg-white/[0.02]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedProductIds.includes(p.id)}
                            readOnly
                            className="accent-[#c79a3b]"
                          />
                          <span className="flex-1 truncate">{p.name}</span>
                          <span className="shrink-0 font-medium" style={{ color: "var(--gold)" }}>{formatPrice(p.price)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-gold justify-center w-full disabled:opacity-50"
              >
                <Send size={14} />
                {sending ? "DISPATCHING BROADCAST..." : "SEND BROADCAST TO PATRONS"}
              </button>
            </form>
          </div>

          {/* Quick Preview Panel */}
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg" style={{ color: "var(--text)" }}>Live Composition Preview</h3>
              <button
                onClick={() => {
                  setSelectedTemplate(broadcastType === "newsletter" ? "campaign" : "collection_broadcast");
                  setActiveTab("previews");
                }}
                className="font-body text-[10px] tracking-wider uppercase text-[var(--gold)] flex items-center gap-1 hover:underline"
              >
                Full Preview <ExternalLink size={10} />
              </button>
            </div>
            <div className="flex-1 border border-[var(--border)] rounded overflow-hidden shadow-2xl bg-[#120f0d]">
              <iframe
                title="Broadcast Preview"
                srcDoc={
                  broadcastType === "newsletter"
                    ? getNewsletterCampaignEmail(
                        subject || "Collector's News & Discoveries",
                        content
                          ? content.split("\n\n").map(p => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, "<br />")}</p>`).join("")
                          : "<p>Draft content on the left to see it formatted here in real-time...</p>",
                        "dev@example.com"
                      ).html
                    : getCollectionBroadcastEmail(
                        title || "The Rajasthan Collection",
                        description || "A curated assembly of hand-carved jharokhas and miniature equestrian paintings from the desert lands of Jaipur.",
                        initialProducts.filter(p => selectedProductIds.includes(p.id)).length > 0
                          ? initialProducts.filter(p => selectedProductIds.includes(p.id)).map(p => ({
                              name: p.name,
                              price: p.price,
                              slug: p.slug,
                              images: p.images
                            }))
                          : mockProducts,
                        "dev@example.com"
                      ).html
                }
                className="w-full h-[500px] border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. PREVIEWS TAB */}
      {activeTab === "previews" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Select Template Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <h3 className="font-display text-lg mb-4" style={{ color: "var(--text)" }}>Email Layouts</h3>
            {[
              { key: "welcome", label: "1. Welcome (New Account)" },
              { key: "newsletter_welcome", label: "2. Newsletter Confirmation" },
              { key: "order_confirmation", label: "3. Order Confirmation" },
              { key: "order_shipped", label: "4. Order Shipped" },
              { key: "order_delivered", label: "5. Order Delivered" },
              { key: "abandoned_cart", label: "6. Abandoned Cart" },
              { key: "collection_broadcast", label: "7. Collection Launch" },
              { key: "campaign", label: "8. Custom Campaign" },
            ].map((tmpl) => (
              <button
                key={tmpl.key}
                onClick={() => setSelectedTemplate(tmpl.key)}
                className={`w-full text-left font-body text-xs px-4 py-3 tracking-wide transition-all border border-transparent ${
                  selectedTemplate === tmpl.key
                    ? "bg-[var(--gold-glow)] text-[var(--gold)] border-[var(--gold)]/20"
                    : "text-muted hover:bg-white/[0.01]"
                }`}
              >
                {tmpl.label}
              </button>
            ))}
          </div>

          {/* Render Area */}
          <div className="lg:col-span-3 flex flex-col">
            <h3 className="font-display text-lg mb-4" style={{ color: "var(--text)" }}>Visual Render</h3>
            <div className="border border-[var(--border)] rounded-lg overflow-hidden shadow-2xl bg-[#120f0d]">
              <iframe
                title="Template Preview Render"
                srcDoc={previewHtml}
                className="w-full h-[600px] border-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. LOGS TAB */}
      {activeTab === "logs" && (
        <div className="glass-card overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="font-display text-2xl" style={{ color: "var(--text)" }}>Delivery History</h2>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-faint)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search email or subject..."
                  className="font-body text-xs pl-9 pr-4 py-2 w-48 md:w-64 focus:outline-none bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text)] rounded-sm"
                />
              </div>

              {/* Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="font-body text-xs px-3 py-2 bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text)] rounded-sm focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="sending">Sending</option>
                <option value="sent">Sent</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>

              {/* Refresh */}
              <button
                onClick={refreshLogs}
                disabled={logsLoading}
                className="p-2 border border-[var(--border)] bg-[var(--bg-subtle)] text-[var(--text)] hover:text-[var(--gold)] disabled:opacity-50 transition-colors"
                title="Refresh Logs"
              >
                <RefreshCw size={14} className={logsLoading ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredLogs.length === 0 ? (
              <div className="py-20 text-center">
                <p className="font-display text-lg mb-1" style={{ color: "var(--text-muted)" }}>No email logs found</p>
                <p className="font-body text-xs" style={{ color: "var(--text-faint)" }}>Sent emails will be recorded here.</p>
              </div>
            ) : (
              <table className="w-full font-body text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Recipient", "Subject", "Type", "Status", "Resend ID", "Date Sent"].map((h) => (
                      <th key={h} className="px-6 py-3 text-left font-body text-[10px] tracking-[0.2em] uppercase" style={{ color: "var(--text-faint)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, i) => {
                    const relativeType = log.email_type.replace(/_/g, " ");
                    const dateStr = new Date(log.created_at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    });

                    return (
                      <tr
                        key={log.id}
                        style={{ borderBottom: i < filteredLogs.length - 1 ? "1px solid var(--border)" : "none" }}
                      >
                        <td className="px-6 py-4">
                          <div className="font-body text-xs font-semibold" style={{ color: "var(--text)" }}>
                            {log.recipient_name || "Collector"}
                          </div>
                          <div className="font-body text-[10px]" style={{ color: "var(--text-faint)" }}>
                            {log.recipient_email}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-xs font-body max-w-xs truncate" title={log.subject} style={{ color: "var(--text)" }}>
                          {log.subject}
                        </td>
                        <td className="px-6 py-4 text-[10px] font-body uppercase tracking-wider text-muted">
                          {relativeType}
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(log.status)}
                          {log.error && (
                            <div className="text-[9px] text-red-400 mt-1 max-w-[200px] truncate" title={log.error}>
                              Error: {log.error}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 font-mono text-[10px] text-muted" style={{ color: "var(--text-faint)" }}>
                          {log.resend_id ? log.resend_id.slice(0, 12) + "..." : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-xs text-muted" style={{ color: "var(--text-faint)" }}>
                          {dateStr}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
