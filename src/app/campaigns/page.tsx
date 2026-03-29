import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { format } from "date-fns";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { campaign, post } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Megaphone, Plus } from "lucide-react";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline"> = {
  active: "default",
  paused: "secondary",
  completed: "outline",
};

export default async function CampaignsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  const campaigns = await db.query.campaign.findMany({
    where: eq(campaign.userId, userId),
    orderBy: (c, { desc }) => [desc(c.createdAt)],
  });

  const postCounts = await Promise.all(
    campaigns.map((c) =>
      db.query.post.findMany({ where: eq(post.campaignId, c.id) }).then((posts) => ({
        campaignId: c.id,
        total: posts.length,
        published: posts.filter((p) => p.status === "published").length,
      }))
    )
  );

  const countMap = Object.fromEntries(postCounts.map((pc) => [pc.campaignId, pc]));

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Campaigns</h1>
              <p className="text-sm text-muted-foreground">Manage your content campaigns</p>
            </div>
            <Button asChild>
              <Link href="/campaigns/new">
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Link>
            </Button>
          </div>

          {campaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Megaphone className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">No campaigns yet</h3>
                <p className="text-sm text-muted-foreground">
                  Create a campaign to organize and schedule a sequence of posts
                </p>
              </div>
              <Button asChild>
                <Link href="/campaigns/new">Create Campaign</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {campaigns.map((c) => {
                const counts = countMap[c.id];
                return (
                  <Link key={c.id} href={`/campaigns/${c.id}`}>
                    <Card className="transition-colors hover:bg-accent/50">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <CardTitle className="text-base font-semibold">{c.name}</CardTitle>
                        <Badge variant={STATUS_VARIANTS[c.status] ?? "outline"} className="capitalize">
                          {c.status}
                        </Badge>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground line-clamp-2">{c.brief}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          <span>{counts?.total ?? 0} posts · {counts?.published ?? 0} published</span>
                          {c.startDate && (
                            <span>Started {format(c.startDate, "MMM d, yyyy")}</span>
                          )}
                          {c.endDate && (
                            <span>Ends {format(c.endDate, "MMM d, yyyy")}</span>
                          )}
                          <span>Created {format(c.createdAt, "MMM d, yyyy")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
