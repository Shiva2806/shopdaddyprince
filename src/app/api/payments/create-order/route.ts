import { razorpay } from "@/lib/razorpay/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  amount: z.number().positive(), // in paise
  currency: z.string().default("INR"),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { amount, currency } = parsed.data;

  const order = await razorpay.orders.create({
    amount,
    currency,
    receipt: `dp_${Date.now()}`,
  });

  return NextResponse.json({ data: order });
}
