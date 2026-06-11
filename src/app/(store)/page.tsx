import Hero from "@/components/store/Hero";
import MarqueeTicker from "@/components/store/MarqueeTicker";
import FeaturedCategories from "@/components/store/FeaturedCategories";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import HeritageStrip from "@/components/store/HeritageStrip";
import Newsletter from "@/components/store/Newsletter";
import Reveal from "@/components/ui/Reveal";
import { createServerClient } from "@/lib/supabase/server";

export const revalidate = 0; // Bypass cache to fetch fresh data

export default async function HomePage() {
  const supabase = createServerClient();
  const { data: dbProducts } = await supabase
    .from("products")
    .select("*")
    .eq("is_featured", true)
    .in("status", ["active", "sold_out"])
    .order("created_at", { ascending: false })
    .limit(8);

  const featured = ((dbProducts as any) || []).map((p: any) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    artist: p.artist || "Unknown",
    price: p.price,
    compareAt: p.compare_at_price || undefined,
    image: p.images?.[0] || "/images/categories/product_banners/painting.webp",
    images: p.images || [],
    category: p.categories?.[0] || "paintings",
    subcategory: p.subcategory || "",
    origin: p.origin || "India",
    stock: p.stock,
  }));

  return (
    <main>
      <Hero />
      <MarqueeTicker />
      <Reveal><FeaturedCategories /></Reveal>
      <Reveal><FeaturedProducts initialProducts={featured} /></Reveal>
      <Reveal><HeritageStrip /></Reveal>
      <Reveal><Newsletter /></Reveal>
    </main>
  );
}
