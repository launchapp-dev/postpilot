import { redirect } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { Link2, Plus } from "lucide-react";

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  tiktok: "TikTok",
  bluesky: "Bluesky",
  threads: "Threads",
};

export default async function AccountsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const accounts = await db.query.socialAccount.findMany({
    where: eq(socialAccount.userId, session.user.id),
    orderBy: (a, { desc }) => [desc(a.createdAt)],
  });

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl space-y-8 px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">Connected Accounts</h1>
              <p className="text-sm text-muted-foreground">Manage your social media connections</p>
            </div>
            <Button asChild>
              <Link href="/accounts/new">
                <Plus className="mr-2 h-4 w-4" />
                Connect Account
              </Link>
            </Button>
          </div>

          {accounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Link2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-semibold">No accounts connected</h3>
                <p className="text-sm text-muted-foreground">
                  Connect your social accounts to start scheduling posts
                </p>
              </div>
              <Button asChild>
                <Link href="/accounts/new">Connect Account</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {accounts.map((acct) => (
                <Link key={acct.id} href={`/accounts/${acct.id}`}>
                  <Card className="transition-colors hover:bg-accent/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-base font-semibold">
                        {PLATFORM_LABELS[acct.platform] ?? acct.platform}
                      </CardTitle>
                      <Badge variant={acct.status === "connected" ? "default" : "secondary"} className="capitalize">
                        {acct.status}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        @{acct.handle}
                        {acct.displayName ? ` · ${acct.displayName}` : ""}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
