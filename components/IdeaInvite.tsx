"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const CONSENT_KEY = "tc-cookie-consent";
const SEEN_KEY = "tc-idea-invite-seen";

/**
 * "Think your idea is brilliant?" invitation shown on the homepage, on desktop only. It waits for the
 * cookie choice (8s after load if one is saved, otherwise 4s after the visitor makes it), then offers
 * the free idea stress test. Shown once per visit; Escape or "Not now" dismisses it.
 */
export default function IdeaInvite() {
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const [idea, setIdea] = useState("");
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (path !== "/" || !matchMedia("(min-width: 1024px)").matches) return;
    // Automated browsers (our own tests) skip it unless a test explicitly asks for it.
    if (navigator.webdriver && !(window as unknown as { __forceInvite?: boolean }).__forceInvite) return;
    try {
      if (sessionStorage.getItem(SEEN_KEY)) return;
    } catch {}
    let timer: ReturnType<typeof setTimeout> | undefined;
    const show = () => {
      if (!matchMedia("(min-width: 1024px)").matches) return;
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      setShown(true);
      requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    };
    const hasConsent = () => {
      try {
        return !!localStorage.getItem(CONSENT_KEY);
      } catch {
        return true;
      }
    };
    if (hasConsent()) {
      timer = setTimeout(show, 8000);
      return () => clearTimeout(timer);
    }
    const onConsent = () => {
      if (hasConsent() && !timer) timer = setTimeout(show, 4000);
    };
    window.addEventListener("tc-consent", onConsent);
    return () => {
      window.removeEventListener("tc-consent", onConsent);
      clearTimeout(timer);
    };
  }, [path]);

  const close = () => {
    setOpen(false);
    setTimeout(() => setShown(false), 400);
  };

  useEffect(() => {
    if (!open) return;
    const f = setTimeout(() => input.current?.focus(), 450);
    const key = (e: KeyboardEvent) => e.key === "Escape" && close();
    window.addEventListener("keydown", key);
    return () => {
      clearTimeout(f);
      window.removeEventListener("keydown", key);
    };
  }, [open]);

  if (!shown) return null;
  return (
    <div className={`ii-root ${open ? "is-open" : ""}`}>
      <button type="button" aria-label="Close" className="ii-backdrop" onClick={close} />
      <div role="dialog" aria-modal="true" aria-labelledby="idea-invite-title" className="ii-card">
        <span className="ii-glow" aria-hidden="true" />
        <button type="button" aria-label="Close" className="ii-x" onClick={close}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <span className="ii-chip">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m12.5 17-.5-1-.5 1h1z" />
            <path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z" />
            <circle cx="15" cy="12" r="1" />
            <circle cx="9" cy="12" r="1" />
          </svg>
          Idea stress test, free
        </span>
        <h2 id="idea-invite-title">Sure your idea is a winner?</h2>
        <p>Spare us two minutes and we will try to knock it down. We will go after your customer, your rivals and your problem, then say plainly what you should test first.</p>
        <form
          data-form="idea_invite"
          data-clarity-mask="True"
          onSubmit={(e) => {
            e.preventDefault();
            const v = idea.trim();
            close();
            router.push(v ? `/kill-my-idea?idea=${encodeURIComponent(v.slice(0, 300))}` : "/kill-my-idea");
          }}
        >
          <input ref={input} value={idea} onChange={(e) => setIdea(e.target.value)} placeholder="Describe your idea in a sentence" aria-label="Your idea" />
          <div className="ii-actions">
            <button type="submit" className="ii-go" data-cta="idea-invite-start">
              Try and kill it
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14m-7-7 7 7-7 7" />
              </svg>
            </button>
            <button type="button" className="ii-skip" onClick={close}>
              Maybe later
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
