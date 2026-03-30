"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { disconnectSocialAccount, reconnectSocialAccount, deleteSocialAccount } from "@/app/accounts/actions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AccountActions({
  accountId,
  status,
}: {
  accountId: string;
  status: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleToggle() {
    setLoading(true);
    if (status === "connected") {
      await disconnectSocialAccount(accountId);
    } else {
      await reconnectSocialAccount(accountId);
    }
    router.refresh();
    setLoading(false);
  }

  async function handleDelete() {
    setLoading(true);
    await deleteSocialAccount(accountId);
  }

  return (
    <div className="space-y-4 pt-2">
      <Separator />
      <div className="flex gap-3">
        <Button variant="outline" onClick={handleToggle} disabled={loading}>
          {status === "connected" ? "Disconnect" : "Reconnect"}
        </Button>
        <Button variant="outline" onClick={handleDelete} disabled={loading} className="text-destructive hover:text-destructive">
          Remove Account
        </Button>
      </div>
    </div>
  );
}
