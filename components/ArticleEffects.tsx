"use client";

import { useEffect } from "react";

/**
 * Blog article behaviour on the server-rendered markup: the "On this page" list highlights the
 * heading being read (the last one above 30% of the screen) and its line fills with page scroll progress.
 */
export default function ArticleEffects() {
  useEffect(() => {
    const nav = document.querySelector<HTMLElement>('nav[aria-label="On this page"]');
    if (!nav) return;
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>("ul a"));
    const bar = nav.querySelector<HTMLElement>("span.bg-brand");
    const targets = links.map((a) => document.getElementById(decodeURIComponent(a.getAttribute("href")!.slice(1)))).filter((el): el is HTMLElement => !!el);
    const ON = ["font-medium", "text-ink"];
    const OFF = ["text-muted", "hover:text-ink"];
    let active = "";

    const update = () => {
      const edge = 0.3 * window.innerHeight;
      let id = targets[0]?.id ?? "";
      for (const t of targets) if (t.getBoundingClientRect().top <= edge) id = t.id;
      if (id !== active) {
        active = id;
        links.forEach((a) => {
          const on = decodeURIComponent(a.getAttribute("href")!.slice(1)) === id;
          a.classList.remove(...(on ? OFF : ON));
          a.classList.add(...(on ? ON : OFF));
        });
      }
      if (bar) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleY(${max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0})`;
      }
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);
  return null;
}
