"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { bulkDeletePosts, bulkReschedulePosts, bulkDuplicatePosts } from "@/lib/actions/posts";
import { Trash2, CalendarClock, Copy, X } from "lucide-react";

interface BulkActionBarProps {
  selectedIds: string[];
  onClear: () => void;
}

export function BulkActionBar({ selectedIds, onClear }: BulkActionBarProps) {
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [dateValue, setDateValue] = useState("");
  const [isPending, startTransition] = useTransition();

  if (selectedIds.length === 0) return null;

  function handleDelete() {
    startTransition(async () => {
      await bulkDeletePosts(selectedIds);
      onClear();
    });
  }

  function handleDuplicate() {
    startTransition(async () => {
      await bulkDuplicatePosts(selectedIds);
      onClear();
    });
  }

  function handleReschedule() {
    if (!dateValue) return;
    const date = new Date(dateValue);
    startTransition(async () => {
      await bulkReschedulePosts(selectedIds, date);
      setRescheduleOpen(false);
      setDateValue("");
      onClear();
    });
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-4 py-2.5">
        <Badge variant="secondary">{selectedIds.length} selected</Badge>
        <div className="flex items-center gap-2 ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDuplicate}
            disabled={isPending}
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setRescheduleOpen(true)}
            disabled={isPending}
          >
            <CalendarClock className="h-4 w-4" />
            Reschedule
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
          <Button variant="ghost" size="icon" onClick={onClear} disabled={isPending}>
            <X className="h-4 w-4" />
            <span className="sr-only">Clear selection</span>
          </Button>
        </div>
      </div>

      <Dialog open={rescheduleOpen} onOpenChange={setRescheduleOpen}>
        <DialogContent>
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Reschedule {selectedIds.length} post{selectedIds.length !== 1 ? "s" : ""}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reschedule-date">New date &amp; time</Label>
            <Input
              id="reschedule-date"
              type="datetime-local"
              value={dateValue}
              onChange={(e) => setDateValue(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleOpen(false)} disabled={isPending}>
              Cancel
            </Button>
            <Button onClick={handleReschedule} disabled={!dateValue || isPending}>
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
