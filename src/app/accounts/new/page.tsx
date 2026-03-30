import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/sidebar";
import { NewAccountForm } from "@/components/accounts/new-account-form";

export default async function NewAccountPage() {
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
            <h1 className="text-2xl font-semibold">Connect Account</h1>
            <p className="text-sm text-muted-foreground">
              Link a social media account to start scheduling posts
            </p>
          </div>

          <NewAccountForm />
        </div>
      </main>
    </div>
  );
}
