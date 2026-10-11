"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const REVIEWS = [
  { q: "The TechClues team always make sure to deliver the project on time, and they are very professional about product development. From development to deployment, they made sure my idea became a product.", ini: "Z", name: "Zeeshan", role: "COO, Qatar" },
  { q: "I am satisfied with the web development services the TechClues team has provided. They have good UI/UX experience, which helped our site rank on Google and improved my ROI.", ini: "SM", name: "Shoaib Masood", role: "Islamabad dental clinic" },
  { q: "Picktiles was a really hard startup to get going, but their confidence in building a product from scratch is undeniably professional. I highly recommend them to any startup looking for technology consultants.", ini: "K", name: "Khurram", role: "CEO, Pakistan" },
  { q: "They automated my whole car business using web technologies, and built applications for the whole HR system that help my staff manage everything from inventory to sales.", ini: "AS", name: "Abbay Singh", role: "Affordable Autos, Canada" },
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
