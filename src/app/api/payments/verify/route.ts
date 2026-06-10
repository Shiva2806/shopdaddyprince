import { verifyPaymentSignature, razorpay } from "@/lib/razorpay/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  items: z.array(
    z.object({
      product_id: z.string(),
      product_name: z.string(),
      quantity: z.number().int().positive(),
      price: z.number().int().positive(),
      product_image: z.string().optional(),
      variant_id: z.string().optional(),
      selected_dimension: z.string().optional(),
    })
  ),
  shipping_address: z.object({
    full_name: z.string(),
    phone: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  subtotal: z.number().int().nonnegative(),
  shipping: z.number().int().nonnegative(),
  total: z.number().int().positive(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request payload", details: parsed.error.format() }, { status: 400 });
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    items,
    shipping_address,
    subtotal,
    shipping,
    total,
  } = parsed.data;

  // 1. Verify Razorpay Payment Signature
  const valid = verifyPaymentSignature({
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
    signature: razorpay_signature,
  });

  if (!valid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  // 2. Security: Verify that the amount paid in Razorpay matches the total
  try {
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (razorpayOrder.amount !== total) {
      return NextResponse.json({ error: "Tampered order amount detected" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch Razorpay order: " + err.message }, { status: 500 });
  }

  // 3. Create the order in Supabase database
  const supabase = createAdminClient() as any;
  const { data: order, error: insertError } = await supabase
    .from("orders")
    .insert({
      user_id: session.user.id,
      items,
      subtotal,
      shipping,
      total,
      status: "paid",
      shipping_address,
      razorpay_order_id,
      razorpay_payment_id,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Supabase order insertion error:", insertError);
    return NextResponse.json({ error: "Database error: " + insertError.message }, { status: 500 });
  }

  // 4. Reduce stock in database
  for (const item of items) {
    try {
      if (item.variant_id) {
        const { data: variant } = await supabase
          .from("product_variants")
          .select("stock")
          .eq("id", item.variant_id)
          .single();
        if (variant) {
          const newStock = Math.max(0, variant.stock - item.quantity);
          await supabase
            .from("product_variants")
            .update({ stock: newStock })
            .eq("id", item.variant_id);
        }
      } else {
        const { data: product } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.product_id)
          .single();
        if (product) {
          const newStock = Math.max(0, product.stock - item.quantity);
          await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.product_id);
        }
      }
    } catch (err) {
      console.error(`Failed to update stock for item ${item.product_id} / variant ${item.variant_id}:`, err);
    }
  }

  return NextResponse.json({ success: true, order_id: order.id });
}
