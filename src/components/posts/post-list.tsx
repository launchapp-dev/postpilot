"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionBar } from "@/components/posts/bulk-action-bar";
import { Search, Plus } from "lucide-react";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

interface Post {
  id: string;
  content: string;
  platforms: string;
  status: PostStatus;
  scheduledAt: Date | null;
  publishedAt: Date | null;
  createdAt: Date;
}

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
};

const STATUS_VARIANTS: Record<PostStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  scheduled: "outline",
  published: "default",
  failed: "destructive",
};

function parsePlatforms(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function PostRow({
  post,
  selected,
  onToggle,
}: {
  post: Post;
  selected: boolean;
  onToggle: (id: string) => void;
}) {
  const preview = post.content.length > 80 ? post.content.slice(0, 80) + "…" : post.content;
  const platforms = parsePlatforms(post.platforms);
  const dateToShow = post.publishedAt ?? post.scheduledAt;

  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50">
      <Checkbox
        checked={selected}
        onCheckedChange={() => onToggle(post.id)}
        aria-label="Select post"
        onClick={(e) => e.stopPropagation()}
      />
      <Link
        href={`/posts/${post.id}`}
        className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:gap-4"
      >
        <p className="flex-1 text-sm text-foreground line-clamp-2">{preview}</p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {platforms.map((p) => (
            <Badge key={p} variant="outline" className="capitalize text-xs">
              {p}
            </Badge>
          ))}
          <Badge variant={STATUS_VARIANTS[post.status]}>{STATUS_LABELS[post.status]}</Badge>
          {dateToShow && (
            <span className="text-xs text-muted-foreground">
              {format(dateToShow, "MMM d, yyyy")}
            </span>
          )}
        </div>
      </Link>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <Plus className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold">No posts yet</h3>
        <p className="text-sm text-muted-foreground">Generate your first AI post in seconds</p>
      </div>
      <Button asChild>
        <Link href="/posts/new">Create Post</Link>
      </Button>
    </div>
  );
}

const TAB_VALUES = ["all", "draft", "scheduled", "published", "failed"] as const;

export function PostList({ posts }: { posts: Post[] }) {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<string>("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filtered = posts.filter((p) => {
    const matchesSearch = search === "" || p.content.toLowerCase().includes(search.toLowerCase());
    const matchesTab = tab === "all" || p.status === tab;
    return matchesSearch && matchesTab;
  });

  function togglePost(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    const filteredIds = new Set(filtered.map((p) => p.id));
    const allSelected = filtered.every((p) => selectedIds.has(p.id));
    if (allSelected) {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.delete(id));
        return next;
      });
    } else {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        filteredIds.forEach((id) => next.add(id));
        return next;
      });
    }
  }

  const allFilteredSelected = filtered.length > 0 && filtered.every((p) => selectedIds.has(p.id));
  const someFilteredSelected = filtered.some((p) => selectedIds.has(p.id));

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search posts…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <BulkActionBar
        selectedIds={Array.from(selectedIds)}
        onClear={() => setSelectedIds(new Set())}
      />

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          {TAB_VALUES.map((t) => (
            <TabsTrigger key={t} value={t} className="capitalize">
              {t === "all" ? "All" : STATUS_LABELS[t as PostStatus]}
            </TabsTrigger>
          ))}
        </TabsList>

        {TAB_VALUES.map((t) => (
          <TabsContent key={t} value={t} className="mt-4">
            {filtered.length === 0 ? (
              posts.length === 0 && t === "all" && search === "" ? (
                <EmptyState />
              ) : (
                <p className="py-8 text-center text-sm text-muted-foreground">No posts found.</p>
              )
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 px-1 pb-1">
                  <Checkbox
                    checked={allFilteredSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all posts"
                    data-indeterminate={someFilteredSelected && !allFilteredSelected}
                  />
                  <span className="text-xs text-muted-foreground">Select all</span>
                </div>
                {filtered.map((post) => (
                  <PostRow
                    key={post.id}
                    post={post}
                    selected={selectedIds.has(post.id)}
                    onToggle={togglePost}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
