import { CATEGORIES, type ProductCategory } from "@/types";
import { notFound } from "next/navigation";
import ShopClient from "@/components/store/shop/ShopClient";
import { createServerClient } from "@/lib/supabase/server";

interface Props {
  params: { category: string };
  searchParams: { sub?: string; sort?: string; page?: string; state?: string; tag?: string };
}

export const revalidate = 0; // Bypass cache to fetch fresh data

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((cat) => ({ category: cat }));
}

export async function generateMetadata({ params }: Props) {
  const cat = CATEGORIES[params.category as ProductCategory];
  if (!cat) return {};
  return {
    title: `${cat.label} | Daddy Prince`,
    description: `Shop our curated collection of ${cat.label.toLowerCase()} — authentic, handpicked Indian crafts.`,
  };
}

export default async function ShopPage({ params, searchParams }: Props) {
  const category = params.category as ProductCategory;
  if (!CATEGORIES[category]) notFound();

  const supabase = createServerClient();

  // Fetch all active/sold_out products in this category
  const { data: dbProducts, error } = await supabase
    .from("products")
    .select("*")
    .contains("categories", [category])
    .in("status", ["active", "sold_out"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching shop products:", error);
  }

  // Map database products to the client interface format
  const products = ((dbProducts as any) || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    artist: p.artist || "Unknown",
    price: p.price,
    compareAt: p.compare_at_price || undefined,
    image: p.images?.[0] || "/images/categories/product_banners/painting.webp",
    images: p.images || [],
    category: category,
    subcategory: p.subcategory || "",
    origin: p.origin || "India",
    stock: p.stock,
    description: p.description || "",
    dimensions: (p.dimensions as any)?.text || "",
    medium: (p.dimensions as any)?.medium || "",
    year: (p.dimensions as any)?.year || "",
    tags: p.tags || [],
  }));

  return (
    <ShopClient
      category={category}
      initialProducts={products}
      activeSub={searchParams.sub}
      activeState={searchParams.state}
      activeTag={searchParams.tag}
      activeSort={searchParams.sort ?? "newest"}
    />
  );
}
