"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { calculatorIcons } from "@/lib/calculator-icons";
import { estimate, gbp, labelOfPricing, DEFAULT_CALCULATOR_PRICING, type Answers, type CalculatorPricing, type Option } from "@/lib/calculator";
import { api, ApiError } from "@/lib/api/client";

const STEPS = ["Details", "Goal", "Platform", "Features", "Timeline", "Estimate"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Details = { name: string; email: string; phone: string; company: string };
const EMPTY: Details = { name: "", email: "", phone: "", company: "" };
const DEFAULTS: Answers = { goal: "mvp", platform: "web", features: [], pace: "standard" };

/** Eases a displayed number toward its target whenever the target changes (first value shows immediately). */
function useTween(target: number | null, ms = 800) {
  const [shown, setShown] = useState<number | null>(target);
  const from = useRef<number | null>(target);
  useEffect(() => {
    if (target === null) {
      from.current = null;
      setShown(null);
      return;
    }
    const start = from.current ?? target;
    if (start === target) {
      setShown(target);
      from.current = target;
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      from.current = target;
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(start + (target - start) * eased);
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return shown ?? target;
}

function Icon({ name, className, stroke = 1.7 }: { name: string; className: string; stroke?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true" dangerouslySetInnerHTML={{ __html: calculatorIcons[name] ?? "" }} />
  );
}

const Arrow = ({ cls }: { cls: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const Back = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
    <path d="m12 19-7-7 7-7" />
    <path d="M19 12H5" />
  </svg>
);
const Check = ({ cls, w = 3 }: { cls: string; w?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const OPTION_BASE =
  "relative flex rounded-2xl border text-left transition-[border-color,background-color,box-shadow,translate] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-0.5";
const ON = "border-brand bg-brand/[0.04] shadow-[0_16px_32px_-20px_rgba(0,100,255,0.6)]";
const OFF = "border-ink/[0.08] hover:border-brand/30";
const TICK = "absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-brand text-white";

function OptionGrid({ kind, options, value, onPick }: { kind: string; options: Option[]; value: string; onPick: (id: string) => void }) {
  return (
    <div className="mt-8">
      <div className="grid gap-3 sm:grid-cols-3">
        {options.map((o) => {
          const on = value === o.id;
          return (
            <button key={o.id} aria-pressed={on} onClick={() => onPick(o.id)} className={`${OPTION_BASE} w-full items-center gap-4 p-5 sm:flex-col sm:items-start sm:p-6 ${on ? ON : OFF}`}>
              <span className={`grid size-12 shrink-0 place-items-center rounded-xl transition-colors duration-500 ${on ? "bg-brand text-white" : "bg-paper text-ink"}`}>
                <Icon name={`${kind}:${o.id}`} className="size-5" />
              </span>
              <span className="sm:mt-6">
                <span className="block text-[17px] tracking-[-0.01em] text-ink">{o.name}</span>
                <span className="mt-1 block text-[14px] text-muted">{o.text}</span>
              </span>
              <span className={TICK} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "scale(0.4)", transition: "opacity .3s, transform .3s" }}>
                <Check cls="size-3" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** The six-step cost calculator: details, goal, platform, features, timeline and the estimate.
 *  `pricing` comes from the admin-editable model (see lib/api/pricing.ts); omit it to use the
 *  frontend's own hardcoded defaults. */
const DEFAULT_BUILD_ONE = { amount: 499, durationLabel: "7 days" };

export default function CalculatorWizard({
  pricing = DEFAULT_CALCULATOR_PRICING,
  buildOne = DEFAULT_BUILD_ONE,
}: {
  pricing?: CalculatorPricing;
  buildOne?: { amount: number; durationLabel: string };
}) {
  const { goals, platforms, features, paces } = pricing;
  const labelOf = labelOfPricing(pricing);
  const [step, setStep] = useState(0);
  const [details, setDetails] = useState<Details>(EMPTY);
  const [unlocked, setUnlocked] = useState(false);
  const [a, setA] = useState<Answers>(DEFAULTS);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [submitError, setSubmitError] = useState("");

  const validDetails = details.name.trim().length > 0 && EMAIL.test(details.email.trim());
  const hasFeatures = a.features.length > 0;
  const result = unlocked && hasFeatures ? estimate(a, pricing) : null;
  const enabled = (i: number) => i === 0 || (i <= 3 ? unlocked : unlocked && hasFeatures);
  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((p) => ({ ...p, [k]: v }));
  const toggleFeature = (id: string) => set("features", a.features.includes(id) ? a.features.filter((x) => x !== id) : [...a.features, id]);
  const startOver = () => {
    setA(DEFAULTS);
    setStep(0);
  };
  const minShown = useTween(result ? result.minCost : null);
  const maxShown = useTween(result ? result.maxCost : null);
  const costShown = useTween(result ? result.cost : null);
  const range = result ? `${gbp(result.minCost)} – ${gbp(result.maxCost)}` : "";
  const weeks = result ? (result.minWeeks === result.maxWeeks ? `${result.minWeeks} weeks` : `${result.minWeeks}–${result.maxWeeks} weeks`) : "";

  let body: ReactNode;
  if (step === 0) {
    const input = "h-13 w-full rounded-xl border border-ink/10 bg-paper px-4 text-[15px] text-ink placeholder:text-muted/70 transition-colors duration-300 focus:border-brand focus:bg-white focus:outline-none";
    const field = (label: string, key: keyof Details, p: Record<string, string>) => (
      <label className="grid gap-1.5 text-[13px] text-muted">
        {label}
        <input className={input} value={details[key]} onChange={(e) => setDetails({ ...details, [key]: e.target.value })} {...p} />
      </label>
    );
    body = (
      <div>
        <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-tight tracking-[-0.035em] text-ink">To begin, tell us a bit about yourself.</h2>
        <p className="mt-2 text-[16px] text-ink-soft">This lets us send your estimate and get in touch if you would like a proposal.</p>
        <div className="mt-8">
          <form
            className="grid gap-3 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!validDetails) return;
              setUnlocked(true);
              setStep(1);
            }}
          >
            {field("Full name*", "name", { autoComplete: "name", placeholder: "Jane Smith" })}
            {field("Email*", "email", { type: "email", autoComplete: "email", placeholder: "jane@company.com" })}
            {field("Phone number", "phone", { type: "tel", autoComplete: "tel", placeholder: "+44" })}
            {field("Company", "company", { autoComplete: "organization", placeholder: "Not required" })}
            <div className="mt-4 flex flex-col-reverse gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-[340px] text-[12px] leading-relaxed text-muted">Your details are used only to share your estimate and respond to you. No spam.</p>
              <button type="submit" disabled={!validDetails} className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/30">
                Begin my estimate
                <Arrow cls="size-4 transition-transform duration-300 group-enabled:group-hover:translate-x-1" />
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  } else if (step === 1) {
    body = (
      <div>
        <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-tight tracking-[-0.035em] text-ink">What do you want to do?</h2>
        <p className="mt-2 text-[16px] text-ink-soft">Pick the option that best matches your situation now.</p>
        <OptionGrid kind="goal" options={goals} value={a.goal} onPick={(v) => set("goal", v)} />
      </div>
    );
  } else if (step === 2) {
    body = (
      <div>
        <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-tight tracking-[-0.035em] text-ink">Which platform are you after?</h2>
        <p className="mt-2 text-[16px] text-ink-soft">Another platform can be added at any point.</p>
        <OptionGrid kind="platform" options={platforms} value={a.platform} onPick={(v) => set("platform", v)} />
      </div>
    );
  } else if (step === 3) {
    body = (
      <div>
        <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-tight tracking-[-0.035em] text-ink">Which features do you need?</h2>
        <p className="mt-2 text-[16px] text-ink-soft">Tick everything the first version has to include.</p>
        <div className="mt-8">
          <div className="-mr-2 max-h-[46vh] overflow-y-auto overscroll-contain pr-2 sm:max-h-[420px]" data-lenis-prevent="true">
            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 sm:gap-3">
              {features.map((f) => {
                const on = a.features.includes(f.id);
                return (
                  <button key={f.id} aria-pressed={on} onClick={() => toggleFeature(f.id)} className={`${OPTION_BASE} flex-col items-start p-4 ${on ? ON : OFF}`}>
                    <span className={`grid size-10 place-items-center rounded-xl transition-colors duration-500 ${on ? "bg-brand text-white" : "bg-paper text-ink"}`}>
                      <Icon name={`feature:${f.id}`} className="size-5" />
                    </span>
                    <span className="mt-4 text-[15px] leading-tight text-ink">{f.name}</span>
                    <span className={TICK} style={{ opacity: on ? 1 : 0, transform: on ? "none" : "scale(0.4)", transition: "opacity .3s, transform .3s" }}>
                      <Check cls="size-3" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (step === 4) {
    body = (
      <div>
        <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-tight tracking-[-0.035em] text-ink">What speed suits you?</h2>
        <p className="mt-2 text-[16px] text-ink-soft">A quicker pace calls for a larger team working together.</p>
        <OptionGrid kind="pace" options={paces} value={a.pace} onPick={(v) => set("pace", v)} />
      </div>
    );
  } else if (result) {
    body = (
      <div>
        <h2 className="text-[clamp(1.6rem,2.6vw,2.3rem)] font-normal leading-tight tracking-[-0.035em] text-ink">Your estimate is in.</h2>
        <p className="mt-2 text-[16px] text-ink-soft">Here is the breakdown. Prices cover design, development and testing.</p>
        <ul className="mt-8 border-t border-ink/10">
          {a.features.map((id) => (
            <li key={id} className="flex items-center justify-between gap-4 border-b border-ink/10 py-3.5 text-[15px]">
              <span className="flex items-center gap-3 text-ink">
                <Icon name={`feature:${id}`} className="size-4 text-brand" stroke={1.8} />
                {labelOf.feature(id)}
              </span>
              <Check cls="size-4 shrink-0 text-brand" w={2} />
            </li>
          ))}
          <li className="flex items-center justify-between gap-4 py-4 text-[16px]">
            <span className="text-ink">Estimated total</span>
            <span className="font-medium tabular-nums text-ink">{gbp(result.cost)}</span>
          </li>
        </ul>
        <p className="text-[13px] text-muted">
          {labelOf.platform(a.platform)} · {labelOf.goal(a.goal)} · {labelOf.pace(a.pace)} pace
        </p>
        <div className="mt-8 rounded-2xl bg-paper p-5 sm:p-6">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[17px] tracking-[-0.01em] text-ink">Would you like a detailed proposal?</p>
              <p className="mt-1 text-[14px] text-ink-soft">
                It will go to <span className="text-ink">{details.email}</span>.{" "}
                <button onClick={() => setStep(0)} className="inline-flex items-center gap-1 text-brand hover:underline">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3" aria-hidden="true">
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                  </svg>{" "}
                  Edit
                </button>
              </p>
            </div>
            <button
              type="button"
              disabled={submitState === "sending" || submitState === "sent"}
              onClick={async () => {
                setSubmitState("sending");
                setSubmitError("");
                try {
                  await api.post(
                    "/api/public/brief",
                    {
                      name: details.name.trim(),
                      email: details.email.trim(),
                      company: details.company.trim() || undefined,
                      platform: labelOf.platform(a.platform),
                      goal: labelOf.goal(a.goal),
                      features: a.features.map((id) => labelOf.feature(id)).join(", "),
                      pace: labelOf.pace(a.pace),
                      result: {
                        title: "Estimate shown to the visitor",
                        headline: range,
                        lines: [`Timeline: ${weeks}`, `Based on ${a.features.length} feature(s), ${labelOf.platform(a.platform)}`],
                      },
                    },
                    { auth: false },
                  );
                  setSubmitState("sent");
                } catch (err) {
                  setSubmitState("error");
                  setSubmitError(err instanceof ApiError ? err.message : "That did not go through. Please try once more.");
                }
              }}
              className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand disabled:cursor-wait disabled:bg-ink/60"
            >
              {submitState === "sending" ? "Sending…" : submitState === "sent" ? "Sent, we will be in touch" : "Send my estimate"}
              {submitState !== "sent" && <Arrow cls="size-4 transition-transform duration-300 group-hover:translate-x-1" />}
            </button>
          </div>
          {submitState === "error" && (
            <p role="alert" className="mt-4 text-[13px] text-[#b42318]">
              {submitError}
            </p>
          )}
        </div>
      </div>
    );
  }

  const dd = (label: string, value: string) => (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-white/50">{label}</dt>
      <dd className="text-right text-white">{value}</dd>
    </div>
  );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1.4fr_1fr] lg:gap-8">
      <div className="rounded-[28px] border border-ink/[0.08] bg-white p-5 shadow-[0_30px_80px_-50px_rgba(14,15,49,0.35)] sm:rounded-[32px] sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] text-muted">
            Step {step + 1} of 6
          </p>
          {step > 0 && (
            <button onClick={startOver} className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>{" "}
              Begin again
            </button>
          )}
        </div>
        <ol className="mt-4 grid grid-cols-6 gap-1.5 sm:gap-2">
          {STEPS.map((label, i) => (
            <li key={label}>
              <button
                disabled={!enabled(i)}
                aria-current={i === step ? "step" : undefined}
                onClick={() => setStep(i)}
                className="group w-full text-left disabled:cursor-not-allowed"
              >
                <span className="block h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
                  <span className="block h-full rounded-full bg-[linear-gradient(90deg,#0050d6,#0064ff,#4d8dff)]" style={{ width: i <= step ? "100%" : "0%", transition: "width .6s cubic-bezier(.65,0,.35,1)" }} />
                </span>
                <span className={`mt-2 hidden text-[12px] transition-colors sm:block ${i === step ? "text-ink" : "text-muted group-enabled:group-hover:text-ink"}`}>{label}</span>
              </button>
            </li>
          ))}
        </ol>
        {step > 0 && (
          <div className="mt-6 flex items-center justify-between rounded-2xl bg-paper px-4 py-3 lg:hidden">
            <span className="text-[13px] text-muted">Estimate</span>
            <span className="text-[15px] font-medium text-ink">{result ? range : "Choose features"}</span>
          </div>
        )}
        <div className="relative mt-8 min-h-[340px] sm:mt-10">
          <div key={step} className="calc-step-in">{body}</div>
        </div>
        {step >= 1 && step <= 4 && (
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/[0.08] pt-6">
            <button onClick={() => setStep(step - 1)} className="inline-flex items-center gap-1.5 text-[15px] text-ink">
              <Back /> Back
            </button>
            <div className="flex items-center gap-4">
              <button
                disabled={step === 3 && !hasFeatures}
                onClick={() => setStep(step + 1)}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/30"
              >
                {step === 4 ? "View my estimate" : "Continue"}
                <Arrow cls="size-4 transition-transform duration-300 group-enabled:group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}
        {step === 5 && (
          <div className="mt-8 border-t border-ink/[0.08] pt-6">
            <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-[15px] text-ink">
              <Back /> Change answers
            </button>
          </div>
        )}
      </div>
      <aside className="lg:sticky lg:top-28">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-ink p-7 text-white sm:rounded-[32px] sm:p-9">
          <span className="pointer-events-none absolute -right-24 -top-32 -z-10 size-[380px] rounded-full bg-brand/45 blur-[100px]" />
          <span className="pointer-events-none absolute -bottom-40 -left-20 -z-10 size-[320px] rounded-full bg-brand-soft/15 blur-[100px]" />
          <p className="flex items-center gap-2 text-[14px] font-medium text-white/60">
            <span className="size-1.5 rounded-full bg-brand-soft" />
            Your estimate
          </p>
          <div className="mt-6 min-h-[92px]">
            {!unlocked ? (
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <p className="max-w-[260px] text-[18px] leading-snug text-white/70">Enter your details to unlock your instant estimate.</p>
              </div>
            ) : result ? (
              <>
                <p className="text-[clamp(2rem,3.4vw,3rem)] font-normal leading-none tracking-[-0.04em]">
                  <span>{gbp(minShown ?? result.minCost)}</span> <span className="text-white/40">–</span> <span>{gbp(maxShown ?? result.maxCost)}</span>
                </p>
                <p className="mt-3 text-[15px] text-white/60">
                  Around <span>{gbp(costShown ?? result.cost)}</span> · {weeks}
                </p>
              </>
            ) : (
              <p className="max-w-[260px] text-[18px] leading-snug text-white/70">Choose your features to see an instant estimate.</p>
            )}
          </div>
          <dl className="mt-8 grid gap-3 border-t border-white/10 pt-6 text-[14px]">
            {dd("Project", unlocked ? labelOf.goal(a.goal) : "—")}
            {dd("Platform", unlocked ? labelOf.platform(a.platform) : "—")}
            {dd("Features", !unlocked ? "—" : hasFeatures ? `${a.features.length} selected` : "None so far")}
            {dd("Pace", unlocked ? labelOf.pace(a.pace) : "—")}
          </dl>
          <a href="/book-a-call" className="group mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">
            Fine-tune it on a free call
            <Arrow cls="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </a>
          <p className="mt-4 text-center text-[12px] text-white/45">A planning estimate, not a quote.</p>
          <a href="/zero-one" className="group mt-5 block border-t border-white/10 pt-5 text-center text-[13.5px] leading-relaxed text-white/70 transition-colors hover:text-white">
            Not ready for a full MVP? Try out your core feature with <span className="font-medium text-white">BUILD.ONE</span> for {gbp(buildOne.amount)}
            <Arrow cls="ml-1 inline size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>
      </aside>
    </div>
  );
}
