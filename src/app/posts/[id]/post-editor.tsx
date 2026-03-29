"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { updatePost, deletePost, recyclePost } from "@/app/posts/actions";
import { ArrowLeft, Save, Trash2, Sparkles, Clock, RefreshCw } from "lucide-react";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

interface Post {
  id: string;
  content: string;
  platforms: string;
  status: PostStatus;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  prompt: string | null;
  recycleCount: number;
  noRecycle: boolean;
  lastRecycledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const PLATFORMS = [
  { id: "twitter", label: "X / Twitter", limit: 280 },
  { id: "linkedin", label: "LinkedIn", limit: 3000 },
  { id: "instagram", label: "Instagram", limit: 2200 },
  { id: "tiktok", label: "TikTok", limit: 2200 },
  { id: "bluesky", label: "Bluesky", limit: 300 },
  { id: "threads", label: "Threads", limit: 500 },
] as const;

const STATUS_VARIANTS: Record<PostStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  scheduled: "outline",
  published: "default",
  failed: "destructive",
};

function parsePlatforms(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

export function PostEditor({ post }: { post: Post }) {
  const router = useRouter();
  const [content, setContent] = useState(post.content);
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduledAt ? format(post.scheduledAt, "yyyy-MM-dd'T'HH:mm") : ""
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenError, setRegenError] = useState("");
  const [isRecycling, setIsRecycling] = useState(false);
  const [recycleError, setRecycleError] = useState("");

  const platforms = parsePlatforms(post.platforms);

  const charLimit = platforms.length > 0
    ? Math.min(...platforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.limit ?? Infinity))
    : null;
  const isOverLimit = charLimit !== null && content.length > charLimit;

  async function handleSave() {
    setIsSaving(true);
    try {
      await updatePost(post.id, {
        content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      });
      router.refresh();
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setIsDeleting(true);
    await deletePost(post.id);
  }

  async function handleRecycle() {
    setIsRecycling(true);
    setRecycleError("");
    try {
      const result = await recyclePost(post.id);
      if (!result.success) {
        setRecycleError(result.error);
      } else {
        router.push(`/posts/${result.newPostId}`);
      }
    } finally {
      setIsRecycling(false);
    }
  }

  async function handleRegenerate() {
    if (!post.prompt) return;
    setIsRegenerating(true);
    setRegenError("");
    try {
      const res = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: post.prompt, platforms, tone: "professional" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setContent(data.content);
    } catch (err) {
      setRegenError(err instanceof Error ? err.message : "Regeneration failed");
    } finally {
      setIsRegenerating(false);
    }
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4" />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-semibold">Edit Post</h1>
                <p className="text-sm text-muted-foreground">
                  Created {format(post.createdAt, "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <Badge variant={STATUS_VARIANTS[post.status]} className="capitalize">
              {post.status}
            </Badge>
          </div>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <div className="flex flex-wrap gap-2">
                {platforms.map((p) => (
                  <Badge key={p} variant="outline" className="capitalize">
                    {PLATFORMS.find((pl) => pl.id === p)?.label ?? p}
                  </Badge>
                ))}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="content">Content</Label>
                  {charLimit !== null && (
                    <span className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                      {content.length} / {charLimit}
                    </span>
                  )}
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                  error={isOverLimit}
                />
              </div>

              {post.scheduledAt || post.status === "scheduled" ? (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">
                    <Clock className="inline mr-1.5 h-3.5 w-3.5" />
                    Scheduled for
                  </Label>
                  <input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              ) : null}

              {post.publishedAt && (
                <p className="text-sm text-muted-foreground">
                  Published {format(post.publishedAt, "MMM d, yyyy 'at' h:mm a")}
                </p>
              )}

              {regenError && (
                <p className="text-sm text-destructive">{regenError}</p>
              )}

              {recycleError && (
                <p className="text-sm text-destructive">{recycleError}</p>
              )}

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || isOverLimit || !content.trim()}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? "Saving…" : "Save Changes"}
                </Button>

                {post.prompt && (
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    disabled={isRegenerating}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isRegenerating ? "Regenerating…" : "Regenerate"}
                  </Button>
                )}

                {post.status === "published" && !post.noRecycle && post.recycleCount < 3 && (
                  <Button
                    variant="outline"
                    onClick={handleRecycle}
                    disabled={isRecycling}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isRecycling ? "Recycling…" : "Recycle"}
                  </Button>
                )}

                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="ml-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  {isDeleting ? "Deleting…" : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {platforms.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Platform Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {platforms.map((pid) => {
                  const platform = PLATFORMS.find((p) => p.id === pid);
                  if (!platform) return null;
                  const over = content.length > platform.limit;
                  return (
                    <div key={pid} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">{platform.label}</span>
                        <Badge variant={over ? "destructive" : "outline"} className="text-xs">
                          {content.length} / {platform.limit}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3 rounded border border-border bg-muted/30 p-2">
                        {content.slice(0, platform.limit)}
                        {over && "…"}
                      </p>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
