import { runAgent, type AgentMessage } from "@/lib/ai/agent";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1),
  history: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string(),
    })
  ).default([]),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  // TODO: also verify user.role === "admin"
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { message, history } = parsed.data;

  const reply = await runAgent(history as AgentMessage[], message);
  return NextResponse.json({ reply });
}
