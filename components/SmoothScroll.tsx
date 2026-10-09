"use client";

import { useEffect } from "react";

/**
 * Inertial smooth scrolling for mouse and trackpad users (fine pointers only), with the same
 * settings as the original. Scrollable panels opt out with the `data-lenis-prevent` attribute.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    let lenis: { destroy: () => void } | null = null;
    let cancelled = false;
    import("lenis").then(({ default: Lenis }) => {
      if (cancelled) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
        wheelMultiplier: 1,
        anchors: { offset: -96 },
        stopInertiaOnNavigate: true,
      });
    });
    return () => {
      cancelled = true;
      lenis?.destroy();
    };
  }, []);

  return null;
}
