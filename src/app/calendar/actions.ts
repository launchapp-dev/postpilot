"use server";

import { and, eq, gte, lte, or } from "drizzle-orm";
import { startOfMonth, endOfMonth } from "date-fns";
import { db } from "@/lib/db";
import { post } from "@/db/schema";

export async function getPostsForMonth(userId: string, year: number, month: number) {
  const date = new Date(year, month, 1);
  const start = startOfMonth(date);
  const end = endOfMonth(date);

  return db.query.post.findMany({
    where: and(
      eq(post.userId, userId),
      or(eq(post.status, "scheduled"), eq(post.status, "published")),
      gte(post.scheduledAt, start),
      lte(post.scheduledAt, end)
    ),
    orderBy: (p, { asc }) => [asc(p.scheduledAt)],
  });
}
