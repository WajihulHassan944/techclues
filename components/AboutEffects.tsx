"use client";

import { useEffect } from "react";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/**
 * About page behaviour, on the server-rendered markup:
 *  - fade-ups that play once when they reach the middle of the screen
 *  - "Our story": the progress line and the active chapter follow the scroll
 *  - team banner: grows from an inset, rounded card to full width while its photo drifts
 */
export default function AboutEffects() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];

    // Fade-ups (chapters use a 15% inset, the banner caption 20%)
    document.querySelectorAll<HTMLElement>("[data-ab]").forEach((el) => {
      const inset = el.style.getPropertyValue("--ab-margin") || "15";
      const io = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) {
            el.classList.add("is-in");
            io.disconnect();
          }
        },
        { rootMargin: `-${inset}% 0px` },
      );
      io.observe(el);
      cleanups.push(() => io.disconnect());
    });

    // Story progress
    const story = document.querySelector<HTMLElement>('section[aria-label="Our story"]');
    const chapters = story?.querySelector<HTMLElement>(":scope > div > ol");
    const line = story?.querySelector<HTMLElement>("[data-ab-line]");
    const items = Array.from(story?.querySelectorAll<HTMLElement>("ol.relative > li") ?? []);

    // Team banner
    const banner = document.querySelector<HTMLElement>("[data-ab-banner]");
    const pad = banner?.firstElementChild as HTMLElement | null;
    const card = pad?.firstElementChild as HTMLElement | null;
    const photo = card?.firstElementChild as HTMLElement | null;

    let active = -1;
    const update = () => {
      const vh = window.innerHeight;
      if (chapters && line) {
        const r = chapters.getBoundingClientRect();
        const p = clamp((0.5 * vh - r.top) / r.height);
        line.style.transform = `scaleY(${p})`;
        const idx = Math.min(items.length - 1, Math.floor(p * items.length));
        if (idx !== active) {
          active = idx;
          items.forEach((li, i) => {
            li.classList.toggle("font-medium", i === idx);
            li.classList.toggle("text-ink", i === idx);
            li.classList.toggle("text-muted", i !== idx);
          });
        }
      }
      if (banner && pad && card && photo) {
        const r = banner.getBoundingClientRect();
        const p = clamp((vh - r.top) / (vh + r.height));
        photo.style.transform = `translateY(${-8 + 16 * p}%)`;
        const t = clamp(p / 0.35);
        pad.style.paddingLeft = pad.style.paddingRight = `${4 * (1 - t)}%`;
        card.style.borderRadius = `${36 * (1 - t)}px`;
      }
    };
    let raf = 0;
    const schedule = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          update();
        });
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    cleanups.push(() => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    });
    return () => cleanups.forEach((f) => f());
  }, []);
  return null;
}
