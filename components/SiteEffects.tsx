"use client";

import { useEffect } from "react";

/**
 * Page-wide behaviour that works on the server-rendered markup:
 *  - scroll reveal for [data-reveal] elements
 *  - the nav hover highlight and the Services / Industries / Company dropdowns
 *  - the stat-card pointer spotlight
 */
export default function SiteEffects() {
  useEffect(() => {
    // Scroll reveal
    document.documentElement.classList.add("js-reveal");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));

    // Nav highlight + dropdowns
    const nav = document.querySelector<HTMLElement>("header nav");
    const cleanups: Array<() => void> = [];
    if (nav) {
      const highlight = nav.querySelector<HTMLElement>(":scope > span[aria-hidden]");
      const items = Array.from(nav.children).filter((c) => c !== highlight) as HTMLElement[];

      const moveHighlight = (el: HTMLElement) => {
        if (!highlight) return;
        const n = nav.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        highlight.style.width = `${r.width}px`;
        highlight.style.transform = `translateX(${r.left - n.left - nav.clientLeft}px)`;
        highlight.style.opacity = "1";
      };
      const onNavLeave = () => {
        if (highlight) highlight.style.opacity = "0";
      };
      nav.addEventListener("mouseleave", onNavLeave);
      cleanups.push(() => nav.removeEventListener("mouseleave", onNavLeave));

      let openItem: HTMLElement | null = null;
      let closeTimer: ReturnType<typeof setTimeout> | undefined;
      const setOpen = (item: HTMLElement, open: boolean) => {
        const panel = item.querySelector<HTMLElement>("[data-nav-panel]");
        const btn = item.querySelector<HTMLElement>("button");
        panel?.classList.toggle("hidden", !open);
        btn?.setAttribute("aria-expanded", String(open));
        btn?.querySelector("svg")?.classList.toggle("rotate-180", open);
      };
      const close = () => {
        if (openItem) setOpen(openItem, false);
        openItem = null;
      };

      for (const item of items) {
        const target = (item.querySelector("button, a") as HTMLElement) ?? item;
        const hasPanel = !!item.querySelector("[data-nav-panel]");
        const enter = () => {
          clearTimeout(closeTimer);
          moveHighlight(target);
          if (hasPanel) {
            if (openItem && openItem !== item) setOpen(openItem, false);
            openItem = item;
            setOpen(item, true);
          } else {
            close();
          }
        };
        const leave = () => {
          if (!hasPanel) return;
          closeTimer = setTimeout(close, 160);
        };
        item.addEventListener("mouseenter", enter);
        item.addEventListener("mouseleave", leave);
        cleanups.push(() => {
          item.removeEventListener("mouseenter", enter);
          item.removeEventListener("mouseleave", leave);
        });
      }
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
      document.addEventListener("keydown", onKey);
      cleanups.push(() => document.removeEventListener("keydown", onKey));
    }

    // Stat-card spotlight follows the pointer
    document.querySelectorAll<HTMLElement>(".group.isolate").forEach((card) => {
      if (!card.querySelector('[class*="circle_at_var(--mx)"]')) return;
      const move = (e: PointerEvent) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", `${e.clientX - r.left}px`);
        card.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      card.addEventListener("pointermove", move);
      cleanups.push(() => card.removeEventListener("pointermove", move));
    });

    return () => {
      io.disconnect();
      document.documentElement.classList.remove("js-reveal");
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
