import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { format } from "date-fns";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { campaign, post } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { CampaignControls } from "@/components/campaigns/campaign-controls";
import { ArrowLeft, FileText } from "lucide-react";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
};

const POST_STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  scheduled: "outline",
  published: "default",
  failed: "destructive",
};

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const c = await db.query.campaign.findFirst({
    where: and(eq(campaign.id, id), eq(campaign.userId, session.user.id)),
  });

  if (!c) notFound();

  const posts = await db.query.post.findMany({
    where: eq(post.campaignId, id),
    orderBy: (p, { asc }) => [asc(p.createdAt)],
  });

  const publishedCount = posts.filter((p) => p.status === "published").length;
  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl space-y-8 px-6 py-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/campaigns">
                <ArrowLeft className="mr-1 h-4 w-4" />
                Campaigns
              </Link>
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">{c.name}</h1>
                <Badge variant={STATUS_VARIANTS[c.status] ?? "outline"} className="capitalize">
                  {c.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground max-w-xl">{c.brief}</p>
            </div>

            <CampaignControls campaignId={c.id} status={c.status as "active" | "paused" | "completed"} />
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{posts.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{publishedCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{scheduledCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Started</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-semibold">
                  {c.startDate ? format(c.startDate, "MMM d, yyyy") : "—"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="mb-4 text-lg font-semibold">Posts Timeline</h2>
            {posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-12 text-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No posts in this campaign yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {posts.map((p) => {
                  const platforms: string[] = (() => {
                    try { return JSON.parse(p.platforms); } catch { return []; }
                  })();
                  const dateToShow = p.publishedAt ?? p.scheduledAt;
                  return (
                    <Link
                      key={p.id}
                      href={`/posts/${p.id}`}
                      className="flex flex-col gap-2 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/50 sm:flex-row sm:items-center sm:gap-4"
                    >
                      <p className="flex-1 text-sm text-foreground line-clamp-2">
                        {p.content.length > 100 ? p.content.slice(0, 100) + "…" : p.content}
                      </p>
                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        {platforms.map((pl) => (
                          <Badge key={pl} variant="outline" className="capitalize text-xs">
                            {pl}
                          </Badge>
                        ))}
                        <Badge variant={POST_STATUS_VARIANTS[p.status] ?? "outline"} className="capitalize">
                          {p.status}
                        </Badge>
                        {dateToShow && (
                          <span className="text-xs text-muted-foreground">
                            {format(dateToShow, "MMM d, yyyy")}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
