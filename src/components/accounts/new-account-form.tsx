"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSocialAccount } from "@/app/accounts/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

const PLATFORMS = [
  { value: "twitter", label: "X / Twitter" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "tiktok", label: "TikTok" },
  { value: "bluesky", label: "Bluesky" },
  { value: "threads", label: "Threads" },
];

export function NewAccountForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await createSocialAccount(formData);
    setLoading(false);
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="platform">Platform</Label>
            <select
              id="platform"
              name="platform"
              required
              defaultValue=""
              className="flex h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a platform</option>
              {PLATFORMS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="handle">Handle / Username</Label>
            <Input id="handle" name="handle" required placeholder="e.g. myhandle (without @)" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="displayName">Display name <span className="text-muted-foreground">(optional)</span></Label>
            <Input id="displayName" name="displayName" placeholder="e.g. My Brand" />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={loading}>
              {loading ? "Connecting…" : "Connect Account"}
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
