import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient() as any;

  // Verify requester is admin
  const { data: requester, error: reqErr } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .maybeSingle();

  if (reqErr || !requester || requester.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch profiles with role = 'customer'
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (profErr) {
    return NextResponse.json({ error: profErr.message }, { status: 500 });
  }

  // Fetch all orders to aggregate
  const { data: orders, error: ordErr } = await supabase
    .from("orders")
    .select("id, user_id, total, shipping_address, created_at");

  if (ordErr) {
    return NextResponse.json({ error: ordErr.message }, { status: 500 });
  }

  // Group orders by user_id
  const ordersByUser: Record<string, any[]> = {};
  orders?.forEach((o: any) => {
    if (!ordersByUser[o.user_id]) {
      ordersByUser[o.user_id] = [];
    }
    ordersByUser[o.user_id].push(o);
  });

  const getInitials = (name: string) => {
    if (!name) return "??";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const customers = profiles.map((p: any) => {
    const userOrders = ordersByUser[p.id] || [];
    const ordersCount = userOrders.length;
    const totalSpent = userOrders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);

    // Get city from latest order
    let city = "N/A";
    if (ordersCount > 0) {
      // Sort orders descending by created_at
      const sorted = [...userOrders].sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const latestOrder = sorted[0];
      if (latestOrder.shipping_address && typeof latestOrder.shipping_address === "object") {
        city = (latestOrder.shipping_address as any).city || "N/A";
      }
    }

    const joined = new Date(p.created_at).toLocaleDateString("en-IN", {
      month: "short",
      year: "numeric",
    });

    return {
      id: p.id,
      name: p.full_name || "Guest Collector",
      email: p.email,
      city,
      orders: ordersCount,
      spent: totalSpent,
      joined,
      avatar: getInitials(p.full_name || p.email),
    };
  });

  return NextResponse.json({ data: customers });
}
