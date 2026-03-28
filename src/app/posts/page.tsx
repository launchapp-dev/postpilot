import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { post } from "@/db/schema";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { PostList } from "@/components/posts/post-list";

export default async function PostsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const posts = await db.query.post.findMany({
    where: eq(post.userId, session.user.id),
    orderBy: (p, { desc }) => [desc(p.createdAt)],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Posts</h1>
            <Button asChild>
              <Link href="/posts/new">New Post</Link>
            </Button>
          </div>

          <PostList posts={posts} />
        </div>
      </main>
    </div>
  );
}
