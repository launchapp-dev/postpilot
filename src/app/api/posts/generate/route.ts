import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generatePost } from "@/lib/ai";

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s{2,}/g, " ")
    .trim();
}

async function fetchUrlContent(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": "PostPilot/1.0 (content-summarizer)" },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) throw new Error(`Failed to fetch URL: ${res.status} ${res.statusText}`);
  const html = await res.text();
  const text = stripHtml(html);
  return text.slice(0, 8000);
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { prompt, platforms, tone, sourceContent } = body as {
    prompt?: string;
    platforms: string[];
    tone: string;
    sourceContent?: { type: "url" | "text"; value: string };
  };

  if (!platforms?.length) {
    return NextResponse.json({ error: "platforms are required" }, { status: 400 });
  }

  if (!prompt && !sourceContent?.value) {
    return NextResponse.json(
      { error: "prompt or sourceContent is required" },
      { status: 400 }
    );
  }

  try {
    let effectivePrompt = prompt ?? "";

    if (sourceContent?.value) {
      let sourceText = sourceContent.value;
      if (sourceContent.type === "url") {
        try {
          sourceText = await fetchUrlContent(sourceContent.value);
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Failed to fetch URL";
          return NextResponse.json({ error: msg }, { status: 422 });
        }
      }
      effectivePrompt = effectivePrompt
        ? `${effectivePrompt}\n\nSource content to reference:\n${sourceText}`
        : `Generate posts that summarize and promote the following content:\n\n${sourceText}`;
    }

    const content = await generatePost(effectivePrompt, platforms, tone ?? "professional");
    return NextResponse.json({ content });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
