"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const REVIEWS = [
  { q: "TechClues took our idea from a rough sketch to a live MVP in under six weeks. We saw a working build every week, and the price never moved from the original quote.", ini: "DH", name: "Daniel Hughes", role: "Founder, UK property start-up" },
  { q: "Our old website looked fine but never brought in enquiries. After the rebuild with TechClues the pages load faster and calls from Google started coming in within the first month.", ini: "AS", name: "Amira Siddiqui", role: "Practice manager, dental clinic" },
  { q: "We came to them with a half-finished prototype built with AI tools. They tidied it up, secured it and got it ready for real customers, and explained every decision in plain English.", ini: "TF", name: "Tom Fletcher", role: "CEO, e-commerce start-up" },
  { q: "They automated our order and stock handling with a custom dashboard. My team saves hours every day and I finally have one place to see sales, inventory and staff tasks.", ini: "PN", name: "Priya Nair", role: "Operations director, retail business" },
];

const INTERVAL_MS = 7000;
/** Rotating review card with progress bars; pauses while the card is hovered. */
export default function TestimonialsRotator() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = document.querySelector<HTMLElement>('section[aria-label="Testimonials"] [class*="rounded-[28px]"]');
    if (!card) return;
    const on = () => setPaused(true);
    const off = () => setPaused(false);
    card.addEventListener("mouseenter", on);
    card.addEventListener("mouseleave", off);
    return () => {
      card.removeEventListener("mouseenter", on);
      card.removeEventListener("mouseleave", off);
    };
  }, []);

  const go = useCallback((i: number) => setIndex((i + REVIEWS.length) % REVIEWS.length), []);
  const r = REVIEWS[index];

  return (
    <>
      <div className="relative mt-10 min-h-[330px] sm:min-h-[280px] lg:min-h-[300px]">
        <figure key={index} className={index === 0 && !paused ? undefined : "testimonial-in"}>
          <blockquote className="max-w-[1150px] font-normal leading-[1.18] tracking-[-0.035em] text-ink text-[clamp(1.6rem,3.2vw,3.1rem)]">“{r.q}”</blockquote>
          <figcaption className="mt-10 flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,#4d8dff,#0038b8)] text-[14px] font-semibold text-white">{r.ini}</span>
            <span>
              <span className="flex items-center gap-2 text-[16px] font-medium text-ink">
                {r.name}
                
              </span>
              <span className="mt-1 flex items-center gap-2 text-[14px] text-muted">
                {r.role}
              </span>
            </span>
          </figcaption>
        </figure>
      </div>
      <div className="mt-10 flex items-center justify-between gap-6">
        <div className="flex flex-1 gap-2">
          {REVIEWS.map((_, i) => (
            <button key={i} aria-label={`Show review ${i + 1}`} onClick={() => go(i)} className="group relative h-8 flex-1">
              <span className="absolute inset-x-0 top-1/2 h-[3px] -translate-y-1/2 overflow-hidden rounded-full bg-ink/10 transition-colors group-hover:bg-ink/20">
                {i < index && <span className="absolute inset-0 bg-ink" />}
                {i === index && (
                  <span
                    key={`bar-${index}`}
                    className="testimonial-bar absolute inset-y-0 left-0 bg-brand"
                    style={{ animationPlayState: paused || reduce.current ? "paused" : "running" }}
                    onAnimationEnd={() => go(index + 1)}
                  />
                )}
              </span>
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button aria-label="Previous review" onClick={() => go(index - 1)} className="grid size-12 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white sm:size-14">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
          </button>
          <button aria-label="Next review" onClick={() => go(index + 1)} className="grid size-12 place-items-center rounded-full border border-ink/15 text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white sm:size-14">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
