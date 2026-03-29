"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { inArray } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";

async function requireSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function bulkDeletePosts(ids: string[]) {
  const session = await requireSession();
  if (ids.length === 0) return;

  const userPosts = await db.query.post.findMany({
    where: (p, { and, eq, inArray: inArr }) =>
      and(eq(p.userId, session.user.id), inArr(p.id, ids)),
    columns: { id: true },
  });

  const ownedIds = userPosts.map((p) => p.id);
  if (ownedIds.length === 0) return;

  await db.delete(post).where(inArray(post.id, ownedIds));

  revalidatePath("/dashboard");
}

export async function bulkReschedulePosts(ids: string[], scheduledAt: Date) {
  const session = await requireSession();
  if (ids.length === 0) return;

  const userPosts = await db.query.post.findMany({
    where: (p, { and, eq, inArray: inArr }) =>
      and(eq(p.userId, session.user.id), inArr(p.id, ids)),
    columns: { id: true },
  });

  const ownedIds = userPosts.map((p) => p.id);
  if (ownedIds.length === 0) return;

  const now = new Date();
  await db
    .update(post)
    .set({ scheduledAt, status: "scheduled", updatedAt: now })
    .where(inArray(post.id, ownedIds));

  revalidatePath("/dashboard");
}

export async function bulkDuplicatePosts(ids: string[]) {
  const session = await requireSession();
  if (ids.length === 0) return;

  const sourcePosts = await db.query.post.findMany({
    where: (p, { and, eq, inArray: inArr }) =>
      and(eq(p.userId, session.user.id), inArr(p.id, ids)),
  });

  if (sourcePosts.length === 0) return;

  const now = new Date();
  const duplicates = sourcePosts.map((p) => ({
    id: crypto.randomUUID(),
    userId: session.user.id,
    content: p.content,
    platforms: p.platforms,
    status: "draft" as const,
    scheduledAt: null,
    publishedAt: null,
    prompt: p.prompt,
    publishAttempts: 0,
    nextRetryAt: null,
    campaignId: p.campaignId,
    recycleCount: 0,
    lastRecycledAt: null,
    noRecycle: false,
    recycledFromId: null,
    createdAt: now,
    updatedAt: now,
  }));

  await db.insert(post).values(duplicates);

  revalidatePath("/dashboard");
}
