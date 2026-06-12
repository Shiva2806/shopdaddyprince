import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";

// Helper to verify if user is an admin
async function verifyAdmin(userId: string) {
  const supabase = createAdminClient() as any;
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  if (error || !profile || profile.role !== "admin") {
    return false;
  }
  return true;
}

// GET /api/admin/orders — list all orders for admin
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await verifyAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = createAdminClient() as any;
  const { data: orders, error: fetchErr } = await supabase
    .from("orders")
    .select("*, profiles(email)")
    .order("created_at", { ascending: false });

  if (fetchErr) {
    console.error("Admin list orders error:", fetchErr);
    return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  }

  return NextResponse.json({ data: orders });
}

// PATCH /api/admin/orders — update status of an order for admin
export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isAdmin = await verifyAdmin(session.user.id);
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing order ID or status" }, { status: 400 });
    }

    const supabase = createAdminClient() as any;

    // Fetch existing order to check previous status and prevent duplicate email dispatch
    const { data: existingOrder, error: fetchErr } = await supabase
      .from("orders")
      .select("status")
      .eq("id", id)
      .single();

    if (fetchErr || !existingOrder) {
      console.error(`Error fetching order ${id} before status update:`, fetchErr);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const previousStatus = existingOrder.status;

    const { data: order, error: updateErr } = await supabase
      .from("orders")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (updateErr) {
      console.error("Admin update order status error:", updateErr);
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    // Trigger status update emails asynchronously
    if (status === "shipped" || status === "delivered") {
      if (previousStatus !== status) {
        (async () => {
          try {
            console.log(`[ORDER_${status.toUpperCase()}_EMAIL_TRIGGERED] Preparing to send status: ${status} email for order: ${id}`);
            const { data: fullOrder } = await supabase
              .from("orders")
              .select("*, profiles(email, full_name)")
              .eq("id", id)
              .single();

            if (fullOrder && fullOrder.profiles) {
              const email = fullOrder.profiles.email;
              const customerName = fullOrder.shipping_address?.full_name || fullOrder.profiles.full_name || "Collector";

              if (email && !email.endsWith("@phone.daddyprince.com")) {
                const { getOrderShippedEmail, getOrderDeliveredEmail } = await import("@/utils/emailTemplates");
                const { sendEmail } = await import("@/lib/resend");

                const { subject, html } = status === "shipped"
                  ? getOrderShippedEmail(fullOrder, customerName, email)
                  : getOrderDeliveredEmail(fullOrder, customerName, email);

                await sendEmail({
                  to: email,
                  subject,
                  html,
                  emailType: status === "shipped" ? "order_shipped" : "order_delivered",
                  recipientName: customerName,
                  metadata: { order_id: id },
                });
              } else {
                console.log(`[ORDER_${status.toUpperCase()}_EMAIL_SKIPPED] Skipped email sending for phone-login/no-email user: ${email}`);
              }
            }
          } catch (emailErr) {
            console.error(`Failed to send order ${status} email:`, emailErr);
          }
        })();
      } else {
        console.log(`[ORDER_${status.toUpperCase()}_EMAIL_SKIPPED] Order status is already ${status}. Duplicate email dispatch prevented.`);
      }
    }

    return NextResponse.json({ data: order });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update order" }, { status: 500 });
  }
}
