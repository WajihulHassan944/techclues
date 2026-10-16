"use client";

import { useEffect, useRef } from "react";

const CUBES = [
  { s: 74, x: "9%", y: "26%", d: "0s", t: "13s", z: 40 },
  { s: 46, x: "20%", y: "64%", d: "-4s", t: "10s", z: 90 },
  { s: 96, x: "84%", y: "14%", d: "-2s", t: "16s", z: 20 },
  { s: 52, x: "89%", y: "58%", d: "-7s", t: "11s", z: 110 },
  { s: 34, x: "66%", y: "72%", d: "-5s", t: "9s", z: 60 },
];

/** 3D arcade backdrop for the hero: twinkling pixel stars, a neon perspective floor and spinning wireframe cubes that follow the pointer. */
export default function GameHero() {
  const root = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = root.current;
    const sec = el?.parentElement;
    const cv = canvas.current;
    if (!el || !sec || !cv) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    // pointer parallax (eased)
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      const r = sec.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
      ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const loop = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      raf = requestAnimationFrame(loop);
    };
    if (!reduce) {
      sec.addEventListener("pointermove", move);
      raf = requestAnimationFrame(loop);
    }

    // pixel stars
    const ctx = cv.getContext("2d")!;
    let w = 0, h = 0;
    const stars = Array.from({ length: 90 }, () => ({ x: Math.random(), y: Math.random() * 0.75, r: Math.random() < 0.15 ? 3 : 2, p: Math.random() * 6.28, v: 0.6 + Math.random() * 1.6 }));
    const size = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = sec.clientWidth; h = sec.clientHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    let sraf = 0;
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduce ? 0.7 : 0.25 + 0.75 * Math.abs(Math.sin(s.p + (t / 1000) * s.v));
        ctx.fillStyle = `rgba(160,210,255,${a})`;
        ctx.fillRect(Math.round(s.x * w), Math.round(s.y * h), s.r, s.r);
      }
      if (!reduce) sraf = requestAnimationFrame(draw);
    };
    size();
    draw(0);
    if (!reduce) sraf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(() => { size(); if (reduce) draw(0); });
    ro.observe(sec);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
      sec.removeEventListener("pointermove", move);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="gh-root">
      <canvas ref={canvas} className="gh-stars" />
      <span className="gh-glow gh-glow-a" />
      <span className="gh-glow gh-glow-b" />
      <div className="gh-scene">
        <div className="gh-floor"><span /></div>
        {CUBES.map((c, i) => (
          <div key={i} className="gh-float" style={{ left: c.x, top: c.y, animationDelay: c.d, animationDuration: c.t, ["--z" as string]: `${c.z}px` }}>
            <div className="gh-cube" style={{ ["--s" as string]: `${c.s}px`, animationDuration: `${parseInt(c.t) + 6}s`, animationDelay: c.d }}>
              <i /><i /><i /><i /><i /><i />
            </div>
          </div>
        ))}
      </div>
      <div className="gh-hud gh-hud-tl">
        <span>P1</span>
        <b>SCORE <em>004200</em></b>
        <span className="gh-hearts">♥ ♥ ♥</span>
      </div>
      <div className="gh-hud gh-hud-br">INSERT COIN <i /></div>
    </div>
  );
}
