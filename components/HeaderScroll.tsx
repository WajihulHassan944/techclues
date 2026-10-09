"use client";

import { useEffect, useState } from "react";

const HIDE = ["pointer-events-none", "-translate-y-3", "opacity-0"];
const NAV_ON = ["bg-white/95", "shadow-[0_12px_40px_-14px_rgba(14,15,49,0.22)]", "backdrop-blur-xl"];
const BAR_TOP = ["h-[96px]", "sm:h-[112px]"];
const BAR_SCROLLED = ["h-[88px]"];

/**
 * Applies the header's scrolled state: the logo and header CTA fade out, the nav
 * becomes a white floating pill, and a floating "Start your project" button appears.
 * It toggles classes on the server-rendered header, so no markup is duplicated.
 */
export default function HeaderScroll() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const bar = header.firstElementChild;
    const logo = header.querySelector('a[aria-label="Vebryx home"]');
    const nav = header.querySelector("nav");
    const cta = header.querySelector(".justify-self-end a");

    const apply = (on: boolean) => {
      bar?.classList.remove(...(on ? BAR_TOP : BAR_SCROLLED));
      bar?.classList.add(...(on ? BAR_SCROLLED : BAR_TOP));
      for (const el of [logo, cta]) {
        if (!el) continue;
        if (on) el.classList.add(...HIDE);
        else el.classList.remove(...HIDE);
      }
      if (nav) {
        if (on) nav.classList.add(...NAV_ON);
        else nav.classList.remove(...NAV_ON);
      }
      setScrolled(on);
    };

    const onScroll = () => apply(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!scrolled) return null;
  return (
    <a
      href="/book-a-call"
      className="group pointer-events-auto fixed bottom-[86px] right-5 z-40 hidden h-[52px] items-center gap-0 rounded-full bg-ink pl-6 pr-6 text-[15px] font-medium text-white shadow-[0_18px_40px_-16px_rgba(14,15,49,0.6)] transition-[background-color,gap,padding] duration-300 hover:gap-2 hover:bg-brand hover:pr-5 sm:bottom-[104px] sm:right-8 sm:inline-flex"
    >
      Start your project
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-4 w-0 opacity-0 transition-all duration-300 group-hover:w-4 group-hover:opacity-100"
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  );
}
