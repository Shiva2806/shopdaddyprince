import { createServerClient } from "@/lib/supabase/server";
import SaleClient from "@/components/store/shop/SaleClient";

interface Props {
  searchParams: { sort?: string };
}

export const revalidate = 0; // Bypass cache

export const metadata = {
  title: "Archive Sale | Daddy Prince",
  description: "Shop our curated selection of fine Indian crafts on sale — authentic, handpicked legacy art.",
};

export default async function SalePage({ searchParams }: Props) {
  const supabase = createServerClient();

  // Fetch all active/sold_out products that have a compare_at_price > 0
  const { data: dbProducts, error } = await supabase
    .from("products")
    .select("*")
    .in("status", ["active", "sold_out"])
    .gt("compare_at_price", 0)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sale products:", error);
  }

  // Map database products to the client interface format
  const products = ((dbProducts as any) || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    artist: p.artist || "Unknown",
    price: p.price,
    compareAt: p.compare_at_price || undefined,
    image: p.images?.[0] || "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&q=80",
    images: p.images || [],
    category: p.categories?.[0] || "paintings",
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
    <SaleClient
      initialProducts={products}
      activeSort={searchParams.sort ?? "newest"}
    />
  );
}
