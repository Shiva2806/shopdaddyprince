import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  generateProductDescription,
  generateCollectionDescription,
  generateSeoMetadata,
  analyzeProductImage
} from "@/lib/ai/claude";
import { runAgent } from "@/lib/ai/agent";

// Schema for input validation
const routeSchema = z.object({
  type: z.enum(["product", "collection", "seo", "test", "vision"]),
  params: z.record(z.any()).optional().default({}),
});

export async function POST(request: Request) {
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

    // 3. Parse input request
    const body = await request.json();

    // Handle legacy chat/message format (Add/Edit product descriptions)
    if ("message" in body) {
      const { message, history } = body;
      if (!message || typeof message !== "string") {
        return NextResponse.json({ error: "Message is required" }, { status: 400 });
      }
      const reply = await runAgent(history || [], message);
      return NextResponse.json({ reply });
    }

    const parsed = routeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request data structure", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { type, params } = parsed.data;

    // 4. Dispatch tasks based on type
    if (type === "vision") {
      const { image, price, optionalParams } = params;
      if (!image || !price) {
        return NextResponse.json(
          { error: "Image and Price are required for visual product analysis." },
          { status: 400 }
        );
      }

      // Extract raw base64 and media type from data URL
      let base64Data = image;
      let mediaType = "image/jpeg";
      if (image.startsWith("data:")) {
        const match = image.match(/^data:([^;]+);base64,(.*)$/);
        if (match) {
          mediaType = match[1];
          base64Data = match[2];
        }
      }

      const output = await analyzeProductImage(
        base64Data,
        mediaType,
        price,
        optionalParams
      );
      return NextResponse.json({ data: output });
    }

    if (type === "product") {
      const { name, category, subcategory, material, dimensions, region, price } = params;
      if (!name || !category || !subcategory || !material || !dimensions || !region) {
        return NextResponse.json(
          { error: "Missing required product properties (name, category, subcategory, material, dimensions, region)." },
          { status: 400 }
        );
      }
      const output = await generateProductDescription({
        name,
        category,
        subcategory,
        material,
        dimensions,
        region,
        price,
      });
      return NextResponse.json({ data: output });
    } 
    
    if (type === "collection") {
      const { name, category, region } = params;
      if (!name || !category) {
        return NextResponse.json(
          { error: "Missing required collection properties (name, category)." },
          { status: 400 }
        );
      }
      const output = await generateCollectionDescription({
        name,
        category,
        region,
      });
      return NextResponse.json({ data: output });
    } 
    
    if (type === "seo") {
      const { name, category, description } = params;
      if (!name || !category || !description) {
        return NextResponse.json(
          { error: "Missing required SEO properties (name, category, description)." },
          { status: 400 }
        );
      }
      const output = await generateSeoMetadata({
        name,
        category,
        description,
      });
      return NextResponse.json({ data: output });
    } 
    
    if (type === "test") {
      // Simulated integration response matching the vision JSON output schema
      return NextResponse.json({
        data: {
          detectedMetadata: {
            productName: "Kalamkari Ramayana Painting",
            category: "paintings",
            subcategory: "kalamkari",
            material: "Natural mineral pigments on hand-woven cotton canvas",
            style: "Srikalahasti School of Kalamkari",
            regionOfOrigin: "Srikalahasti, Andhra Pradesh",
            suggestedDimensions: "36 x 24 inches",
            tags: ["kalamkari", "ramayana", "paintings", "mythology", "heritage"],
            keywords: ["kalamkari ramayana painting", "traditional indian art", "mythological paintings"]
          },
          narrative: {
            productTitle: "Handpainted Kalamkari Ramayana Heritage Canvas",
            shortDescription: "An extraordinary hand-painted Kalamkari canvas depicting epic narratives from the Ramayana in organic mineral pigments.",
            longDescription: "Crafted on hand-loomed cotton, this museum-grade Kalamkari painting depicts scenes from the sacred Ramayana epic. Each detail is painstakingly drawn with a bamboo pen (kalam) using traditional vegetable dyes and mineral extracts. The earthy color palette of deep indigo, madder red, and mustard yellow is typical of classical Temple hangings, giving it an authentic vintage allure.\n\nThe Srikalahasti style relies on fine outline drawing followed by manual coloring. This makes each depiction of deities and elements completely unique. Suitable as a primary focal work in fine residences and heritage spaces.",
            heritageStory: "Kalamkari, meaning 'pen-craftsmanship,' has its roots in the medieval temples of Andhra Pradesh. Srikalahasti remains the heart of this ancient lineage, preserving natural organic dyeing processes that require up to twenty-three steps of washing, treating, drawing, and boiling.",
            keyHighlights: [
              "Hand-drawn using traditional bamboo pen (kalam)",
              "100% natural organic vegetable dyes and mineral pigments",
              "Srikalahasti temple-hanging lineage style",
              "Depicts central scenes from the Ramayana epic"
            ]
          },
          seo: {
            seoTitle: "Kalamkari Ramayana Painting | Indian Heritage Art | Daddy Prince",
            metaDescription: "Discover museum-grade Srikalahasti Kalamkari Ramayana paintings at Daddy Prince. Hand-painted with natural dyes on cotton canvas for fine art collectors.",
            keywords: ["kalamkari ramayana painting", "srikalahasti kalamkari", "indian heritage art paintings", "daddy prince gallery"],
            slugSuggestions: ["kalamkari-ramayana-painting-srikalahasti", "handpainted-ramayana-kalamkari"]
          }
        }
      });
    }

    return NextResponse.json({ error: "Unsupported operation type" }, { status: 400 });
  } catch (error: any) {
    console.error("AI API Error:", error);
    return NextResponse.json(
      { error: error.message || "An error occurred during content generation." },
      { status: 500 }
    );
  }
}
