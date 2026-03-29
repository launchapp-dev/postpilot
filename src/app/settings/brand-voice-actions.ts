"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { brandVoice } from "@/db/schema";
import { generatePostWithVoice } from "@/lib/ai";

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export type BrandVoiceData = {
  id?: string;
  name: string;
  tone: "professional" | "casual" | "witty" | "authoritative";
  vocabulary: string | null;
  topicsToAvoid: string | null;
  referenceContent: string | null;
  isDefault: boolean;
};

export type BrandVoiceRow = BrandVoiceData & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getBrandVoices(): Promise<BrandVoiceRow[]> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const rows = await db.query.brandVoice.findMany({
    where: eq(brandVoice.userId, session.user.id),
    orderBy: (bv, { desc }) => [desc(bv.isDefault), bv.name],
  });

  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    tone: r.tone as BrandVoiceRow["tone"],
    vocabulary: r.vocabulary ?? null,
    topicsToAvoid: r.topicsToAvoid ?? null,
    referenceContent: r.referenceContent ?? null,
    isDefault: r.isDefault,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

export async function upsertBrandVoice(data: BrandVoiceData): Promise<BrandVoiceRow> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const now = new Date();

  if (data.isDefault) {
    await db
      .update(brandVoice)
      .set({ isDefault: false, updatedAt: now })
      .where(eq(brandVoice.userId, session.user.id));
  }

  if (data.id) {
    await db
      .update(brandVoice)
      .set({
        name: data.name,
        tone: data.tone,
        vocabulary: data.vocabulary,
        topicsToAvoid: data.topicsToAvoid,
        referenceContent: data.referenceContent,
        isDefault: data.isDefault,
        updatedAt: now,
      })
      .where(and(eq(brandVoice.id, data.id), eq(brandVoice.userId, session.user.id)));

    const row = await db.query.brandVoice.findFirst({
      where: and(eq(brandVoice.id, data.id), eq(brandVoice.userId, session.user.id)),
    });
    if (!row) redirect("/settings");
    return {
      id: row.id,
      name: row.name,
      tone: row.tone as BrandVoiceRow["tone"],
      vocabulary: row.vocabulary ?? null,
      topicsToAvoid: row.topicsToAvoid ?? null,
      referenceContent: row.referenceContent ?? null,
      isDefault: row.isDefault,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  const id = generateId();
  await db.insert(brandVoice).values({
    id,
    userId: session.user.id,
    name: data.name,
    tone: data.tone,
    vocabulary: data.vocabulary,
    topicsToAvoid: data.topicsToAvoid,
    referenceContent: data.referenceContent,
    isDefault: data.isDefault,
    createdAt: now,
    updatedAt: now,
  });

  return {
    id,
    name: data.name,
    tone: data.tone,
    vocabulary: data.vocabulary,
    topicsToAvoid: data.topicsToAvoid,
    referenceContent: data.referenceContent,
    isDefault: data.isDefault,
    createdAt: now,
    updatedAt: now,
  };
}

export async function deleteBrandVoice(id: string): Promise<void> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  await db
    .delete(brandVoice)
    .where(and(eq(brandVoice.id, id), eq(brandVoice.userId, session.user.id)));
}

export async function testBrandVoice(voiceId: string): Promise<string> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const voice = await db.query.brandVoice.findFirst({
    where: and(eq(brandVoice.id, voiceId), eq(brandVoice.userId, session.user.id)),
  });

  if (!voice) throw new Error("Brand voice not found");

  return generatePostWithVoice(
    "Write a LinkedIn post about our latest product update",
    ["linkedin"],
    voice.tone,
    {
      vocabulary: voice.vocabulary ?? undefined,
      topicsToAvoid: voice.topicsToAvoid ?? undefined,
      referenceContent: voice.referenceContent ?? undefined,
    }
  );
}
