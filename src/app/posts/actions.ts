"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { generatePostContent } from "@/lib/ai";

async function requireUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  return session.user;
}

export async function createPost(data: {
  content: string;
  platforms: string[];
  status: "draft" | "scheduled";
  scheduledAt?: Date;
}) {
  const user = await requireUser();
  const now = new Date();
  const id = randomUUID();
  await db.insert(post).values({
    id,
    userId: user.id,
    content: data.content,
    platforms: JSON.stringify(data.platforms),
    status: data.status,
    scheduledAt: data.scheduledAt ?? null,
    createdAt: now,
    updatedAt: now,
  });
  return { id };
}

export async function updatePost(
  id: string,
  data: {
    content?: string;
    platforms?: string[];
    status?: "draft" | "scheduled" | "published" | "failed";
    scheduledAt?: Date | null;
  }
) {
  const user = await requireUser();
  await db
    .update(post)
    .set({
      ...(data.content !== undefined && { content: data.content }),
      ...(data.platforms !== undefined && {
        platforms: JSON.stringify(data.platforms),
      }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.scheduledAt !== undefined && { scheduledAt: data.scheduledAt }),
      updatedAt: new Date(),
    })
    .where(and(eq(post.id, id), eq(post.userId, user.id)));
}

export async function deletePost(id: string) {
  const user = await requireUser();
  await db
    .delete(post)
    .where(and(eq(post.id, id), eq(post.userId, user.id)));
  redirect("/dashboard");
}

export async function generatePostContentAction(
  prompt: string,
  platforms: string[],
  tone: string
): Promise<{ success: true; content: Record<string, string> } | { success: false; error: string }> {
  await requireUser();
  try {
    const content = await generatePostContent(prompt, platforms, tone);
    return { success: true, content };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return { success: false, error: message };
  }
}
