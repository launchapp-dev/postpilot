"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePostContentAction, createPost } from "@/app/posts/actions";
import { PLATFORM_LIMITS } from "@/lib/ai";

const PLATFORMS = [
  { id: "twitter", label: "X / Twitter" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "instagram", label: "Instagram" },
  { id: "tiktok", label: "TikTok" },
  { id: "bluesky", label: "Bluesky" },
  { id: "threads", label: "Threads" },
];

const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "authoritative", label: "Authoritative" },
];

const schema = z.object({
  prompt: z.string().min(1, "Describe your post"),
  platforms: z.array(z.string()).min(1, "Select at least one platform"),
  tone: z.string().min(1, "Select a tone"),
  scheduledAt: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function NewPostForm() {
  const router = useRouter();
  const [generated, setGenerated] = useState<Record<string, string>>({});
  const [editedContent, setEditedContent] = useState<Record<string, string>>({});
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { platforms: [], tone: "professional" },
  });

  const selectedPlatforms = watch("platforms");

  async function onGenerate(values: FormValues) {
    setGenerating(true);
    setError("");
    const result = await generatePostContentAction(
      values.prompt,
      values.platforms,
      values.tone
    );
    if (result.success) {
      setGenerated(result.content);
      setEditedContent(result.content);
    } else {
      setError(result.error);
    }
    setGenerating(false);
  }

  async function onSave(status: "draft" | "scheduled") {
    const platforms = selectedPlatforms;
    const content = platforms
      .map((p) => `[${p}]\n${editedContent[p] ?? generated[p] ?? ""}`)
      .join("\n\n");

    if (!content.trim()) {
      setError("Generate content first");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const scheduledAt = (document.getElementById("scheduledAt") as HTMLInputElement)?.value;
      const { id } = await createPost({
        content,
        platforms,
        status,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      });
      router.push(`/posts/${id}`);
    } catch {
      setError("Failed to save post");
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="prompt">Describe your post</Label>
            <Textarea
              id="prompt"
              placeholder="Write a thread about our new pricing launch…"
              rows={3}
              {...register("prompt")}
            />
            {errors.prompt && (
              <p className="text-sm text-destructive">{errors.prompt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Platforms</Label>
            <div className="flex flex-wrap gap-3">
              <Controller
                name="platforms"
                control={control}
                render={({ field }) => (
                  <>
                    {PLATFORMS.map(({ id, label }) => {
                      const checked = field.value.includes(id);
                      return (
                        <label
                          key={id}
                          className="flex cursor-pointer items-center gap-2 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:bg-accent"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(val) => {
                              if (val) {
                                field.onChange([...field.value, id]);
                              } else {
                                field.onChange(field.value.filter((v) => v !== id));
                              }
                            }}
                          />
                          {label}
                        </label>
                      );
                    })}
                  </>
                )}
              />
            </div>
            {errors.platforms && (
              <p className="text-sm text-destructive">{errors.platforms.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Controller
              name="tone"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Select tone" />
                  </SelectTrigger>
                  <SelectContent>
                    {TONES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Button
            type="button"
            onClick={handleSubmit(onGenerate)}
            disabled={generating}
            className="gap-2"
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {generating ? "Generating…" : "Generate"}
          </Button>
        </CardContent>
      </Card>

      {Object.keys(generated).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {selectedPlatforms.map((platform) => {
              const limit = PLATFORM_LIMITS[platform] ?? 500;
              const text = editedContent[platform] ?? "";
              const overLimit = text.length > limit;
              return (
                <div key={platform} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="capitalize">{platform}</Label>
                    <span
                      className={`text-xs ${overLimit ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {text.length} / {limit}
                    </span>
                  </div>
                  <Textarea
                    rows={4}
                    value={text}
                    onChange={(e) =>
                      setEditedContent((prev) => ({
                        ...prev,
                        [platform]: e.target.value,
                      }))
                    }
                    aria-invalid={overLimit}
                  />
                </div>
              );
            })}

            <div className="space-y-2">
              <Label htmlFor="scheduledAt">Schedule date &amp; time (optional)</Label>
              <Input
                id="scheduledAt"
                type="datetime-local"
                min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onSave("draft")}
                disabled={saving}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save as Draft
              </Button>
              <Button onClick={() => onSave("scheduled")} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Schedule Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && Object.keys(generated).length === 0 && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
