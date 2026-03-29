"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Sidebar } from "@/components/layout/sidebar";
import { PlatformPreview } from "@/components/posts/platform-preview";
import { createPost } from "@/app/posts/actions";
import { ArrowLeft, Sparkles, Save, Clock } from "lucide-react";

const PLATFORMS = [
  { id: "twitter", label: "X / Twitter", limit: 280 },
  { id: "linkedin", label: "LinkedIn", limit: 3000 },
  { id: "instagram", label: "Instagram", limit: 2200 },
  { id: "tiktok", label: "TikTok", limit: 2200 },
  { id: "bluesky", label: "Bluesky", limit: 300 },
  { id: "threads", label: "Threads", limit: 500 },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "authoritative", label: "Authoritative" },
  { value: "inspirational", label: "Inspirational" },
];

export default function NewPostPage() {
  const router = useRouter();
  const [inputMode, setInputMode] = useState<"prompt" | "source">("prompt");
  const [prompt, setPrompt] = useState("");
  const [sourceType, setSourceType] = useState<"url" | "text">("url");
  const [sourceValue, setSourceValue] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [tone, setTone] = useState("professional");
  const [content, setContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [scheduleMode, setScheduleMode] = useState<"now" | "schedule">("now");
  const [scheduledAt, setScheduledAt] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function togglePlatform(id: string) {
    setSelectedPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  }

  const canGenerate = selectedPlatforms.length > 0 &&
    (inputMode === "prompt" ? !!prompt.trim() : !!sourceValue.trim());

  async function handleGenerate() {
    if (!canGenerate) return;
    setIsGenerating(true);
    setGenerateError("");
    try {
      const body: Record<string, unknown> = {
        platforms: selectedPlatforms,
        tone,
      };
      if (inputMode === "prompt") {
        body.prompt = prompt;
      } else {
        body.sourceContent = { type: sourceType, value: sourceValue };
      }
      const res = await fetch("/api/posts/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generation failed");
      setContent(data.content);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleSave(status: "draft" | "scheduled") {
    if (!content.trim() || selectedPlatforms.length === 0) return;
    if (status === "scheduled" && !scheduledAt) return;
    setIsSaving(true);
    try {
      const { id } = await createPost({
        content,
        platforms: selectedPlatforms,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        prompt: prompt || null,
      });
      router.push(`/posts/${id}`);
    } finally {
      setIsSaving(false);
    }
  }

  const charLimit = selectedPlatforms.length > 0
    ? Math.min(...selectedPlatforms.map((p) => PLATFORMS.find((pl) => pl.id === p)?.limit ?? Infinity))
    : null;

  const charCount = content.length;
  const isOverLimit = charLimit !== null && charCount > charLimit;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-6 px-6 py-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Create Post</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Generate with AI</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-1 rounded-md border border-border bg-muted/40 p-1">
                    <button
                      onClick={() => setInputMode("prompt")}
                      className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                        inputMode === "prompt"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Prompt
                    </button>
                    <button
                      onClick={() => setInputMode("source")}
                      className={`flex-1 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                        inputMode === "source"
                          ? "bg-background text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      From Source
                    </button>
                  </div>

                  {inputMode === "prompt" ? (
                    <div className="space-y-2">
                      <Label htmlFor="prompt">What do you want to post about?</Label>
                      <Textarea
                        id="prompt"
                        placeholder="e.g. Write a LinkedIn post about our new feature launch that improves team collaboration"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex gap-1 text-sm">
                        <button
                          onClick={() => setSourceType("url")}
                          className={`rounded px-2.5 py-1 transition-colors ${
                            sourceType === "url"
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          URL
                        </button>
                        <button
                          onClick={() => setSourceType("text")}
                          className={`rounded px-2.5 py-1 transition-colors ${
                            sourceType === "text"
                              ? "bg-primary text-primary-foreground"
                              : "border border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                          }`}
                        >
                          Paste text
                        </button>
                      </div>

                      {sourceType === "url" ? (
                        <div className="space-y-2">
                          <Label htmlFor="source-url">Blog post, changelog, or press release URL</Label>
                          <Input
                            id="source-url"
                            type="url"
                            placeholder="https://example.com/blog/post"
                            value={sourceValue}
                            onChange={(e) => setSourceValue(e.target.value)}
                          />
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Label htmlFor="source-text">Paste your content</Label>
                          <Textarea
                            id="source-text"
                            placeholder="Paste a blog post, changelog entry, press release, or product description…"
                            value={sourceValue}
                            onChange={(e) => setSourceValue(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Brand voice</Label>
                    <Select value={tone} onValueChange={setTone}>
                      <SelectTrigger aria-label="Select tone">
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>
                            {t.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {generateError && (
                    <p className="text-sm text-destructive">{generateError}</p>
                  )}

                  <Button
                    onClick={handleGenerate}
                    disabled={!canGenerate || isGenerating}
                    className="w-full"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isGenerating ? "Generating…" : "Generate"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Content</span>
                    {charLimit !== null && (
                      <span className={`text-xs font-normal ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
                        {charCount} / {charLimit}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isGenerating ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-4 w-3/5" />
                    </div>
                  ) : (
                    <Textarea
                      id="content"
                      aria-label="Post content"
                      placeholder="Your post content will appear here after generation, or type directly…"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="min-h-[180px]"
                      error={isOverLimit}
                    />
                  )}

                  <div className="space-y-3 border-t border-border pt-4">
                    <Label>Schedule</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={scheduleMode === "now" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setScheduleMode("now")}
                      >
                        Post Now
                      </Button>
                      <Button
                        variant={scheduleMode === "schedule" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setScheduleMode("schedule")}
                      >
                        <Clock className="mr-1.5 h-3.5 w-3.5" />
                        Schedule
                      </Button>
                    </div>

                    {scheduleMode === "schedule" && (
                      <input
                        type="datetime-local"
                        value={scheduledAt}
                        onChange={(e) => setScheduledAt(e.target.value)}
                        aria-label="Schedule date and time"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    )}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      variant="outline"
                      disabled={!content.trim() || selectedPlatforms.length === 0 || isSaving || isOverLimit}
                      onClick={() => handleSave("draft")}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      Save Draft
                    </Button>
                    <Button
                      disabled={
                        !content.trim() ||
                        selectedPlatforms.length === 0 ||
                        isSaving ||
                        isOverLimit ||
                        (scheduleMode === "schedule" && !scheduledAt)
                      }
                      onClick={() => handleSave(scheduleMode === "schedule" ? "scheduled" : "draft")}
                    >
                      {scheduleMode === "schedule" ? "Schedule Post" : "Save Post"}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {selectedPlatforms.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Platform Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <PlatformPreview
                      platforms={PLATFORMS.filter((p) => selectedPlatforms.includes(p.id))}
                      content={content}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Platforms</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {PLATFORMS.map((platform) => {
                    const selected = selectedPlatforms.includes(platform.id);
                    return (
                      <button
                        key={platform.id}
                        onClick={() => togglePlatform(platform.id)}
                        className={`w-full flex items-center justify-between rounded-md border px-3 py-2 text-sm transition-colors ${
                          selected
                            ? "border-primary bg-primary/5 text-foreground"
                            : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                      >
                        <span>{platform.label}</span>
                        <span className="text-xs text-muted-foreground">{platform.limit.toLocaleString()}</span>
                      </button>
                    );
                  })}
                  {selectedPlatforms.length === 0 && (
                    <p className="text-xs text-muted-foreground pt-1">Select at least one platform</p>
                  )}
                </CardContent>
              </Card>

              {selectedPlatforms.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedPlatforms.map((pid) => {
                      const platform = PLATFORMS.find((p) => p.id === pid)!;
                      const over = content.length > platform.limit;
                      return (
                        <div key={pid} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{platform.label}</span>
                            <Badge variant={over ? "destructive" : "outline"} className="text-xs">
                              {content.length} / {platform.limit}
                            </Badge>
                          </div>
                          {content && (
                            <p className="text-xs text-muted-foreground line-clamp-3 rounded border border-border bg-muted/30 p-2">
                              {content.slice(0, platform.limit)}
                              {over && "…"}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
