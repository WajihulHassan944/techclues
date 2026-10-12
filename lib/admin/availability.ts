import { addDays, dateKey, toMin, weekday, zoned } from "./tz";
import type { Booking } from "./bookings-types";

export type Availability = {
  slotMinutes: number;
  bufferMinutes: number;
  noticeHours: number;
  windowDays: number;
  meetingLink: string;
  /** Monday to Sunday. `to` is when the last call must end. */
  days: { on: boolean; from: string; to: string }[];
  blocked: { date: string; reason: string }[];
};

export const DEFAULT_AVAILABILITY: Availability = {
  slotMinutes: 30,
  bufferMinutes: 0,
  noticeHours: 4,
  windowDays: 21,
  meetingLink: "https://meet.google.com/techclues-calls",
  days: [
    { on: true, from: "09:00", to: "17:30" },
    { on: true, from: "09:00", to: "17:30" },
    { on: true, from: "09:00", to: "17:30" },
    { on: true, from: "09:00", to: "17:30" },
    { on: true, from: "09:00", to: "17:30" },
    { on: false, from: "09:00", to: "13:00" },
    { on: false, from: "09:00", to: "13:00" },
  ],
  blocked: [],
};

export const isBlocked = (av: Availability, key: string) => av.blocked.find((b) => b.date === key);

/** Free start times on a day, as ISO strings, given hours, notice, window, blocked days and existing calls. */
export function slotsForDay(key: string, av: Availability, bookings: Booking[], now: number, ignoreId?: string): string[] {
  const day = av.days[weekday(key)];
  if (!day.on || isBlocked(av, key)) return [];
  const earliest = now + av.noticeHours * 3_600_000;
  const latest = zoned(addDays(dateKey(now), av.windowDays), 24 * 60).getTime();
  const step = av.slotMinutes + av.bufferMinutes;
  const busy = bookings.filter((b) => b.status === "confirmed" && b.id !== ignoreId).map((b) => [new Date(b.start).getTime() - av.bufferMinutes * 60_000, new Date(b.start).getTime() + (b.minutes + av.bufferMinutes) * 60_000] as const);
  const out: string[] = [];
  for (let s = toMin(day.from); s + av.slotMinutes <= toMin(day.to); s += step) {
    const start = zoned(key, s).getTime();
    const end = start + av.slotMinutes * 60_000;
    if (start < earliest || start >= latest) continue;
    if (busy.some(([a, b]) => start < b && end > a)) continue;
    out.push(new Date(start).toISOString());
  }
  return out;
}

/** The next few free slots across the booking window, for the availability preview. */
export function nextSlots(av: Availability, bookings: Booking[], now: number, count = 6): string[] {
  const out: string[] = [];
  let key = dateKey(now);
  for (let i = 0; i <= av.windowDays && out.length < count; i++, key = addDays(key, 1)) out.push(...slotsForDay(key, av, bookings, now));
  return out.slice(0, count);
}
