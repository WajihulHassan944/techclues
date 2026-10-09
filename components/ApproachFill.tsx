"use client";

import { useEffect } from "react";

/**
 * "Our approach" statement: each word fades from 14% to full opacity as the paragraph scrolls
 * through the viewport (progress runs from its top reaching 85% of the screen to its bottom reaching 50%).
 */
export default function ApproachFill() {
  useEffect(() => {
    const p = Array.from(document.querySelectorAll<HTMLElement>("section p")).find((el) => el.textContent?.startsWith("Most products fail"));
    if (!p) return;
    const words = Array.from(p.children) as HTMLElement[];
    const n = words.length;
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = p.getBoundingClientRect();
      const progress = (0.85 * vh - r.top) / (0.35 * vh + r.height);
      words.forEach((w, i) => {
        const t = Math.min(1, Math.max(0, progress * n - i));
        w.style.opacity = String(0.14 + 0.86 * t);
      });
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
