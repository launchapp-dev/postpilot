import Anthropic from "@anthropic-ai/sdk";

export const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
  tiktok: 2200,
  bluesky: 300,
  threads: 500,
};

export async function generatePost(
  prompt: string,
  platforms: string[],
  tone: string
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const platformList = platforms.join(", ");

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system:
      "You are an expert social media copywriter. Generate engaging, platform-native content optimized for each platform's best practices. Return only the post content with no additional explanation.",
    messages: [
      {
        role: "user",
        content: `Write a social media post for: ${platformList}\nTone: ${tone}\nRequest: ${prompt}\n\nReturn only the post content.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from AI");
  return content.text;
}

export async function rephrasePost(
  originalContent: string,
  platforms: string[]
): Promise<string> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const platformList = platforms.join(", ");

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 1024,
    system:
      "You are an expert social media copywriter. Rewrite the given post with a fresh angle and different phrasing while keeping the same core topic and message. Return only the rephrased post content with no additional explanation.",
    messages: [
      {
        role: "user",
        content: `Rephrase this post for ${platformList} with a fresh angle:\n\n${originalContent}\n\nReturn only the rephrased content.`,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== "text") throw new Error("Unexpected response type from AI");
  return content.text;
}
