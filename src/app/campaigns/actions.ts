"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Anthropic from "@anthropic-ai/sdk";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { campaign, post } from "@/db/schema";

const anthropic = new Anthropic();

export async function createCampaign(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const name = String(formData.get("name") ?? "").trim();
  const brief = String(formData.get("brief") ?? "").trim();
  const postCount = Math.min(10, Math.max(1, Number(formData.get("postCount") ?? 3)));

  if (!name || !brief) return;

  const now = new Date();
  const campaignId = crypto.randomUUID();

  await db.insert(campaign).values({
    id: campaignId,
    userId: session.user.id,
    name,
    brief,
    status: "active",
    startDate: now,
    createdAt: now,
    updatedAt: now,
  });

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `You are a social media content creator. Generate exactly ${postCount} social media posts for the following campaign brief. Return ONLY a JSON array of objects with "content" and "platforms" keys. platforms should be an array like ["twitter"] or ["instagram","linkedin"]. Do not include any other text.

Campaign: ${name}
Brief: ${brief}`,
      },
    ],
  });

  const responseText = message.content[0].type === "text" ? message.content[0].text : "[]";

  let generatedPosts: Array<{ content: string; platforms: string[] }> = [];
  try {
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      generatedPosts = JSON.parse(jsonMatch[0]);
    }
  } catch {
    generatedPosts = [];
  }

  if (generatedPosts.length > 0) {
    await db.insert(post).values(
      generatedPosts.slice(0, postCount).map((p) => ({
        id: crypto.randomUUID(),
        userId: session.user.id,
        campaignId,
        content: p.content ?? "",
        platforms: JSON.stringify(Array.isArray(p.platforms) ? p.platforms : ["twitter"]),
        status: "draft" as const,
        createdAt: now,
        updatedAt: now,
      }))
    );
  }

  redirect(`/campaigns/${campaignId}`);
}

export async function updateCampaignStatus(campaignId: string, status: "active" | "paused" | "completed") {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { eq, and } = await import("drizzle-orm");

  await db
    .update(campaign)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(campaign.id, campaignId), eq(campaign.userId, session.user.id)));
}
