"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import { recyclePost } from "@/app/posts/actions";

interface Post {
  id: string;
  content: string;
  platforms: string;
  publishedAt: Date | null;
  recycleCount: number;
}

function parsePlatforms(raw: string): string[] {
  try { return JSON.parse(raw); } catch { return []; }
}

function SuggestionCard({ post }: { post: Post }) {
  const router = useRouter();
  const [isRecycling, setIsRecycling] = useState(false);
  const [error, setError] = useState("");

  const platforms = parsePlatforms(post.platforms);
  const preview = post.content.length > 100 ? post.content.slice(0, 100) + "…" : post.content;

  async function handleRecycle() {
    setIsRecycling(true);
    setError("");
    try {
      const result = await recyclePost(post.id);
      if (!result.success) {
        setError(result.error);
      } else {
        router.push(`/posts/${result.newPostId}`);
      }
    } finally {
      setIsRecycling(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex-1 space-y-1.5">
        <p className="text-sm text-foreground line-clamp-2">{preview}</p>
        <div className="flex flex-wrap items-center gap-2">
          {platforms.map((p) => (
            <Badge key={p} variant="outline" className="capitalize text-xs">
              {p}
            </Badge>
          ))}
          {post.publishedAt && (
            <span className="text-xs text-muted-foreground">
              Published {format(post.publishedAt, "MMM d, yyyy")}
            </span>
          )}
          {post.recycleCount > 0 && (
            <span className="text-xs text-muted-foreground">
              Recycled {post.recycleCount}x
            </span>
          )}
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
      <Button
        size="sm"
        variant="outline"
        onClick={handleRecycle}
        disabled={isRecycling}
        className="shrink-0"
      >
        <RefreshCw className="mr-2 h-3.5 w-3.5" />
        {isRecycling ? "Recycling…" : "Recycle"}
      </Button>
    </div>
  );
}

export function RecycleSuggestions({ posts }: { posts: Post[] }) {
  return (
    <div>
      <h2 className="mb-4 text-lg font-semibold">Ready to Recycle</h2>
      {posts.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border py-8 text-center text-sm text-muted-foreground">
          No posts ready for recycling yet
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {posts.map((post) => (
            <SuggestionCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
