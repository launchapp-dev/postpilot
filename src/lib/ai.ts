import Anthropic from "@anthropic-ai/sdk";

export const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  instagram: 2200,
  tiktok: 2200,
  bluesky: 300,
  threads: 500,
};

const client = new Anthropic();

export async function generatePost(
  prompt: string,
  platforms: string[],
  tone: string
): Promise<string> {
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
