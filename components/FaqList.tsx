"use client";

import { useState } from "react";
import type { AccordionItem } from "./Accordion";

/** FAQ accordion: one answer open at a time, first open by default. */
export default function FaqList({ items }: { items: AccordionItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="border-t border-ink/10">
      {items.map((f, i) => {
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
