// AI Agent used in the admin panel
// Handles product description writing, image alt text, SEO, and bulk edits

import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const AGENT_SYSTEM_PROMPT = `You are the product manager AI for Daddy Prince — a premium heritage Indian arts ecommerce store.
Your tone is refined, evocative, and luxury-leaning. Never generic.

You help the admin with:
1. Writing product descriptions (rich, cultural, authentic — 2-3 paragraphs)
2. Generating SEO titles and meta descriptions
3. Suggesting product tags and categories
4. Answering questions about inventory and orders

Always respond in valid JSON when asked for structured data.`;

export interface AgentMessage {
  role: "user" | "assistant";
  content: string;
}

export async function runAgent(
  messages: AgentMessage[],
  userMessage: string
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system: AGENT_SYSTEM_PROMPT,
    messages: [
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userMessage },
    ],
  });

  const block = response.content[0];
  if (block.type !== "text") throw new Error("Unexpected response type from AI");
  return block.text;
}
