"use client";

import { useEffect, useState } from "react";

export default function ZeroOneSlotButton() {
  const [on, setOn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const live = new Set<Element>();
    const update = () => setOn(live.size === 0 && window.scrollY > 400);
    const io = new IntersectionObserver((es) => {
      for (const e of es) (e.isIntersecting ? live.add(e.target) : live.delete(e.target));
      update();
    });
    document.querySelectorAll("[data-slot-form]").forEach((f) => io.observe(f));
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  // keep the node around briefly so it can fade out like the original's exit animation
  useEffect(() => {
    if (on) setMounted(true);
    else if (mounted) {
      const t = window.setTimeout(() => setMounted(false), 450);
      return () => window.clearTimeout(t);
    }
  }, [on, mounted]);

  if (!mounted) return null;
  return (
    <a
      href="#brief"
      data-cta="zero-one-floating-slot"
      className={`zo-slot group fixed bottom-[86px] right-4 z-40 inline-flex h-[52px] items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white shadow-[0_18px_40px_-16px_rgba(14,15,49,0.6)] transition-colors duration-300 hover:bg-brand sm:bottom-[104px] sm:right-8 ${on ? "zo-slot-in" : "zo-slot-out"}`}
    >
      Book your slot
      <span className="text-white/55">£499</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </a>
  );
}
