"use client";

import { useRef } from "react";

/** Layered photo collage in real 3D, same mechanic as the game page's collage: the stack tilts
 *  toward the pointer, with stat chips floating nearest to you. */
export default function AiCollage() {
  const stage = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 14).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 18).toFixed(2)}deg`);
  };
  const leave = () => {
    stage.current?.style.setProperty("--rx", "0deg");
    stage.current?.style.setProperty("--ry", "0deg");
  };
  return (
    <div className="gd-stage" onPointerMove={move} onPointerLeave={leave}>
      <div className="gd-stage-idle">
        <div ref={stage} className="gd-stage-in">
          <div className="gd-layer gd-layer-a">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/services/ai.jpg" alt="A team reviewing an AI workflow" loading="lazy" />
          </div>
          <div className="gd-layer gd-layer-b">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/blog/ai-funding.jpg" alt="A dashboard showing model output" loading="lazy" />
          </div>
          <div className="gd-layer gd-layer-c gd-glass-light" aria-hidden="true">
            <span>Model grounded</span>
            <b>Your data, not the open web</b>
          </div>
          <div className="gd-layer gd-layer-d gd-glass-light" aria-hidden="true">
            <span>Shipped in</span>
            <b>Weeks, not quarters</b>
          </div>
        </div>
      </div>
    </div>
  );
}
