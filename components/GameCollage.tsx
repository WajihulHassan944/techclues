"use client";

import { useRef } from "react";

/** Layered photo collage in real 3D: the stack tilts toward the pointer, with chips floating nearest to you. */
export default function GameCollage() {
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
            <img src="/images/game/setup.jpg" alt="A game studio desk lit by neon" loading="lazy" />
          </div>
          <div className="gd-layer gd-layer-b">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/game/controller.jpg" alt="A gamepad under blue and orange lighting" loading="lazy" />
          </div>
          <div className="gd-layer gd-layer-c gd-glass-light" aria-hidden="true">
            <span>Unreal Engine 5</span>
            <b>90 FPS · Quest 3</b>
          </div>
          <div className="gd-layer gd-layer-d gd-glass-light" aria-hidden="true">
            <span>Release</span>
            <b>Live on 6 platforms</b>
          </div>
        </div>
      </div>
    </div>
  );
}
