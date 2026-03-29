"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { settings } from "@/db/schema";

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type SettingsData = {
  brandName: string | null;
  industry: string | null;
  website: string | null;
  defaultTone: string | null;
  topicsToAvoid: string | null;
  emailAlerts: boolean;
};

export async function getSettings(): Promise<SettingsData> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const row = await db.query.settings.findFirst({
    where: eq(settings.userId, session.user.id),
  });

  return {
    brandName: row?.brandName ?? null,
    industry: row?.industry ?? null,
    website: row?.website ?? null,
    defaultTone: row?.defaultTone ?? null,
    topicsToAvoid: row?.topicsToAvoid ?? null,
    emailAlerts: row?.emailAlerts ?? false,
  };
}

export async function upsertSettings(data: SettingsData): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const now = new Date();

  const existing = await db.query.settings.findFirst({
    where: eq(settings.userId, session.user.id),
  });

  if (existing) {
    await db
      .update(settings)
      .set({
        brandName: data.brandName,
        industry: data.industry,
        website: data.website,
        defaultTone: data.defaultTone,
        topicsToAvoid: data.topicsToAvoid,
        emailAlerts: data.emailAlerts,
        updatedAt: now,
      })
      .where(eq(settings.userId, session.user.id));
  } else {
    await db.insert(settings).values({
      id: generateId(),
      userId: session.user.id,
      brandName: data.brandName,
      industry: data.industry,
      website: data.website,
      defaultTone: data.defaultTone,
      topicsToAvoid: data.topicsToAvoid,
      emailAlerts: data.emailAlerts,
      createdAt: now,
      updatedAt: now,
    });
  }
}
