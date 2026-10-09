"use client";

import { useEffect } from "react";

/** Switches between the pricing groups (e.g. Web app / Mobile app) on the server-rendered pricing section. */
export default function PricingTabs() {
  useEffect(() => {
    const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('#pricing [role="tablist"] [role="tab"]'));
    if (tabs.length < 2) return;
    const panels = tabs.map((t) => document.getElementById(t.getAttribute("aria-controls") ?? ""));
    const pill = tabs.map((t) => t.querySelector(":scope > span.absolute")).find(Boolean) as HTMLElement | undefined;

    const show = (i: number) => {
      tabs.forEach((t, k) => {
        const on = k === i;
        t.setAttribute("aria-selected", String(on));
        t.classList.toggle("text-white", on);
        t.classList.toggle("text-ink-soft", !on);
        t.classList.toggle("hover:text-ink", !on);
        const p = panels[k];
        if (!p) return;
        p.classList.toggle("hidden", !on);
        p.classList.toggle("grid", on);
        p.classList.toggle("step-in", on);
        if (on) p.removeAttribute("aria-hidden");
        else p.setAttribute("aria-hidden", "true");
      });
      if (pill) tabs[i].prepend(pill);
    };
    const handlers = tabs.map((t, i) => {
      const h = () => show(i);
      t.addEventListener("click", h);
      return h;
    });
    return () => tabs.forEach((t, i) => t.removeEventListener("click", handlers[i]));
  }, []);
  return null;
}
