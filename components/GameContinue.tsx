"use client";

import { useEffect, useState } from "react";

/** Arcade "CONTINUE?" call to action with a looping 9..0 countdown. */
export default function GameContinue() {
  const [n, setN] = useState(9);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setN((v) => (v === 0 ? 9 : v - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <section aria-label="Continue" className="py-[clamp(24px,4vw,56px)]">
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
        <div data-reveal="" style={{ "--reveal-delay": "0s", "--reveal-y": "28px" } as React.CSSProperties}>
          <div className="gx-continue gx-crt relative isolate overflow-hidden rounded-[28px] px-6 py-14 text-center sm:rounded-[36px] sm:py-20">
            <span className="gx-continue-grid" aria-hidden="true" />
            <p className="gx-mono relative text-[#7fd0ff]">Player 1</p>
            <h2 className="relative mt-4 text-[clamp(2.6rem,8vw,6.5rem)] font-normal leading-none tracking-[-0.04em] text-white">
              Continue<span className="gx-blink">?</span>
            </h2>
            <p className="gx-count relative mx-auto mt-4" aria-hidden="true">{n}</p>
            <p className="relative mx-auto mt-3 max-w-[460px] text-[17px] leading-relaxed text-white/70">Bring a concept, a stalled build or a live title. One free call and we map the route to launch.</p>
            <a href="#get-started" data-cta="game-continue" className="gx-start group relative mt-9 inline-flex h-14 items-center gap-3 rounded-full px-9 text-[15px] font-medium tracking-wide text-white">
              Press start
              <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
