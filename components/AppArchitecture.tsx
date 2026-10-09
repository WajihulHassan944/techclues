"use client";

import { useEffect } from "react";

/** Layers of the "How your app is put together" stack, top to bottom, with the tools shown for each. */
const TECH: string[][] = [
  ["React", "Next.js", "React Native", "Flutter", "TypeScript", "Tailwind CSS"],
  ["Express", "Stripe", "Google Analytics", "Mailchimp"],
  ["Node.js", "Python", ".NET", "PHP"],
  ["PostgreSQL", "MongoDB", "Supabase", "Firebase", "Redis"],
  ["AWS", "Google Cloud", "Microsoft Azure", "Vercel", "DigitalOcean"],
];
const SPRITE: Record<string, string> = {
  React: "react", "Next.js": "next-js", "React Native": "react-native", Flutter: "flutter", TypeScript: "typescript",
  "Tailwind CSS": "tailwind-css", Express: "express", Stripe: "stripe", "Google Analytics": "google-analytics",
  Mailchimp: "mailchimp", "Node.js": "node-js", Python: "python", ".NET": "net", PHP: "php", PostgreSQL: "postgresql",
  MongoDB: "mongodb", Supabase: "supabase", Firebase: "firebase", Redis: "redis", "Google Cloud": "google-cloud",
  Vercel: "vercel", DigitalOcean: "digitalocean",
};
const TEXT_MARK: Record<string, [string, string]> = { AWS: ["AWS", "#FF9900"], "Microsoft Azure": ["Azure", "#0078D4"] };

const pill = (name: string) => {
  const t = TEXT_MARK[name];
  const mark = t
    ? `<span class="font-semibold leading-none tracking-tight text-[9px]" style="color:${t[1]}" role="img" aria-label="${name}">${t[0]}</span>`
    : `<svg viewBox="0 0 24 24" class="size-[18px]" role="img" aria-label="${name}"><use href="/logos.svg?v=1liiiom#${SPRITE[name]}"></use></svg>`;
  return `<li class="inline-flex items-center gap-2 rounded-full border border-ink/[0.08] bg-white py-1.5 pl-1.5 pr-3.5"><span class="grid size-8 shrink-0 place-items-center rounded-full bg-paper">${mark}</span><span class="whitespace-nowrap text-[13.5px] text-ink">${name}</span></li>`;
};

const EASE = "cubic-bezier(0.22,1,0.36,1)";
const N = 5;
const z = (layer: number, c: number) => `calc(var(--gap) * ${N - 1 - layer} + var(--open) * ${+(layer < c)})`;
// The connector lines between layers: [layer above it]
const LINE_FROM = [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3];

const sw = (el: Element | null | undefined, on: boolean, onCls: string, offCls: string) => {
  if (!el) return;
  el.classList.remove(...(on ? offCls : onCls).split(" ").filter(Boolean));
  el.classList.add(...(on ? onCls : offCls).split(" ").filter(Boolean));
};

/**
 * Makes the architecture stack interactive: picking a layer (tab or click on the stack) opens the
 * stack up around it, swaps the "Built with" tools and, until you interact, steps through the
 * layers on a timer while the section is on screen.
 */
export default function AppArchitecture() {
  useEffect(() => {
    const sec = document.querySelector<HTMLElement>('section[aria-label="How your app is built"]');
    const grid = sec?.querySelector<HTMLElement>(":scope .mt-8.grid");
    const root = sec?.querySelector<HTMLElement>('[style*="preserve-3d"]');
    const tabs = Array.from(sec?.querySelectorAll<HTMLButtonElement>('button[role="tab"]') ?? []);
    const list = sec?.querySelector<HTMLElement>("#arch-tech ul");
    if (!sec || !grid || !root || tabs.length !== N || !list) return;

    const kids = Array.from(root.children) as HTMLElement[];
    const lines = kids.slice(1, 12);
    const layers = kids.slice(12);
    let current = 0;
    let paused = false;
    let visible = false;
    let swap = 0;
    let swapTimer = 0;
    let first = true;

    const render = (c: number) => {
      lines.forEach((ln, k) => {
        const from = LINE_FROM[k];
        const near = from === c || from + 1 === c;
        const open = from < c && from + 1 >= c;
        ln.style.transform = `translateZ(${z(from, c)})`;
        const bar = ln.firstElementChild as HTMLElement;
        bar.style.height = `calc(var(--gap) + var(--open) * ${+open})`;
        sw(bar, near, "bg-brand/35", "bg-ink/15");
      });
      layers.forEach((ly, a) => {
        const on = a === c;
        const above = a < c;
        ly.style.transform = `translateZ(${z(a, c)})`;
        const [shadow, card] = Array.from(ly.children) as HTMLElement[];
        sw(shadow, on, "bg-brand/40", "bg-[#cfd6e6]");
        shadow.style.opacity = above ? "0.25" : "1";
        sw(card, on, "border-brand/60 bg-[#eef4ff] shadow-[0_0_0_1px_rgba(0,100,255,0.12),0_24px_60px_-18px_rgba(0,100,255,0.5)]", "border-ink/15 bg-white/75");
        card.style.opacity = above ? "0.35" : "1";
        Array.from(card.children).forEach((part) => {
          sw(part, on, "border-brand/30 bg-white text-brand shadow-[0_6px_14px_-8px_rgba(0,100,255,0.5)]", "border-ink/10 bg-white/90 text-ink/45");
          if (part.classList.contains("h-[26%]")) part.classList.toggle("bg-brand/[0.07]", on);
          sw(part.querySelector("span"), on, "text-ink", "text-ink/45");
        });
      });
      tabs.forEach((b, a) => {
        const on = a === c;
        b.setAttribute("aria-selected", String(on));
        const [bar, num, text] = Array.from(b.children) as HTMLElement[];
        sw(bar, on, "bg-brand", "bg-transparent");
        sw(num, on, "text-brand", "text-muted");
        sw(text.children[0], on, "text-ink", "text-ink/50 group-hover:text-ink/80");
        sw(text.children[1], on, "grid-rows-[1fr] opacity-100", "grid-rows-[0fr] opacity-0");
      });
      if (first) {
        first = false;
        return;
      }
      // "Built with" list: fade the old tools out, then the new ones in.
      const token = ++swap;
      clearTimeout(swapTimer);
      list.style.transition = "opacity .35s, transform .35s";
      list.style.opacity = "0";
      list.style.transform = "translateY(-6px)";
      swapTimer = window.setTimeout(() => {
        if (token !== swap) return;
        list.innerHTML = TECH[c].map(pill).join("");
        list.style.transition = "none";
        list.style.transform = "translateY(8px)";
        void list.offsetHeight;
        list.style.transition = "opacity .35s, transform .35s";
        list.style.opacity = "1";
        list.style.transform = "none";
      }, 350);
    };

    const select = (a: number) => {
      paused = true;
      go(a);
    };
    const go = (a: number) => {
      current = a;
      render(a);
      schedule();
    };
    let timer = 0;
    const schedule = () => {
      clearTimeout(timer);
      if (paused || !visible || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      timer = window.setTimeout(() => go((current + 1) % N), 3800);
    };

    const pulses = Array.from(sec.querySelectorAll<HTMLElement>(".arch-pulse"));
    const io = new IntersectionObserver(
      ([e]) => {
        visible = e.isIntersecting;
        pulses.forEach((p) => (p.style.animationPlayState = visible ? "running" : "paused"));
        schedule();
      },
      { threshold: 0.3 },
    );
    io.observe(grid);
    pulses.forEach((p) => (p.style.animationPlayState = "paused"));

    const off: Array<() => void> = [];
    const on = (el: EventTarget, ev: string, fn: () => void) => {
      el.addEventListener(ev, fn);
      off.push(() => el.removeEventListener(ev, fn));
    };
    on(grid, "mouseenter", () => {
      paused = true;
      clearTimeout(timer);
    });
    on(grid, "mouseleave", () => {
      paused = false;
      schedule();
    });
    tabs.forEach((b, a) => {
      on(b, "click", () => select(a));
      on(b, "focus", () => select(a));
    });
    layers.forEach((ly, a) => on(ly, "click", () => select(a)));
    render(0);

    return () => {
      io.disconnect();
      clearTimeout(timer);
      clearTimeout(swapTimer);
      off.forEach((f) => f());
    };
  }, []);
  return null;
}
