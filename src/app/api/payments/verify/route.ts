import { verifyPaymentSignature, razorpay } from "@/lib/razorpay/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateServerTotal } from "@/utils/payment";

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
    // Perform server-side calculation of totals
    const { subtotal: calcSubtotal, shipping: calcShipping, total: calcTotal } = await calculateServerTotal(items);

    if (calcTotal !== total) {
      return NextResponse.json({ error: "Tampered order amount detected (total mismatch)" }, { status: 400 });
    }

    if (calcSubtotal !== subtotal || calcShipping !== shipping) {
      return NextResponse.json({ error: "Tampered order amount detected (subtotal/shipping mismatch)" }, { status: 400 });
    }

    // Verify each item's price matches the database price
    const verifySupabase = createAdminClient() as any;
    for (const item of items) {
      let dbPrice = 0;
      if (item.variant_id) {
        const { data: variant } = await verifySupabase
          .from("product_variants")
          .select("price, sale_price")
          .eq("id", item.variant_id)
          .single();
        if (!variant) {
          return NextResponse.json({ error: `Variant not found: ${item.variant_id}` }, { status: 400 });
        }
        dbPrice = variant.sale_price !== null && variant.sale_price !== undefined ? variant.sale_price : variant.price;
      } else {
        const { data: product } = await verifySupabase
          .from("products")
          .select("price")
          .eq("id", item.product_id)
          .single();
        if (!product) {
          return NextResponse.json({ error: `Product not found: ${item.product_id}` }, { status: 400 });
        }
        dbPrice = product.price;
      }

      if (item.price !== dbPrice) {
        return NextResponse.json({ error: `Tampered item price detected for product: ${item.product_id}` }, { status: 400 });
      }
    }

    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);
    if (razorpayOrder.amount !== calcTotal) {
      return NextResponse.json({ error: "Tampered order amount detected (Razorpay amount mismatch)" }, { status: 400 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to verify payment totals: " + err.message }, { status: 500 });
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

  // 5. Clear cart in database after successful purchase
  try {
    await supabase
      .from("carts")
      .delete()
      .eq("user_id", session.user.id);
  } catch (err) {
    console.error("Failed to clear database cart after order creation:", err);
  }

  // 6. Send Order Confirmation Email asynchronously
  (async () => {
    try {
      console.log(`[ORDER_CONFIRMATION_EMAIL_TRIGGERED] Preparing to send email for order: ${order.id}, recipient: ${session.user?.email}`);
      const { getOrderConfirmationEmail } = await import("@/utils/emailTemplates");
      const { sendEmail } = await import("@/lib/resend");
      const { subject, html } = getOrderConfirmationEmail(
        order,
        shipping_address.full_name || session.user?.name || "Collector",
        session.user?.email || ""
      );
      if (session.user?.email && !session.user.email.endsWith("@phone.daddyprince.com")) {
        await sendEmail({
          to: session.user.email,
          subject,
          html,
          emailType: "order_confirmation",
          recipientName: shipping_address.full_name || session.user?.name || "Collector",
          metadata: { order_id: order.id },
        });
      } else {
        console.log(`[ORDER_CONFIRMATION_EMAIL_SKIPPED] Skipped email sending for phone-login/no-email user: ${session.user?.email}`);
      }
    } catch (emailErr) {
      console.error("Failed to send order confirmation email:", emailErr);
    }
  })();

  return NextResponse.json({ success: true, order_id: order.id });
}
