import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { logProductDeletion } from "@/utils/activity";

// Helper to verify admin role
async function verifyAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return { error: "Unauthorized", status: 401 };
  }

  const supabase = createAdminClient() as any;
  const { data: requester, error: reqErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (reqErr || !requester || requester.role !== "admin") {
    return { error: "Forbidden", status: 403 };
  }

  return { supabase };
}

// PATCH /api/products/[id] — update product details, status, or featured flag
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await verifyAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  const { supabase } = adminCheck;

  try {
    const body = await request.json();
    const updateData: any = {
      updated_at: new Date().toISOString(),
    };

    // Assign incoming values directly (RUPEES -> PAISE conversions are done on the client)
    if (body.name !== undefined) updateData.name = body.name;
    if (body.artist !== undefined) updateData.artist = body.artist;
    if (body.origin !== undefined) updateData.origin = body.origin;
    if (body.price !== undefined) updateData.price = body.price;
    if (body.compare_at_price !== undefined) updateData.compare_at_price = body.compare_at_price;
    if (body.categories !== undefined) updateData.categories = body.categories;
    if (body.subcategory !== undefined) updateData.subcategory = body.subcategory;
    if (body.images !== undefined) updateData.images = body.images;
    if (body.stock !== undefined) updateData.stock = body.stock;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.is_featured !== undefined) updateData.is_featured = body.is_featured;
    if (body.tags !== undefined) updateData.tags = body.tags;
    if (body.dimensions !== undefined) updateData.dimensions = body.dimensions;

    const { data: updatedProduct, error: updateError } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // Smart sync product variants if provided
    const { variants } = body;
    if (variants !== undefined && Array.isArray(variants)) {
      const { data: existingVariants, error: fetchVarErr } = await supabase
        .from("product_variants")
        .select("id")
        .eq("product_id", params.id);

      if (fetchVarErr) {
        return NextResponse.json({ error: `Failed to fetch existing variants: ${fetchVarErr.message}` }, { status: 500 });
      }

      const existingIds = existingVariants ? existingVariants.map((v: any) => v.id) : [];
      const newVariants = variants.filter((v: any) => !v.id);
      const updatedVariants = variants.filter((v: any) => v.id && existingIds.includes(v.id));
      const deletedIds = existingIds.filter((id: string) => !variants.some((v: any) => v.id === id));

      if (deletedIds.length > 0) {
        const { error: delErr } = await supabase
          .from("product_variants")
          .delete()
          .in("id", deletedIds);
        if (delErr) {
          return NextResponse.json({ error: `Failed to delete omitted variants: ${delErr.message}` }, { status: 500 });
        }
      }

      const parsePrice = (p: any) => {
        if (p === null || p === undefined || p === "") return null;
        const num = parseFloat(p);
        return isNaN(num) ? null : Math.round(num * 100);
      };

      if (newVariants.length > 0) {
        const inserts = newVariants.map((v: any) => ({
          product_id: params.id,
          dimension: v.dimension || "",
          price: parsePrice(v.price) ?? 0,
          sale_price: parsePrice(v.sale_price),
          stock: v.stock ? parseInt(v.stock) : 0,
          sku: v.sku || null,
          weight_grams: v.weight_grams ? parseInt(v.weight_grams) : null
        }));
        const { error: insErr } = await supabase
          .from("product_variants")
          .insert(inserts);
        if (insErr) {
          return NextResponse.json({ error: `Failed to insert new variants: ${insErr.message}` }, { status: 500 });
        }
      }

      for (const v of updatedVariants) {
        const { error: updErr } = await supabase
          .from("product_variants")
          .update({
            dimension: v.dimension,
            price: parsePrice(v.price) ?? 0,
            sale_price: parsePrice(v.sale_price),
            stock: v.stock ? parseInt(v.stock) : 0,
            sku: v.sku || null,
            weight_grams: v.weight_grams ? parseInt(v.weight_grams) : null
          })
          .eq("id", v.id);
        if (updErr) {
          return NextResponse.json({ error: `Failed to update variant ${v.id}: ${updErr.message}` }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ data: updatedProduct });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update product" }, { status: 500 });
  }
}

// DELETE /api/products/[id] — permanently delete a product
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminCheck = await verifyAdmin();
  if (adminCheck.error) {
    return NextResponse.json({ error: adminCheck.error }, { status: adminCheck.status });
  }

  const { supabase } = adminCheck;

  try {
    // 1. Get product name first
    const { data: product } = await supabase
      .from("products")
      .select("name")
      .eq("id", params.id)
      .maybeSingle();

    // 2. Perform deletion
    const { error: deleteError } = await supabase
      .from("products")
      .delete()
      .eq("id", params.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // 3. Log the deletion event if name was retrieved
    if (product?.name) {
      logProductDeletion(product.name);
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete product" }, { status: 500 });
  }
}
