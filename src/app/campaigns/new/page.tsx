import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { NewCampaignForm } from "@/components/campaigns/new-campaign-form";

export default async function NewCampaignPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-2xl space-y-8 px-6 py-8">
          <div>
            <h1 className="text-2xl font-semibold">New Campaign</h1>
            <p className="text-sm text-muted-foreground">
              Describe your campaign and AI will generate a post sequence for you
            </p>
          </div>

          <NewCampaignForm />
        </div>
      </main>
    </div>
  );
}
