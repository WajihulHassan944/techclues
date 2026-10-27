"use client";

import { useEffect, useState } from "react";
import { IconArrowLeft, IconCheck } from "./icons";

type StepState = "done" | "active" | "pending";
const STEPS = ["Authenticating session", "Loading dashboard data", "Preparing your tools"];
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type Props = {
  /** The actual login call. Step 0 stays "active" for as long as this takes — no fixed timer
   * pretends it's instant, so slow or cold-started logins are shown honestly. */
  run: () => Promise<void>;
  onDone: () => void;
  onError: (message: string) => void;
};

/** Shown for the whole login attempt — replaces the sign-in button's busy state — then carries
 * through into the panel so there's no gap between "signed in" and a ready dashboard. */
export default function LoadingWorkspace({ run, onDone, onError }: Props) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await run();
      } catch (err) {
        if (!cancelled) onError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
        return;
      }
      if (cancelled) return;
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
        onDone();
        return;
      }
      for (const [step, delay] of [[1, 700], [2, 700], [3, 400]] as const) {
        setActive(step);
        await sleep(delay);
        if (cancelled) return;
      }
      onDone();
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, (active / STEPS.length) * 100);

  return (
    <div className="adm-login" role="status" aria-live="polite">
      <div className="adm-load-card adm-fadein">
        <img src="/images/techclues-logo.png" alt="TechClues" width={200} height={125} />
        <div className="adm-load-ring" aria-hidden="true">
          <span className="adm-load-dot adm-load-dot-l" />
          <span className="adm-load-ring-outer" />
          <span className="adm-load-ring-inner" />
          <span className="adm-load-dot adm-load-dot-r" />
        </div>
        <h1>Preparing your workspace</h1>
        <p className="adm-load-sub">Securely loading your dashboard…</p>
        <div className="adm-load-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="adm-load-kicker">
          <span className="adm-load-kicker-dot" /> Initializing admin console
        </p>
        <ul className="adm-load-steps">
          {STEPS.map((label, i) => {
            const state: StepState = i < active ? "done" : i === active ? "active" : "pending";
            return (
              <li key={label} className={`adm-load-step adm-load-step-${state}`}>
                <span className="adm-load-step-icon">{state === "active" ? <span className="adm-spin" /> : <IconCheck />}</span>
                {label}
              </li>
            );
          })}
        </ul>
        <p className="adm-load-note">This will only take a moment</p>
        <a className="adm-load-back" href="/">
          <IconArrowLeft /> Back to website
        </a>
      </div>
    </div>
  );
}
