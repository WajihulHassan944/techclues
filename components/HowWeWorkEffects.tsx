"use client";

import { useEffect } from "react";

const swap = (el: Element | null | undefined, on: boolean, onCls: string, offCls: string) => {
  if (!el) return;
  el.classList.remove(...(on ? offCls : onCls).split(" "));
  el.classList.add(...(on ? onCls : offCls).split(" "));
};

/**
 * How-we-work behaviour, on the server-rendered markup:
 *  - journey: a phase's connector line and number light up while it sits in the upper 55% of the screen
 *  - timeline: the week-by-week bars grow in one after another when they come into view
 */
export default function HowWeWorkEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    document.querySelectorAll<HTMLElement>("li[data-step]").forEach((li) => {
      const line = li.querySelector(":scope > span[aria-hidden]");
      const dot = li.querySelector(":scope > div > span.rounded-full");
      const io = new IntersectionObserver(
        ([e]) => {
          const on = e.isIntersecting;
          swap(line, on, "bg-brand", "bg-ink/10");
          swap(dot, on, "border-brand bg-brand text-white shadow-[0_0_0_6px_rgba(0,100,255,0.1)]", "border-ink/15 bg-paper text-muted");
        },
        { rootMargin: "0px 0px -45% 0px" },
      );
      io.observe(li);
      cleanups.push(() => io.disconnect());
    });

    document.querySelectorAll<HTMLElement>("[data-bar]").forEach((bar) => {
      const i = Number(bar.dataset.bar);
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          const t = `${0.15 + 0.15 * i}s`;
          bar.style.transition = `transform .9s cubic-bezier(.16,1,.3,1) ${t}, opacity .9s cubic-bezier(.16,1,.3,1) ${t}`;
          bar.style.opacity = "1";
          bar.style.transform = "scaleX(1)";
          io.disconnect();
        },
        { rootMargin: "-10%" },
      );
      io.observe(bar);
      cleanups.push(() => io.disconnect());
    });

    return () => cleanups.forEach((f) => f());
  }, []);
  return null;
}
