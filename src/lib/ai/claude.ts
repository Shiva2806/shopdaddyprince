import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Anthropic API key is missing. Please set the ANTHROPIC_API_KEY environment variable in .env.local."
      );
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

// Brand guidelines and tone prompt for Claude
export const BRAND_SYSTEM_PROMPT = `You are the official copywriter for Daddy Prince.

Daddy Prince is a luxury Indian heritage brand specializing in curated paintings, brass artifacts, regional arts, vintage collectibles, handcrafted decor, and museum-grade cultural pieces.

Tone:
- Premium
- Elegant
- Heritage-focused
- Editorial
- Sophisticated

Focus on:
- Craftsmanship
- Legacy
- Cultural significance
- Artisan traditions
- Authenticity

Avoid:
- Generic marketing language
- Cheap sales language
- Overhyped claims`;

/**
 * Strips code block tags (e.g., ```json ... ```) and parses Claude's output as JSON
 */
function parseClaudeJson<T>(text: string): T {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  }
  try {
    return JSON.parse(cleaned) as T;
  } catch (err: any) {
    console.error("Failed to parse JSON from Claude response:", text);
    throw new Error("Claude returned invalid JSON format: " + err.message);
  }
}

/**
 * Intercepts Anthropic API key / billing / model errors and turns them into user-friendly instructions.
 */
async function wrapAnthropicCall<T>(fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    console.error("Anthropic API Error:", error);
    // Intercept model not found (404) or key permission errors and translate to a user-friendly message
    if (
      error.status === 404 ||
      error.message?.includes("model:") ||
      error.message?.includes("not found") ||
      error.message?.includes("not_found_error")
    ) {
      throw new Error(
        "The requested Claude model is not available. This usually happens if your Anthropic API key has restricted model permissions, or if the account needs funding (insufficient billing balance). Please check your Anthropic Console (console.anthropic.com) billing status."
      );
    }
    throw error;
  }
}

/**
 * Helper to run the Sonnet model with system and user prompts
 */
async function runClaudeSonnet(systemPrompt: string, userPrompt: string): Promise<string> {
  return wrapAnthropicCall(async () => {
    const anthropic = getAnthropicClient();
    const modelName = "claude-sonnet-4-6";
    console.log(`Calling Anthropic API with model: ${modelName}`);
    
    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 2000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }
    return block.text;
  });
}

// Interfaces for structured generators

export interface ProductGeneratorInput {
  name: string;
  category: string;
  subcategory: string;
  material: string;
  dimensions: string;
  region: string;
  price?: string;
}

export interface ProductGeneratorOutput {
  shortDescription: string;
  longDescription: string;
  keyHighlights: string[];
  productStory: string;
}

export interface CollectionGeneratorInput {
  name: string;
  category: string;
  region?: string;
}

export interface CollectionGeneratorOutput {
  introduction: string;
  heritageStory: string;
  description: string;
  seoCopy: string;
}

export interface SeoGeneratorInput {
  name: string;
  category: string;
  description: string;
}

export interface SeoGeneratorOutput {
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  slugSuggestions: string[];
}

export interface VisionAnalysisOutput {
  productName: string;
  description: string;
  tags: string[];
  category: string;
  subcategory: string;
  priceSuggestion?: string;
  variants: {
    dimension: string;
    price: string;
    sale_price?: string;
    stock: string;
    color?: string;
    sku?: string;
  }[];
  isFeatured?: boolean;
}

/**
 * A. Product Description Generator
 */
export async function generateProductDescription(
  params: ProductGeneratorInput
): Promise<ProductGeneratorOutput> {
  const userPrompt = `Write product copy details for the following item:
- Product Name: ${params.name}
- Category: ${params.category}
- Subcategory: ${params.subcategory}
- Material: ${params.material}
- Dimensions: ${params.dimensions}
${params.price ? `- Price: ₹${params.price}` : ""}

Return a valid JSON object matching the structure below. Return ONLY the raw JSON object. Do not include any explanations, preambles, or markdown wrappers.

JSON Structure:
{
  "shortDescription": "A refined, luxury short description (1-2 sentences).",
  "longDescription": "Evocative, heritage-focused editorial content (2-3 paragraphs).",
  "keyHighlights": ["Highlight 1", "Highlight 2", "Highlight 3", "Highlight 4"],
  "productStory": "The cultural story or significance behind the art style/piece."
}`;

  const textOutput = await runClaudeSonnet(BRAND_SYSTEM_PROMPT, userPrompt);
  return parseClaudeJson<ProductGeneratorOutput>(textOutput);
}

/**
 * B. Collection Description Generator
 */
export async function generateCollectionDescription(
  params: CollectionGeneratorInput
): Promise<CollectionGeneratorOutput> {
  const userPrompt = `Write collection descriptions and copy for the following collection:
- Collection Name: ${params.name}
- Category: ${params.category}
- Region: ${params.region || "India"}

Return a valid JSON object matching the structure below. Return ONLY the raw JSON object. Do not include any explanations, preambles, or markdown wrappers.

JSON Structure:
{
  "introduction": "High-end collection introduction (1-2 paragraphs).",
  "heritageStory": "Editorial story of the history, region, and artisans of this collection.",
  "description": "Formal, elegant collection description.",
  "seoCopy": "High-converting, brand-aligned marketing copy optimized for search engines."
}`;

  const textOutput = await runClaudeSonnet(BRAND_SYSTEM_PROMPT, userPrompt);
  return parseClaudeJson<CollectionGeneratorOutput>(textOutput);
}

/**
 * C. SEO Generator
 */
export async function generateSeoMetadata(
  params: SeoGeneratorInput
): Promise<SeoGeneratorOutput> {
  const userPrompt = `Generate SEO configurations for:
- Product/Collection Name: ${params.name}
- Category: ${params.category}
- Description: ${params.description}

Return a valid JSON object matching the structure below. Return ONLY the raw JSON object. Do not include any explanations, preambles, or markdown wrappers.

JSON Structure:
{
  "seoTitle": "Premium brand-aligned SEO Title (under 60 chars) including 'Daddy Prince'.",
  "metaDescription": "Captivating search description (under 160 chars).",
  "keywords": ["keyword 1", "keyword 2", "keyword 3", "keyword 4", "keyword 5"],
  "slugSuggestions": ["slug-option-1", "slug-option-2", "slug-option-3"]
}`;

  const textOutput = await runClaudeSonnet(BRAND_SYSTEM_PROMPT, userPrompt);
  return parseClaudeJson<SeoGeneratorOutput>(textOutput);
}

/**
 * D. Claude Vision Image Analysis
 */
export async function analyzeProductImage(
  base64Image: string,
  mediaType: string,
  price: string,
  optionalParams?: {
    name?: string;
    dimensions?: string;
    material?: string;
    category?: string;
  }
): Promise<VisionAnalysisOutput> {
  return wrapAnthropicCall(async () => {
    const anthropic = getAnthropicClient();
    
    // Construct instructions using any optional inputs provided by the admin
    let contextInstructions = "";
    if (optionalParams) {
      if (optionalParams.name) contextInstructions += `- Pre-entered Name: ${optionalParams.name}\n`;
      if (optionalParams.category) contextInstructions += `- Pre-entered Category: ${optionalParams.category}\n`;
      if (optionalParams.material) contextInstructions += `- Pre-entered Material: ${optionalParams.material}\n`;
      if (optionalParams.dimensions) contextInstructions += `- Pre-entered Dimensions: ${optionalParams.dimensions}\n`;
    }

    const systemPrompt = BRAND_SYSTEM_PROMPT + `\n\nYou are an expert in heritage Indian art, lost-wax bronze castings, traditional paintings, and antiques. Your task is to analyze the image of a heritage item and its price, identify key cultural details, and output a complete product detail package matching the required fields.`;

    const userPrompt = `Analyze the uploaded image of this heritage item.
Price of the item is ₹${price}.
${contextInstructions ? `The admin has provided the following optional context clues to assist you:\n${contextInstructions}` : ""}

Please identify the item's details and generate a valid JSON object matching the exact structure below. Do not output any preamble, code block markdown, or conversational text. Return ONLY the raw JSON.

JSON Structure:
{
  "productName": "An elegant, premium product name reflecting the craft and object type (use the pre-entered name if helpful, otherwise generate a luxury title)",
  "description": "Evocative, heritage-focused editorial description (2-3 paragraphs detailing the craft, craftsmanship, visual aesthetics, and placement).",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5", "tag6", "tag7"],
  "category": "Must be one of: paintings, home-decor, regional-arts, brass, vintage (select the best matching category)",
  "subcategory": "Specific subcategory or craft genre (e.g. traditional screen arts, wall decor, kondapalli toys, cheriyal art, patachitra)",
  "priceSuggestion": "Optional price recommendation in INR based on your analysis of quality/rarity, or just return the input price ${price}",
  "variants": [
    {
      "dimension": "Size/Dimension of this variant (e.g. 12x16 inches or small, medium, large)",
      "price": "Price in INR for this variant",
      "sale_price": "Optional sale price in INR",
      "stock": "Initial stock quantity (e.g. 1 or 2)",
      "color": "Color option for this variant (e.g. Gold, Bronze, Red, Black)",
      "sku": "Optional generated SKU"
    }
  ],
  "isFeatured": true/false (Recommendation on whether this is a high-value showpiece suitable for featured banner display)
}`;

    const modelName = "claude-sonnet-4-6";
    console.log(`Calling Anthropic API with model (Vision): ${modelName}`);

    const response = await anthropic.messages.create({
      model: modelName,
      max_tokens: 3000,
      temperature: 0.7,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType as any,
                data: base64Image,
              },
            },
            {
              type: "text",
              text: userPrompt,
            },
          ],
        },
      ],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    return parseClaudeJson<VisionAnalysisOutput>(block.text);
  });
}
