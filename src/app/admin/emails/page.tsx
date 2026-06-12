import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import EmailsClient from "./EmailsClient";

export const dynamic = "force-dynamic";

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

export default async function AdminEmailsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const isAdmin = await verifyAdmin(session.user.id);
  if (!isAdmin) {
    redirect("/");
  }

  const supabase = createAdminClient() as any;

  // 1. Fetch products to select for launches
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, slug, images")
    .eq("status", "active")
    .order("name", { ascending: true });

  // 2. Fetch email logs
  const { data: logs } = await supabase
    .from("email_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  // 3. Count subscribers
  const { count: listCount } = await supabase
    .from("newsletter_subscribers")
    .select("*", { count: "exact", head: true });

  const { count: customerCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "customer");

  return (
    <EmailsClient
      initialProducts={products || []}
      initialLogs={logs || []}
      newsletterCount={listCount || 0}
      registeredCount={customerCount || 0}
    />
  );
}
