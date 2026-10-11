import { SOURCE_KEYS, type Enquiry, type SourceKey } from "./inbox-types";

export type Range = "7d" | "30d" | "13w";
export const RANGES: { key: Range; label: string; days: number; bucket: number }[] = [
  { key: "7d", label: "7 days", days: 7, bucket: 1 },
  { key: "30d", label: "30 days", days: 30, bucket: 1 },
  { key: "13w", label: "13 weeks", days: 91, bucket: 7 },
];

export type Bucket = { start: Date; end: Date; total: number; bySource: Record<SourceKey, number> };

const startOfDay = (t: number) => {
  const d = new Date(t);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
};

/** Small deterministic generator, so the sample history is the same on every visit. */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Average enquiries per weekday for each source: the shape of a small agency's inbox. */
const RATE: Record<SourceKey, number> = { contact: 0.5, calculator: 0.35, "kill-my-idea": 0.25, grant: 0.15, "partner-refer": 0.07, "partner-join": 0.05, "zero-one": 0.1, careers: 0.08 };
const REAL_DAYS = 15; // the last two weeks come from the actual inbox; older days are sample history

const empty = (): Record<SourceKey, number> => Object.fromEntries(SOURCE_KEYS.map((k) => [k, 0])) as Record<SourceKey, number>;

/** Enquiries per source for the day `offset` days before today. */
function dayCounts(offset: number, today: number, enquiries: Enquiry[]): Record<SourceKey, number> {
  const out = empty();
  const day = new Date(today);
  day.setDate(day.getDate() - offset);
  const t0 = day.getTime();
  if (offset < REAL_DAYS) {
    for (const e of enquiries) {
      if (e.folder === "spam") continue;
      const r = new Date(e.received).getTime();
      if (r >= t0 && r < t0 + 86_400_000) out[e.source]++;
    }
    return out;
  }
  const dow = day.getDay();
  const weekend = dow === 0 || dow === 6 ? 0.3 : 1;
  const rand = rng(Math.floor(t0 / 86_400_000) * 97 + 13);
  for (const k of SOURCE_KEYS) {
    const v = RATE[k] * weekend * (0.35 + rand() * 1.3);
    out[k] = Math.floor(v + rand() * 0.9);
  }
  return out;
}

/** Buckets from oldest to newest covering the `days` days up to and including today. */
export function buildBuckets(enquiries: Enquiry[], now: number, days: number, bucket: number, shiftDays = 0): Bucket[] {
  const today = startOfDay(now);
  const n = Math.ceil(days / bucket);
  const out: Bucket[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const bySource = empty();
    const first = i * bucket + shiftDays;
    for (let d = first; d < first + bucket && d < days + shiftDays; d++) {
      const c = dayCounts(d, today, enquiries);
      for (const k of SOURCE_KEYS) bySource[k] += c[k];
    }
    const start = new Date(today);
    start.setDate(start.getDate() - (first + bucket - 1));
    const end = new Date(today);
    end.setDate(end.getDate() - first);
    out.push({ start, end, bySource, total: SOURCE_KEYS.reduce((s, k) => s + bySource[k], 0) });
  }
  return out;
}

export const sumBuckets = (b: Bucket[]) => b.reduce((s, x) => s + x.total, 0);

/** A tidy axis maximum and tick values for counts. */
export function niceAxis(max: number): { top: number; ticks: number[] } {
  const m = Math.max(4, max);
  const step = m <= 8 ? 2 : m <= 20 ? 5 : m <= 50 ? 10 : m <= 100 ? 20 : 50;
  const top = Math.ceil(m / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return { top, ticks };
}
