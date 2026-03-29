"use client";

import { useState } from "react";
import Link from "next/link";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  isSameMonth,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarPost {
  id: string;
  content: string;
  platforms: string;
  status: string;
  scheduledAt: Date | null;
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: "bg-blue-500 text-white border-transparent",
  x: "bg-blue-500 text-white border-transparent",
  linkedin: "bg-sky-600 text-white border-transparent",
  instagram: "bg-pink-500 text-white border-transparent",
  facebook: "bg-indigo-600 text-white border-transparent",
};

function platformColor(platform: string): string {
  return PLATFORM_COLORS[platform.toLowerCase()] ?? "bg-purple-500 text-white border-transparent";
}

function parsePlatforms(json: string): string[] {
  try {
    const val = JSON.parse(json);
    return Array.isArray(val) ? val : [];
  } catch {
    return [];
  }
}

interface CalendarClientProps {
  posts: CalendarPost[];
  initialMonth: Date;
}

export function CalendarClient({ posts, initialMonth }: CalendarClientProps) {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [view, setView] = useState("month");

  const calStart = startOfWeek(startOfMonth(currentMonth));
  const calEnd = endOfWeek(endOfMonth(currentMonth));
  const calDays = eachDayOfInterval({ start: calStart, end: calEnd });

  function getPostsForDay(day: Date) {
    return posts.filter((p) => {
      if (!p.scheduledAt) return false;
      return isSameDay(new Date(p.scheduledAt as unknown as string | Date), day);
    });
  }

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  function handleDayClick(day: Date) {
    setSelectedDay((prev) => (prev && isSameDay(prev, day) ? null : day));
  }

  return (
    <div className="flex gap-6">
      <div className="flex flex-1 flex-col">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="min-w-36 text-center text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <Tabs value={view} onValueChange={setView}>
            <TabsList>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="day">Day</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {view === "month" && (
          <>
            <div className="mb-1 grid grid-cols-7 text-center">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                <div key={d} className="py-2 text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-border">
              {calDays.map((day) => {
                const dayPosts = getPostsForDay(day);
                const inMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);
                const selected = selectedDay && isSameDay(day, selectedDay);
                const noContent = inMonth && dayPosts.length === 0;

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDayClick(day)}
                    className={cn(
                      "min-h-24 bg-card p-2 text-left transition-colors hover:bg-accent",
                      !inMonth && "opacity-40",
                      today && "ring-2 ring-inset ring-primary",
                      selected && "bg-accent",
                      noContent && "bg-amber-50 dark:bg-amber-950/20"
                    )}
                  >
                    <span
                      className={cn(
                        "mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full text-sm",
                        today && "bg-primary text-primary-foreground font-semibold"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {dayPosts.slice(0, 3).map((p) => {
                        const platforms = parsePlatforms(p.platforms);
                        const platform = platforms[0] ?? "post";
                        return (
                          <span
                            key={p.id}
                            className={cn(
                              "max-w-full truncate rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-tight",
                              platformColor(platform)
                            )}
                          >
                            {platform}
                          </span>
                        );
                      })}
                      {dayPosts.length > 3 && (
                        <span className="text-[10px] text-muted-foreground">
                          +{dayPosts.length - 3}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {view === "week" && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-border py-24 text-sm text-muted-foreground">
            Week view coming soon
          </div>
        )}

        {view === "day" && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-border py-24 text-sm text-muted-foreground">
            Day view coming soon
          </div>
        )}
      </div>

      {selectedDay && (
        <div className="w-72 shrink-0 rounded-lg border border-border bg-card p-4">
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="font-semibold">{format(selectedDay, "EEEE")}</p>
              <p className="text-sm text-muted-foreground">{format(selectedDay, "MMMM d, yyyy")}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedDay(null)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Link
            href={`/posts/new?date=${format(selectedDay, "yyyy-MM-dd")}`}
            className="mb-4 flex w-full items-center justify-center rounded-md border border-dashed border-border py-2 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary"
          >
            + New Post
          </Link>

          <div className="space-y-2">
            {selectedDayPosts.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground">No posts scheduled</p>
            ) : (
              selectedDayPosts.map((p) => {
                const platforms = parsePlatforms(p.platforms);
                return (
                  <Link
                    key={p.id}
                    href={`/posts/${p.id}`}
                    className="block rounded-md border border-border p-3 transition-colors hover:bg-accent"
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-1">
                      {platforms.map((platform) => (
                        <Badge
                          key={platform}
                          className={cn("text-[10px] px-1.5 py-0", platformColor(platform))}
                        >
                          {platform}
                        </Badge>
                      ))}
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        {p.status}
                      </Badge>
                    </div>
                    <p className="line-clamp-2 text-xs text-muted-foreground">{p.content}</p>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
