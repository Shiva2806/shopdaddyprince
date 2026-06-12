import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/resend";
import { getNewsletterWelcomeEmail, generateUnsubscribeToken } from "@/utils/emailTemplates";
import { NextResponse } from "next/server";
import { z } from "zod";

// Simple in-memory rate limiter configuration
const WINDOW_SIZE_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 5; // max 5 subscription requests per 15 mins
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW_SIZE_MS });
    return false;
  }
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + WINDOW_SIZE_MS;
    return false;
  }
  record.count += 1;
  return record.count > MAX_REQUESTS;
}

const schema = z.object({
  email: z.string().email(),
  name_field: z.string().optional(), // Honeypot field
});

export async function POST(request: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = getClientIp(request);
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in 15 minutes." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    const { email, name_field } = parsed.data;

    // 2. Honeypot Check
    if (name_field) {
      console.warn(`[NEWSLETTER_SPAM_DETECTED] Honeypot field was filled for: ${email}`);
      // Return success to quiet spam bots
      return NextResponse.json({ success: true, message: "Welcome to the Collector's Circle!" });
    }

    const supabase = createAdminClient() as any;

    // Check if user is already subscribed
    const { data: subscriber, error: fetchErr } = await supabase
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (fetchErr) {
      console.error("Error checking newsletter subscriber:", fetchErr);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (subscriber) {
      // Already subscribed, return success to customer to avoid exposing details
      return NextResponse.json({ success: true, message: "Already subscribed." });
    }

    // Insert new subscriber
    const { error: insertErr } = await supabase
      .from("newsletter_subscribers")
      .insert({ email });

    if (insertErr) {
      console.error(`[NEWSLETTER_SIGNUP_ERROR] Failed to save subscriber ${email} to database:`, insertErr);
      return NextResponse.json({ error: "Failed to join list." }, { status: 500 });
    }

    // Send Welcome Email
    console.log(`[NEWSLETTER_EMAIL_TRIGGERED] sending welcome email for newsletter sign up: ${email}`);
    const { subject, html } = getNewsletterWelcomeEmail(email);
    await sendEmail({
      to: email,
      subject,
      html,
      emailType: "newsletter_welcome",
    });

    console.log(`[NEWSLETTER_SIGNUP_SUCCESS] Saved to DB & Welcome Email triggered for: ${email}`);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[NEWSLETTER_SIGNUP_ERROR] Newsletter API exception occurred:", err);
    return NextResponse.json({ error: err.message || "Something went wrong." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 });
    }

    if (!token || token !== generateUnsubscribeToken(email)) {
      return NextResponse.json({ error: "Invalid or missing unsubscribe token" }, { status: 400 });
    }

    const supabase = createAdminClient() as any;
    const { error } = await supabase
      .from("newsletter_subscribers")
      .delete()
      .eq("email", email);

    if (error) {
      console.error("Error deleting newsletter subscriber:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Successfully unsubscribed" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to unsubscribe" }, { status: 500 });
  }
}
