import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
  tiktok: 2200,
  bluesky: 300,
  threads: 500,
};

export async function generatePostContent(
  prompt: string,
  platforms: string[],
  tone: string
): Promise<Record<string, string>> {
  const platformList = platforms.join(", ");
  const limits = platforms
    .map((p) => `${p}: ${PLATFORM_LIMITS[p] ?? 500} chars`)
    .join(", ");

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are a social media copywriter. Generate post content for the following platforms: ${platformList}.

Tone: ${tone}
Topic/Instructions: ${prompt}

Character limits per platform: ${limits}

Respond with a JSON object where keys are platform names and values are the post content. Stay within character limits. Example:
{"twitter": "...", "linkedin": "..."}

Only return the JSON object, no other text.`,
      },
    ],
  });

  const text = message.content[0].type === "text" ? message.content[0].text : "";
  try {
    return JSON.parse(text);
  } catch {
    const result: Record<string, string> = {};
    for (const platform of platforms) {
      result[platform] = text;
    }
    return result;
  }
}

export { PLATFORM_LIMITS };
