"use client";

import { useState } from "react";

const FAQS = [
  { q: "How accurate is the calculator?", a: "It gives an estimated range based on the features, platform and pace you choose. It's a realistic starting point; the final cost depends on detailed requirements, integrations and custom work." },
  { q: "What affects the cost of an MVP?", a: "The number of core features, web or mobile, design complexity, third-party integrations such as payments or APIs, and your timeline. As these grow, so does the effort and the cost." },
  { q: "What is included in an MVP?", a: "Only the essentials needed to test your core idea: usually user accounts, the main functionality, a simple dashboard and any must-have integrations." },
  { q: "Can you help refine my idea?", a: "Yes. We work with founders to validate ideas, choose the right features and design an MVP that launches quickly within budget." },
  { q: "What should I do after getting my estimate?", a: "Refine your scope and plan your roadmap. Book a free call and we'll turn your estimate into a detailed plan and proposal." },
  { q: "Can the MVP grow into a full product?", a: "Yes. We build MVPs to scale, so once the idea is validated you can add features and integrations rather than start again." },
];

/** FAQ accordion for the calculator page: one answer open at a time, first open by default. */
export default function CalcFaq() {
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
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="text-[19px] tracking-[-0.02em] text-ink transition-colors group-hover:text-brand sm:text-[22px]">{f.q}</span>
              <span
                className={`grid size-10 shrink-0 place-items-center rounded-full border transition-all duration-500 ${
                  isOpen ? "rotate-45 border-ink bg-ink text-white" : "border-ink/15 text-ink group-hover:border-ink"
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="max-w-[640px] pb-7 pr-14 text-[16px] leading-relaxed text-ink-soft">{f.a}</p>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
