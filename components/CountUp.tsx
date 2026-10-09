"use client";

import { useEffect } from "react";

const DURATION = 1800;

/** cubic-bezier(.16, 1, .3, 1), the easing the original uses. */
function ease(t: number) {
  const x1 = 0.16, y1 = 1, x2 = 0.3, y2 = 1;
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

/** Counts the "Vebryx in numbers" figures up from zero the first time they scroll into view. */
export default function CountUp() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>('section[aria-label="Vebryx in numbers"]');
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const nodes = Array.from(section.querySelectorAll<HTMLElement>("p > span")).map((el) => {
      const final = el.textContent ?? "";
      const target = parseFloat(final.replace(/,/g, ""));
      const decimals = (final.split(".")[1] ?? "").length;
      return { el, final, target, decimals, commas: final.includes(",") };
    });
    const fmt = (n: { decimals: number; commas: boolean }, v: number) =>
      n.commas ? Math.round(v).toLocaleString("en-GB") : v.toFixed(n.decimals);

    nodes.forEach((n) => (n.el.textContent = fmt(n, 0)));

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / DURATION);
          const eased = ease(p);
          nodes.forEach((n) => (n.el.textContent = p === 1 ? n.final : fmt(n, n.target * eased)));
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.35 },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      nodes.forEach((n) => (n.el.textContent = n.final));
    };
  }, []);

  return null;
}
