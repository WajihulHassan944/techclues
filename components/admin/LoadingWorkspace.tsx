"use client";

import { useEffect, useState } from "react";
import { IconArrowLeft, IconCheck } from "./icons";

type StepState = "done" | "active" | "pending";
const STEPS = ["Authenticating session", "Loading dashboard data", "Preparing your tools"];
/** `active` = index of the step currently spinning (1-based); login already happened, so step 0
 * ("Authenticating session") starts done. Once `active` exceeds STEPS.length, every step is done. */
const SCHEDULE: [number, number][] = [
  [2, 900],
  [3, 1700],
];

/** Shown after a successful admin login, before routing into the panel. */
export default function LoadingWorkspace({ onDone }: { onDone: () => void }) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      onDone();
      return;
    }
    const timers = SCHEDULE.map(([step, delay]) => setTimeout(() => setActive(step), delay));
    const done = setTimeout(onDone, 2200);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const progress = Math.min(100, (active / STEPS.length) * 100);

  return (
    <div className="adm-login" role="status" aria-live="polite">
      <div className="adm-load-card adm-fadein">
        <img src="/images/techclues-logo.png" alt="TechClues" width={235} height={34} />
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
            const state: StepState = active > STEPS.length || i < active - 1 ? "done" : i === active - 1 ? "active" : "pending";
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
