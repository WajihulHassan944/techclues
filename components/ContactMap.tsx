"use client";

import { useEffect } from "react";

const ZONES = ["Europe/London", "Asia/Karachi"]; // Glasgow, Karachi

const sw = (el: Element | null | undefined, on: boolean, onCls: string, offCls: string) => {
  if (!el) return;
  el.classList.remove(...(on ? offCls : onCls).split(" "));
  el.classList.add(...(on ? onCls : offCls).split(" "));
};

/**
 * "Where we are": hovering, focusing or clicking a pin (or its card) highlights that location,
 * and each card shows the current local time there.
 */
export default function ContactMap() {
  useEffect(() => {
    const sec = document.querySelector<HTMLElement>('section[aria-label="Where we are"]');
    if (!sec) return;
    const pins = Array.from(sec.querySelectorAll<HTMLButtonElement>("button[aria-label]"));
    const cards = Array.from(sec.querySelectorAll<HTMLElement>(".sm\\:grid-cols-2 > div"));
    if (pins.length !== 2 || cards.length !== 2) return;

    const render = (active: number) => {
      pins.forEach((pin, i) => {
        const on = i === active;
        const [label, line, dotWrap] = Array.from(pin.firstElementChild!.children) as HTMLElement[];
        sw(label, on, "border-white/20 bg-white text-ink", "border-white/10 bg-white/10 text-white");
        sw(label.children[0], on, "bg-brand", "bg-white/60");
        sw(label.children[1].children[1], on, "text-muted", "text-white/60");
        sw(line, on, "h-7 from-white to-white/0", "h-5 from-white/50 to-white/0");
        sw(dotWrap.lastElementChild, on, "size-3.5", "size-2.5");
      });
      cards.forEach((card, i) => {
        const on = i === active;
        sw(card, on, "border-brand bg-white", "border-ink/[0.08] bg-white");
        sw(card.querySelector("p span"), on, "bg-brand", "bg-ink/20");
      });
    };

    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) sec.querySelectorAll(".animate-ping").forEach((el) => el.remove());

    const off: Array<() => void> = [];
    const on = (el: EventTarget, ev: string, fn: () => void) => {
      el.addEventListener(ev, fn);
      off.push(() => el.removeEventListener(ev, fn));
    };
    pins.forEach((p, i) => ["mouseenter", "focus", "click"].forEach((ev) => on(p, ev, () => render(i))));
    cards.forEach((c, i) => on(c, "mouseenter", () => render(i)));
    render(0);

    const clocks = cards.map((c) => c.querySelector<HTMLElement>("p.tabular-nums")!);
    const fmt = ZONES.map((z) => new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: z }));
    const tick = () => clocks.forEach((el, i) => el && (el.textContent = fmt[i].format(new Date())));
    tick();
    const timer = setInterval(tick, 30_000);
    return () => {
      clearInterval(timer);
      off.forEach((f) => f());
    };
  }, []);
  return null;
}
