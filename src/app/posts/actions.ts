"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { eq, and } from "drizzle-orm";

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export async function createPost(data: {
  content: string;
  platforms: string[];
  status: "draft" | "scheduled";
  scheduledAt?: Date | null;
  prompt?: string | null;
}): Promise<{ id: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const id = generateId();
  const now = new Date();

  await db.insert(post).values({
    id,
    userId: session.user.id,
    content: data.content,
    platforms: JSON.stringify(data.platforms),
    status: data.status,
    scheduledAt: data.scheduledAt ?? null,
    prompt: data.prompt ?? null,
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
    prompt?: string | null;
  }
): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await db
    .update(post)
    .set({
      content: data.content,
      platforms: data.platforms ? JSON.stringify(data.platforms) : undefined,
      status: data.status,
      scheduledAt: data.scheduledAt,
      prompt: data.prompt ?? undefined,
      updatedAt: new Date(),
    })
    .where(and(eq(post.id, id), eq(post.userId, session.user.id)));
}

export async function deletePost(id: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await db
    .delete(post)
    .where(and(eq(post.id, id), eq(post.userId, session.user.id)));

  redirect("/dashboard");
}
