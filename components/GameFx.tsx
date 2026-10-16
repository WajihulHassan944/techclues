"use client";

import { useEffect, useState } from "react";

/**
 * Quiet polish for the game page: a thin read-progress line, subtle 3D tilt on cards,
 * scroll parallax on photographs, count-up numbers and a progress line through the process.
 * Disabled for reduced motion; the page reads normally without it.
 */
export default function GameFx() {
  const [p, setP] = useState(0);

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];
    const par = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const quests = Array.from(document.querySelectorAll<HTMLElement>("[data-quest]"));
    let tick = 0;
    const onScroll = () => {
      if (tick) return;
      tick = requestAnimationFrame(() => {
        tick = 0;
        const max = document.documentElement.scrollHeight - innerHeight;
        setP(max > 0 ? Math.min(1, scrollY / max) : 0);
        if (!reduce) {
          for (const el of par) {
            const r = el.getBoundingClientRect();
            if (r.bottom < -100 || r.top > innerHeight + 100) continue;
            const k = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
            el.style.setProperty("--py", `${(-k * Number(el.dataset.parallax || 40)).toFixed(1)}px`);
          }
        }
        for (const el of quests) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--qp", Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / (r.height * 0.8))).toFixed(3));
        }
      });
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    cleanups.push(() => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); cancelAnimationFrame(tick); });

    if (!reduce && matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
          el.style.setProperty("--rx", `${((0.5 - y) * 6).toFixed(2)}deg`);
          el.style.setProperty("--ry", `${((x - 0.5) * 8).toFixed(2)}deg`);
          el.style.setProperty("--gx", `${(x * 100).toFixed(0)}%`);
          el.style.setProperty("--gy", `${(y * 100).toFixed(0)}%`);
        };
        const leave = () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave); });
      });
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          if (el.dataset.count) {
            const to = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix ?? "";
            if (reduce) { el.textContent = to + suffix; continue; }
            const t0 = performance.now();
            const step = (t: number) => {
              const k = Math.min(1, (t - t0) / 1500);
              el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
              if (k < 1) requestAnimationFrame(step);
            };
            requestAnimationFrame(step);
          }
          if (el.dataset.level) el.classList.add("is-unlocked");
        }
      },
      { threshold: 0.5 },
    );
    document.querySelectorAll("[data-count], [data-level]").forEach((n) => io.observe(n));
    cleanups.push(() => io.disconnect());
    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <div aria-hidden="true" className="gd-progress">
      <span style={{ transform: `scaleX(${p})` }} />
    </div>
  );
}
