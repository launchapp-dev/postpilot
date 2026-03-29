"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCampaignStatus } from "@/app/campaigns/actions";
import { Button } from "@/components/ui/button";
import { Pause, Play, CheckCircle } from "lucide-react";

interface CampaignControlsProps {
  campaignId: string;
  status: "active" | "paused" | "completed";
}

export function CampaignControls({ campaignId, status }: CampaignControlsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAction(newStatus: "active" | "paused" | "completed") {
    setLoading(true);
    await updateCampaignStatus(campaignId, newStatus);
    router.refresh();
    setLoading(false);
  }

  if (status === "completed") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <CheckCircle className="h-4 w-4" />
        Campaign completed
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      {status === "active" ? (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("paused")}
          disabled={loading}
        >
          <Pause className="mr-1 h-4 w-4" />
          Pause
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleAction("active")}
          disabled={loading}
        >
          <Play className="mr-1 h-4 w-4" />
          Resume
        </Button>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction("completed")}
        disabled={loading}
      >
        <CheckCircle className="mr-1 h-4 w-4" />
        Mark Complete
      </Button>
    </div>
  );
}
