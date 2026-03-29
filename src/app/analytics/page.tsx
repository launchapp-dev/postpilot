import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Sidebar } from "@/components/layout/sidebar";
import { BarChart2, TrendingUp, FileText, Users, Eye, MousePointerClick, Share2, Heart } from "lucide-react";

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "Twitter / X",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  facebook: "Facebook",
  tiktok: "TikTok",
};

function parsePlatforms(raw: string): string[] {
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export default async function AnalyticsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [allPosts, publishedPosts, scheduledPosts] = await Promise.all([
    db.query.post.findMany({ where: eq(post.userId, userId) }),
    db.query.post.findMany({
      where: and(eq(post.userId, userId), eq(post.status, "published")),
      orderBy: (p, { desc }) => [desc(p.publishedAt)],
    }),
    db.query.post.findMany({
      where: and(eq(post.userId, userId), eq(post.status, "scheduled")),
    }),
  ]);

  const platformCounts: Record<string, number> = {};
  for (const p of allPosts) {
    const platforms = parsePlatforms(p.platforms);
    for (const platform of platforms) {
      platformCounts[platform] = (platformCounts[platform] ?? 0) + 1;
    }
  }

  const platformEntries = Object.entries(platformCounts).sort((a, b) => b[1] - a[1]);
  const totalPlatformPosts = platformEntries.reduce((sum, [, count]) => sum + count, 0);

  const summaryStats = [
    { label: "Total Posts", value: allPosts.length, icon: FileText },
    { label: "Published", value: publishedPosts.length, icon: TrendingUp },
    { label: "Scheduled", value: scheduledPosts.length, icon: BarChart2 },
    { label: "Platforms Active", value: platformEntries.length, icon: Users },
  ];

  const placeholderMetrics = [
    { label: "Impressions", value: "—", icon: Eye },
    { label: "Clicks", value: "—", icon: MousePointerClick },
    { label: "Shares", value: "—", icon: Share2 },
    { label: "Engagements", value: "—", icon: Heart },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
          <div>
            <h1 className="text-2xl font-semibold">Analytics</h1>
            <p className="text-sm text-muted-foreground">
              Content performance and audience insights
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {summaryStats.map(({ label, value, icon: Icon }) => (
              <Card key={label}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {placeholderMetrics.map(({ label, value, icon: Icon }) => (
                  <Card key={label}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {label}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-muted-foreground">{value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Platform integration required
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Engagement Trends</CardTitle>
                  <CardDescription>
                    Connect your social accounts to see engagement data over time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex h-40 items-center justify-center rounded-md border border-dashed border-border">
                    <p className="text-sm text-muted-foreground">
                      No engagement data yet
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="platforms" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Platform Breakdown</CardTitle>
                  <CardDescription>
                    Posts distributed across connected platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {platformEntries.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">No platform data yet</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {platformEntries.map(([platform, count]) => {
                        const pct = totalPlatformPosts > 0 ? Math.round((count / totalPlatformPosts) * 100) : 0;
                        return (
                          <div key={platform} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium">
                                {PLATFORM_LABELS[platform] ?? platform}
                              </span>
                              <span className="text-muted-foreground">
                                {count} post{count !== 1 ? "s" : ""} · {pct}%
                              </span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Published Posts</CardTitle>
                  <CardDescription>
                    Your most recently published content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {publishedPosts.length === 0 ? (
                    <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-border">
                      <p className="text-sm text-muted-foreground">No published posts yet</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border">
                      {publishedPosts.slice(0, 10).map((p) => {
                        const platforms = parsePlatforms(p.platforms);
                        return (
                          <div key={p.id} className="flex items-start justify-between gap-4 py-3">
                            <p className="line-clamp-2 flex-1 text-sm">{p.content}</p>
                            <div className="flex shrink-0 flex-wrap gap-1">
                              {platforms.map((platform) => (
                                <Badge key={platform} variant="outline" className="text-xs">
                                  {PLATFORM_LABELS[platform] ?? platform}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
