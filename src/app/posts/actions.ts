"use server";

import { headers } from "next/headers";
import { eq, and, lte, gte, lt } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { PLATFORM_DAILY_LIMIT, calcNextRetryAt } from "@/lib/scheduling";
import { startOfDay, endOfDay } from "date-fns";

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
