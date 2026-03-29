"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCampaign } from "@/app/campaigns/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function NewCampaignForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createCampaign(formData);
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="name">Campaign name</Label>
            <Input id="name" name="name" required placeholder="e.g. Product Launch May 2026" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="brief">Campaign brief</Label>
            <textarea
              id="brief"
              name="brief"
              required
              rows={5}
              placeholder="Describe your campaign goals, target audience, tone, and key messages. The more detail you provide, the better the AI-generated posts will be."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="postCount">Number of posts to generate</Label>
            <Input
              id="postCount"
              name="postCount"
              type="number"
              min={1}
              max={10}
              defaultValue={3}
              className="w-32"
            />
            <p className="text-xs text-muted-foreground">Between 1 and 10 posts</p>
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Generating…" : "Generate Campaign"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
