import { redirect, notFound } from "next/navigation";
import { headers } from "next/headers";
import { eq, and } from "drizzle-orm";
import Link from "next/link";
import { format } from "date-fns";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { socialAccount } from "@/db/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sidebar } from "@/components/layout/sidebar";
import { AccountActions } from "@/components/accounts/account-actions";
import { ArrowLeft } from "lucide-react";

const PLATFORM_LABELS: Record<string, string> = {
  twitter: "X / Twitter",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  tiktok: "TikTok",
  bluesky: "Bluesky",
  threads: "Threads",
};

export default async function AccountDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");

  const acct = await db.query.socialAccount.findFirst({
    where: and(eq(socialAccount.id, id), eq(socialAccount.userId, session.user.id)),
  });

  if (!acct) notFound();

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-6 px-6 py-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/accounts">
                <ArrowLeft className="mr-1.5 h-4 w-4" />
                Back
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{PLATFORM_LABELS[acct.platform] ?? acct.platform}</CardTitle>
              <Badge variant={acct.status === "connected" ? "default" : "secondary"} className="capitalize">
                {acct.status}
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <span className="text-muted-foreground">Handle</span>
                <span>@{acct.handle}</span>

                {acct.displayName && (
                  <>
                    <span className="text-muted-foreground">Display name</span>
                    <span>{acct.displayName}</span>
                  </>
                )}

                <span className="text-muted-foreground">Connected</span>
                <span>{format(acct.createdAt, "MMM d, yyyy")}</span>

                <span className="text-muted-foreground">Last updated</span>
                <span>{format(acct.updatedAt, "MMM d, yyyy")}</span>
              </div>

              <AccountActions accountId={acct.id} status={acct.status} />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
