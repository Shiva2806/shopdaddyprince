import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Enforce fail-closed verification checking both Authorization header and query param
  const authHeader = request.headers.get("authorization");
  let secret = "";
  if (authHeader && authHeader.toLowerCase().startsWith("bearer ")) {
    secret = authHeader.slice(7).trim();
  } else {
    const { searchParams } = new URL(request.url);
    secret = searchParams.get("secret") || "";
  }

  const configuredSecret = process.env.RESEND_WEBHOOK_SECRET;

  if (!configuredSecret || !secret || secret !== configuredSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const eventType = payload.type; // 'email.delivered', 'email.bounced', 'email.delivery_failed', 'email.sent'
    const emailId = payload.data?.email_id; // Maps to resend_id in our DB

    if (!emailId || !eventType) {
      return NextResponse.json({ error: "Missing email_id or event type" }, { status: 400 });
    }

    const supabase = createAdminClient() as any;

    // Map Resend events to email_logs statuses
    let newStatus = "sent";
    let errorDetail = null;

    if (eventType === "email.delivered") {
      newStatus = "delivered";
    } else if (eventType === "email.bounced" || eventType === "email.delivery_failed") {
      newStatus = "failed";
      errorDetail = payload.data?.error || `Resend Event: ${eventType}`;
    }

    // Update the record in email_logs
    const { error } = await supabase
      .from("email_logs")
      .update({
        status: newStatus,
        error: errorDetail,
        updated_at: new Date().toISOString(),
      })
      .eq("resend_id", emailId);

    if (error) {
      console.error("Error updating email log from Resend webhook:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: err.message || "Failed to process webhook" }, { status: 500 });
  }
}
