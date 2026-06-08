import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import AccountClient from "@/components/store/account/AccountClient";
import type { Order, UserProfile } from "@/types";

export const metadata = {
  title: "My Account | Daddy Prince",
  description: "Manage your collector profile, orders, addresses, and wishlist.",
};

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const userId = (session.user as any)?.id;
  if (!userId) {
    redirect("/login");
  }

  const supabase = createAdminClient();
  
  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  // Fetch orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (
    <AccountClient
      session={session}
      initialProfile={(profile as unknown as UserProfile) || null}
      initialOrders={(orders as unknown as Order[]) || []}
    />
  );
}
