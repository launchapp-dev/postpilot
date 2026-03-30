"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";

export async function createSocialAccount(formData: FormData) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const platform = String(formData.get("platform") ?? "").trim() as
    | "twitter"
    | "linkedin"
    | "instagram"
    | "tiktok"
    | "bluesky"
    | "threads";
  const handle = String(formData.get("handle") ?? "").trim();
  const displayName = String(formData.get("displayName") ?? "").trim() || null;

  if (!platform || !handle) return;

  const now = new Date();

  await db.insert(socialAccount).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    platform,
    handle,
    displayName,
    status: "connected",
    createdAt: now,
    updatedAt: now,
  });

  redirect("/accounts");
}

export async function disconnectSocialAccount(accountId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await db
    .update(socialAccount)
    .set({ status: "disconnected", updatedAt: new Date() })
    .where(and(eq(socialAccount.id, accountId), eq(socialAccount.userId, session.user.id)));
}

export async function reconnectSocialAccount(accountId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await db
    .update(socialAccount)
    .set({ status: "connected", updatedAt: new Date() })
    .where(and(eq(socialAccount.id, accountId), eq(socialAccount.userId, session.user.id)));
}

export async function deleteSocialAccount(accountId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await db
    .delete(socialAccount)
    .where(and(eq(socialAccount.id, accountId), eq(socialAccount.userId, session.user.id)));

  redirect("/accounts");
}
