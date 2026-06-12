import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";

const cartSyncSchema = z.object({
  items: z.array(z.any()),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = cartSyncSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const { items } = parsed.data;
    const supabase = createAdminClient() as any;

    // Upsert cart in database. If items list is empty, we still upsert but it won't be flagged as abandoned
    const { error } = await supabase
      .from("carts")
      .upsert({
        user_id: session.user.id,
        items,
        updated_at: new Date().toISOString(),
        email_sent: false, // Reset email_sent so they can be triggered again if abandoned later
      }, {
        onConflict: "user_id"
      });

    if (error) {
      console.error("Error syncing cart to database:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to sync cart" }, { status: 500 });
  }
}
