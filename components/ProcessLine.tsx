"use client";

import { useEffect } from "react";

const ACTIVE_DOT = ["border-brand"];
const IDLE_DOT = ["border-ink/20"];

/**
 * Fills the "eight phases" progress line as the list scrolls past 60% of the viewport height
 * and lights up each step once the line reaches its dot.
 */
export default function ProcessLine() {
  useEffect(() => {
    const ol = Array.from(document.querySelectorAll("ol")).find((o) => o.textContent?.includes("Ignition")) as HTMLElement | undefined;
    const line = ol?.querySelector<HTMLElement>(":scope > span.bg-brand");
    if (!ol || !line) return;
    const steps = Array.from(ol.querySelectorAll<HTMLElement>(":scope > li"));
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = ol.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      line.style.transform = p >= 1 ? "none" : `scaleY(${p})`;
      const reach = line.offsetTop + p * line.offsetHeight;
      for (const li of steps) {
        const dot = li.firstElementChild as HTMLElement;
        const inner = dot.firstElementChild as HTMLElement;
        const text = li.children[1] as HTMLElement;
        const center = li.offsetTop + dot.offsetTop + dot.offsetHeight / 2;
        const on = center <= reach;
        dot.classList.remove(...(on ? IDLE_DOT : ACTIVE_DOT));
        dot.classList.add(...(on ? ACTIVE_DOT : IDLE_DOT));
        inner.classList.toggle("scale-100", on);
        inner.classList.toggle("bg-brand", on);
        inner.classList.toggle("scale-50", !on);
        inner.classList.toggle("bg-ink/20", !on);
        text.classList.toggle("opacity-100", on);
        text.classList.toggle("opacity-40", !on);
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return null;
}
