"use client";

import { useEffect, useState } from "react";

/**
 * Page-wide game feel: an XP bar that fills as you scroll, 3D tilt on cards, count-up stats,
 * "level unlocked" steps in the process, and a coin burst on call-to-action clicks.
 * Everything is progressive: without JS (or with reduced motion) the page simply reads normally.
 */
export default function GameFx() {
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: (() => void)[] = [];

    // XP bar + level from scroll depth
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      setXp(p);
      setLevel(1 + Math.floor(p * 10));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => removeEventListener("scroll", onScroll));

    // 3D tilt with a moving highlight
    if (!reduce && matchMedia("(pointer: fine)").matches) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width;
          const y = (e.clientY - r.top) / r.height;
          el.style.setProperty("--rx", `${((0.5 - y) * 10).toFixed(2)}deg`);
          el.style.setProperty("--ry", `${((x - 0.5) * 12).toFixed(2)}deg`);
          el.style.setProperty("--gx", `${(x * 100).toFixed(0)}%`);
          el.style.setProperty("--gy", `${(y * 100).toFixed(0)}%`);
        };
        const leave = () => {
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        });
      });
    }

    // count-up numbers + level-unlock steps, when scrolled into view
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          if (el.dataset.count) {
            const to = parseInt(el.dataset.count, 10);
            const suffix = el.dataset.suffix ?? "";
            if (reduce) { el.textContent = to + suffix; continue; }
            const t0 = performance.now();
            const tick = (t: number) => {
              const k = Math.min(1, (t - t0) / 1400);
              el.textContent = Math.round(to * (1 - Math.pow(1 - k, 3))) + suffix;
              if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
          if (el.dataset.level) {
            el.classList.add("is-unlocked");
            setToast(`LEVEL ${el.dataset.level} UNLOCKED`);
            setTimeout(() => setToast(""), 1800);
          }
        }
      },
      { threshold: 0.6 },
    );
    document.querySelectorAll("[data-count], [data-level]").forEach((n) => io.observe(n));
    cleanups.push(() => io.disconnect());

    // coin burst on CTA clicks
    const burst = (e: MouseEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cta], .gh-coin");
      if (!t || reduce) return;
      for (let i = 0; i < 14; i++) {
        const c = document.createElement("span");
        c.className = "gh-spark";
        const a = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
        const d = 50 + Math.random() * 60;
        c.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d - 30}px`;
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 800);
      }
    };
    document.addEventListener("click", burst);
    cleanups.push(() => document.removeEventListener("click", burst));

    return () => cleanups.forEach((f) => f());
  }, []);

  return (
    <>
      <div aria-hidden="true" className="gx-xp">
        <span className="gx-xp-fill" style={{ transform: `scaleX(${xp})` }} />
        <b>LV {String(level).padStart(2, "0")}</b>
      </div>
      <div aria-hidden="true" className={`gx-toast ${toast ? "is-on" : ""}`}>{toast || " "}</div>
    </>
  );
}
