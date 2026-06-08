import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { redirect, notFound } from "next/navigation";
import OrderDetailClient from "./OrderDetailClient";

export const metadata = {
  title: "Admin Order Details | Daddy Prince",
};

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    redirect("/login");
  }

  const supabase = createAdminClient() as any;

  // Verify requester is admin
  const { data: requester, error: reqErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (reqErr || !requester || requester.role !== "admin") {
    redirect("/");
  }

  // Fetch specific order details
  const { data: order, error: fetchErr } = await supabase
    .from("orders")
    .select("*, profiles(email)")
    .eq("id", params.id)
    .maybeSingle();

  if (fetchErr || !order) {
    notFound();
  }

  return <OrderDetailClient initialOrder={order} />;
}
