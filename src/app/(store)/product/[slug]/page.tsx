import { notFound } from "next/navigation";
import ProductClient from "@/components/store/product/ProductClient";
import { createServerClient } from "@/lib/supabase/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

interface Props {
  params: { slug: string };
}

export const revalidate = 0; // Bypass cache to fetch fresh data

export async function generateStaticParams() {
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase
    .from("products")
    .select("slug")
    .in("status", ["active", "sold_out"]);

  return ((data as any) || []).map((p: any) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const supabase = createServerClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!product) return {};
  const p = product as any;
  return {
    title: `${p.name} | Daddy Prince`,
    description: p.description?.slice(0, 160) || "",
  };
}

export default async function ProductPage({ params }: Props) {
  const supabase = createServerClient();

  // Fetch the product by slug
  const { data: dbProduct, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (error || !dbProduct) {
    notFound();
  }

  const p = dbProduct as any;

  // Map database product to frontend format
  const mappedProduct = {
    id: p.id,
    slug: p.slug,
    name: p.name,
    artist: p.artist || "Unknown",
    price: p.price,
    compareAt: p.compare_at_price || undefined,
    images: p.images && p.images.length > 0 ? p.images : ["/images/categories/product_banners/painting.webp"],
    category: p.categories?.[0] || "paintings",
    subcategory: p.subcategory || "",
    origin: p.origin || "India",
    stock: p.stock,
    description: p.description || "",
    dimensions: (p.dimensions as any)?.text || "",
    medium: (p.dimensions as any)?.medium || "",
    year: (p.dimensions as any)?.year || "",
  };

  // Related products — same categories, different slug, status active or sold_out
  const { data: dbRelated } = await supabase
    .from("products")
    .select("*")
    .neq("slug", p.slug)
    .in("status", ["active", "sold_out"])
    .overlaps("categories", p.categories)
    .limit(4);

  const related = ((dbRelated as any) || []).map((prod: any) => ({
    id: prod.id,
    slug: prod.slug,
    name: prod.name,
    artist: prod.artist || "Unknown",
    price: prod.price,
    compareAt: prod.compare_at_price || undefined,
    images: prod.images && prod.images.length > 0 ? prod.images : ["/images/categories/product_banners/painting.webp"],
    category: prod.categories?.[0] || "paintings",
    subcategory: prod.subcategory || "",
    origin: prod.origin || "India",
    stock: prod.stock,
    description: prod.description || "",
    dimensions: (prod.dimensions as any)?.text || "",
    medium: (prod.dimensions as any)?.medium || "",
    year: (prod.dimensions as any)?.year || "",
  }));

  // Fetch variants for this product
  const { data: dbVariants } = await supabase
    .from("product_variants")
    .select("*")
    .eq("product_id", p.id)
    .order("created_at", { ascending: true });

  const variants = ((dbVariants as any) || []).map((v: any) => ({
    id: v.id,
    product_id: v.product_id,
    dimension: v.dimension,
    price: v.price,
    sale_price: v.sale_price || undefined,
    stock: v.stock,
    sku: v.sku || undefined,
    weight_grams: v.weight_grams || undefined,
  }));

  return <ProductClient product={mappedProduct} related={related} variants={variants} />;
}
