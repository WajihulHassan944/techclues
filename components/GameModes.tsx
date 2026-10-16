"use client";

import { useState } from "react";

type Mode = { badge: string; title: string; text: string; best: string };

/** "Select your mode" cards: pick one with a click or the arrow keys, like a game's mode-select screen. */
export default function GameModes({ modes }: { modes: Mode[] }) {
  const [sel, setSel] = useState(0);
  const key = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setSel((s) => (s + 1) % modes.length); }
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setSel((s) => (s + modes.length - 1) % modes.length); }
  };
  return (
    <div role="radiogroup" aria-label="Engagement mode" className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14" onKeyDown={key}>
      {modes.map((m, n) => {
        const on = sel === n;
        return (
          <div key={m.title} data-reveal="" style={{ "--reveal-delay": `${n * 0.08}s`, "--reveal-y": "28px" } as React.CSSProperties}>
            <div
              role="radio"
              aria-checked={on}
              tabIndex={on ? 0 : -1}
              onClick={() => setSel(n)}
              className={`gx-mode relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[24px] border p-7 outline-none transition-all duration-500 sm:p-9 ${on ? "is-on" : ""}`}
            >
              <span className="gx-mode-glow" />
              <div className="flex items-center justify-between">
                <span className="gx-badge">{m.badge}</span>
                <span className="gx-mode-p">{`P${n + 1}`}</span>
              </div>
              <h3 className="mt-7 text-[clamp(1.5rem,2.2vw,2rem)] tracking-[-0.03em] text-ink">{m.title}</h3>
              <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-ink-soft">{m.text}</p>
              <p className="gx-mono mt-auto flex items-center justify-between border-t border-ink/10 pt-5 text-brand-ink" style={{ marginTop: "auto" }}>
                <span>{m.best}</span>
                <span className="gx-select">{on ? "▶ SELECTED" : "SELECT"}</span>
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
