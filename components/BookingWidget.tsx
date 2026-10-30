"use client";

import { useEffect, useMemo, useRef, useState, type ComponentProps, type CSSProperties } from "react";
import { api, ApiError } from "@/lib/api/client";

const TITLE = "Free MVP strategy call";
const DURATION = 30;
const EMAIL = "info@techclues.co.uk";
const PRIVACY = "/privacy-policy";
const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const cn = (...a: (string | false | undefined | null)[]) => a.filter(Boolean).join(" ");

/* ---------- time zone helpers (same maths as the original) ---------- */
type Parts = { year: number; month: number; day: number; hour: number; minute: number; second: number; weekday: number };
function partsOf(d: Date, tz: string): Parts {
  const n: Record<string, number> = {};
  for (const p of new Intl.DateTimeFormat("en-GB", { timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short" }).formatToParts(d)) {
    if (p.type === "weekday") n.weekday = WEEK.indexOf(p.value);
    else if (p.type !== "literal") n[p.type] = Number(p.value);
  }
  return n as unknown as Parts;
}
function offsetMin(d: Date, tz: string) {
  const n = partsOf(d, tz);
  return Math.round((Date.UTC(n.year, n.month - 1, n.day, n.hour, n.minute, n.second) - d.getTime()) / 6e4);
}
function zoned(y: number, mo: number, d: number, min: number, tz: string) {
  const base = Date.UTC(y, mo - 1, d, 0, min);
  const o1 = offsetMin(new Date(base), tz);
  let t = base - 6e4 * o1;
  const o2 = offsetMin(new Date(t), tz);
  if (o2 !== o1) t = base - 6e4 * o2;
  return new Date(t);
}
const timeText = (iso: string, tz: string, h12: boolean) =>
  new Intl.DateTimeFormat(undefined, { timeZone: tz, hour: "numeric", minute: "2-digit", hour12: h12 }).format(new Date(iso)).replace(/\s?([ap])\.?\s?m\.?/i, (_m, t) => ` ${t.toLowerCase()}m`);
const keyDate = (k: string) => {
  const [y, m, d] = k.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, d)));
};
const dayOf = (iso: string, tz: string) => {
  const n = partsOf(new Date(iso), tz);
  return `${n.year}-${String(n.month).padStart(2, "0")}-${String(n.day).padStart(2, "0")}`;
};
const offsetLabel = (tz: string, at = new Date()) => {
  const n = offsetMin(at, tz);
  if (!n) return "GMT";
  const a = Math.abs(n);
  return `GMT${n > 0 ? "+" : "-"}${Math.floor(a / 60)}${a % 60 ? `:${String(a % 60).padStart(2, "0")}` : ""}`;
};
const cityOf = (tz: string) => tz.split("/").pop()!.replace(/_/g, " ");
function allTimeZones(cur: string) {
  let t: string[] = [];
  try {
    t = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    t = [];
  }
  if (!t.length) t = ["Europe/London", "Europe/Dublin", "Europe/Paris", "America/New_York", "America/Los_Angeles", "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Australia/Sydney", "UTC"];
  return t.includes(cur) ? t : [cur, ...t];
}
function monthGrid(y: number, m: number) {
  const first = new Date(Date.UTC(y, m - 1, 1));
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const out: (string | null)[] = Array((first.getUTCDay() + 6) % 7).fill(null);
  for (let d = 1; d <= days; d++) out.push(`${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`);
  while (out.length % 7) out.push(null);
  return out;
}
const monthTitle = (y: number, m: number) => new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
const detectTz = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";
  } catch {
    return "Europe/London";
  }
};
const uses12 = () => {
  try {
    const c = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hourCycle;
    return c === "h12" || c === "h11";
  } catch {
    return false;
  }
};

/* ---------- real availability from the API ---------- */
type SlotData = { slots: string[]; duration: number; horizonEnd: string };
async function availableSlots(fromISO: string, toISO: string): Promise<SlotData> {
  return api.get<SlotData>(
    `/api/public/availability?from=${encodeURIComponent(fromISO)}&to=${encodeURIComponent(toISO)}`,
    { auth: false },
  );
}

/* ---------- small icons ---------- */
type IconProps = { className?: string; strokeWidth?: number };
const Icon = ({ className, strokeWidth = 2, name, children }: IconProps & { name: string; children: React.ReactNode }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-${name} ${className ?? ""}`} aria-hidden="true">
    {children}
  </svg>
);
const ChevronLeft = (p: IconProps) => <Icon name="chevron-left" {...p}><path d="m15 18-6-6 6-6" /></Icon>;
const ChevronRight = (p: IconProps) => <Icon name="chevron-right" {...p}><path d="m9 18 6-6-6-6" /></Icon>;
const ArrowRight = (p: IconProps) => <Icon name="arrow-right" {...p}><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></Icon>;
const ArrowLeft = (p: IconProps) => <Icon name="arrow-left" {...p}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></Icon>;
const Check = (p: IconProps) => <Icon name="check" {...p}><path d="M20 6 9 17l-5-5" /></Icon>;
const Clock = (p: IconProps) => <Icon name="clock" {...p}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></Icon>;
const Globe = (p: IconProps) => <Icon name="globe" {...p}><circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" /></Icon>;
const Video = (p: IconProps) => <Icon name="video" {...p}><path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" /><rect x="2" y="6" width="14" height="12" rx="2" /></Icon>;
const Download = (p: IconProps) => <Icon name="download" {...p}><path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" /></Icon>;
const CalendarPlus = (p: IconProps) => <Icon name="calendar-plus" {...p}><path d="M16 18h6" /><path d="M16 2v3" /><path d="M19 15v6" /><path d="M21 11.5V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h8.3" /><path d="M3 9h18" /><path d="M8 2v3" /></Icon>;

/* ---------- slot picker ---------- */
function SlotPicker({ timeZone: tz, onTimeZoneChange, h12, selected, onSelect, refreshKey }: { timeZone: string; onTimeZoneChange: (z: string) => void; h12: boolean; selected: string | null; onSelect: (iso: string) => void; refreshKey: number }) {
  const [nowIso] = useState(() => new Date().toISOString());
  const today = dayOf(nowIso, tz);
  const [ym, setYm] = useState(() => {
    const [y, m] = (selected ? dayOf(selected, tz) : today).split("-").map(Number);
    return { y, m };
  });
  const [dir, setDir] = useState(0);
  const [cache, setCache] = useState<Record<string, SlotData | { error: true }>>({});
  const [retry, setRetry] = useState(0);
  const [pickedDay, setPickedDay] = useState<string | null>(selected ? dayOf(selected, tz) : null);
  const [pickedTime, setPickedTime] = useState<string | null>(selected);
  const jumped = useRef(false);
  const timesRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const nextMonth = (y: number, m: number) => (m === 12 ? { y: y + 1, m: 1 } : { y, m: m + 1 });
  const key = `${tz}|${ym.y}-${ym.m}|${refreshKey}|${retry}`;
  const data = cache[key];

  useEffect(() => {
    if (cache[key]) return;
    const nm = nextMonth(ym.y, ym.m);
    const from = zoned(ym.y, ym.m, 1, 0, tz);
    const to = zoned(nm.y, nm.m, 1, 0, tz);
    let cancelled = false;
    const id = window.setTimeout(() => {
      availableSlots(from.toISOString(), to.toISOString())
        .then((res) => {
          if (cancelled) return;
          setCache((c) => ({ ...c, [key]: res }));
          if (!res.slots.length && !jumped.current && to.toISOString() < res.horizonEnd) {
            jumped.current = true;
            setDir(1);
            setYm(nm);
          }
        })
        .catch(() => {
          if (!cancelled) setCache((c) => ({ ...c, [key]: { error: true } }));
        });
    }, 350);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [key, cache, ym, tz]);

  const byDay = useMemo(() => {
    const map = new Map<string, string[]>();
    if (data && "slots" in data) for (const s of data.slots) map.set(dayOf(s, tz), [...(map.get(dayOf(s, tz)) ?? []), s]);
    return map;
  }, [data, tz]);
  const activeDay = pickedDay && byDay.has(pickedDay) ? pickedDay : [...byDay.keys()][0] ?? null;
  const times = activeDay ? byDay.get(activeDay) ?? [] : [];
  const [ty, tm] = today.split("-").map(Number);
  const canPrev = ym.y > ty || (ym.y === ty && ym.m > tm);
  const nmo = nextMonth(ym.y, ym.m);
  const nextIso = zoned(nmo.y, nmo.m, 1, 0, tz).toISOString();
  const canNext = !!data && "horizonEnd" in data && nextIso < data.horizonEnd;
  const go = (n: number) => {
    const t = 12 * ym.y + (ym.m - 1) + n;
    setDir(n);
    setYm({ y: Math.floor(t / 12), m: (t % 12) + 1 });
  };
  const zones = useMemo(() => allTimeZones(tz), [tz]);
  const loading = !data;
  const failed = !!data && "error" in data;
  const mKey = `${ym.y}-${ym.m}`;
  const slide = dir >= 0 ? "bk-slide-r" : "bk-slide-l";

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_220px] md:gap-8">
      <div>
        <div className="flex items-center justify-between">
          <div className="relative h-7 flex-1 overflow-hidden">
            <h3 key={mKey} className={cn("absolute inset-0 text-[17px] font-medium tracking-[-0.01em] text-ink", dir >= 0 ? "bk-title-r" : "bk-title-l")} style={dir === 0 ? { animation: "none" } : undefined} aria-live="polite">
              {monthTitle(ym.y, ym.m)}
            </h3>
          </div>
          <div className="flex gap-1">
            <button type="button" onClick={() => go(-1)} disabled={!canPrev} aria-label="Previous month" className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] active:scale-95 disabled:text-ink/20 disabled:hover:bg-transparent">
              <ChevronLeft className="size-5" />
            </button>
            <button type="button" onClick={() => go(1)} disabled={!canNext} aria-label="Next month" className="grid size-9 place-items-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] active:scale-95 disabled:text-ink/20 disabled:hover:bg-transparent">
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-7 gap-1 text-center" aria-hidden="true">
          {WEEK.map((d) => (
            <span key={d} className="py-1 text-[12px] font-medium text-muted">
              {d}
            </span>
          ))}
        </div>
        <div className="overflow-hidden">
          <div key={mKey} role="group" aria-label={`Days in ${monthTitle(ym.y, ym.m)}`} aria-busy={loading} className={cn("mt-1 grid grid-cols-7 gap-1", dir !== 0 && slide)}>
            {monthGrid(ym.y, ym.m).map((d, i) => {
              if (!d) return <span key={`blank-${i}`} />;
              const n = byDay.get(d)?.length ?? 0;
              const on = d === activeDay;
              return n ? (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setPickedDay(d);
                    setPickedTime(null);
                    requestAnimationFrame(() => {
                      const el = timesRef.current;
                      if (el && el.getBoundingClientRect().top > window.innerHeight - 120) el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
                    });
                  }}
                  aria-pressed={on}
                  aria-label={`${keyDate(d)}, ${n} ${n === 1 ? "time" : "times"} available`}
                  className={cn("group relative mx-auto grid aspect-square w-full max-w-[46px] place-items-center rounded-full text-[15px] font-medium tabular-nums transition-colors duration-200", on ? "text-white" : "bg-brand/[0.08] text-brand hover:bg-brand/[0.16]")}
                >
                  {on && <span className="bk-pop absolute inset-0 rounded-full bg-ink shadow-[0_8px_20px_-8px_rgba(14,15,49,0.6)]" />}
                  <span className="relative transition-transform duration-200 group-active:scale-90">{Number(d.slice(8))}</span>
                  {d === today && <span className={cn("absolute bottom-1.5 size-1 rounded-full", on ? "bg-white" : "bg-brand")} />}
                </button>
              ) : (
                <span key={d} className={cn("relative mx-auto grid aspect-square w-full max-w-[46px] place-items-center rounded-full text-[15px] tabular-nums", loading ? "animate-pulse bg-ink/[0.04] text-transparent" : "text-ink/25")}>
                  {Number(d.slice(8))}
                  {d === today && !loading && <span className="absolute bottom-1.5 size-1 rounded-full bg-ink/25" />}
                </span>
              );
            })}
          </div>
        </div>
        <label className="mt-6 flex items-center gap-2 text-[14px] text-ink-soft">
          <Globe className="size-4 shrink-0 text-muted" />
          <span className="sr-only">Time zone</span>
          <select value={tz} onChange={(e) => onTimeZoneChange(e.target.value)} className="w-auto min-w-0 max-w-full cursor-pointer truncate rounded-lg bg-transparent py-1 pr-1 text-[14px] text-ink underline decoration-ink/20 underline-offset-4 hover:decoration-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            {zones.map((z) => (
              <option key={z} value={z}>
                {cityOf(z)} ({offsetLabel(z)})
              </option>
            ))}
          </select>
        </label>
      </div>
      <div ref={timesRef} className="scroll-mt-24">
        {failed ? (
          <div className="rounded-2xl bg-[#f1f0f6] p-5 text-[14px] text-ink-soft" role="alert">
            The available times would not load.
            <button type="button" onClick={() => setRetry((r) => r + 1)} className="mt-3 block font-medium text-ink underline underline-offset-4">
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="space-y-2" aria-hidden="true">
            <span className="block h-5 w-40 animate-pulse rounded bg-ink/[0.06]" />
            {Array.from({ length: 5 }, (_, i) => (
              <span key={i} className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]" />
            ))}
          </div>
        ) : activeDay ? (
          <div key={activeDay} className="bk-fade">
            <p className="text-[15px] font-medium text-ink">{keyDate(activeDay)}</p>
            <p className="mt-0.5 text-[13px] text-muted">
              {times.length} {times.length === 1 ? "time" : "times"} · {cityOf(tz)} time
            </p>
            <ul className={cn("mt-4 grid grid-cols-2 gap-2 md:max-h-[392px] md:grid-cols-1 md:overflow-y-auto md:overscroll-contain md:pr-1", times.length > 7 && "md:pb-8 md:[mask-image:linear-gradient(to_bottom,#000_82%,transparent)]")} data-lenis-prevent>
              {times.map((t, i) => {
                const sel = t === pickedTime;
                return (
                  <li key={t} className={cn("bk-li", sel && "col-span-2 md:col-span-1")} style={{ animationDelay: `${0.025 * Math.min(i, 12)}s` } as CSSProperties}>
                    <div className={cn("grid transition-[grid-template-columns,column-gap] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]", sel ? "grid-cols-[1fr_1fr] gap-x-2" : "grid-cols-[1fr_0fr] gap-x-0")}>
                      <button
                        type="button"
                        onClick={() => {
                          setPickedTime(t);
                          requestAnimationFrame(() => nextRef.current?.focus({ preventScroll: true }));
                        }}
                        aria-pressed={sel}
                        className={cn("h-12 w-full rounded-xl border text-[15px] font-medium tabular-nums transition-colors duration-200", sel ? "border-ink bg-ink text-white" : "border-ink/12 text-ink hover:border-brand hover:bg-brand/[0.04] hover:text-brand")}
                      >
                        {timeText(t, tz, h12)}
                      </button>
                      <div className="min-w-0 overflow-hidden">
                        <button ref={sel ? nextRef : undefined} type="button" onClick={() => onSelect(t)} inert={!sel} aria-label={`Next: book ${timeText(t, tz, h12)}`} className={cn("group inline-flex h-12 w-full items-center justify-center gap-1.5 whitespace-nowrap rounded-xl bg-brand text-[15px] font-medium text-white transition-[opacity,background-color] duration-300 hover:bg-brand-ink", sel ? "opacity-100" : "opacity-0")}>
                          Next
                          <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <div className="rounded-2xl bg-[#f1f0f6] p-5 text-[14px] leading-relaxed text-ink-soft">
            Nothing available in {monthTitle(ym.y, ym.m).split(" ")[0]}.
            {canNext && (
              <button type="button" onClick={() => go(1)} className="mt-3 block font-medium text-ink underline underline-offset-4">
                View next month
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- booking form ---------- */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({ id, label, hint, error, ...rest }: { id: string; label: string; hint?: string; error?: string } & ComponentProps<"input">) {
  return (
    <label>
      <span className="mb-1.5 flex justify-between text-[14px] font-medium text-ink">
        {label}
        {hint && <span className="font-normal text-muted">{hint}</span>}
      </span>
      <input id={`booking-${id}`} {...rest} aria-invalid={!!error} aria-describedby={error ? `booking-${id}-error` : undefined} className={cn("h-12 w-full rounded-2xl border bg-white px-4 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 focus:outline-none focus:ring-4", error ? "border-[#b42318] focus:ring-[#b42318]/10" : "border-ink/12 hover:border-ink/25 focus:border-brand focus:ring-brand/10")} />
      {error && (
        <span id={`booking-${id}-error`} className="mt-1.5 block text-[13px] text-[#b42318]">
          {error}
        </span>
      )}
    </label>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[88px_minmax(0,1fr)] gap-3 px-4 py-3.5 text-[14px] sm:grid-cols-[110px_minmax(0,1fr)]">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink [overflow-wrap:anywhere]">{children}</dd>
    </div>
  );
}

type Booked = { name: string; email: string; start: string; meetingLink?: string; googleUrl: string; icsUrl: string; manageUrl: string };

function Widget() {
  const [tz, setTz] = useState(detectTz);
  const [h12] = useState(uses12);
  const [step, setStep] = useState<"pick" | "details" | "done">("pick");
  const [slot, setSlot] = useState<string | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(() => {
    const q = new URLSearchParams(window.location.search);
    return { name: q.get("name") ?? "", email: q.get("email") ?? "", company: q.get("company") ?? "", phone: "", notes: q.get("notes") ?? "", website: "" };
  });
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [booked, setBooked] = useState<Booked | null>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: true });
    const r = boxRef.current?.getBoundingClientRect();
    if (r && r.top < 0) boxRef.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, [step]);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (k === "name" || k === "email") if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const er: { name?: string; email?: string } = {};
    if (!form.name.trim()) er.name = "Enter your name.";
    if (!EMAIL_RE.test(form.email.trim())) er.email = "Please check your email address.";
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`booking-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setFormError("");
    setBusy(true);
    (async () => {
      try {
        const res = await api.post<{ id: string; start: string; minutes: number; meetingLink?: string }>(
          "/api/public/bookings",
          {
            name: form.name.trim(),
            email: form.email.trim(),
            company: form.company.trim() || undefined,
            phone: form.phone.trim() || undefined,
            start: slot!,
            topic: form.notes.trim() || TITLE,
            website: form.website,
          },
          { auth: false },
        );
        const start = new Date(res.start);
        const end = new Date(start.getTime() + (res.minutes ?? DURATION) * 6e4);
        const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
        const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//TechClues//Booking//EN", "BEGIN:VEVENT", `DTSTART:${stamp(start)}`, `DTEND:${stamp(end)}`, `SUMMARY:${TITLE}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
        setBooked({
          name: form.name.trim(),
          email: form.email.trim(),
          start: res.start,
          meetingLink: res.meetingLink,
          googleUrl: `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(TITLE)}&dates=${stamp(start)}/${stamp(end)}`,
          icsUrl: `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`,
          manageUrl: "/book-a-call",
        });
        setStep("done");
      } catch (err) {
        if (err instanceof ApiError && err.statusCode === 400) {
          // formError only renders on the "details" step, which we're about to leave — show
          // this on the "pick" step's own notice banner instead, or the user sees their slot
          // silently vanish with no explanation.
          setNotice(err.message || "That time has just been taken, so please choose another slot.");
          setStep("pick");
          setRefresh((r) => r + 1);
        } else {
          setFormError("We could not book your call. Please try once more.");
        }
      } finally {
        setBusy(false);
      }
    })();
  };

  const when = slot ? `${new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long" }).format(new Date(slot))}, ${timeText(slot, tz, h12)}` : "";
  const idx = ["pick", "details", "done"].indexOf(step);

  return (
    <div ref={boxRef} data-clarity-mask="True" className="scroll-mt-28 rounded-[28px] border border-ink/[0.08] bg-white p-5 shadow-[0_30px_80px_-50px_rgba(14,15,49,0.35)] sm:p-8">
      <ol className="mb-7 flex items-center gap-2 text-[13px]" aria-label="Booking steps">
        {["Time", "Details", "Booked"].map((s, n) => (
          <li key={s} className="flex items-center gap-2" aria-current={n === idx ? "step" : undefined}>
            <span className={cn("grid size-6 place-items-center rounded-full text-[12px] font-medium transition-colors duration-300", n < idx ? "bg-brand text-white" : n === idx ? "bg-ink text-white" : "bg-ink/[0.06] text-muted")}>{n < idx ? <Check className="size-3.5" strokeWidth={3} /> : n + 1}</span>
            <span className={cn("transition-colors duration-300", n === idx ? "font-medium text-ink" : "text-muted max-sm:sr-only")}>{s}</span>
            {n < 2 && (
              <span className="relative mx-1 h-px w-5 overflow-hidden bg-ink/15 sm:w-8">
                <span className={cn("absolute inset-y-0 left-0 bg-brand transition-[width] duration-500 ease-out", n < idx ? "w-full" : "w-0")} />
              </span>
            )}
          </li>
        ))}
      </ol>

      {step === "pick" && (
        <section key="pick" className="step-in" aria-labelledby="booking-step">
          <h2 id="booking-step" ref={headRef} tabIndex={-1} className="text-[22px] font-normal tracking-[-0.02em] text-ink outline-none">
            Pick a time
          </h2>
          {notice && (
            <p role="alert" className="mt-3 rounded-xl bg-[#fff4e5] px-4 py-3 text-[14px] text-[#8a4b00]">
              {notice}
            </p>
          )}
          <div className="mt-6">
            <SlotPicker
              timeZone={tz}
              onTimeZoneChange={setTz}
              h12={h12}
              selected={slot}
              onSelect={(t) => {
                setSlot(t);
                setNotice("");
                setStep("details");
              }}
              refreshKey={refresh}
            />
          </div>
        </section>
      )}

      {step === "details" && slot && (
        <section key="details" className="step-in" aria-labelledby="booking-step">
          <button type="button" onClick={() => setStep("pick")} className="group mb-4 inline-flex items-center gap-1.5 text-[14px] text-muted transition-colors hover:text-ink">
            <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
            Pick another time
          </button>
          <h2 id="booking-step" ref={headRef} tabIndex={-1} className="text-[22px] font-normal tracking-[-0.02em] text-ink outline-none">
            Your information
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-2xl bg-[#f1f0f6] px-4 py-3.5 text-[14px] text-ink">
            <span className="inline-flex items-center gap-2 font-medium">
              <Clock className="size-4 text-brand" />
              {when}
            </span>
            <span className="text-ink-soft">
              {TITLE} · {DURATION} min · {cityOf(tz)} time
            </span>
          </div>
          <form data-form="booking" data-clarity-mask="True" onSubmit={submit} noValidate className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field id="name" label="Name" value={form.name} onChange={set("name")} error={errors.name} autoComplete="name" required />
            <Field id="email" label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} autoComplete="email" inputMode="email" required />
            <Field id="company" label="Company name" hint="Not required" value={form.company} onChange={set("company")} autoComplete="organization" />
            <Field id="phone" label="Phone number" hint="Not required" type="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" inputMode="tel" />
            <label className="sm:col-span-2">
              <span className="mb-1.5 flex justify-between text-[14px] font-medium text-ink">
                What would you like to discuss?
                <span className="font-normal text-muted">Not required</span>
              </span>
              <textarea id="booking-notes" value={form.notes} onChange={set("notes")} rows={3} maxLength={2000} placeholder="A short note about your idea helps us prepare." className="w-full resize-y rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 hover:border-ink/25 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10" />
            </label>
            <input type="text" name="website" value={form.website} onChange={set("website")} tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
            {formError && (
              <p role="alert" className="rounded-xl bg-[#fdecec] px-4 py-3 text-[14px] text-[#b42318] sm:col-span-2">
                {formError}
              </p>
            )}
            <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-[13px] leading-relaxed text-muted">
                Your details are used only to arrange this call. Read our{" "}
                <a href={PRIVACY} className="underline underline-offset-2 hover:text-ink">
                  privacy policy
                </a>
                .
              </p>
              <button type="submit" disabled={busy} className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-ink px-7 text-[15px] font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-[0_12px_30px_-10px_rgba(0,100,255,0.7)] active:scale-[0.98] disabled:cursor-wait disabled:opacity-70">
                {busy ? (
                  <>
                    <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true" />
                    Booking…
                  </>
                ) : (
                  <>
                    Book this slot
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
      )}

      {step === "done" && booked && (
        <section key="done" className="step-in" aria-labelledby="booking-step">
          <span className="booked-check grid size-14 place-items-center rounded-full bg-[#e6f7f0] text-[#00875a]">
            <Check className="size-7" strokeWidth={2.5} />
          </span>
          <h2 id="booking-step" ref={headRef} tabIndex={-1} className="mt-5 text-[clamp(1.6rem,2.6vw,2.1rem)] font-normal leading-[1.15] tracking-[-0.03em] text-ink outline-none">
            Your call is booked, {booked.name.split(" ")[0]}.
          </h2>
          <p className="mt-2 text-[16px] leading-relaxed text-ink-soft [overflow-wrap:anywhere]">
            A confirmation and calendar invite are on their way to <strong className="font-medium text-ink">{booked.email}</strong>.
          </p>
          <dl className="mt-6 divide-y divide-ink/[0.08] rounded-2xl border border-ink/[0.08]">
            <Row label="When">
              {new Intl.DateTimeFormat("en-GB", { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(booked.start))}, {timeText(booked.start, tz, h12)} ({cityOf(tz)} time)
            </Row>
            <Row label="Length">{DURATION} minutes</Row>
            <Row label="Where">Video call. The link will be emailed to you ahead of the call.</Row>
          </dl>
          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <a href={booked.googleUrl} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 text-[14px] font-medium text-white transition-colors duration-300 hover:bg-brand">
              <CalendarPlus className="size-4" />
              Add it to Google Calendar
            </a>
            <a href={booked.icsUrl} download="techclues-call.ics" className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 px-6 text-[14px] font-medium text-ink transition-colors duration-300 hover:border-ink">
              <Download className="size-4" />
              Apple or Outlook calendar
            </a>
          </div>
          <p className="mt-6 text-[14px] text-muted">
            Need to make a change?{" "}
            <a href={booked.manageUrl} className="font-medium text-ink underline underline-offset-4 hover:text-brand">
              Reschedule or cancel
            </a>
            . You will find the link in your email as well.
          </p>
        </section>
      )}
    </div>
  );
}

const Skeleton = () => (
  <div aria-hidden="true" className="rounded-[28px] border border-ink/[0.08] bg-white p-5 sm:p-8"><div className="mb-7 h-6 w-64 animate-pulse rounded-full bg-ink/[0.05]"></div><div className="h-7 w-44 animate-pulse rounded bg-ink/[0.06]"></div><div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_220px]"><div className="grid grid-cols-7 gap-1"><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span><span className="mx-auto aspect-square w-full max-w-[46px] animate-pulse rounded-full bg-ink/[0.04]"></span></div><div className="space-y-2"><span className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]"></span><span className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]"></span><span className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]"></span><span className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]"></span><span className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]"></span><span className="block h-12 animate-pulse rounded-xl bg-ink/[0.04]"></span></div></div></div>
);

/* The original renders this widget on the client only; the page ships the skeleton until it mounts. */
export default function BookingWidget() {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  return ready ? <Widget /> : <Skeleton />;
}
void EMAIL;
