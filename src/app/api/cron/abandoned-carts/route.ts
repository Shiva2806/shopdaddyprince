import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { getAbandonedCartEmail } from "@/utils/emailTemplates";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Enforce fail-closed verification checking both Authorization header and query param
  const authHeader = request.headers.get("authorization");
  let secret = "";
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    secret = authHeader.slice(7).trim();
  } else {
    const { searchParams } = new URL(request.url);
    secret = searchParams.get("secret") || "";
  }

  const expectedSecret = process.env.CRON_SECRET;

  if (!expectedSecret || !secret || secret !== expectedSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient() as any;

  // 1. Calculate time windows
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  try {
    // 2. Fetch candidates: updated more than 1 hour ago, less than 24 hours ago, no email sent yet
    const { data: carts, error } = await supabase
      .from("carts")
      .select("*, profiles(email, full_name)")
      .lt("updated_at", oneHourAgo)
      .gt("updated_at", twentyFourHoursAgo)
      .eq("email_sent", false);

    if (error) {
      console.error("Cron fetch abandoned carts error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!carts || carts.length === 0) {
      return NextResponse.json({ message: "No abandoned carts found in this window." });
    }

    const results = [];

    // 3. Process each cart
    for (const cart of carts) {
      // Check if cart has items
      if (!Array.isArray(cart.items) || cart.items.length === 0) {
        continue;
      }

      const profile = cart.profiles;
      if (!profile || !profile.email || profile.email.endsWith("@phone.daddyprince.com")) {
        continue; // Skip guests/users with no real email
      }

      const email = profile.email;
      const name = profile.full_name || "Collector";

      // 4. Send email
      const { subject, html } = getAbandonedCartEmail(cart.items, name, email);
      console.log(`[ABANDONED_CART_EMAIL_TRIGGERED] Preparing to send email for cart: ${cart.id}, recipient: ${email}`);
      const res = await sendEmail({
        to: email,
        subject,
        html,
        emailType: "abandoned_cart",
        recipientName: name,
        metadata: { cart_id: cart.id },
      });

      if (res.success) {
        console.log(`[ABANDONED_CART_EMAIL_SENT_SUCCESS] Marked cart: ${cart.id} as sent for recipient: ${email}`);
        // Mark as sent in DB
        await supabase
          .from("carts")
          .update({ email_sent: true, updated_at: new Date().toISOString() })
          .eq("id", cart.id);

        results.push({ email, status: "success", resendId: res.resendId });
      } else {
        console.error(`[ABANDONED_CART_EMAIL_SEND_FAILED] failed for cart: ${cart.id}, recipient: ${email}, error: ${res.error}`);
        results.push({ email, status: "failed", error: res.error });
      }
    }

    return NextResponse.json({ processed: results.length, details: results });
  } catch (err: any) {
    console.error("Cron abandoned cart process failed:", err);
    return NextResponse.json({ error: err.message || "Failed to process cron job" }, { status: 500 });
  }
}
