"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Placeholder reviews copied from the reference site. Replace these with real Techclues reviews
 * (and a real Trustpilot link) before launch.
 */
const REVIEWS = [
  { q: "Great communication and clear project updates from beginning to end. We always knew what stage the app was in.", ini: "A", name: "Abernathy", stars: 5, verified: true },
  { q: "We appreciated their focus on building only the most important features. It saved time and kept the project streamlined.", ini: "MC", name: "Micheal Chong", stars: 5, verified: true },
  { q: "The development team did an excellent job building our first mobile prototype. The UI was simple but functional, which is exactly what we needed.", ini: "AB", name: "Alan beith", stars: 5, verified: true },
  { q: "Amazing, wonderful people.. particularly Naqvi and Huzaifa, available to help you almost anytime day & night, truly amazing team to work with, not to mention a very costs effective service. I will recommend them to anyone!", ini: "MR", name: "Mohammed Rofique", stars: 5, verified: false },
  { q: "Dealt with Naqvi from start to finish and very happy with the service provided. Went through everything in detail when I needed it", ini: "ML", name: "Mr A Lockley", stars: 4, verified: false },
  { q: "The team understood our requirements quickly and delivered a good first version of our app.", ini: "JB", name: "John Beckett", stars: 5, verified: true },
  { q: "Worked with Vebryx for a small fitness studio app (class booking + login) took a bit of back and forth to get the flow right, but final version works smoothly.", ini: "TK", name: "Tom Kmiec", stars: 4, verified: true },
  { q: "The company is really good, great products great customer services", ini: "AH", name: "Asim Hussain Esq", stars: 5, verified: false },
  { q: "It’s excellent and very friendly services. I recommend for all thank you vebryx. You nailed it 👏🏻keep it up @Naqvi bro 😎", ini: "FB", name: "Faizan Bashir", stars: 5, verified: false },
  { q: "How detailed and attentive..Trusted and results driven and also the level of patience they have no matter my complaints 😩😁", ini: "O", name: "Oluwatosin", stars: 5, verified: false },
];

const INTERVAL_MS = 7000;
const STAR_PATH =
  "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z";

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5" role="img" aria-label={`${n} out of 5 stars`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4">
          <span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{ width: i < n ? "100%" : "0%" }} />
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative fill-white text-white size-2.5" aria-hidden="true">
            <path d={STAR_PATH} />
          </svg>
        </span>
      ))}
    </span>
  );
}

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
                {r.verified && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#e6f7f0] px-2 py-0.5 text-[12px] font-medium text-[#00875a]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                      <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
                      <path d="m16 9-5.5 5.5L8 12" />
                    </svg>
                    Verified
                  </span>
                )}
              </span>
              <span className="mt-1 flex items-center gap-2 text-[14px] text-muted">
                <Stars n={r.stars} />
                Trustpilot
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
