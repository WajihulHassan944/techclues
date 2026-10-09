"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

const WORDS = ["idea validation", "rapid MVPs", "UI/UX design", "mobile apps", "scaling up"];
const FIRST_DELAY = 1300;
const PERIOD = 2700;

const wordClass = "whitespace-nowrap px-[0.42em] text-[0.8em] leading-none";
const sizerClass = `invisible inline-flex h-[1.02em] items-center justify-self-start [grid-area:1/1] ${wordClass}`;

/** The rotating highlighted word in the hero headline. */
export default function HeroWord() {
  const [index, setIndex] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const sizers = useRef<(HTMLSpanElement | null)[]>([]);

  useLayoutEffect(() => {
    const el = sizers.current[index];
    if (el) setWidth(el.getBoundingClientRect().width);
  }, [index]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const step = (delay: number) => {
      timer = setTimeout(() => {
        setIndex((i) => {
          setPrev(i);
          return (i + 1) % WORDS.length;
        });
        step(PERIOD);
      }, delay);
    };
    step(FIRST_DELAY);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 800);
    return () => clearTimeout(t);
  }, [prev]);

  return (
    <span className="relative inline-grid align-[-0.08em]">
      <span className="sr-only">{WORDS.join(", ")}</span>
      {WORDS.map((w, i) => (
        <span
          key={w}
          ref={(el) => {
            sizers.current[i] = el;
          }}
          data-sizer="true"
          aria-hidden="true"
          className={sizerClass}
        >
          {w}
        </span>
      ))}
      <span
        aria-hidden="true"
        className="absolute left-0 top-0 inline-flex h-[1.02em] items-center justify-center overflow-hidden rounded-full bg-ink text-white"
        style={{
          width,
          transition: width === undefined ? undefined : "width 700ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {prev !== null && (
          <span key={`out-${prev}`} className={`absolute inset-0 flex items-center justify-center ${wordClass} hero-word-out`}>
            {WORDS[prev]}
          </span>
        )}
        <span
          key={`in-${index}`}
          className={`absolute inset-0 flex items-center justify-center ${wordClass} ${prev !== null ? "hero-word-in" : ""}`}
        >
          {WORDS[index]}
        </span>
      </span>
    </span>
  );
}
