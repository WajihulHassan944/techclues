"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Page-wide behaviour that works on the server-rendered markup:
 *  - scroll reveal for [data-reveal] elements
 *  - the nav hover highlight and the Services / Industries / Company dropdowns
 *  - the stat-card pointer spotlight
 *  - scroll parallax on photos inside `-inset-y-[N%]` wrappers (offset runs from -(N-2)% to +(N-2)%)
 */
export default function SiteEffects() {
  const pathname = usePathname();
  useEffect(() => {
    // Re-attach for the new page after a client-side navigation; close any open dropdown.
    document.querySelectorAll("[data-nav-panel]").forEach((p) => p.classList.add("hidden"));
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

    // Photo parallax: the offset follows how far the photo's frame has travelled through the viewport.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const frames = Array.from(document.querySelectorAll<HTMLElement>('div[class*="-inset-y-["]'))
        .filter((el) => el.querySelector("img") && el.parentElement && !el.closest("[data-ab-banner]"))
        .map((el) => {
          const m = /-inset-y-\[(\d+)%\]/.exec(el.className);
          return m ? { el, amp: Number(m[1]) - 2, host: el.parentElement as HTMLElement } : null;
        })
        .filter((f): f is { el: HTMLElement; amp: number; host: HTMLElement } => f !== null);
      let raf = 0;
      const update = () => {
        raf = 0;
        const vh = window.innerHeight;
        for (const { el, amp, host } of frames) {
          const r = host.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
          el.style.transform = `translateY(${-amp + 2 * amp * p}%)`;
        }
      };
      const schedule = () => {
        if (!raf) raf = requestAnimationFrame(update);
      };
      if (frames.length) {
        update();
        window.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          window.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
        });
      }
    }

    return () => {
      io.disconnect();
      document.documentElement.classList.remove("js-reveal");
      cleanups.forEach((fn) => fn());
    };
  }, [pathname]);

  return null;
}
