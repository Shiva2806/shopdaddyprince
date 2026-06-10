import { createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";

// GET /api/products — fetch all active/sold_out products with optional filters
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const page = parseInt(searchParams.get("page") ?? "1");
  const offset = (page - 1) * limit;

  const supabase = createServerClient();

  let query = supabase
    .from("products")
    .select("*")
    .in("status", ["active", "sold_out"])
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (category) {
    query = query.contains("categories", [category]);
  }

  if (featured === "true") {
    query = query.eq("is_featured", true);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST /api/products — create a new product (admin only)
export async function POST(request: Request) {
  let session = await getServerSession(authOptions);
  const bypass = process.env.NODE_ENV === "development" && process.env.BYPASS_ADMIN_AUTH === "true";

  if (bypass) {
    session = {
      user: {
        id: "00000000-0000-0000-0000-000000000000",
        name: "Dev Admin",
        email: "admin@shopdaddyprince.com"
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createAdminClient() as any;

    if (!bypass) {
      // Verify requester is admin
      const { data: requester, error: reqErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (reqErr || !requester || requester.role !== "admin") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const body = await request.json();
    const {
      name,
      artist,
      origin,
      price,
      compare_at_price,
      categories,
      subcategory,
      stock,
      description,
      medium,
      dimensions: dimensionsText,
      year,
      tags: tagsRaw,
      images,
      is_featured,
      status,
      variants,
    } = body;

    if (!name || !price || !categories || !Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "Name, price and at least one category are required" }, { status: 400 });
    }

    // Generate unique slug
    const cleanName = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const slug = `${cleanName}-${Math.random().toString(36).substring(2, 6)}`;

    // Convert prices from rupees to paise
    const pricePaise = Math.round(parseFloat(price) * 100);
    const compareAtPricePaise = compare_at_price ? Math.round(parseFloat(compare_at_price) * 100) : null;
    const stockQty = stock ? parseInt(stock) : 0;

    // Process tags
    const tags = tagsRaw
      ? typeof tagsRaw === "string"
        ? tagsRaw.split(",").map((t: string) => t.trim()).filter(Boolean)
        : tagsRaw
      : [];

    // Bundle dimensions JSONB
    const dimensions = {
      text: dimensionsText || "",
      medium: medium || "",
      year: year || "",
    };

    const { data: product, error: insertError } = await supabase
      .from("products")
      .insert({
        slug,
        name,
        description: description || "",
        price: pricePaise,
        compare_at_price: compareAtPricePaise,
        categories,
        subcategory: subcategory || null,
        images: images || [],
        stock: stockQty,
        status: status || "active",
        is_featured: !!is_featured,
        tags,
        dimensions,
        artist: artist || null,
        origin: origin || null,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // Insert variants if provided
    if (variants && Array.isArray(variants) && variants.length > 0) {
      const variantsToInsert = variants.map((v: any) => ({
        product_id: product.id,
        dimension: v.dimension || "",
        price: Math.round(parseFloat(v.price) * 100),
        sale_price: v.sale_price ? Math.round(parseFloat(v.sale_price) * 100) : null,
        stock: v.stock ? parseInt(v.stock) : 0,
        sku: v.sku || null,
        weight_grams: v.weight_grams ? parseInt(v.weight_grams) : null
      }));

      const { error: varErr } = await supabase
        .from("product_variants")
        .insert(variantsToInsert);

      if (varErr) {
        return NextResponse.json({ error: `Product created, but variants failed to save: ${varErr.message}` }, { status: 500 });
      }
    }

    return NextResponse.json({ data: product });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to save product" }, { status: 500 });
  }
}
