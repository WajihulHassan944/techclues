"use client";

import { useEffect, useRef } from "react";

/** Cinematic hero backdrop: slow-zooming photograph, soft light dust and a pointer-led parallax. */
export default function GameHero() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current;
    const sec = el?.parentElement;
    const cv = canvas.current;
    if (!el || !sec || !cv) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const ctx = cv.getContext("2d")!;
    let w = 0, h = 0;
    const dust = Array.from({ length: 46 }, () => ({ x: Math.random(), y: Math.random(), r: 0.6 + Math.random() * 1.8, v: 0.015 + Math.random() * 0.05, p: Math.random() * 6.28 }));
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = sec.clientWidth; h = sec.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const frame = (t: number) => {
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      ctx.clearRect(0, 0, w, h);
      for (const d of dust) {
        const y = ((d.y - (t / 1000) * d.v) % 1 + 1) % 1;
        const a = 0.12 + 0.4 * Math.abs(Math.sin(d.p + t / 1800));
        ctx.fillStyle = `rgba(170,205,255,${a})`;
        ctx.beginPath();
        ctx.arc(d.x * w + cx * d.r * 14, y * h, d.r, 0, 6.283);
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    size();
    if (!reduce) {
      sec.addEventListener("pointermove", move);
      raf = requestAnimationFrame(frame);
    }
    const ro = new ResizeObserver(size);
    ro.observe(sec);
    return () => {
      cancelAnimationFrame(raf);
      sec.removeEventListener("pointermove", move);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="gd-hero-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/game/hero.jpg" alt="" className="gd-hero-img" fetchPriority="high" />
      <span className="gd-hero-shade" />
      <canvas ref={canvas} className="gd-hero-dust" />
    </div>
  );
}
