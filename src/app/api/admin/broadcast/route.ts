import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { getNewsletterCampaignEmail, getCollectionBroadcastEmail } from "@/utils/emailTemplates";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";

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

const broadcastSchema = z.object({
  type: z.enum(["newsletter", "collection"]),
  subject: z.string().optional(),
  content: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  product_ids: z.array(z.string()).optional(),
});

export async function POST(request: Request) {
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
    const parsed = broadcastSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload parameters", details: parsed.error.format() }, { status: 400 });
    }

    const { type, subject, content, title, description, product_ids } = parsed.data;
    const supabase = createAdminClient() as any;

    // 1. Gather all subscribers
    // Fetch from newsletter list
    const { data: listSubscribers } = await supabase
      .from("newsletter_subscribers")
      .select("email");

    // Fetch from profiles table
    const { data: profileCustomers } = await supabase
      .from("profiles")
      .select("email")
      .eq("role", "customer");

    // Merge and deduplicate
    const emailSet = new Set<string>();
    
    (listSubscribers || []).forEach((s: any) => {
      if (s.email) emailSet.add(s.email.trim().toLowerCase());
    });

    (profileCustomers || []).forEach((c: any) => {
      if (c.email && !c.email.endsWith("@phone.daddyprince.com")) {
        emailSet.add(c.email.trim().toLowerCase());
      }
    });

    const recipientEmails = Array.from(emailSet);

    if (recipientEmails.length === 0) {
      return NextResponse.json({ error: "No subscribers found to send this broadcast to." }, { status: 400 });
    }

    let successCount = 0;
    let failCount = 0;

    // 2. Process based on broadcast type
    if (type === "newsletter") {
      if (!subject || !content) {
        return NextResponse.json({ error: "Subject and Content are required for newsletters" }, { status: 400 });
      }

      // Loop and send newsletter
      for (const email of recipientEmails) {
        const { subject: templateSubj, html } = getNewsletterCampaignEmail(subject, content, email);
        const res = await sendEmail({
          to: email,
          subject: templateSubj,
          html,
          emailType: "collection_broadcast", // Uses this category for tracking
          metadata: { campaign: "newsletter_broadcast" },
        });

        if (res.success) successCount++;
        else failCount++;
      }

    } else if (type === "collection") {
      if (!title || !description || !product_ids || product_ids.length === 0) {
        return NextResponse.json({ error: "Title, Description, and Products are required for collection broadcasts" }, { status: 400 });
      }

      // Fetch matching products
      const { data: products, error: prodErr } = await supabase
        .from("products")
        .select("id, name, price, slug, images")
        .in("id", product_ids);

      if (prodErr || !products || products.length === 0) {
        return NextResponse.json({ error: "Failed to load specified products. Check product IDs." }, { status: 400 });
      }

      // Loop and send collection broadcast
      for (const email of recipientEmails) {
        const { subject: templateSubj, html } = getCollectionBroadcastEmail(title, description, products, email);
        const res = await sendEmail({
          to: email,
          subject: templateSubj,
          html,
          emailType: "collection_broadcast",
          metadata: { campaign: "collection_broadcast", products: product_ids },
        });

        if (res.success) successCount++;
        else failCount++;
      }
    }

    return NextResponse.json({
      success: true,
      recipients: recipientEmails.length,
      successCount,
      failCount,
    });

  } catch (err: any) {
    console.error("Failed to process admin broadcast:", err);
    return NextResponse.json({ error: err.message || "Failed to process campaign broadcast" }, { status: 500 });
  }
}
