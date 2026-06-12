import { razorpay } from "@/lib/razorpay/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";
import { calculateServerTotal } from "@/utils/payment";

const schema = z.object({
  items: z.array(
    z.object({
      product_id: z.string(),
      quantity: z.number().int().positive(),
      variant_id: z.string().optional(),
    })
  ).min(1, "Cart must contain at least one item"),
  currency: z.string().default("INR"),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid request payload" }, { status: 400 });
    }

    const { items, currency } = parsed.data;

    // Calculate secure server-side total
    const { total } = await calculateServerTotal(items);

    const order = await razorpay.orders.create({
      amount: total,
      currency,
      receipt: `dp_${Date.now()}`,
    });

    return NextResponse.json({ data: order });
  } catch (error: any) {
    console.error("Razorpay order creation failed:", error);
    
    // Check if it's an authorization/authentication failure
    if (error.statusCode === 401 || (error.message && /auth|key|unauthorized|credential/i.test(error.message))) {
      return NextResponse.json({ error: "Razorpay authentication failed. Please verify API keys." }, { status: 401 });
    }
    
    return NextResponse.json({ error: error.message || "Failed to create order on payment gateway" }, { status: 500 });
  }
}
