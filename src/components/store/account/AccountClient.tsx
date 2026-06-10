"use client";

import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useWishlistStore } from "@/store/wishlist";
import { useAddressStore, type SavedAddress } from "@/store/addresses";
import { useCartStore } from "@/store/cart";
import { formatPrice, formatOrderId } from "@/utils/format";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  MapPin,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Check,
  Loader2,
  ChevronRight,
  User,
  Phone,
  Mail,
  Calendar,
  Award,
  ExternalLink,
  ShoppingBagIcon,
} from "lucide-react";
import type { Order, UserProfile } from "@/types";

interface Props {
  session: any;
  initialProfile: UserProfile | null;
  initialOrders: Order[];
}

type TabType = "dashboard" | "orders" | "wishlist" | "addresses" | "settings";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Andaman and Nicobar Islands", "Chandigarh", "Delhi", "Jammu and Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

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

export default function AccountClient({ session, initialProfile, initialOrders }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabFromUrl = searchParams.get("tab") as TabType | null;

  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile);

  // Wishlist and Address Stores
  const wishlist = useWishlistStore();
  const addressStore = useAddressStore();
  const addToCart = useCartStore((s) => s.addItem);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    full_name: initialProfile?.full_name || session?.user?.name || "",
    phone: initialProfile?.phone || "",
  });

  // Address Edit State
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState<Omit<SavedAddress, "id">>({
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    isDefault: false,
  });

  // Handle URL tab changes
  useEffect(() => {
    if (activeTabFromUrl && ["dashboard", "orders", "wishlist", "addresses", "settings"].includes(activeTabFromUrl)) {
      setActiveTab(activeTabFromUrl);
    }
  }, [activeTabFromUrl]);

  // Sync profile details if initialProfile updates
  useEffect(() => {
    if (initialProfile) {
      setProfile(initialProfile);
      setProfileForm({
        full_name: initialProfile.full_name || session?.user?.name || "",
        phone: initialProfile.phone || "",
      });
    }
  }, [initialProfile, session]);

  const changeTab = (tab: TabType) => {
    setActiveTab(tab);
    // Update URL query param silently
    const params = new URLSearchParams(window.location.search);
    params.set("tab", tab);
    router.push(`${window.location.pathname}?${params.toString()}`, { scroll: false });
  };

  // Profile saving logic
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const userId = session?.user?.id;

    if (!userId) {
      toast.error("Auth session expired. Please log in again.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: profileForm.full_name,
          phone: profileForm.phone,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Failed to update profile");

      setProfile(body.data as UserProfile);
      toast.success("Profile updated successfully");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Address operations logic
  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.full_name || !addressForm.phone || !addressForm.line1 || !addressForm.city || !addressForm.state || !addressForm.pincode) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (editingAddressId) {
      addressStore.updateAddress(editingAddressId, addressForm);
      toast.success("Address updated successfully");
    } else {
      addressStore.addAddress(addressForm);
      toast.success("Address added successfully");
    }

    // Reset Address form
    setEditingAddressId(null);
    setShowAddressForm(false);
    setAddressForm({
      full_name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      isDefault: false,
    });
  };

  const handleEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id);
    setAddressForm({
      full_name: addr.full_name,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (id: string) => {
    if (confirm("Are you sure you want to delete this address?")) {
      addressStore.deleteAddress(id);
      toast.success("Address deleted");
    }
  };

  // Wishlist actions logic
  const handleWishlistToCart = (product: any) => {
    addToCart(product, 1);
    toast.success(`${product.name} added to cart`);
  };

  // Calculate Reward Points (500 initial + 1 point per ₹100 spent)
  const totalSpentRupees = initialOrders
    .filter((o) => o.status === "paid" || o.status === "delivered" || o.status === "processing" || o.status === "shipped")
    .reduce((sum, o) => sum + o.total, 0) / 100;
  const rewardPoints = 500 + Math.round(totalSpentRupees / 100);

  const sidebarLinks = [
    { key: "dashboard" as TabType, label: "Dashboard", icon: LayoutDashboard },
    { key: "orders" as TabType, label: "Orders", icon: ShoppingBag },
    { key: "wishlist" as TabType, label: "Wishlist", icon: Heart },
    { key: "addresses" as TabType, label: "Addresses", icon: MapPin },
    { key: "settings" as TabType, label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen pt-20 pb-24" style={{ backgroundColor: "var(--bg)" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Page Header */}
        <div className="mb-10 text-center md:text-left">
          <p className="font-body text-[10px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--gold)" }}>
            Collector Account
          </p>
          <h1 className="font-display text-4xl font-light text-theme-card" style={{ color: "var(--text)" }}>
            My Account
          </h1>
          <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Manage your fine art orders, shipping addresses, and personal credentials.
          </p>
        </div>

        {/* Responsive Layout */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Mobile Tab Switcher */}
          <div className="w-full md:hidden flex overflow-x-auto pb-2 mb-4 gap-1.5 scrollbar-none border-b" style={{ borderColor: "var(--border)" }}>
            {sidebarLinks.map((link) => (
              <button
                key={link.key}
                onClick={() => changeTab(link.key)}
                className="flex items-center gap-1.5 px-4 py-2.5 font-body text-[10px] tracking-widest uppercase shrink-0 transition-all border"
                style={{
                  backgroundColor: activeTab === link.key ? "var(--gold-glow)" : "transparent",
                  borderColor: activeTab === link.key ? "var(--gold)" : "var(--border)",
                  color: activeTab === link.key ? "var(--gold-light)" : "var(--text-muted)",
                }}
              >
                <link.icon size={12} />
                {link.label}
              </button>
            ))}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 px-4 py-2.5 font-body text-[10px] tracking-widest uppercase shrink-0 transition-colors border"
              style={{
                borderColor: "rgba(220,80,50,0.2)",
                color: "rgba(220,80,50,0.8)",
                backgroundColor: "transparent",
              }}
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>

          {/* Desktop Left Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="glass-card p-4 space-y-1">
              <div className="px-3 py-4 border-b mb-3" style={{ borderColor: "var(--border)" }}>
                <div className="flex items-center gap-3">
                  {session?.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="w-10 h-10 rounded-full object-cover border"
                      style={{ borderColor: "var(--gold)" }}
                    />
                  ) : (
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-body text-base font-semibold"
                      style={{
                        backgroundColor: "var(--gold-glow)",
                        border: "1px solid var(--gold)",
                        color: "var(--gold)",
                      }}
                    >
                      {session?.user?.name?.charAt(0).toUpperCase() || <User size={16} />}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-body text-xs font-semibold truncate" style={{ color: "var(--text)" }}>
                      {profile?.full_name || session?.user?.name}
                    </p>
                    <p className="font-body text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>
              {sidebarLinks.map((link) => (
                <button
                  key={link.key}
                  onClick={() => changeTab(link.key)}
                  className="w-full flex items-center gap-3 px-4 py-3 font-body text-xs tracking-wider uppercase transition-colors"
                  style={{
                    backgroundColor: activeTab === link.key ? "var(--gold-glow)" : "transparent",
                    color: activeTab === link.key ? "var(--gold)" : "var(--text-muted)",
                    borderLeft: activeTab === link.key ? "2px solid var(--gold)" : "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== link.key) e.currentTarget.style.color = "var(--gold)";
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== link.key) e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  <link.icon size={14} />
                  {link.label}
                </button>
              ))}
              <div className="h-px my-2" style={{ backgroundColor: "var(--border)" }} />
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center gap-3 px-4 py-3 font-body text-xs tracking-wider uppercase transition-colors"
                style={{ color: "rgba(220,80,50,0.7)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(220,80,50,1)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(220,80,50,0.7)")}
              >
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </aside>

          {/* Right Content Area */}
          <div className="flex-1 w-full min-w-0">
            <div className="animate-fade-up">

              {/* 1. DASHBOARD VIEW */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  {/* Welcome Section */}
                  <div className="glass-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h2 className="font-display text-3xl font-light mb-1" style={{ color: "var(--text)" }}>
                        Welcome back, {profile?.full_name?.split(" ")[0] || session?.user?.name?.split(" ")[0]}
                      </h2>
                      <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                        Collector Account Status:{" "}
                        <span className="font-medium uppercase tracking-widest text-[10px]" style={{ color: "var(--gold)" }}>
                          {profile?.role === "admin" ? "Gold Patron (Admin)" : "Venerable Patron"}
                        </span>
                      </p>
                    </div>
                    <div
                      className="flex items-center gap-2 px-4 py-2 border rounded"
                      style={{ backgroundColor: "var(--gold-glow)", borderColor: "var(--gold)" }}
                    >
                      <Award size={16} style={{ color: "var(--gold)" }} />
                      <div>
                        <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                          Reward Points
                        </p>
                        <p className="font-display text-base font-semibold" style={{ color: "var(--gold)" }}>
                          {rewardPoints} pts
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Overview Cards Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Total Orders", value: initialOrders.length, icon: ShoppingBag, color: "var(--gold)" },
                      { label: "Wishlist Items", value: wishlist.items.length, icon: Heart, color: "#EA4335" },
                      { label: "Saved Addresses", value: addressStore.addresses.length, icon: MapPin, color: "#4285F4" },
                      { label: "Rewards Points", value: rewardPoints, icon: Award, color: "var(--gold)" },
                    ].map((stat, idx) => (
                      <div key={idx} className="glass-card p-5">
                        <div className="flex items-start justify-between mb-3">
                          <p className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>
                            {stat.label}
                          </p>
                          <stat.icon size={15} style={{ color: stat.color }} />
                        </div>
                        <p className="font-display text-2xl font-semibold" style={{ color: "var(--text)" }}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Recent Orders + Profile Info Side-by-Side */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Recent Orders (2 cols on large screen) */}
                    <div className="lg:col-span-2 glass-card overflow-hidden">
                      <div className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                        <h3 className="font-display text-xl font-light" style={{ color: "var(--text)" }}>
                          Recent Orders
                        </h3>
                        {initialOrders.length > 0 && (
                          <button
                            onClick={() => changeTab("orders")}
                            className="font-body text-[9px] tracking-[0.2em] uppercase transition-colors"
                            style={{ color: "var(--gold)" }}
                          >
                            View All →
                          </button>
                        )}
                      </div>
                      
                      <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                        {initialOrders.length === 0 ? (
                          <div className="text-center py-16 px-4">
                            <ShoppingBagIcon size={36} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text)" }} />
                            <p className="font-display text-lg mb-1" style={{ color: "var(--text-muted)" }}>
                              No orders placed yet
                            </p>
                            <p className="font-body text-xs mb-4" style={{ color: "var(--text-faint)" }}>
                              Explore legacy Indian craftsmanship in our catalog.
                            </p>
                            <a href="/shop" className="btn-gold py-2 px-5 text-[10px]">
                              Discover Shop
                            </a>
                          </div>
                        ) : (
                          initialOrders.slice(0, 3).map((order) => (
                            <div key={order.id} className="p-5 flex justify-between items-center gap-4 hover:bg-[var(--bg-subtle)] transition-colors">
                              <div>
                                <p className="font-body text-xs font-semibold" style={{ color: "var(--gold)" }}>
                                  {formatOrderId(order.id)}
                                </p>
                                <p className="font-body text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                  {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                                </p>
                                <div className="flex gap-1.5 mt-2 overflow-hidden max-w-xs md:max-w-md">
                                  {order.items.map((item, idx) => (
                                    <div
                                      key={idx}
                                      className="w-8 h-10 border overflow-hidden shrink-0"
                                      style={{ borderColor: "var(--border)" }}
                                      title={item.product_name}
                                    >
                                      <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="font-body text-sm font-semibold" style={{ color: "var(--text)" }}>
                                  {formatPrice(order.total)}
                                </p>
                                <span
                                  className="font-body text-[8px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full inline-block mt-2"
                                  style={{
                                    backgroundColor: statusColors[order.status],
                                    color: statusText[order.status],
                                  }}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Profile Information (1 col on large screen) */}
                    <div className="glass-card p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-display text-xl font-light mb-5" style={{ color: "var(--text)" }}>
                          Profile Details
                        </h3>
                        <div className="space-y-4">
                          <div className="flex gap-3 items-center">
                            <User size={15} style={{ color: "var(--gold)" }} />
                            <div>
                              <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>
                                Full Name
                              </p>
                              <p className="font-body text-xs" style={{ color: "var(--text)" }}>
                                {profile?.full_name || session?.user?.name || "Not provided"}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-center">
                            <Mail size={15} style={{ color: "var(--gold)" }} />
                            <div>
                              <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>
                                Email Address
                              </p>
                              <p className="font-body text-xs truncate" style={{ color: "var(--text)" }}>
                                {session?.user?.email}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-3 items-center">
                            <Phone size={15} style={{ color: "var(--gold)" }} />
                            <div>
                              <p className="font-body text-[9px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>
                                Phone Number
                              </p>
                              <p className="font-body text-xs" style={{ color: "var(--text)" }}>
                                {profile?.phone || "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => changeTab("settings")}
                        className="btn-ghost w-full justify-center text-[10px] py-2.5 mt-6 border"
                      >
                        Edit Details
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions Grid */}
                  <div>
                    <h3 className="font-display text-xl font-light mb-4" style={{ color: "var(--text)" }}>
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { label: "Browse Catalog", action: () => router.push("/shop"), desc: "Browse fine Indian art pieces" },
                        { label: "Update Profile Settings", action: () => changeTab("settings"), desc: "Keep credentials and phone updated" },
                        { label: "Manage Saved Locations", action: () => changeTab("addresses"), desc: "Manage billing and delivery address" },
                      ].map((a, idx) => (
                        <button
                          key={idx}
                          onClick={a.action}
                          className="glass-card p-5 text-left group transition-all duration-300 block hover:border-[var(--gold)]"
                        >
                          <p className="font-display text-base mb-1 group-hover:text-gold-theme transition-colors" style={{ color: "var(--text)" }}>
                            {a.label}
                          </p>
                          <p className="font-body text-[11px]" style={{ color: "var(--text-muted)" }}>
                            {a.desc}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ORDERS VIEW */}
              {activeTab === "orders" && (
                <div className="glass-card">
                  <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                    <h2 className="font-display text-2xl font-light" style={{ color: "var(--text)" }}>
                      Your Orders
                    </h2>
                  </div>
                  {initialOrders.length === 0 ? (
                    <div className="text-center py-20 px-6">
                      <ShoppingBagIcon size={48} className="mx-auto mb-4 opacity-20" style={{ color: "var(--text)" }} />
                      <h3 className="font-display text-2xl mb-1" style={{ color: "var(--text)" }}>
                        No orders recorded
                      </h3>
                      <p className="font-body text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                        It seems you haven't placed any orders yet. Discover our collection of hand-picked fine arts.
                      </p>
                      <a href="/shop" className="btn-gold">
                        Begin Collecting
                      </a>
                    </div>
                  ) : (
                    <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                      {initialOrders.map((order) => (
                        <div key={order.id} className="p-6 md:p-8 space-y-6">
                          {/* Order Header Summary */}
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-body text-sm font-semibold" style={{ color: "var(--gold)" }}>
                                  {formatOrderId(order.id)}
                                </span>
                                <span
                                  className="font-body text-[9px] font-semibold tracking-widest uppercase px-2.5 py-0.5 rounded-full inline-block"
                                  style={{
                                    backgroundColor: statusColors[order.status],
                                    color: statusText[order.status],
                                  }}
                                >
                                  {order.status}
                                </span>
                              </div>
                              <p className="font-body text-xs mt-1" style={{ color: "var(--text-faint)" }}>
                                Placed on {new Date(order.created_at).toLocaleDateString("en-IN", { dateStyle: "long" })}{" "}
                                at {new Date(order.created_at).toLocaleTimeString("en-IN", { timeStyle: "short" })}
                              </p>
                            </div>
                            <div className="text-left sm:text-right shrink-0">
                              <p className="font-body text-[10px] tracking-widest uppercase" style={{ color: "var(--text-faint)" }}>
                                Total Amount
                              </p>
                              <p className="font-display text-xl font-semibold" style={{ color: "var(--text)" }}>
                                {formatPrice(order.total)}
                              </p>
                            </div>
                          </div>

                          {/* Order Items Table/List */}
                          <div className="space-y-4">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex gap-4 items-center pb-4"
                                style={{ borderBottom: "1px solid var(--border)", opacity: 0.85 }}
                              >
                                <div className="w-14 h-18 shrink-0 overflow-hidden border" style={{ borderColor: "var(--border)" }}>
                                  <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-display text-base font-semibold truncate" style={{ color: "var(--text)" }}>
                                    {item.product_name}
                                  </h4>
                                  <p className="font-body text-xs mt-0.5" style={{ color: "var(--text-faint)" }}>
                                    Quantity: {item.quantity} · Price: {formatPrice(item.price)}
                                  </p>
                                </div>
                                <p className="font-body text-sm font-semibold shrink-0" style={{ color: "var(--gold)" }}>
                                  {formatPrice(item.price * item.quantity)}
                                </p>
                              </div>
                            ))}
                          </div>

                          {/* Shipping and Payment Info */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-body p-4 bg-[var(--bg-subtle)] border" style={{ borderColor: "var(--border)" }}>
                            <div>
                              <p className="font-body text-[9px] tracking-widest uppercase font-semibold mb-1" style={{ color: "var(--gold)" }}>
                                Delivery Details
                              </p>
                              <p style={{ color: "var(--text)" }}>{order.shipping_address.full_name}</p>
                              <p style={{ color: "var(--text-muted)" }}>
                                {order.shipping_address.line1}
                                {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ""}
                              </p>
                              <p style={{ color: "var(--text-muted)" }}>
                                {order.shipping_address.city}, {order.shipping_address.state} — {order.shipping_address.pincode}
                              </p>
                              <p className="mt-1" style={{ color: "var(--text-faint)" }}>
                                Phone: {order.shipping_address.phone}
                              </p>
                            </div>
                            <div className="flex flex-col justify-between">
                              <div>
                                <p className="font-body text-[9px] tracking-widest uppercase font-semibold mb-1" style={{ color: "var(--gold)" }}>
                                  Payment Context
                                </p>
                                <p style={{ color: "var(--text)" }}>Razorpay Gateway</p>
                                <p style={{ color: "var(--text-muted)" }}>
                                  Order Ref: {order.razorpay_order_id || "N/A"}
                                </p>
                                <p style={{ color: "var(--text-muted)" }}>
                                  Payment Ref: {order.razorpay_payment_id || "N/A"}
                                </p>
                              </div>
                              <div className="mt-2 text-left md:text-right text-[10px]" style={{ color: "var(--text-faint)" }}>
                                ID: {order.id}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 3. WISHLIST VIEW */}
              {activeTab === "wishlist" && (
                <div>
                  <div className="glass-card px-6 py-5 border-b mb-6" style={{ borderColor: "var(--border)" }}>
                    <h2 className="font-display text-2xl font-light" style={{ color: "var(--text)" }}>
                      Your Wishlist
                    </h2>
                  </div>
                  {wishlist.items.length === 0 ? (
                    <div className="glass-card text-center py-20 px-6">
                      <Heart size={48} className="mx-auto mb-4 opacity-20" style={{ color: "var(--text)" }} />
                      <h3 className="font-display text-2xl mb-1" style={{ color: "var(--text)" }}>
                        Wishlist is empty
                      </h3>
                      <p className="font-body text-sm mb-6 max-w-sm mx-auto" style={{ color: "var(--text-muted)" }}>
                        You haven't bookmarked any pieces yet. Browse paintings, brass idols, and vintage items.
                      </p>
                      <a href="/shop" className="btn-gold">
                        Browse Catalog
                      </a>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.items.map((p) => (
                        <div key={p.id} className="glass-card overflow-hidden group flex flex-col justify-between">
                          <div className="relative overflow-hidden aspect-[3/4] border-b" style={{ borderColor: "var(--border)" }}>
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <button
                              onClick={() => {
                                wishlist.removeItem(p.id);
                                toast.success("Removed from wishlist");
                              }}
                              className="absolute top-3 right-3 p-1.5 rounded-full shadow"
                              style={{ backgroundColor: "rgba(8,6,4,0.6)", color: "#EA4335" }}
                            >
                              <Trash2 size={13} />
                            </button>
                            <div className="absolute top-3 left-3 px-2 py-0.5 font-body text-[8px] tracking-widest uppercase bg-black/60 text-white rounded">
                              {p.origin}
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div className="mb-4">
                              <h4 className="font-display text-lg font-semibold truncate" style={{ color: "var(--text)" }}>
                                {p.name}
                              </h4>
                              <p className="font-body text-[10px] mt-0.5" style={{ color: "var(--text-faint)" }}>
                                Artist: {p.artist}
                              </p>
                            </div>
                            <div>
                              <p className="font-body text-base font-semibold mb-4" style={{ color: "var(--gold)" }}>
                                {formatPrice(p.price)}
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleWishlistToCart(p)}
                                  className="btn-gold flex-1 text-[9px] py-2 justify-center"
                                  disabled={p.stock === 0}
                                >
                                  {p.stock === 0 ? "Sold Out" : "Add to Cart"}
                                </button>
                                <button
                                  onClick={() => {
                                    wishlist.removeItem(p.id);
                                    toast.success("Removed");
                                  }}
                                  className="p-2 border"
                                  style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                                  title="Remove"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 4. ADDRESSES VIEW */}
              {activeTab === "addresses" && (
                <div className="glass-card">
                  <div className="px-6 py-5 border-b flex justify-between items-center" style={{ borderColor: "var(--border)" }}>
                    <h2 className="font-display text-2xl font-light" style={{ color: "var(--text)" }}>
                      Saved Addresses
                    </h2>
                    {!showAddressForm && (
                      <button
                        onClick={() => {
                          setEditingAddressId(null);
                          setAddressForm({
                            full_name: "",
                            phone: "",
                            line1: "",
                            line2: "",
                            city: "",
                            state: "",
                            pincode: "",
                            isDefault: addressStore.addresses.length === 0,
                          });
                          setShowAddressForm(true);
                        }}
                        className="btn-gold py-1.5 px-4 text-[9px] flex items-center gap-1 shrink-0"
                      >
                        <Plus size={11} /> Add New
                      </button>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Add/Edit Address Form */}
                    {showAddressForm && (
                      <form onSubmit={handleSaveAddress} className="border p-5 mb-8 bg-[var(--bg-subtle)] space-y-4" style={{ borderColor: "var(--border)" }}>
                        <h3 className="font-display text-lg mb-4" style={{ color: "var(--text)" }}>
                          {editingAddressId ? "Edit Address Details" : "Add Address Details"}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.full_name}
                              onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            />
                          </div>
                          <div>
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              Phone Number *
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.phone}
                              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              Street Address *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="House / Flat no., Street, Apartment"
                              value={addressForm.line1}
                              onChange={(e) => setAddressForm({ ...addressForm, line1: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              Apartment, Suite, Unit, Landmark (optional)
                            </label>
                            <input
                              type="text"
                              value={addressForm.line2}
                              onChange={(e) => setAddressForm({ ...addressForm, line2: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            />
                          </div>
                          <div>
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              City *
                            </label>
                            <input
                              type="text"
                              required
                              value={addressForm.city}
                              onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            />
                          </div>
                          <div>
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              Pincode *
                            </label>
                            <input
                              type="text"
                              required
                              maxLength={6}
                              value={addressForm.pincode}
                              onChange={(e) => setAddressForm({ ...addressForm, pincode: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block font-body text-[9px] tracking-widest uppercase mb-1" style={{ color: "var(--text-faint)" }}>
                              State *
                            </label>
                            <select
                              required
                              value={addressForm.state}
                              onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                              className="w-full font-body text-xs px-3 py-2.5 focus:outline-none transition-all"
                              style={{ backgroundColor: "var(--bg)", border: "1px solid var(--border)", color: "var(--text)" }}
                            >
                              <option value="">Select State</option>
                              {INDIAN_STATES.map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2 flex items-center gap-2 pt-2">
                            <input
                              type="checkbox"
                              id="isDefault"
                              checked={addressForm.isDefault}
                              disabled={!editingAddressId && addressStore.addresses.length === 0} // Always default if first
                              onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                              className="w-3.5 h-3.5 accent-[var(--gold)]"
                            />
                            <label htmlFor="isDefault" className="font-body text-xs cursor-pointer select-none" style={{ color: "var(--text-muted)" }}>
                              Set as default shipping address
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "var(--border)" }}>
                          <button type="submit" className="btn-gold py-2 px-6 text-[10px]">
                            {editingAddressId ? "Update Address" : "Save Address"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setShowAddressForm(false)}
                            className="btn-ghost py-2 px-6 text-[10px] border"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}

                    {/* Address List */}
                    {addressStore.addresses.length === 0 ? (
                      <div className="text-center py-12">
                        <MapPin size={36} className="mx-auto mb-3 opacity-25" style={{ color: "var(--text)" }} />
                        <h3 className="font-display text-xl mb-1" style={{ color: "var(--text)" }}>
                          No addresses saved
                        </h3>
                        <p className="font-body text-xs mb-4" style={{ color: "var(--text-muted)" }}>
                          Add a delivery address to complete checkout faster.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addressStore.addresses.map((addr) => (
                          <div
                            key={addr.id}
                            className="border p-5 flex flex-col justify-between transition-all"
                            style={{
                              borderColor: addr.isDefault ? "var(--gold)" : "var(--border)",
                              backgroundColor: "var(--bg-subtle)",
                            }}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="font-display text-base font-semibold" style={{ color: "var(--text)" }}>
                                  {addr.full_name}
                                </h4>
                                {addr.isDefault && (
                                  <span
                                    className="font-body text-[8px] tracking-widest uppercase px-2 py-0.5 border"
                                    style={{ color: "var(--gold)", borderColor: "var(--gold)", backgroundColor: "var(--gold-glow)" }}
                                  >
                                    Default
                                  </span>
                                )}
                              </div>
                              <p className="font-body text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                                {addr.line1}
                                {addr.line2 ? `, ${addr.line2}` : ""}
                              </p>
                              <p className="font-body text-xs" style={{ color: "var(--text-muted)" }}>
                                {addr.city}, {addr.state} — {addr.pincode}
                              </p>
                              <p className="font-body text-xs mt-2" style={{ color: "var(--text-faint)" }}>
                                Phone: {addr.phone}
                              </p>
                            </div>
                            <div className="flex items-center justify-between border-t mt-5 pt-3" style={{ borderColor: "var(--border)" }}>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleEditAddress(addr)}
                                  className="font-body text-[10px] tracking-widest uppercase flex items-center gap-1 hover:text-gold-theme transition-colors"
                                  style={{ color: "var(--text-muted)" }}
                                >
                                  <Edit2 size={10} /> Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="font-body text-[10px] tracking-widest uppercase flex items-center gap-1 hover:text-red-500 transition-colors"
                                  style={{ color: "var(--text-faint)" }}
                                >
                                  <Trash2 size={10} /> Delete
                                </button>
                              </div>
                              {!addr.isDefault && (
                                <button
                                  onClick={() => {
                                    addressStore.setDefaultAddress(addr.id);
                                    toast.success("Default address updated");
                                  }}
                                  className="font-body text-[9px] tracking-widest uppercase"
                                  style={{ color: "var(--gold)" }}
                                >
                                  Make Default
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 5. SETTINGS VIEW */}
              {activeTab === "settings" && (
                <div className="glass-card">
                  <div className="px-6 py-5 border-b" style={{ borderColor: "var(--border)" }}>
                    <h2 className="font-display text-2xl font-light" style={{ color: "var(--text)" }}>
                      Account Settings
                    </h2>
                  </div>
                  <form onSubmit={handleSaveProfile} className="p-6 md:p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className="block font-body text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                          Registered Email (Immutable)
                        </label>
                        <input
                          type="email"
                          disabled
                          value={session?.user?.email || ""}
                          className="w-full font-body text-xs px-4 py-3 select-none cursor-not-allowed opacity-60 border"
                          style={{
                            backgroundColor: "rgba(8,6,4,0.3)",
                            borderColor: "var(--border)",
                            color: "var(--text-muted)",
                          }}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={profileForm.full_name}
                          onChange={(e) => setProfileForm({ ...profileForm, full_name: e.target.value })}
                          className="w-full font-body text-xs px-4 py-3 focus:outline-none transition-all"
                          style={{
                            backgroundColor: "var(--bg-subtle)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--gold)";
                            e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>
                      <div>
                        <label className="block font-body text-[10px] tracking-widest uppercase mb-2" style={{ color: "var(--text-faint)" }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="+91 XXXXX XXXXX"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                          className="w-full font-body text-xs px-4 py-3 focus:outline-none transition-all"
                          style={{
                            backgroundColor: "var(--bg-subtle)",
                            border: "1px solid var(--border)",
                            color: "var(--text)",
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.borderColor = "var(--gold)";
                            e.currentTarget.style.boxShadow = "0 0 0 3px var(--gold-glow)";
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = "var(--border)";
                            e.currentTarget.style.boxShadow = "none";
                          }}
                        />
                      </div>
                    </div>

                    <div className="pt-6 border-t flex justify-end" style={{ borderColor: "var(--border)" }}>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-gold min-w-[150px] justify-center"
                      >
                        {loading ? (
                          <>
                            <Loader2 size={13} className="animate-spin" /> Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
