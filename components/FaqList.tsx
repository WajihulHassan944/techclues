"use client";

import { useState } from "react";

const FAQS = [
  { q: "What does Vebryx do?", a: "We're an MVP studio in Glasgow. We help founders validate ideas, then design, build and scale them." },
  { q: "How much does an MVP cost?", a: "A Validation MVP starts from £2,500, a Lean MVP from £5,000 and a Custom or SaaS platform from £10,000, with your price agreed before any work starts. Try our cost calculator for an instant estimate." },
  { q: "How long does it take to build an MVP?", a: "A Validation MVP takes 1–2 weeks and a Lean MVP 2–4 weeks. A Custom or SaaS platform takes around 8 weeks, agreed up front." },
  { q: "How does Vebryx develop an MVP?", a: "Through eight phases: Ignition, Compass, Pillar, Canvas, Forge, Bridge, Sentinel and Everest, from first idea to deployment." },
  { q: "Can you turn an MVP into a full product?", a: "Yes. We build on scalable foundations from day one, so nothing gets thrown away." },
  { q: "How do you support products after launch?", a: "Ongoing support, maintenance and growth marketing once you're live." },
];

/** FAQ accordion: one answer open at a time, first open by default. */
export default function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t border-ink/10">
      {FAQS.map((f, i) => {
        const isOpen = open === i;
        return (
          <li key={f.q} className="border-b border-ink/10">
            <button
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? null : i)}
              className="group flex w-full items-center justify-between gap-6 py-7 text-left"
            >
              <span className="text-[20px] font-normal tracking-[-0.02em] text-ink transition-colors group-hover:text-brand sm:text-[24px]">
                {f.q}
              </span>
              <span
                className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                  isOpen ? "rotate-45 border-ink bg-ink text-white" : "border-ink/15 text-ink group-hover:border-ink"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="max-w-[680px] pb-8 pr-14 text-[17px] leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
