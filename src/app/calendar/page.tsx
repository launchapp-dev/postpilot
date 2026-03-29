import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { CalendarClient } from "./calendar-client";
import { getPostsForMonth } from "./actions";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const { month } = await searchParams;

  let currentDate = new Date();
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [year, mon] = month.split("-").map(Number);
    currentDate = new Date(year, mon - 1, 1);
  }

  const posts = await getPostsForMonth(
    session.user.id,
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Content Calendar</h1>
            <Button asChild>
              <Link href="/posts/new">
                <Plus className="mr-2 h-4 w-4" />
                New Post
              </Link>
            </Button>
          </div>
          <CalendarClient posts={posts} initialMonth={currentDate} />
        </div>
      </main>
    </div>
  );
}
