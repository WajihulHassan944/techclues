"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IconClose } from "./icons";

const FOCUSABLE = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** A modal or side drawer: closes on Escape or a click outside, keeps focus inside, and gives focus back afterwards. */
export default function Dialog({ title, onClose, variant = "modal", children, footer }: { title: string; onClose: () => void; variant?: "modal" | "drawer"; children: React.ReactNode; footer?: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;

  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current!;
    el.focus();
    document.body.style.overflow = "hidden";
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close.current();
      }
      if (e.key !== "Tab") return;
      const f = Array.from(el.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((x) => x.offsetParent !== null);
      if (!f.length) return;
      const first = f[0];
      const last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      document.body.style.overflow = "";
      prev?.focus?.();
    };
  }, []);

  // Rendered outside the page content so it sits above the top bar.
  const host = document.querySelector<HTMLElement>(".adm-root") ?? document.body;
  return createPortal(
    <div className="adm-dlg-scrim" data-variant={variant} onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className="adm-dlg" role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} data-lenis-prevent>
        <header className="adm-dlg-head">
          <h2>{title}</h2>
          <button type="button" className="adm-icon-btn adm-sm" aria-label="Close" onClick={onClose}>
            <IconClose />
          </button>
        </header>
        <div className="adm-dlg-body">{children}</div>
        {footer && <footer className="adm-dlg-foot">{footer}</footer>}
      </div>
    </div>,
    host,
  );
}
