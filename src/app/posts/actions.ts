"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and, lte, gte, lt } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { PLATFORM_DAILY_LIMIT, calcNextRetryAt } from "@/lib/scheduling";
import { generatePost } from "@/lib/ai";
import { startOfDay, endOfDay } from "date-fns";

export async function generatePostContentAction(
  prompt: string,
  platforms: string[],
  tone: string
): Promise<{ success: true; content: Record<string, string> } | { success: false; error: string }> {
  try {
    const content: Record<string, string> = {};
    for (const platform of platforms) {
      content[platform] = await generatePost(prompt, [platform], tone);
    }
    return { success: true, content };
  } catch {
    return { success: false, error: "Failed to generate content" };
  }
}

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

const MAX_ATTEMPTS = 3;

export async function schedulePost(
  postId: string,
  platform: string,
  scheduledAt: Date
): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return { success: false, error: "Unauthenticated" };

  const userId = session.user.id;

  if (scheduledAt <= new Date()) {
    return { success: false, error: "Scheduled time must be in the future" };
  }

  const dayStart = startOfDay(scheduledAt);
  const dayEnd = endOfDay(scheduledAt);

  const postsOnDay = await db.query.post.findMany({
    where: and(
      eq(post.userId, userId),
      gte(post.scheduledAt, dayStart),
      lte(post.scheduledAt, dayEnd)
    ),
  });

  const platformPosts = postsOnDay.filter((p) => {
    try {
      const platforms: string[] = JSON.parse(p.platforms);
      return platforms.includes(platform);
    } catch {
      return false;
    }
  });

  if (platformPosts.length >= PLATFORM_DAILY_LIMIT) {
    return {
      success: false,
      error: `Daily limit of ${PLATFORM_DAILY_LIMIT} posts reached for ${platform}`,
    };
  }

  await db
    .update(post)
    .set({
      status: "scheduled",
      scheduledAt,
      updatedAt: new Date(),
    })
    .where(and(eq(post.id, postId), eq(post.userId, userId)));

  return { success: true };
}

export async function publishDuePosts(): Promise<{ published: number; retried: number; failed: number }> {
  const now = new Date();

  const due = await db.query.post.findMany({
    where: and(
      eq(post.status, "scheduled"),
      lte(post.scheduledAt, now)
    ),
  });

  const retryable = await db.query.post.findMany({
    where: and(
      eq(post.status, "failed"),
      lt(post.publishAttempts, MAX_ATTEMPTS),
      lte(post.nextRetryAt, now)
    ),
  });

  let published = 0;
  let retried = 0;
  let failed = 0;

  for (const p of [...due, ...retryable]) {
    const attempts = p.publishAttempts + 1;
    const succeeded = true;

    if (succeeded) {
      await db
        .update(post)
        .set({
          status: "published",
          publishedAt: now,
          publishAttempts: attempts,
          updatedAt: now,
        })
        .where(eq(post.id, p.id));
      published++;
    } else if (attempts >= MAX_ATTEMPTS) {
      await db
        .update(post)
        .set({
          status: "failed",
          publishAttempts: attempts,
          nextRetryAt: null,
          updatedAt: now,
        })
        .where(eq(post.id, p.id));
      failed++;
    } else {
      await db
        .update(post)
        .set({
          status: "failed",
          publishAttempts: attempts,
          nextRetryAt: calcNextRetryAt(attempts),
          updatedAt: now,
        })
        .where(eq(post.id, p.id));
      retried++;
    }
  }

  return { published, retried, failed };
}
