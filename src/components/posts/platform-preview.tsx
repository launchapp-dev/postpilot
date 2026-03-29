"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

interface Platform {
  id: string;
  label: string;
  limit: number;
}

interface PlatformPreviewProps {
  platforms: Platform[];
  content: string;
}

const PLATFORM_HANDLES: Record<string, string> = {
  twitter: "@yourhandle",
  linkedin: "Your Name",
  instagram: "@yourhandle",
  tiktok: "@yourhandle",
  bluesky: "@yourhandle.bsky.social",
  threads: "@yourhandle",
};

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "bg-black text-white",
  linkedin: "bg-[#0077b5] text-white",
  instagram: "bg-gradient-to-br from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888] text-white",
  tiktok: "bg-black text-white",
  bluesky: "bg-[#0085ff] text-white",
  threads: "bg-black text-white",
};

function formatContent(text: string) {
  const parts = text.split(/(#\w+|@\w+|https?:\/\/\S+)/g);
  return parts.map((part, i) => {
    if (part.startsWith("#")) {
      return (
        <span key={i} className="text-blue-500 font-medium">
          {part}
        </span>
      );
    }
    if (part.startsWith("@")) {
      return (
        <span key={i} className="text-blue-500 font-medium">
          {part}
        </span>
      );
    }
    if (part.startsWith("http")) {
      return (
        <span key={i} className="text-blue-500 underline break-all">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function CharCount({ count, limit }: { count: number; limit: number }) {
  const pct = count / limit;
  let colorClass = "text-muted-foreground";
  let badgeVariant: "outline" | "secondary" | "destructive" = "outline";
  if (pct >= 1) {
    colorClass = "text-destructive";
    badgeVariant = "destructive";
  } else if (pct >= 0.8) {
    colorClass = "text-amber-500";
    badgeVariant = "secondary";
  }
  return (
    <Badge variant={badgeVariant} className={`text-xs font-mono ${colorClass}`}>
      {count} / {limit}
    </Badge>
  );
}

export function PlatformPreview({ platforms, content }: PlatformPreviewProps) {
  if (platforms.length === 0) return null;

  return (
    <Tabs defaultValue={platforms[0].id}>
      <TabsList className="flex w-full flex-wrap gap-1 h-auto">
        {platforms.map((p) => (
          <TabsTrigger key={p.id} value={p.id} className="text-xs">
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {platforms.map((platform) => {
        const handle = PLATFORM_HANDLES[platform.id] ?? "@yourhandle";
        const colorClass = PLATFORM_COLORS[platform.id] ?? "bg-muted text-foreground";
        const charCount = content.length;

        return (
          <TabsContent key={platform.id} value={platform.id} className="mt-3">
            <div className="rounded-lg border border-border overflow-hidden">
              <div className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold ${colorClass}`}>
                <span>{platform.label}</span>
              </div>

              <div className="bg-background p-3 space-y-3">
                <div className="flex items-start gap-2">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-sm font-semibold text-foreground">Your Name</span>
                      <span className="text-xs text-muted-foreground truncate">{handle}</span>
                      <span className="text-xs text-muted-foreground">· Just now</span>
                    </div>

                    <div className="mt-1.5 text-sm leading-relaxed text-foreground whitespace-pre-wrap break-words">
                      {content ? (
                        formatContent(
                          charCount > platform.limit
                            ? content.slice(0, platform.limit)
                            : content
                        )
                      ) : (
                        <span className="text-muted-foreground italic">
                          Your post will appear here…
                        </span>
                      )}
                      {charCount > platform.limit && (
                        <span className="text-destructive">…</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-border pt-2">
                  <span className="text-xs text-muted-foreground">Preview</span>
                  <CharCount count={charCount} limit={platform.limit} />
                </div>
              </div>
            </div>
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
