import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAnthropicClient } from "@/lib/ai/claude";

export async function GET(request: Request) {
  try {
    // 1. Verify user session
    let session = await getServerSession(authOptions);
    const bypass = process.env.NODE_ENV === "development" && process.env.BYPASS_ADMIN_AUTH === "true";

    if (bypass) {
      session = {
        user: {
          id: "00000000-0000-0000-0000-000000000000",
          name: "Dev Admin",
          email: "admin@shopdaddyprince.com"
        },
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      };
    }

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!bypass) {
      // 2. Verify admin role in Database
      const supabase = createAdminClient() as any;
      const { data: requester, error: reqErr } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", session.user.id)
        .maybeSingle();

      if (reqErr || !requester || requester.role !== "admin") {
        return NextResponse.json({ error: "Forbidden: Admin role required" }, { status: 403 });
      }
    }

    const apiKeyDetected = !!process.env.ANTHROPIC_API_KEY;
    const modelName = "claude-sonnet-4-6";
    let connectionSuccess = false;
    let errorMessage = null;

    if (apiKeyDetected) {
      try {
        const client = getAnthropicClient();
        console.log(`[Health Check] Verifying Anthropic connection with model: ${modelName}`);
        await client.messages.create({
          model: modelName,
          max_tokens: 1,
          messages: [{ role: "user", content: "Ping" }]
        });
        connectionSuccess = true;
      } catch (err: any) {
        console.error("[Health Check] Anthropic API connection failed:", err);
        errorMessage = err.message || "Unknown error occurred";
      }
    } else {
      errorMessage = "Anthropic API key is missing from environment variables.";
    }

    return NextResponse.json({
      apiKeyDetected,
      modelName,
      connectionSuccess,
      error: errorMessage
    });

  } catch (error: any) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during health check." },
      { status: 500 }
    );
  }
}
