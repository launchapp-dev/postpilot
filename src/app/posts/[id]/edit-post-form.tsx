"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { updatePost, deletePost } from "@/app/posts/actions";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

interface EditPostFormProps {
  post: {
    id: string;
    content: string;
    platforms: string;
    status: PostStatus;
    scheduledAt: Date | null;
  };
}

function parsePlatforms(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function EditPostForm({ post }: EditPostFormProps) {
  const router = useRouter();
  const [content, setContent] = useState(post.content);
  const [scheduledAt, setScheduledAt] = useState(
    post.scheduledAt
      ? format(post.scheduledAt, "yyyy-MM-dd'T'HH:mm")
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  const platforms = parsePlatforms(post.platforms);
  const isEditable = post.status === "draft" || post.status === "scheduled";

  async function handleSave() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      await updatePost(post.id, {
        content,
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      });
      setSaved(true);
      router.refresh();
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setDeleting(true);
    await deletePost(post.id);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Edit Content</CardTitle>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="gap-2"
        >
          {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Delete
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Platforms</Label>
          <div className="flex flex-wrap gap-2">
            {platforms.map((p) => (
              <span
                key={p}
                className="rounded-md border border-border px-2.5 py-1 text-xs capitalize"
              >
                {p}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            rows={8}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={!isEditable}
          />
        </div>

        {isEditable && (
          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled date &amp; time</Label>
            <Input
              id="scheduledAt"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
        {saved && <p className="text-sm text-green-600">Saved successfully</p>}

        {isEditable && (
          <div className="flex gap-3">
            <Button onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
