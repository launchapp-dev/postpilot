import { addDays, setHours, setMinutes, setSeconds, setMilliseconds, getDay } from "date-fns";

export const PLATFORM_DAILY_LIMIT = 5;

export type Platform = "x" | "linkedin" | "instagram";

export function getOptimalTimes(platform: Platform, baseDate: Date): Date[] {
  const d = setSeconds(setMilliseconds(new Date(baseDate), 0), 0);

  if (platform === "x") {
    return [9, 12, 17].map((h) => setHours(setMinutes(d, 0), h));
  }

  if (platform === "linkedin") {
    const slots: Date[] = [];
    for (let offset = 0; offset < 7; offset++) {
      const day = addDays(d, offset);
      const dow = getDay(day);
      if (dow >= 2 && dow <= 4) {
        slots.push(setHours(setMinutes(day, 0), 8));
        slots.push(setHours(setMinutes(day, 0), 10));
      }
    }
    return slots.slice(0, 6);
  }

  return [11, 14].map((h) => setHours(setMinutes(d, 0), h));
}

export function calcNextRetryAt(attempts: number): Date {
  const delayMs = Math.pow(2, attempts) * 5 * 60 * 1000;
  return new Date(Date.now() + delayMs);
}
