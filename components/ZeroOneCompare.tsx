"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

const FULL = 15000;
const PRICE = 499;
const PCT = Math.round((PRICE / FULL) * 100);
const gbp = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

/* cubic-bezier easing (same maths as CSS) */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = (t: number) => ((ax * t + bx) * t + cx) * t;
  const Y = (t: number) => ((ay * t + by) * t + cy) * t;
  return (x: number) => {
    let t = x;
    for (let i = 0; i < 8; i++) {
      const d = (3 * ax * t + 2 * bx) * t + cx;
      if (Math.abs(d) < 1e-6) break;
      t -= (X(t) - x) / d;
    }
    return Y(Math.min(1, Math.max(0, t)));
  };
}
const easeA = bezier(0.45, 0, 0.25, 1);
const easeB = bezier(0.16, 1, 0.3, 1);

function Row({ label, time, amount, note, highlight, children }: { label: string; time: string; amount: string; note: string; highlight?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className={highlight ? "text-[15px] font-medium text-ink" : "text-[15px] text-ink-soft"}>{label}</p>
        <p className="shrink-0 text-[13px] tabular-nums text-muted">{time}</p>
      </div>
      <p className={`mt-1 text-[clamp(2rem,3.4vw,2.9rem)] font-light leading-none tabular-nums tracking-[-0.05em] ${highlight ? "text-brand" : "text-ink"}`}>{amount}</p>
      <div className="mt-3">{children}</div>
      <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">{note}</p>
    </div>
  );
}

export default function ZeroOneCompare() {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(0);
  const [w, setW] = useState(0);
  const [k, setK] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setStarted(true);
          io.disconnect();
        }
      },
      { threshold: 0.45 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setV(FULL);
      setW(PRICE);
      setK(2);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const t = (now - t0) / 1000;
      const a = Math.min(1, Math.max(0, (t - 0.2) / 1.7));
      const b = Math.min(1, Math.max(0, (t - 2.05) / 0.6));
      setV(FULL * easeA(a));
      setW(PRICE * easeB(b));
      setK(t >= 2.65 ? 2 : t >= 1.9 ? 1 : 0);
      if (t < 2.7) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started]);

  const left = `max(10px, ${(PRICE / FULL) * 100}%)`;
  const done = w >= PRICE;
  return (
    <div ref={ref} className="flex h-full flex-col rounded-[24px] border border-ink/[0.08] bg-white p-6 sm:p-8">
      <p className="text-[14px] font-medium text-ink">Two ways to find out</p>
      <div className="flex flex-1 flex-col justify-center gap-8 pt-7">
        <Row label="Build the full product first" time="Months of building" amount={gbp(v)} note="You find out whether it works after the money is spent.">
          <div className="relative h-3 overflow-hidden rounded-full bg-ink/[0.06]">
            <span className="relative block h-full overflow-hidden rounded-full bg-ink/70" style={{ width: `${(v / FULL) * 100}%` }}>
              <span className={`bar-stripes absolute inset-0 transition-opacity duration-700 ${k >= 1 ? "opacity-0" : "opacity-100"}`}></span>
            </span>
          </div>
        </Row>
        <Row label="Test it with ZERO.ONE first" time={done ? "7 days" : `Day ${Math.max(1, Math.ceil((w / PRICE) * 7))}`} amount={gbp(w)} note="Real users, a clear answer, and £499 off your build if you go ahead." highlight>
          <div className="relative">
            <div className="h-3 overflow-hidden rounded-full bg-ink/[0.06]">
              <span className="block h-full rounded-full bg-brand" style={{ width: w === 0 ? "0%" : `max(10px, ${(w / FULL) * 100}%)` }}></span>
            </div>
            {k >= 2 && <span aria-hidden="true" className="zo-ping absolute top-1/2 size-3 -translate-y-1/2 rounded-full bg-brand" style={{ left: `calc(${left} - 12px)` }}></span>}
            <span
              className="absolute top-1/2 -translate-y-1/2 rounded-full bg-ice px-2 py-0.5 text-[12px] font-semibold tabular-nums text-brand-ink"
              style={{ left: `calc(${left} + 10px)`, opacity: k >= 2 ? 1 : 0, transform: k >= 2 ? "none" : "translateX(-6px) scale(0.6)", transition: "opacity .3s ease .1s, transform .45s cubic-bezier(0.34, 1.56, 0.64, 1) .1s" }}
            >
              {PCT}%
            </span>
          </div>
        </Row>
      </div>
      <p className="pt-8 text-[clamp(1.15rem,1.7vw,1.4rem)] leading-snug tracking-[-0.02em] text-ink" style={{ opacity: k >= 2 ? 1 : 0, transform: k >= 2 ? "none" : "translateY(10px)", transition: `opacity .6s ${EASE_OUT} .35s, transform .6s ${EASE_OUT} .35s` } as CSSProperties}>
        About {PCT}% of the cost, and you know in a week.
      </p>
    </div>
  );
}
