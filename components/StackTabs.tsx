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
function geometry(wide: boolean, persp: HTMLElement) {
  const r = persp.getBoundingClientRect();
  if (!wide) {
    const spread = 78;
    const L = 4 * spread + 240;
    return {
      rootScale: 0.86,
      idleStep: spread,
      spread,
      lift: { x: -L * SIN42, y: L * COS42, z: 150 + 2.5 * spread, scale: Math.min(1.46323, Math.max(1, r.width / 328.05)) },
    };
  }
  const spread = 0.17 * r.height;
  const L = 4 * spread + 240;
  const h = r.height;
  const quad = 1.04399 + 0.00123536 * (h - 504) - 1.5382e-6 * (h - 504) * (h - 560);
  return {
    rootScale: 0.78,
    idleStep: 16,
    spread,
    lift: { x: -L * SIN42, y: L * COS42, z: 150 + 2.5 * spread, scale: Math.max(1, quad) },
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

    const cleanups0: Array<() => void> = [];
    let active: number | null = null;
    let hovered: number | null = null;
    let hoverFromLayer = false;
    const HOVER_CARD_OFF = ["border-white/70", "bg-white/75", "shadow-[0_20px_40px_-24px_rgba(14,15,49,0.35)]"];
    const HOVER_CARD_ON = ["border-brand/60", "bg-white", "shadow-[0_0_0_1px_rgba(0,100,255,0.25),0_30px_60px_-20px_rgba(0,100,255,0.45)]"];

    const apply = (next: number | null) => {
      active = next;
      const on = next !== null;
      setOverlay(on);
      const wide = window.matchMedia("(min-width: 640px)").matches;
      const g = geometry(wide, persp);
      // Hovering a tab (pointer devices, wide layout, nothing lifted) previews its layer.
      const hov = !on && wide && hovered !== null ? hovered : null;
      const spreadMode = (on && wide) || hov !== null;
      const peek = hov !== null && !on && !hoverFromLayer ? 0.526 : 1;

      zTargets.forEach((el) => el?.classList.toggle("z-[95]", on));
      persp.setAttribute("aria-hidden", on ? "false" : "true");
      const scaled = wide ? on || hov !== null : true;
      root.style.transform = `translateX(-50%) translateY(-50%)${scaled ? ` scale(${hov !== null && !on && !hoverFromLayer ? g.rootScale + 0.027 : g.rootScale})` : ""} rotateX(58deg) rotateZ(-42deg)`;

      wrappers.forEach((w, d) => {
        const inner = w.firstElementChild as HTMLElement;
        const group = inner.firstElementChild as HTMLElement;
        const card = group.children[1] as HTMLElement;
        const content = card.children[1] as HTMLElement;
        const close = content.querySelector<HTMLElement>('button[aria-label="Close"]');
        const isTarget = on && d === layerForTab(next!);

        w.classList.toggle("cursor-pointer", !on);
        inner.style.transition = "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)";
        if (isTarget)
          inner.style.transform = `translateX(${g.lift.x}px) translateY(${g.lift.y}px) translateZ(${g.lift.z}px) scale(${g.lift.scale}) rotate(42deg) rotateX(-58deg)`;
        else if (spreadMode)
          inner.style.transform = `${hov !== null && d === layerForTab(hov) ? (hoverFromLayer ? "translateX(-55px) " : "translateX(-22px) ") : ""}translateZ(${(d - 2.5) * g.spread * peek}px)`;
        else inner.style.transform = `translateZ(${(d - 2.5) * g.idleStep}px)`;

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

    resetRef.current = () => apply(null);
    apply(null);
    // Entrance: the layers start stacked flat and fan out to their resting spacing, one after another.
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const idleFor = (d: number) => `translateZ(${(d - 2.5) * geometry(window.matchMedia("(min-width: 640px)").matches, persp).idleStep}px)`;
      wrappers.forEach((w) => {
        const inner = w.firstElementChild as HTMLElement;
        inner.style.transition = "none";
        inner.style.transform = "translateZ(0px)";
        w.style.opacity = "0";
      });
      const io = new IntersectionObserver(([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        wrappers.forEach((w, d) => {
          const inner = w.firstElementChild as HTMLElement;
          w.style.transition = `opacity 700ms ease ${d * 90}ms`;
          inner.style.transition = `transform 1100ms cubic-bezier(0.16, 1, 0.3, 1) ${d * 90}ms`;
          requestAnimationFrame(() => {
            w.style.opacity = "1";
            if (active === null) inner.style.transform = idleFor(d);
          });
        });
      }, { threshold: 0.35 });
      io.observe(persp);
      cleanups0.push(() => io.disconnect());
    }
    const onResize = () => apply(active);
    window.addEventListener("resize", onResize);
    const cleanups: Array<() => void> = [() => window.removeEventListener("resize", onResize), ...cleanups0];
    buttons.forEach((b, i) => {
      const h = () => apply(active === i ? null : i);
      b.addEventListener("click", h);
      const enter = () => {
        if (!window.matchMedia("(hover: hover)").matches) return;
        hovered = i;
        hoverFromLayer = false;
        apply(active);
      };
      const leave = () => {
        hovered = null;
        apply(active);
      };
      b.addEventListener("mouseenter", enter);
      b.addEventListener("mouseleave", leave);
      cleanups.push(() => {
        b.removeEventListener("click", h);
        b.removeEventListener("mouseenter", enter);
        b.removeEventListener("mouseleave", leave);
      });
    });
    wrappers.forEach((w, d) => {
      const h = () => {
        if (active === null) apply(wrappers.length - 1 - d);
      };
      w.addEventListener("click", h);
      // Hovering a layer directly spreads the stack and pulls that layer out, like hovering its tab.
      let leaveTimer: ReturnType<typeof setTimeout> | undefined;
      const enterLayer = () => {
        clearTimeout(leaveTimer);
        if (active !== null || !window.matchMedia("(hover: hover)").matches || !window.matchMedia("(min-width: 640px)").matches) return;
        hovered = wrappers.length - 1 - d;
        hoverFromLayer = true;
        apply(active);
      };
      const leaveLayer = () => {
        if (!hoverFromLayer) return;
        clearTimeout(leaveTimer);
        leaveTimer = setTimeout(() => {
          hovered = null;
          hoverFromLayer = false;
          apply(active);
        }, 90);
      };
      w.addEventListener("pointerenter", enterLayer);
      w.addEventListener("pointerleave", leaveLayer);
      cleanups.push(() => {
        w.removeEventListener("click", h);
        w.removeEventListener("pointerenter", enterLayer);
        w.removeEventListener("pointerleave", leaveLayer);
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
