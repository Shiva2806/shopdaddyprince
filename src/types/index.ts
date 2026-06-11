// ─── Categories ───────────────────────────────────────────────────────────────

export type ProductCategory =
  | "paintings"
  | "home-decor"
  | "regional-arts"
  | "brass"
  | "vintage";

export const CATEGORIES: Record<
  ProductCategory,
  { label: string; subcategories: string[] }
> = {
  paintings: {
    label: "Paintings",
    subcategories: ["Traditional", "Abstracts", "Caricatures", "Portraits"],
  },
  "home-decor": {
    label: "Home Decor",
    subcategories: ["Masks", "Jharokhas", "Hangings", "Thorans", "Show Pieces"],
  },
  "regional-arts": {
    label: "Regional Heritage",
    subcategories: ["Kalamkari", "Kondapalli", "Lippan", "Warli", "Patachitra", "Cherial"],
  },
  brass: {
    label: "Brass Collection",
    subcategories: ["Idols", "Artifacts", "Hangings"],
  },
  vintage: {
    label: "Vintage Collection",
    subcategories: ["Antiques", "Furniture", "Stools"],
  },
};

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  compare_at_price?: number;
  categories: string[];
  subcategory?: string;
  images: string[];
  stock: number;
  status: 'active' | 'draft' | 'sold_out' | 'hidden';
  is_featured: boolean;
  tags: string[];
  weight_grams?: number;
  dimensions?: { text?: string; medium?: string; year?: string };
  artist?: string;
  origin?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  dimension: string;
  price: number;
  sale_price?: number;
  stock: number;
  sku?: string;
  weight_grams?: number;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product;
  variantId?: string;
  selectedDimension?: string;
  priceAtPurchase?: number; // in paise
  quantity: number;
}

// ─── Order ────────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderItem {
  product_id: string;
  product_name: string;
  product_image: string;
  price: number;
  quantity: number;
  variant_id?: string;
  selected_dimension?: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
}

// ─── User ─────────────────────────────────────────────────────────────────────

export type UserRole = "customer" | "admin";

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  phone?: string;
  role: UserRole;
  created_at: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
