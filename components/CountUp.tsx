"use client";

import { useEffect } from "react";

const DURATION = 1600;

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
          const eased = 1 - Math.pow(1 - p, 3);
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
