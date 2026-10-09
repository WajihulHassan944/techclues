"use client";

import { useEffect, useRef, useState } from "react";

const SPREAD = 85.68;
const LIFT = { x: -389.997, y: 433.136, z: 364.2 };
const BASE_SIZE = 352;

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
      const unit = root.offsetWidth ? root.offsetWidth / BASE_SIZE : 1;

      zTargets.forEach((el) => el?.classList.toggle("z-[95]", on));
      persp.setAttribute("aria-hidden", on ? "false" : "true");
      root.style.transform = `translateX(-50%) translateY(-50%)${on ? " scale(0.78)" : ""} rotateX(58deg) rotateZ(-42deg)`;

      wrappers.forEach((w, d) => {
        const inner = w.firstElementChild as HTMLElement;
        const group = inner.firstElementChild as HTMLElement;
        const card = group.children[1] as HTMLElement;
        const content = card.children[1] as HTMLElement;
        const close = content.querySelector<HTMLElement>('button[aria-label="Close"]');
        const isTarget = on && d === layerForTab(next!);

        w.classList.toggle("cursor-pointer", !on);
        inner.style.transition = "transform 700ms cubic-bezier(0.16, 1, 0.3, 1)";
        if (!on) inner.style.transform = `translateZ(${(d - 2.5) * 16}px)`;
        else if (isTarget)
          inner.style.transform = `translateX(${LIFT.x * unit}px) translateY(${LIFT.y * unit}px) translateZ(${LIFT.z * unit}px) scale(1.04399) rotate(42deg) rotateX(-58deg)`;
        else inner.style.transform = `translateZ(${(d - 2.5) * SPREAD * unit}px)`;

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
    const cleanups: Array<() => void> = [];
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
      onClick={() => resetRef.current()}
      className="stack-overlay fixed inset-0 z-[90] cursor-default overscroll-contain bg-ink/35 backdrop-blur-[6px]"
    />
  );
}
