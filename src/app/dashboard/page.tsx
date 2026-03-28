import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { startOfWeek, endOfWeek } from "date-fns";
import { eq, and, gte, lte } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { PostList } from "@/components/posts/post-list";
import { CalendarDays, Send, FileText, AlertCircle } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [allPosts, weekPosts, scheduledPosts, publishedPosts, draftPosts] = await Promise.all([
    db.query.post.findMany({
      where: eq(post.userId, userId),
      orderBy: (p, { desc }) => [desc(p.createdAt)],
    }),
    db.query.post.findMany({
      where: and(
        eq(post.userId, userId),
        gte(post.createdAt, startOfWeek(new Date())),
        lte(post.createdAt, endOfWeek(new Date()))
      ),
    }),
    db.query.post.findMany({
      where: and(eq(post.userId, userId), eq(post.status, "scheduled")),
    }),
    db.query.post.findMany({
      where: and(eq(post.userId, userId), eq(post.status, "published")),
    }),
    db.query.post.findMany({
      where: and(eq(post.userId, userId), eq(post.status, "draft")),
    }),
  ]);

  const stats = [
    { label: "Posts this week", value: weekPosts.length, icon: CalendarDays },
    { label: "Scheduled", value: scheduledPosts.length, icon: Send },
    { label: "Published", value: publishedPosts.length, icon: FileText },
    { label: "Drafts", value: draftPosts.length, icon: AlertCircle },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Dashboard</h1>
              <p className="text-sm text-muted-foreground">
                Welcome back, {session.user.name}
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link href="/calendar">View Calendar</Link>
              </Button>
              <Button asChild>
                <Link href="/posts/new">New Post</Link>
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map(({ label, value, icon: Icon }) => (
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

          <div>
            <h2 className="mb-4 text-lg font-semibold">All Posts</h2>
            <PostList posts={allPosts} />
          </div>
        </div>
      </main>
    </div>
  );
}
