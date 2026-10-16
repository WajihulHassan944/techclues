"use client";

import { useEffect, useRef, useState } from "react";

const SIN42 = Math.sin((42 * Math.PI) / 180);
const COS42 = Math.cos((42 * Math.PI) / 180);

/**
 * Geometry of the stack, fitted to the original across viewport sizes.
 *  - From 640px up: layers collapse when idle; when a layer is lifted the others spread by
 *    0.17 x the container height and the lifted card's scale grows with that height.
 *  - Below 640px: the stack is always spread (78px steps, scaled to 0.86) and only the
 *    lifted card moves; its scale follows the container width.
 */
function geometry(wide: boolean, persp: HTMLElement, rotZ: number) {
  const r = persp.getBoundingClientRect();
  const n = (rotZ * Math.PI) / 180;
  if (!wide) {
    const spread = 78;
    const L = 4 * spread + 240;
    return {
      rootScale: 0.86,
      spreadStep: spread,
      idleStep: 11,
      lift: { x: L * Math.sin(n), y: L * Math.cos(n), z: 150 + 2.5 * spread, scale: Math.min(1.46323, Math.max(1, r.width / 328.05)) },
    };
  }
  const spread = Math.min(104, Math.max(56, 0.17 * r.height));
  const L = 4 * spread + 240;
  const h = r.height;
  const quad = 1.04399 + 0.00123536 * (h - 504) - 1.5382e-6 * (h - 504) * (h - 560);
  return {
    rootScale: 0.78,
    spreadStep: spread,
    idleStep: 16,
    lift: { x: L * Math.sin(n), y: L * Math.cos(n), z: 150 + 2.5 * spread, scale: Math.max(1, quad) },
  };
}

/**
 * Makes the tech stack section interactive. Picking a tab (or a layer) lifts that
 * layer out of the 3D stack and spreads the others apart; the close button, Escape
 * or clicking the active tab again puts it back. Works on the server-rendered markup.
 */
export default function StackTabs() {
  const [overlay, setOverlay] = useState(false);
  const resetRef = useRef<() => void>(() => {});

  useEffect(() => {
    const sec = document.querySelector<HTMLElement>('[aria-label="Our tech stack"]');
    if (!sec) return;
    const persp = sec.querySelector<HTMLElement>('[style*="perspective"]');
    const root = persp?.firstElementChild as HTMLElement | null;
    const buttons = Array.from(sec.querySelectorAll<HTMLButtonElement>("ol button"));
    if (!persp || !root || !buttons.length) return;

    const wrappers = Array.from(root.children).filter((c) => c.classList.contains("inset-0")) as HTMLElement[];
    const zTargets = [sec.querySelector<HTMLElement>("p.relative"), sec.querySelector<HTMLElement>("h2"), sec.querySelector<HTMLElement>("ol"), persp];

    const tabClasses = buttons.map((b) => {
      const [num, text] = [b.children[0] as HTMLElement, b.children[1] as HTMLElement];
      return { num, label: text.children[0] as HTMLElement, desc: text.children[1] as HTMLElement, idle: [num.className, (text.children[0] as HTMLElement).className, (text.children[1] as HTMLElement).className] };
    });
    const names = buttons.map((b) => (b.children[1].children[0] as HTMLElement).textContent ?? "");
    const layerForTab = (i: number) => wrappers.length - 1 - i;

    const cleanups: Array<() => void> = [];
    let active: number | null = null;
    let hovered: number | null = null; // layer picked by hovering a tab or a layer
    let fan = false; // pointer is over the list or the stack
    let inView = false;
    let tiltTarget = -42; // root rotateZ follows the pointer across the stack, like the original
    let tilt = -42;
    let frozenZ = -42;
    let scale = 1;
    let raf = 0;
    let last = 0;
    const HOVER_CARD_OFF = ["border-white/70", "bg-white/75", "shadow-[0_20px_40px_-24px_rgba(14,15,49,0.35)]"];
    const HOVER_CARD_ON = ["border-brand/60", "bg-white", "shadow-[0_0_0_1px_rgba(0,100,255,0.25),0_30px_60px_-20px_rgba(0,100,255,0.45)]"];
    const isWide = () => window.matchMedia("(min-width: 640px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const open = () => active !== null;
    // Fan the stack apart when the pointer is on it (small screens: whenever it is in view).
    const fanned = () => open() || (isWide() ? fan : fan || inView);
    const scaleTarget = () => (fanned() ? geometry(isWide(), persp, tilt).rootScale : 1);

    const paint = () => {
      root.style.transition = "none";
      root.style.transform = `translateX(-50%) translateY(-50%)${scale !== 1 ? ` scale(${+scale.toFixed(4)})` : ""} rotateX(58deg) rotateZ(${+(open() ? frozenZ : tilt).toFixed(3)}deg)`;
    };
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - (last || now)) / 1000);
      last = now;
      const k = reduced ? 1 : 1 - Math.exp(-dt * 7);
      const st = scaleTarget();
      scale += (st - scale) * k;
      if (!open()) tilt += (tiltTarget - tilt) * (reduced ? 1 : 1 - Math.exp(-dt * 6));
      paint();
      if (Math.abs(st - scale) > 0.0004 || (!open() && Math.abs(tiltTarget - tilt) > 0.01)) raf = requestAnimationFrame(tick);
      else {
        scale = st;
        if (!open()) tilt = tiltTarget;
        raf = 0;
        last = 0;
        paint();
      }
    };
    const animate = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const apply = (next: number | null) => {
      active = next;
      const on = next !== null;
      setOverlay(on);
      const wide = isWide();
      if (on) frozenZ = tilt;
      const g = geometry(wide, persp, on ? frozenZ : tilt);
      const hov = !on ? hovered : null;
      const spreadMode = fanned();

      zTargets.forEach((el) => el?.classList.toggle("z-[95]", on));
      persp.setAttribute("aria-hidden", on ? "false" : "true");
      animate();

      wrappers.forEach((w, d) => {
        const inner = w.firstElementChild as HTMLElement;
        const group = inner.firstElementChild as HTMLElement;
        const card = group.children[1] as HTMLElement;
        const content = card.children[1] as HTMLElement;
        const close = content.querySelector<HTMLElement>('button[aria-label="Close"]');
        const isTarget = on && d === layerForTab(next!);

        w.classList.toggle("cursor-pointer", !on);
        inner.style.transition = "transform 700ms cubic-bezier(0.22, 1, 0.36, 1)";
        if (isTarget)
          inner.style.transform = `translateX(${g.lift.x}px) translateY(${g.lift.y}px) translateZ(${g.lift.z}px) scale(${g.lift.scale}) rotate(${-frozenZ}deg) rotateX(-58deg)`;
        else {
          const step = spreadMode ? g.spreadStep : g.idleStep;
          const slide = hov !== null && d === layerForTab(hov) ? (wide ? "translateX(-56px) " : "translateX(-20px) ") : "";
          inner.style.transform = `${slide}translateZ(${(d - 2.5) * step}px)`;
        }

        const highlighted = hov !== null && d === layerForTab(hov);
        card.classList.remove(...(highlighted ? HOVER_CARD_OFF : HOVER_CARD_ON));
        card.classList.add(...(highlighted ? HOVER_CARD_ON : HOVER_CARD_OFF));

        card.classList.toggle("opacity-55", on && !isTarget);
        content.classList.toggle("pointer-events-none", !isTarget);
        content.classList.toggle("pointer-events-auto", isTarget);
        if (isTarget) {
          content.setAttribute("role", "dialog");
          content.setAttribute("aria-modal", "true");
          content.setAttribute("aria-label", `${names[next!]} tools`);
        } else {
          content.removeAttribute("role");
          content.removeAttribute("aria-modal");
          content.removeAttribute("aria-label");
        }
        if (close) close.style.opacity = isTarget ? "1" : "0";
      });

      tabClasses.forEach((t, i) => {
        const isActive = (on && i === next) || hov === i;
        t.num.className = isActive ? t.idle[0].replace("text-muted", "text-brand") : t.idle[0];
        t.label.className = isActive ? t.idle[1].replace("text-ink/45 group-hover:text-ink/75", "text-ink") : t.idle[1];
        t.desc.className = isActive ? t.idle[2].replace("text-muted/70", "text-ink-soft") : t.idle[2];
      });
    };

    resetRef.current = () => {
      fan = false;
      hovered = null;
      apply(null);
    };
    const io = new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      apply(active);
    }, { threshold: 0.4 });
    io.observe(persp);
    cleanups.push(() => {
      io.disconnect();
      cancelAnimationFrame(raf);
    });
    apply(null);
    paint();

    const onResize = () => apply(active);
    window.addEventListener("resize", onResize);
    cleanups.push(() => window.removeEventListener("resize", onResize));

    // Same wiring as the original: a tab or a layer picks that layer; leaving the list or the stack puts it all back.
    const pick = (i: number) => {
      if (open()) return;
      fan = true;
      hovered = i;
      apply(active);
    };
    const unpick = () => {
      if (open()) return;
      fan = false;
      hovered = null;
      tiltTarget = -42;
      apply(active);
    };
    const olEl = sec.querySelector<HTMLElement>("ol");
    olEl?.addEventListener("mouseleave", unpick);
    cleanups.push(() => olEl?.removeEventListener("mouseleave", unpick));
    buttons.forEach((b, i) => {
      const h = () => apply(active === i ? null : i);
      const enter = () => pick(i);
      b.addEventListener("click", h);
      b.addEventListener("mouseenter", enter);
      b.addEventListener("focus", enter);
      b.addEventListener("blur", unpick);
      cleanups.push(() => {
        b.removeEventListener("click", h);
        b.removeEventListener("mouseenter", enter);
        b.removeEventListener("focus", enter);
        b.removeEventListener("blur", unpick);
      });
    });
    const pEnter = (e: PointerEvent) => {
      if (e.pointerType === "mouse" && !open()) {
        fan = true;
        apply(active);
      }
    };
    const pMove = (e: PointerEvent) => {
      if (open()) return;
      const r = persp.getBoundingClientRect();
      tiltTarget = -42 + ((e.clientX - r.left) / r.width - 0.5) * 12;
      animate();
    };
    const pLeave = (e: PointerEvent) => {
      if (open()) return;
      tiltTarget = -42;
      if (e.pointerType === "mouse") unpick();
      else animate();
    };
    persp.addEventListener("pointerenter", pEnter);
    persp.addEventListener("pointermove", pMove);
    persp.addEventListener("pointerleave", pLeave);
    cleanups.push(() => {
      persp.removeEventListener("pointerenter", pEnter);
      persp.removeEventListener("pointermove", pMove);
      persp.removeEventListener("pointerleave", pLeave);
    });
    wrappers.forEach((w, d) => {
      const idx = wrappers.length - 1 - d;
      const h = () => (open() ? apply(null) : apply(idx));
      const enter = () => pick(idx);
      w.addEventListener("click", h);
      w.addEventListener("mouseenter", enter);
      cleanups.push(() => {
        w.removeEventListener("click", h);
        w.removeEventListener("mouseenter", enter);
      });
      const close = w.querySelector('button[aria-label="Close"]');
      if (close) {
        const c = (e: Event) => {
          e.stopPropagation();
          apply(null);
        };
        close.addEventListener("click", c);
        cleanups.push(() => close.removeEventListener("click", c));
      }
    });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && active !== null && apply(null);
    document.addEventListener("keydown", onKey);
    cleanups.push(() => document.removeEventListener("keydown", onKey));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // Dims and blurs the rest of the page while a layer is lifted; clicking it puts the layer back.
  if (!overlay) return null;
  return (
    <button
      aria-label="Close"
      data-lenis-prevent="true"
      onClick={() => resetRef.current()}
      className="stack-overlay fixed inset-0 z-[90] cursor-default overscroll-contain bg-ink/35 backdrop-blur-[6px]"
    />
  );
}
