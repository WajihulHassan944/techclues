"use client";

import { useState } from "react";

type Mode = { badge: string; title: string; text: string; best: string; img: string };

/** Two engagement options as photo cards; pick one with a click or the arrow keys. */
export default function GameModes({ modes }: { modes: Mode[] }) {
  const [sel, setSel] = useState(0);
  const key = (e: React.KeyboardEvent) => {
    if (["ArrowRight", "ArrowDown"].includes(e.key)) { e.preventDefault(); setSel((s) => (s + 1) % modes.length); }
    if (["ArrowLeft", "ArrowUp"].includes(e.key)) { e.preventDefault(); setSel((s) => (s + modes.length - 1) % modes.length); }
  };
  return (
    <div role="radiogroup" aria-label="Engagement model" className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14" onKeyDown={key}>
      {modes.map((m, n) => {
        const on = sel === n;
        return (
          <div key={m.title} data-reveal="" style={{ "--reveal-delay": `${n * 0.08}s`, "--reveal-y": "28px" } as React.CSSProperties}>
            <div role="radio" aria-checked={on} tabIndex={on ? 0 : -1} onClick={() => setSel(n)} data-tilt="" className={`gd-tilt gd-mode group relative isolate flex h-full min-h-[420px] cursor-pointer flex-col justify-end overflow-hidden rounded-[28px] p-7 outline-none sm:p-9 ${on ? "is-on" : ""}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.img} alt="" loading="lazy" className="gd-mode-img absolute inset-0 -z-20 size-full object-cover" />
              <span className="gd-mode-shade absolute inset-0 -z-10" />
              <span className="gd-chip-light absolute left-7 top-7 sm:left-9 sm:top-9">{m.badge}</span>
              <span className="gd-radio absolute right-7 top-7 sm:right-9 sm:top-9" aria-hidden="true" />
              <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-tight tracking-[-0.03em] text-white">{m.title}</h3>
              <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-white/75">{m.text}</p>
              <p className="mt-6 border-t border-white/20 pt-4 text-[13px] font-medium uppercase tracking-[0.1em] text-[#8fd0ff]">{m.best}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
