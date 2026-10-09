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

    let active: number | null = null;

    const apply = (next: number | null) => {
      active = next;
      const on = next !== null;
      setOverlay(on);
      const wide = window.matchMedia("(min-width: 640px)").matches;
      const g = geometry(wide, persp);

      zTargets.forEach((el) => el?.classList.toggle("z-[95]", on));
      persp.setAttribute("aria-hidden", on ? "false" : "true");
      const scaled = wide ? on : true;
      root.style.transform = `translateX(-50%) translateY(-50%)${scaled ? ` scale(${g.rootScale})` : ""} rotateX(58deg) rotateZ(-42deg)`;

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
        else if (on && wide) inner.style.transform = `translateZ(${(d - 2.5) * g.spread}px)`;
        else inner.style.transform = `translateZ(${(d - 2.5) * g.idleStep}px)`;

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
        const isActive = on && i === next;
        t.num.className = isActive ? t.idle[0].replace("text-muted", "text-brand") : t.idle[0];
        t.label.className = isActive ? t.idle[1].replace("text-ink/45 group-hover:text-ink/75", "text-ink") : t.idle[1];
        t.desc.className = isActive ? t.idle[2].replace("text-muted/70", "text-ink-soft") : t.idle[2];
      });
    };

    resetRef.current = () => apply(null);
    apply(null);
    const onResize = () => apply(active);
    window.addEventListener("resize", onResize);
    const cleanups: Array<() => void> = [() => window.removeEventListener("resize", onResize)];
    buttons.forEach((b, i) => {
      const h = () => apply(active === i ? null : i);
      b.addEventListener("click", h);
      cleanups.push(() => b.removeEventListener("click", h));
    });
    wrappers.forEach((w, d) => {
      const h = () => {
        if (active === null) apply(wrappers.length - 1 - d);
      };
      w.addEventListener("click", h);
      cleanups.push(() => w.removeEventListener("click", h));
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
