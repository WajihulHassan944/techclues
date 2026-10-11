/** Everything in the bookings area is shown in UK time, the same zone the public booking page offers by default. */
export const TZ = "Europe/London";

const PARTS = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit" });

function parts(d: Date) {
  const o: Record<string, number> = {};
  for (const p of PARTS.formatToParts(d)) if (p.type !== "literal") o[p.type] = Number(p.value);
  return o as { year: number; month: number; day: number; hour: number; minute: number; second: number };
}
const offsetMin = (d: Date) => {
  const p = parts(d);
  return Math.round((Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - d.getTime()) / 60_000);
};

/** UK wall-clock time to a real instant. `minutes` is minutes after midnight. */
export function zoned(key: string, minutes: number): Date {
  const [y, m, d] = key.split("-").map(Number);
  const base = Date.UTC(y, m - 1, d, 0, minutes);
  const o1 = offsetMin(new Date(base));
  let t = base - o1 * 60_000;
  const o2 = offsetMin(new Date(t));
  if (o2 !== o1) t = base - o2 * 60_000;
  return new Date(t);
}

/** YYYY-MM-DD in UK time. */
export function dateKey(d: Date | string | number): string {
  const p = parts(new Date(d));
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}
export const minutesOfDay = (d: Date | string) => {
  const p = parts(new Date(d));
  return p.hour * 60 + p.minute;
};

export function addDays(key: string, n: number): string {
  const [y, m, d] = key.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return `${t.getUTCFullYear()}-${String(t.getUTCMonth() + 1).padStart(2, "0")}-${String(t.getUTCDate()).padStart(2, "0")}`;
}
/** Monday = 0 … Sunday = 6. */
export function weekday(key: string): number {
  const [y, m, d] = key.split("-").map(Number);
  return (new Date(Date.UTC(y, m - 1, d)).getUTCDay() + 6) % 7;
}
export function monthGrid(y: number, m: number): (string | null)[] {
  const first = `${y}-${String(m).padStart(2, "0")}-01`;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const out: (string | null)[] = Array(weekday(first)).fill(null);
  for (let i = 1; i <= days; i++) out.push(`${y}-${String(m).padStart(2, "0")}-${String(i).padStart(2, "0")}`);
  while (out.length % 7) out.push(null);
  return out;
}

const T = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
export const fmtTime = (d: Date | string) => T.format(new Date(d));
export const fmtKey = (key: string, o: Intl.DateTimeFormatOptions = { weekday: "long", day: "numeric", month: "long" }) => {
  const [y, m, d] = key.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { ...o, timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
};
export const monthTitle = (y: number, m: number) => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
export const hhmm = (min: number) => `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
export const toMin = (s: string) => {
  const [h, m] = s.split(":").map(Number);
  return h * 60 + m;
};
