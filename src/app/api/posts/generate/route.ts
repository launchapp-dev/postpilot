import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { generatePost } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { prompt, platforms, tone } = body as {
    prompt: string;
    platforms: string[];
    tone: string;
  };

  if (!prompt || !platforms?.length) {
    return NextResponse.json(
      { error: "prompt and platforms are required" },
      { status: 400 }
    );
  }

  try {
    const content = await generatePost(prompt, platforms, tone ?? "professional");
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
