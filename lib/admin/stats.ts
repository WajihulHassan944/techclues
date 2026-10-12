import type { SourceKey } from "./inbox-types";

export type Range = "7d" | "30d" | "13w";
export const RANGES: { key: Range; label: string; days: number; bucket: number }[] = [
  { key: "7d", label: "7 days", days: 7, bucket: 1 },
  { key: "30d", label: "30 days", days: 30, bucket: 1 },
  { key: "13w", label: "13 weeks", days: 91, bucket: 7 },
];

export type Bucket = { start: Date; end: Date; total: number; bySource: Record<SourceKey, number> };

/** A tidy axis maximum and tick values for counts. */
export function niceAxis(max: number): { top: number; ticks: number[] } {
  const m = Math.max(4, max);
  const step = m <= 8 ? 2 : m <= 20 ? 5 : m <= 50 ? 10 : m <= 100 ? 20 : 50;
  const top = Math.ceil(m / step) * step;
  const ticks: number[] = [];
  for (let v = 0; v <= top; v += step) ticks.push(v);
  return { top, ticks };
}
