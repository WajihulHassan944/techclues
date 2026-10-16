"use client";

import { useEffect, useRef } from "react";
import HeroScene from "./HeroScene";

/** Cinematic hero backdrop: the photograph with a pointer-led parallax and a WebGL scene on top. */
export default function GameHero() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const sec = el?.parentElement;
    if (!el || !sec) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const frame = () => {
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      raf = requestAnimationFrame(frame);
    };
    if (!reduce) {
      sec.addEventListener("pointermove", move);
      raf = requestAnimationFrame(frame);
    }
    return () => {
      cancelAnimationFrame(raf);
      sec.removeEventListener("pointermove", move);
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="gd-hero-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/game/hero.webp" alt="" className="gd-hero-img" fetchPriority="high" />
      <span className="gd-hero-shade" />
      <HeroScene />
    </div>
  );
}
