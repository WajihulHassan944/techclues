"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Phase = { from: number; name: string; text: string };
type Lane = { key: "low" | "custom"; label: string; note: string; live: number; phases: Phase[]; learning?: string; versions?: { at: number; label: string }[] };

const REGIONS = [
  { label: "Days", from: 0, to: 20 },
  { label: "Weeks", from: 20, to: 55 },
  { label: "Months", from: 55, to: 100 },
];

const LANES: Lane[] = [
  {
    key: "low",
    label: "Low-code",
    note: "Proven platforms",
    live: 24,
    phases: [
      { from: 0, name: "Scope", text: "Agree what it must do and who will use it." },
      { from: 5, name: "Choose the platform", text: "Pick the tool that fits, not the trendiest one." },
      { from: 9, name: "Build and connect", text: "Screens, data and automations, built from proven blocks." },
      { from: 24, name: "Live", text: "Real users are in, and their feedback shapes each new version." },
    ],
    learning: "Improving with real users",
    versions: [
      { at: 46, label: "v2" },
      { at: 68, label: "v3" },
      { at: 90, label: "v4" },
    ],
  },
  {
    key: "custom",
    label: "Custom code",
    note: "Written from scratch",
    live: 85,
    phases: [
      { from: 0, name: "Scope", text: "Agree what it must do and who will use it." },
      { from: 8, name: "Design", text: "Every screen designed and tested before any code." },
      { from: 24, name: "Build", text: "Every feature written to your exact needs." },
      { from: 64, name: "Test", text: "Checked across devices before launch." },
      { from: 85, name: "Live", text: "Live, and built to grow without limits." },
    ],
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;
const PLAY_SECONDS = 9;
const clamp = (v: number, lo = 0, hi = 100) => Math.min(hi, Math.max(lo, v));

/** Horizontal shift that keeps a chip inside the track near both ends. */
const shift = (e: number) => `${e < 12 ? -((e / 12) * 50) : e > 88 ? -50 - ((e - 88) / 12) * 50 : -50}%`;
const progress = (e: number) => ({
  phases: LANES.map((l) => l.phases.reduce((acc, p, i) => (e >= p.from ? i : acc), 0)),
  versions: (LANES[0].versions ?? []).filter((v) => e >= v.at).length,
  region: REGIONS.findIndex((r) => e <= r.to),
});
const ramp = (e: number, a: number, b: number) => clamp((e - a) / (b - a), 0, 1);

/** cubic-bezier(.16, 1, .3, 1) */
function bezier(t: number) {
  const [x1, y1, x2, y2] = EASE;
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let u = t;
  for (let i = 0; i < 8; i++) {
    const x = ((ax * u + bx) * u + cx) * u - t;
    const dx = (3 * ax * u + 2 * bx) * u + cx;
    if (Math.abs(x) < 1e-5 || !dx) break;
    u -= x / dx;
  }
  return ((ay * u + by) * u + cy) * u;
}

const CHIP =
  "absolute top-[24px] z-10 whitespace-nowrap rounded-full px-2.5 py-1 text-[11.5px] font-medium shadow-[0_6px_16px_-8px_rgba(14,15,49,0.35)] ring-1 sm:top-[8px] sm:text-[12.5px]";
const SUB = "absolute top-[72px] z-10 whitespace-nowrap sm:top-[58px]";

const Check = ({ cls }: { cls: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function LaneRow({ lane, t, phase, versions }: { lane: Lane; t: number; phase: number; versions: number }) {
  const low = lane.key === "low";
  const isLive = phase === lane.phases.length - 1;
  const head = Math.min(t, lane.live);
  const tail = Math.max(t, lane.live);
  const chipOpacity = 1 - ramp(t, lane.live - 0.6, lane.live);
  const learnOpacity = ramp(t, lane.live, lane.live + 2.5);
  const chipName = lane.phases[Math.min(phase, lane.phases.length - 2)].name;
  return (
    <div className="relative h-[102px] sm:h-[86px]">
      <p className="relative z-10 inline-flex items-center gap-2 bg-white pr-2 text-[13px] font-medium text-ink sm:hidden">
        <span className={`size-2 rounded-full ${low ? "bg-brand" : "bg-ink"}`} />
        {lane.label}
      </p>
      <span className={`${CHIP} bg-white text-ink ring-ink/10`} style={{ left: `${head}%`, opacity: chipOpacity, transform: `translateX(${shift(head)})` }}>
        <span key={chipName} className="lc-swap block">{chipName}</span>
      </span>
      {lane.learning && (
        <span className={`${CHIP} bg-ice text-brand-ink ring-brand/20`} style={{ left: `${tail}%`, opacity: learnOpacity, transform: `translateX(${shift(tail)})` }}>
          {lane.learning}
        </span>
      )}
      <div className="absolute inset-x-0 top-[54px] h-3 rounded-full bg-ink/[0.05] shadow-[inset_0_1px_2px_rgba(14,15,49,0.08)] sm:top-[40px]">
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${low ? "bg-[linear-gradient(90deg,#4d8dff,#0064ff)] shadow-[0_0_14px_rgba(0,100,255,0.4)]" : "bg-[linear-gradient(90deg,#3a3b58,#0e0f31)]"}`}
          style={{ width: `${head}%` }}
        />
        {lane.learning && <div className="lane-learn absolute inset-y-0 rounded-r-full" style={{ left: `${lane.live}%`, width: `${Math.max(0, t - lane.live)}%` }} />}
        {lane.versions?.map((v, i) => (
          <span key={v.label} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ left: `${v.at}%` }}>
            <span
              className={`block size-3 rounded-full ring-2 ring-white ${versions > i ? "bg-brand" : "bg-ink/25"}`}
              style={{ opacity: versions > i ? 1 : 0.4, transform: `scale(${versions > i ? 1 : 0.6})`, transition: "transform .25s cubic-bezier(.34,1.8,.64,1), opacity .25s" }}
            />
          </span>
        ))}
        <span className={`absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-[3px] ${low ? "ring-brand" : "ring-ink"}`} style={{ left: `${head}%`, opacity: chipOpacity }} />
        {lane.learning && <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-sm ring-[3px] ring-brand/60" style={{ left: `${tail}%`, opacity: learnOpacity }} />}
      </div>
      {isLive && (
        <span key="live" className={`${SUB} lc-pop`} style={{ left: `${lane.live}%`, transform: "translateX(-50%)" }}>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#1faa59]/10 px-2 py-0.5 text-[11.5px] font-medium text-[#1a8f4b] ring-1 ring-[#1faa59]/25">
            <Check cls="size-3" />
            v1 live
          </span>
        </span>
      )}
      {lane.versions?.map((v, i) => (
        <span
          key={v.label}
          className={`${SUB} text-[11.5px] font-medium text-brand-ink`}
          style={{ left: `${v.at}%`, opacity: versions > i ? 1 : 0, transform: `translateX(-50%) translateY(${versions > i ? 0 : -3}px)`, transition: "opacity .3s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1)" }}
        >
          {v.label}
        </span>
      ))}
    </div>
  );
}

/** "Days, not months": the same product built with low-code and with custom code, on a draggable timeline. */
export default function LowCodeRace() {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const tRef = useRef(0);
  const raf = useRef(0);
  const dragging = useRef(false);
  const started = useRef(false);
  const card = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  const set = useCallback((v: number) => {
    tRef.current = v;
    setT(v);
  }, []);
  const stop = useCallback(() => {
    cancelAnimationFrame(raf.current);
    setPlaying(false);
  }, []);
  const animate = useCallback(
    (to: number, seconds: number, ease: (x: number) => number, onDone?: () => void) => {
      cancelAnimationFrame(raf.current);
      const from = tRef.current;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = seconds <= 0 ? 1 : Math.min(1, (now - t0) / (seconds * 1000));
        set(from + (to - from) * ease(p));
        if (p < 1) raf.current = requestAnimationFrame(tick);
        else onDone?.();
      };
      raf.current = requestAnimationFrame(tick);
    },
    [set],
  );
  const play = useCallback(() => {
    cancelAnimationFrame(raf.current);
    if (tRef.current >= 100) set(0);
    if (reduce.current) {
      set(100);
      return;
    }
    setPlaying(true);
    animate(100, PLAY_SECONDS * (1 - tRef.current / 100), (x) => x, () => setPlaying(false));
  }, [animate, set]);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = card.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          raf.current = requestAnimationFrame(play);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
  }, [play]);

  const at = (clientX: number) => {
    const r = track.current!.getBoundingClientRect();
    return ((clientX - r.left) / r.width) * 100;
  };
  const p = progress(t);
  const names = LANES.map((l, i) => l.phases[p.phases[i]].name);
  const done = t >= 100;

  return (
    <section aria-label="Low-code against custom code" className="py-[clamp(56px,7vw,110px)]">
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div data-reveal="" style={{ "--reveal-delay": "0s", "--reveal-y": "28px" } as React.CSSProperties}>
            <p className="flex items-center gap-2 text-[14px] font-medium text-muted">
              <span className="size-1.5 rounded-full bg-brand" />
              Speed to launch
            </p>
            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Days, not months.</h2>
          </div>
        </div>
        <div data-reveal="" style={{ "--reveal-delay": "0s", "--reveal-y": "28px" } as React.CSSProperties}>
          <p className="mt-5 max-w-[580px] text-[17px] leading-relaxed text-ink-soft">
            The same product, built two ways. Press play or drag the timeline to see what each side is doing, and why low-code gets you in front of real users first.
          </p>
        </div>
        <div ref={card} className="mt-10 rounded-[28px] bg-white p-5 shadow-[0_40px_80px_-50px_rgba(14,15,49,0.35)] ring-1 ring-ink/10 sm:p-8 lg:mt-12 lg:p-10">
          <div className="flex items-center justify-between gap-4">
            <p className="text-[14px] text-ink-soft">Drag the timeline, or press play.</p>
            <button onClick={playing ? stop : play} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2 text-[13.5px] font-medium text-white transition-colors duration-300 hover:bg-brand">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                {playing ? (
                  <>
                    <rect x="14" y="3" width="5" height="18" rx="1" />
                    <rect x="5" y="3" width="5" height="18" rx="1" />
                  </>
                ) : done ? (
                  <>
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </>
                ) : (
                  <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                )}
              </svg>
              {playing ? "Pause" : done ? "Replay" : "Play"}
            </button>
          </div>
          <div className="mt-8 grid sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-6 lg:grid-cols-[200px_minmax(0,1fr)]">
            <div aria-hidden="true" className="hidden sm:block">
              <div className="h-10" />
              {LANES.map((l) => (
                <div key={l.key} className="flex h-[86px] flex-col justify-center">
                  <p className="flex items-center gap-2 text-[15px] font-medium text-ink">
                    <span className={`size-2.5 rounded-full ${l.key === "low" ? "bg-brand" : "bg-ink"}`} />
                    {l.label}
                  </p>
                  <p className="mt-0.5 pl-[18px] text-[13px] text-muted">{l.note}</p>
                </div>
              ))}
            </div>
            <div
              ref={track}
              className="relative cursor-ew-resize select-none"
              style={{ touchAction: "pan-y" }}
              onPointerDown={(e) => {
                dragging.current = true;
                e.currentTarget.setPointerCapture(e.pointerId);
                const target = clamp(at(e.clientX));
                stop();
                animate(target, reduce.current ? 0 : 0.35, bezier);
              }}
              onPointerMove={(e) => {
                if (!dragging.current) return;
                cancelAnimationFrame(raf.current);
                set(clamp(at(e.clientX)));
              }}
              onPointerUp={() => (dragging.current = false)}
              onPointerCancel={() => (dragging.current = false)}
            >
              <div className="relative h-10">
                {REGIONS.map((r, i) => (
                  <span key={r.label} className={`absolute top-0 -translate-x-1/2 text-[11.5px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${p.region === i ? "text-ink" : "text-muted/70"}`} style={{ left: `${(r.from + r.to) / 2}%` }}>
                    {r.label}
                  </span>
                ))}
              </div>
              {REGIONS.slice(1).map((r) => (
                <span key={r.label} aria-hidden="true" className="absolute bottom-0 top-10 border-l border-dashed border-ink/10" style={{ left: `${r.from}%` }} />
              ))}
              <span aria-hidden="true" className="pointer-events-none absolute bottom-0 top-10 w-px -translate-x-1/2 bg-ink/25" style={{ left: `${t}%` }} />
              {LANES.map((l, i) => (
                <LaneRow key={l.key} lane={l} t={t} phase={p.phases[i]} versions={p.versions} />
              ))}
              <button
                role="slider"
                aria-label="Timeline"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(t)}
                aria-valuetext={`${REGIONS[p.region]?.label}: low-code ${names[0]}, custom code ${names[1]}`}
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  const step: Record<string, number> = { ArrowRight: 5, ArrowUp: 5, ArrowLeft: -5, ArrowDown: -5 };
                  const next = e.key === "Home" ? 0 : e.key === "End" ? 100 : step[e.key] ? tRef.current + step[e.key] : null;
                  if (next === null) return;
                  e.preventDefault();
                  stop();
                  set(clamp(next));
                }}
                className="absolute top-[20px] z-20 size-4 -translate-x-1/2 cursor-grab rounded-full bg-ink shadow-[0_4px_12px_-4px_rgba(14,15,49,0.6)] ring-4 ring-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                style={{ left: `${t}%` }}
              />
            </div>
          </div>
          <div className="mt-4 grid gap-5 border-t border-ink/5 pt-6 sm:mt-6 sm:grid-cols-2 sm:gap-10">
            {LANES.map((l, li) => (
              <div key={l.key}>
                <p className="flex items-center gap-2 text-[13px] font-medium text-muted">
                  <span className={`size-2 rounded-full ${l.key === "low" ? "bg-brand" : "bg-ink"}`} />
                  {l.label}
                </p>
                <div className="mt-2 grid">
                  {l.phases.map((ph, pi) => {
                    const active = pi === p.phases[li];
                    const last = pi === l.phases.length - 1;
                    return (
                      <div
                        key={ph.name}
                        aria-hidden={!active}
                        className="[grid-area:1/1]"
                        style={{ opacity: active ? 1 : 0, transform: active ? "none" : "translateY(6px)", transition: "opacity .3s cubic-bezier(.16,1,.3,1), transform .3s cubic-bezier(.16,1,.3,1)" }}
                      >
                        <p className="flex items-center gap-2 text-[18px] tracking-[-0.02em] text-ink">
                          {ph.name}
                          {last && (
                            <span className="grid size-5 place-items-center rounded-full bg-[#1faa59]/15 text-[#1a8f4b]">
                              <Check cls="size-3" />
                            </span>
                          )}
                        </p>
                        <p className="mt-1 text-[14.5px] leading-relaxed text-ink-soft">{ph.text}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-5 max-w-[760px] text-[13px] leading-relaxed text-muted">
          Illustrative timelines. Your scope sets the real one, and we confirm it before we start. Many products begin in low-code and move to custom code once they know what to build.
        </p>
      </div>
    </section>
  );
}
