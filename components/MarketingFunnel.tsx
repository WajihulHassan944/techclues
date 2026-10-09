"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

type Stage = {
  key: string;
  name: string;
  who: string;
  doing: string[];
  metric: { name: string; text: string };
  example: { value: [number, number]; unit: string };
  people: [number, number];
  verb: string;
  tools: string[];
};

const STAGES: Stage[] = [
  {
    key: "reach",
    name: "Reach",
    who: "Someone who has never heard of you sees your ad while they scroll.",
    doing: ["Research who your customers are and where they spend time", "Write the copy and design the ads", "Target by interest, job title and location"],
    metric: { name: "Reach and cost per 1,000 views (CPM)", text: "How many of the right people see your ad, and what it costs to show it to them." },
    example: { value: [1e4, 1e4], unit: "people" },
    people: [1e4, 1e4],
    verb: "see your ad",
    tools: ["Meta Ads", "TikTok Ads", "LinkedIn Ads"],
  },
  {
    key: "click",
    name: "Click",
    who: "They click through to a page built around one clear action.",
    doing: ["Google Ads for people already searching for what you offer", "Landing pages with one message and one button", "Heatmaps that show where visitors get stuck"],
    metric: { name: "Click-through rate (CTR)", text: "The share of people who see your ad and click it." },
    example: { value: [1.5, 2], unit: "%" },
    people: [150, 200],
    verb: "click through",
    tools: ["Google Ads", "Hotjar"],
  },
  {
    key: "convert",
    name: "Convert",
    who: "They join the waitlist, book a call or buy.",
    doing: ["Track every sign-up, booking and sale", "A/B test headlines, offers and forms", "Remind visitors who left without acting"],
    metric: { name: "Conversion rate", text: "The share of visitors who act. Set against your spend, it gives your cost per customer (CPA)." },
    example: { value: [6, 9], unit: "%" },
    people: [9, 18],
    verb: "sign up or buy",
    tools: ["Google Analytics", "Google Tag Manager", "Mixpanel"],
  },
  {
    key: "return",
    name: "Return",
    who: "Follow-up emails and offers bring them back to buy again.",
    doing: ["Welcome and follow-up emails", "Offers that bring past customers back", "Regular reports on what each customer is worth"],
    metric: { name: "Repeat rate", text: "The share of customers who come back. It drives what each customer is worth over time (LTV)." },
    example: { value: [33, 50], unit: "%" },
    people: [3, 9],
    verb: "come back for more",
    tools: ["HubSpot", "Mailchimp"],
  },
];

const SPRITE: Record<string, string> = {
  "Meta Ads": "meta",
  "TikTok Ads": "tiktok",
  "Google Ads": "google-ads",
  Hotjar: "hotjar",
  "Google Analytics": "google-analytics",
  "Google Tag Manager": "tag-manager",
  Mixpanel: "mixpanel",
  HubSpot: "hubspot",
  Mailchimp: "mailchimp",
};

function ToolMark({ name }: { name: string }) {
  if (name === "LinkedIn Ads")
    return (
      <span className="font-semibold leading-none tracking-tight text-[10px] sm:text-[13px]" style={{ color: "#0A66C2" }} role="img" aria-label={name}>
        in
      </span>
    );
  return (
    <svg viewBox="0 0 24 24" className="size-5" role="img" aria-label={name}>
      <use href={`/logos.svg?v=1liiiom#${SPRITE[name]}`} />
    </svg>
  );
}

const EASE = "cubic-bezier(.16,1,.3,1)";
const f = (e: number) => Math.round(100 * e) / 100;
const g = (e: number) => 180 + -((Math.min(Math.max(e, 72), 368) - 72) / 296 * 124);
const Y = STAGES.map((_, t) => 72 + (296 * t) / STAGES.length).concat(368);

const arc = (e: number, front: boolean) => {
  const a = f(g(e));
  return `M${f(215 - a)} ${f(e)}A${a} ${f(0.17 * a)} 0 0 ${+!front} ${f(215 + a)} ${f(e)}`;
};

const SLICES = STAGES.map((_, t) => {
  const r = (Y[t] + Y[t + 1]) / 2;
  const l = g(r);
  const i = f(g(Y[t]));
  const n = f(g(Y[t + 1]));
  return {
    d: `M${f(215 - i)} ${f(Y[t])}A${i} ${f(0.17 * i)} 0 0 0 ${f(215 + i)} ${f(Y[t])}L${f(215 + n)} ${f(Y[t + 1])}A${n} ${f(0.17 * n)} 0 0 1 ${f(215 - n)} ${f(Y[t + 1])}Z`,
    textY: f(r + 0.17 * l),
    dot: { x: f(215 + 0.9 * l), y: f(r + 0.17 * l * Math.sqrt(1 - 0.81)) },
  };
});

const FUNNEL_BODY = `M35 72A180 ${f(30.6)} 0 0 1 395 72L271 368A56 ${f(56 * 0.17)} 0 0 1 159 368Z`;
const pt = (e: number, t: number, a: number) => `${f(215 - e * a)} ${f(t + 0.17 * e * Math.sqrt(1 - a * a))}`;
const SHINE = `M${pt(180, 72, 0.86)}L${pt(180, 72, 0.7)}L${pt(56, 368, 0.7)}L${pt(56, 368, 0.86)}Z`;

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const m = matchMedia(REDUCED);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
};

const NUM = "inline-block text-center tabular-nums";
const widthCh = (e: number[]) => `${String(Math.max(...e)).length}ch`;
const CHIP = "ml-2 inline-block rounded-full bg-ice px-2.5 py-0.5 text-[13px] font-medium text-brand-ink";
const fmt = (e: number, unit?: string, digits = 0) => (unit === "%" ? `${e.toFixed(digits)}%` : Math.round(e).toLocaleString("en-GB"));

/** Solves cubic-bezier(.16,1,.3,1) for progress p. */
function bezier(p: number) {
  const [x1, y1, x2, y2] = [0.16, 1, 0.3, 1];
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  let t = p;
  for (let i = 0; i < 8; i++) {
    const x = ((ax * t + bx) * t + cx) * t - p;
    const d = (3 * ax * t + 2 * bx) * t + cx;
    if (Math.abs(x) < 1e-5 || !d) break;
    t -= x / d;
  }
  return ((ay * t + by) * t + cy) * t;
}

/** Number that counts to its new value over 0.9s whenever the value changes. */
function Num({ value, unit, still, className, style }: { value: number; unit?: string; still: boolean; className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const prev = useRef(value);
  const [initial] = useState(() => fmt(value, unit, +!Number.isInteger(value)));
  useEffect(() => {
    const el = ref.current;
    const from = prev.current;
    prev.current = value;
    if (!el || from === value) return;
    const final = fmt(value, unit, +!Number.isInteger(value));
    if (still) {
      el.textContent = final;
      return;
    }
    const digits = Number.isInteger(from) && Number.isInteger(value) ? 0 : 1;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / 900);
      if (p >= 1) {
        el.textContent = final;
        return;
      }
      el.textContent = fmt(from + (value - from) * bezier(p), unit, digits);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, unit, still]);
  return (
    <span ref={ref} className={className} style={style}>
      {initial}
    </span>
  );
}

const LEAK = { 0: [0.42, 0.4, 0.45], 1: [0.62, 0.6, 0.66] } as Record<number, number[]>;

type P = { on: boolean; phase: number; f: number; z: number; x: number; y: number; dy: number; v: number; vx: number; leakY: number; t: number; seed: number };

/** Particles drifting down the funnel; some leak out of the sides, the rest land in the base. */
function Particles({ run, mode }: { run: boolean; mode: number }) {
  const dots = useRef<(SVGCircleElement | null)[]>([]);
  const rings = useRef<(SVGEllipseElement | null)[]>([]);
  const modeRef = useRef(mode);
  const sim = useRef<{ ps: P[]; rs: { on: boolean; x: number; t: number }[]; clock: number; wait: number; ring: number; warm: boolean } | null>(null);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    if (!run) return;
    sim.current ??= {
      ps: Array.from({ length: 44 }, () => ({ on: false, phase: 0, f: 0, z: 0, x: 0, y: 0, dy: 0, v: 0, vx: 0, leakY: 0, t: 0, seed: 0 })),
      rs: Array.from({ length: 4 }, () => ({ on: false, x: 0, t: 0 })),
      clock: 0,
      wait: 0,
      ring: 0,
      warm: false,
    };
    const s = sim.current;
    const step = (dt: number) => {
      s.clock += dt;
      if ((s.wait -= dt) <= 0) {
        const i = s.ps.findIndex((p) => !p.on);
        if (i !== -1) {
          const odds = LEAK[modeRef.current];
          let k = 1;
          while (k < 4 && Math.random() < odds[k - 1]) k++;
          const side = 0.5 > Math.random() ? -1 : 1;
          Object.assign(s.ps[i], {
            on: true,
            phase: 0,
            f: side * (0.08 + 0.8 * Math.random()),
            z: 2 * Math.random() - 1,
            y: 14,
            dy: 0,
            v: 50 + 18 * Math.random(),
            leakY: k < 4 ? Y[k] - 20 * Math.random() : Infinity,
            t: 0,
            seed: 6.3 * Math.random(),
          });
          dots.current[i]?.setAttribute("fill", "#0064ff");
        }
        s.wait = 0.24 + 0.14 * Math.random();
      }
      s.ps.forEach((p, i) => {
        if (!p.on) return;
        if (p.phase === 0) {
          p.y += p.v * dt;
          const w = g(p.y);
          p.x = 215 + p.f * w * 0.86 + 1.6 * Math.sin(1.4 * s.clock + p.seed);
          p.dy = p.z * (0.17 * w) * Math.sqrt(Math.max(0, 1 - (0.86 * p.f) ** 2));
          if (p.y >= p.leakY) {
            p.phase = 1;
            p.vx = Math.sign(p.f) * (24 + 26 * Math.random());
            p.t = 0;
            dots.current[i]?.setAttribute("fill", "rgba(14,15,49,0.3)");
          } else if (p.y >= 368) p.phase = 2;
        } else if (p.phase === 1) {
          p.t += dt;
          p.vx *= 1 + 1.8 * dt;
          p.x += p.vx * dt;
          p.y += (0.35 * p.v + 60 * p.t) * dt;
          if (p.t >= 1.2) p.on = false;
        } else {
          p.y += (p.v + 40) * dt;
          p.x += (215 + 34 * p.f - p.x) * Math.min(1, 3 * dt);
          p.dy *= 1 - Math.min(1, 4 * dt);
          if (p.y >= 406) {
            p.on = false;
            Object.assign(s.rs[s.ring++ % 4], { on: true, x: p.x, t: 0 });
          }
        }
      });
      s.rs.forEach((r) => {
        if (r.on && (r.t += dt) >= 0.9) r.on = false;
      });
    };
    const paint = () => {
      s.ps.forEach((p, i) => {
        const el = dots.current[i];
        if (!el) return;
        if (!p.on) return void el.setAttribute("opacity", "0");
        const o = p.phase === 1 ? 1 - p.t / 1.2 : p.phase === 0 ? Math.min(1, (p.y - 14) / 30) : 1;
        el.setAttribute("cx", p.x.toFixed(1));
        el.setAttribute("cy", (p.y + p.dy).toFixed(1));
        el.setAttribute("r", (3.2 + 0.7 * p.z).toFixed(2));
        el.setAttribute("opacity", Math.max(0, o).toFixed(2));
      });
      s.rs.forEach((r, i) => {
        const el = rings.current[i];
        if (!el) return;
        if (!r.on) return void el.setAttribute("opacity", "0");
        const q = r.t / 0.9;
        const rx = 4 + 34 * (1 - (1 - q) ** 3);
        el.setAttribute("cx", r.x.toFixed(1));
        el.setAttribute("rx", rx.toFixed(1));
        el.setAttribute("ry", (0.24 * rx).toFixed(1));
        el.setAttribute("opacity", (0.7 * (1 - q)).toFixed(2));
      });
    };
    if (!s.warm) {
      for (let i = 0; i < 240; i++) step(1 / 30);
      s.warm = true;
    }
    paint();
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      step(Math.min(0.05, (now - last) / 1000));
      last = now;
      paint();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [run]);

  return (
    <g>
      {Array.from({ length: 4 }, (_, i) => (
        <ellipse key={i} ref={(el) => { rings.current[i] = el; }} cx={215} cy={406} rx="0" ry="0" fill="none" stroke="#0064ff" strokeWidth="1" opacity="0" />
      ))}
      {Array.from({ length: 44 }, (_, i) => (
        <circle key={i} ref={(el) => { dots.current[i] = el; }} cx={215} cy={72} r="3" fill="#0064ff" stroke="#fff" strokeWidth="0.8" opacity="0" />
      ))}
    </g>
  );
}

const Check = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-3" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
/** Fades/slides in once the funnel scrolls into view. */
const reveal = (on: boolean, delay: number, dur: number, from: CSSProperties): CSSProperties =>
  on ? { opacity: 1, transform: "none", transition: `opacity ${dur}s ${EASE} ${delay}s, transform ${dur}s ${EASE} ${delay}s` } : { opacity: 0, ...from };

export default function MarketingFunnel() {
  const [stage, setStage] = useState(0);
  const [mode, setMode] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const [touched, setTouched] = useState(false);
  const [paused, setPaused] = useState(false);
  const [seen, setSeen] = useState(false);
  const [near, setNear] = useState(false);
  const still = useSyncExternalStore(subscribeReduced, () => matchMedia(REDUCED).matches, () => false);
  const root = useRef<HTMLDivElement>(null);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const modeBtns = useRef<(HTMLButtonElement | null)[]>([]);
  const play = seen && near && !touched && !still;

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const once = new IntersectionObserver(([e]) => e.isIntersecting && (setSeen(true), once.disconnect()), { threshold: 0.25 });
    const live = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "120px 0px" });
    once.observe(el);
    live.observe(el);
    return () => {
      once.disconnect();
      live.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!play || paused) return;
    const id = setTimeout(() => setStage((e) => (e + 1) % STAGES.length), 5200);
    return () => clearTimeout(id);
  }, [play, paused, stage]);

  useEffect(() => {
    const b = modeBtns.current[mode];
    if (b) setPill({ left: b.offsetLeft, width: b.offsetWidth });
  }, [mode]);

  const pick = (i: number) => {
    setTouched(true);
    setStage(i);
  };
  const B = STAGES[2].people;
  const D = STAGES[3].people;
  const q = B[1] / B[0];
  const inView = seen;
  return (
    <div
      ref={root}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        setHover(null);
      }}
      className="mt-10 grid items-center gap-10 lg:mt-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14"
    >
      <div>
        <div role="radiogroup" aria-label="Example figures" className="relative inline-flex rounded-full bg-white p-1 ring-1 ring-ink/10">
          {pill && (
            <span
              aria-hidden="true"
              className="absolute inset-y-1 rounded-full bg-ink"
              style={{ left: pill.left, width: pill.width, transition: "left .45s cubic-bezier(.16,1,.3,1), width .45s cubic-bezier(.16,1,.3,1)" }}
            />
          )}
          {["Before testing", "After testing"].map((label, i) => (
            <button
              key={label}
              ref={(el) => { modeBtns.current[i] = el; }}
              role="radio"
              aria-checked={mode === i}
              onClick={() => setMode(i)}
              className="relative rounded-full px-4 py-2 text-[14px] font-medium"
            >
              {!pill && mode === i && <span className="absolute inset-0 rounded-full bg-ink" />}
              <span className={cn("relative transition-colors duration-300", mode === i ? "text-white" : "text-ink-soft hover:text-ink")}>{label}</span>
            </button>
          ))}
        </div>
        <div className="mt-4 grid text-[15px] text-ink-soft">
          <p aria-hidden="true" className="invisible [grid-area:1/1]">
            Out of 10,000 people:{" "}
            <span className="font-medium">
              <span className={NUM} style={{ minWidth: widthCh(B) }}>{Math.max(...B)}</span> customers
            </span>
            , <span className={NUM} style={{ minWidth: widthCh(D) }}>{Math.max(...D)}</span> coming back
            <span className={CHIP}>{q}× the customers</span>
          </p>
          <p aria-live="polite" className="[grid-area:1/1]">
            Out of 10,000 people:{" "}
            <span className="font-medium text-ink">
              <Num value={B[mode]} still={still} className={NUM} style={{ minWidth: widthCh(B) }} /> customers
            </span>
            , <Num value={D[mode]} still={still} className={NUM} style={{ minWidth: widthCh(D) }} /> coming back
            <span
              className={CHIP}
              style={{
                opacity: mode === 1 ? 1 : 0,
                transform: mode === 1 ? "none" : "translateX(-6px) scale(.9)",
                visibility: mode === 1 ? "visible" : "hidden",
                transition: mode === 1 ? `opacity .4s ${EASE} .5s, transform .4s ${EASE} .5s` : `opacity .2s, transform .2s, visibility 0s .2s`,
              }}
            >
              {q}× the customers
            </span>
          </p>
        </div>
        <div className="relative mt-6 aspect-[430/450] w-full sm:aspect-[660/450]" style={reveal(inView, 0, 1, { transform: "translateY(24px)" })}>
          <svg aria-hidden="true" viewBox="0 0 660 450" preserveAspectRatio="xMinYMid slice" className="absolute inset-0 size-full overflow-visible">
            <defs>
              <linearGradient id="mf-glass" x1="0" y1={72} x2="0" y2={368} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#0064ff" stopOpacity="0.05" />
                <stop offset="1" stopColor="#0064ff" stopOpacity="0.32" />
              </linearGradient>
              <linearGradient id="mf-active" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#3d86ff" />
                <stop offset="1" stopColor="#0050d6" />
              </linearGradient>
              <linearGradient id="mf-mouth" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#0064ff" stopOpacity="0.16" />
                <stop offset="1" stopColor="#e8f0ff" stopOpacity="0.55" />
              </linearGradient>
              <linearGradient id="mf-shine" x1="0" y1={72} x2="0" y2={368} gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
                <stop offset="1" stopColor="#fff" stopOpacity="0.1" />
              </linearGradient>
              <radialGradient id="mf-base">
                <stop offset="0" stopColor="#0064ff" stopOpacity="0.18" />
                <stop offset="1" stopColor="#0064ff" stopOpacity="0" />
              </radialGradient>
              <filter id="mf-soft" x="-20%" y="-5%" width="140%" height="110%">
                <feGaussianBlur stdDeviation="3" />
              </filter>
            </defs>
            <g stroke="rgba(14,15,49,0.08)" strokeDasharray="4 6" strokeWidth="1">
              <path d="M90 0V450M340 0V450" />
              {SLICES.map((e, t) => (
                <path key={t} d={`M0 ${e.dot.y}H${e.dot.x}`} />
              ))}
            </g>
            <ellipse cx={215} cy={406} rx="172" ry="36" fill="url(#mf-base)" />
            <ellipse cx={215} cy={406} rx="108" ry="21" fill="rgba(0,100,255,0.06)" stroke="rgba(0,100,255,0.14)" />
            <path d={FUNNEL_BODY} fill="rgba(0,100,255,0.035)" />
            <ellipse cx={215} cy={72} rx={180} ry={f(30.6)} fill="url(#mf-mouth)" />
            <path d={arc(72, false)} fill="none" stroke="rgba(0,100,255,0.5)" strokeWidth="1.4" />
            {Y.slice(1).map((e) => (
              <path key={e} d={arc(e, false)} fill="none" stroke="rgba(0,100,255,0.16)" strokeWidth="1" />
            ))}
            {seen && <Particles run={near && !still} mode={mode} />}
            {SLICES.map((e, t) => (
              <path
                key={t}
                d={e.d}
                fill="url(#mf-glass)"
                className="cursor-pointer"
                style={inView ? { opacity: 1, transition: `opacity .7s ${EASE} ${0.2 + 0.12 * t}s` } : { opacity: 0 }}
                onClick={() => pick(t)}
                onPointerEnter={() => setHover(t)}
                onPointerLeave={() => setHover(null)}
              />
            ))}
            {SLICES.map((e, s) => (
              <path
                key={s}
                d={e.d}
                fill="url(#mf-active)"
                pointerEvents="none"
                style={{
                  opacity: s === stage ? 0.92 : 0.22 * +(hover === s),
                  transform: s === stage ? "scale(1.035)" : "scale(1)",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  filter: s === stage ? "drop-shadow(0 14px 22px rgba(0,100,255,0.35))" : "none",
                  transition: "opacity .55s cubic-bezier(.16,1,.3,1), transform .7s cubic-bezier(.16,1,.3,1), filter .55s",
                }}
              />
            ))}
            <path d={SHINE} fill="url(#mf-shine)" filter="url(#mf-soft)" pointerEvents="none" />
            <path d="M35 72L159 368M395 72L271 368" stroke="rgba(0,100,255,0.22)" strokeWidth="1" />
            {Y.slice(1).map((e) => (
              <path key={e} d={arc(e, true)} fill="none" stroke="#fff" strokeOpacity="0.8" strokeWidth="1.2" pointerEvents="none" />
            ))}
            <path
              d={arc(72, true)}
              fill="none"
              stroke="#0064ff"
              strokeOpacity="0.7"
              strokeWidth="1.6"
              pathLength={1}
              style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1, transition: inView ? `stroke-dashoffset 1.2s ${EASE}` : "none" }}
            />
            {SLICES.map((e, s) => (
              <g key={s} pointerEvents="none" style={inView ? { opacity: 1, transition: `opacity .6s ease ${0.45 + 0.12 * s}s` } : { opacity: 0 }}>
                <text
                  x={215}
                  y={e.textY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  letterSpacing="-0.02em"
                  className={cn("transition-[fill] duration-500", s === stage ? "fill-white" : "fill-ink/60")}
                >
                  {STAGES[s].name}
                </text>
              </g>
            ))}
            <g className="hidden sm:inline">
              {SLICES.map((e, s) => {
                const on = s === stage;
                return (
                  <g key={s}>
                    <path
                      d={`M${e.dot.x} ${e.dot.y}H452`}
                      stroke="rgba(14,15,49,0.16)"
                      strokeWidth="1"
                      pathLength={1}
                      style={{ strokeDasharray: 1, strokeDashoffset: inView ? 0 : 1, transition: inView ? `stroke-dashoffset .8s ${EASE} ${0.7 + 0.12 * s}s` : "none" }}
                    />
                    <path d={`M${e.dot.x} ${e.dot.y}H452`} stroke="#0064ff" strokeWidth="1.4" className="funnel-flow" style={{ opacity: +on, transition: "opacity .5s" }} />
                    {on && <circle cx={e.dot.x} cy={e.dot.y} r="9" fill="none" stroke="#0064ff" className="ai-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />}
                    <circle
                      cx={e.dot.x}
                      cy={e.dot.y}
                      r="5"
                      strokeWidth="1.5"
                      style={{ fill: on ? "#0064ff" : "#fff", stroke: on ? "#fff" : "rgba(14,15,49,0.3)", transition: "fill .4s, stroke .4s" }}
                    />
                  </g>
                );
              })}
            </g>
          </svg>
          <div role="tablist" aria-label="Funnel stages" className="hidden sm:block">
            {SLICES.map((e, s) => {
              const st = STAGES[s];
              const on = s === stage;
              return (
                <button
                  key={st.key}
                  role="tab"
                  aria-selected={on}
                  aria-controls={`funnel-${st.key}`}
                  onClick={() => pick(s)}
                  onPointerEnter={() => setHover(s)}
                  onPointerLeave={() => setHover(null)}
                  className="group absolute -translate-y-1/2 text-left"
                  style={{
                    left: `${0.706060606060606 * 100}%`,
                    top: `${(e.dot.y / 450) * 100}%`,
                    maxWidth: "29.393939393939394%",
                    ...(inView
                      ? { opacity: 1, translate: "0 0", transition: `opacity .6s ${EASE} ${0.9 + 0.12 * s}s, translate .6s ${EASE} ${0.9 + 0.12 * s}s` }
                      : { opacity: 0, translate: "-8px 0" }),
                  }}
                >
                  <span className={cn("block text-[clamp(1.15rem,1.7vw,1.55rem)] leading-none tracking-[-0.03em] transition-colors duration-500", on ? "text-brand" : "text-ink group-hover:text-brand")}>
                    <Num value={st.people[mode]} still={still} />
                  </span>
                  <span className={cn("mt-1 block text-[13px] transition-colors duration-500", on ? "text-ink" : "text-muted")}>{st.verb}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div role="tablist" aria-label="Funnel stages" className="mt-6 flex flex-wrap gap-2 sm:hidden">
          {STAGES.map((st, s) => (
            <button
              key={st.key}
              role="tab"
              aria-selected={s === stage}
              aria-controls={`funnel-${st.key}`}
              onClick={() => pick(s)}
              className={cn("rounded-full px-4 py-2 text-[14px] font-medium transition-colors duration-300", s === stage ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10")}
            >
              {st.name}
            </button>
          ))}
        </div>
        <p className="mt-6 max-w-[520px] text-[13px] leading-relaxed text-muted">
          Example figures to show how the stages connect, not a forecast. Your real numbers come from your own tracking.
        </p>
      </div>
      <div className="relative overflow-hidden rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-50px_rgba(14,15,49,0.35)] ring-1 ring-ink/10 sm:p-8">
        {play && (
          <span
            key={`${stage}-${paused}`}
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[3px] origin-left bg-brand/80"
            style={paused ? { transform: "scaleX(0)" } : { animation: "funnel-progress 5200ms linear forwards" }}
          />
        )}
        <div className="grid">
          {STAGES.map((s, i) => {
            const on = i === stage;
            const style: CSSProperties = on
              ? { opacity: 1, transform: "none", visibility: "visible", transition: `opacity .45s ${EASE} .12s, transform .45s ${EASE} .12s` }
              : { opacity: 0, transform: "translateY(10px)", visibility: "hidden", transition: `opacity .45s ${EASE}, transform .45s ${EASE}, visibility 0s .45s` };
            return (
              <div
                key={s.key}
                id={`funnel-${s.key}`}
                role="tabpanel"
                aria-label={s.name}
                aria-hidden={!on}
                inert={!on}
                className="[grid-area:1/1]"
                style={style}
              >
                <p className="text-[13px] font-medium text-muted">Stage {i + 1} of {STAGES.length}</p>
                <h3 className="mt-2 text-[clamp(1.7rem,2.4vw,2.2rem)] font-normal leading-tight tracking-[-0.03em] text-ink">{s.name}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-ink-soft">{s.who}</p>
                <p className="mt-6 text-[13px] font-medium text-muted">What we do</p>
                <ul className="mt-3 space-y-2.5">
                  {s.doing.map((d) => (
                    <li key={d} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                      <span className="mt-px grid size-5 shrink-0 place-items-center rounded-full bg-ice text-brand">
                        <Check />
                      </span>
                      {d}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-2xl bg-paper p-4 ring-1 ring-ink/5 sm:p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[13px] font-medium text-muted">What we track</p>
                      <p className="mt-1 text-[16px] font-medium leading-snug text-ink">{s.metric.name}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[clamp(1.5rem,2vw,1.85rem)] leading-none tracking-[-0.03em] text-brand">
                        <Num value={s.example.value[mode]} unit={s.example.unit} still={still} />
                      </p>
                      <p className="mt-1.5 text-[12px] text-muted">{s.example.unit === "people" ? "people, example" : "example"}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">{s.metric.text}</p>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex gap-2">
                    {s.tools.map((t) => (
                      <span key={t} className="grid size-10 place-items-center rounded-xl bg-paper ring-1 ring-ink/5" title={t}>
                        <ToolMark name={t} />
                      </span>
                    ))}
                  </div>
                  <p className="text-[13px] leading-snug text-muted">{s.tools.join(", ")}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
