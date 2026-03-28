import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { format } from "date-fns";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EditPostForm } from "./edit-post-form";
import { ArrowLeft } from "lucide-react";

type PostStatus = "draft" | "scheduled" | "published" | "failed";

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Draft",
  scheduled: "Scheduled",
  published: "Published",
  failed: "Failed",
};

const STATUS_VARIANTS: Record<PostStatus, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "secondary",
  scheduled: "outline",
  published: "default",
  failed: "destructive",
};

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { id } = await params;
  const found = await db.query.post.findFirst({
    where: and(eq(post.id, id), eq(post.userId, session.user.id)),
  });

  if (!found) notFound();

  const status = found.status as PostStatus;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Post Details</h1>
              <p className="text-sm text-muted-foreground">
                Created {format(found.createdAt, "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            <Badge variant={STATUS_VARIANTS[status]}>{STATUS_LABELS[status]}</Badge>
          </div>

          {found.scheduledAt && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Scheduled for
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  {format(found.scheduledAt, "MMMM d, yyyy 'at' h:mm a")}
                </p>
              </CardContent>
            </Card>
          )}

          <EditPostForm
            post={{
              id: found.id,
              content: found.content,
              platforms: found.platforms,
              status,
              scheduledAt: found.scheduledAt,
            }}
          />
        </div>
      </main>
    </div>
  );
}
