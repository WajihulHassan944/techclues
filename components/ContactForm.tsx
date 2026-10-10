"use client";

import { useState, type ComponentProps } from "react";

const NEEDS = ["MVP", "Web or mobile app", "UI/UX design", "Low-code", "Branding", "Marketing", "Other"];
const BUDGETS = ["Under £6k", "£6k–£15k", "£15k–£40k", "£40k+", "Not sure yet"];

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const Tick = ({ className }: { className: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-check ${className}`} aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function Step({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <fieldset>
      <legend className="flex items-baseline gap-3">
        <span className="text-[13px] tabular-nums text-brand">{n}</span>
        <span className="text-[clamp(1.25rem,1.8vw,1.5rem)] tracking-[-0.025em] text-ink">{title}</span>
      </legend>
      <div className="mt-6">{children}</div>
    </fieldset>
  );
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn("inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-[14px] transition-all duration-300", on ? "border-brand bg-brand text-white" : "border-ink/15 text-ink hover:border-ink")}
    >
      {on && <Tick className="size-3.5" />}
      {children}
    </button>
  );
}

function Field({ label, optional, ...rest }: { label: string; optional?: boolean } & ComponentProps<"input">) {
  return (
    <label className="group block">
      <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">
        {label}
        {optional && <span className="text-ink/30"> · optional</span>}
      </span>
      <input
        {...rest}
        className="mt-2 h-11 w-full border-b border-ink/15 bg-transparent text-[18px] text-ink transition-colors focus:border-brand focus:outline-none focus-visible:outline-none"
      />
    </label>
  );
}

/**
 * Enquiry form. Layout and chip behaviour match the original; submitting is intentionally not
 * wired to anything yet (it checks the required fields and then does nothing).
 */
export default function ContactForm() {
  const [needs, setNeeds] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const toggle = (n: string) => setNeeds((a) => (a.includes(n) ? a.filter((x) => x !== n) : [...a, n]));

  return (
    <form data-form="contact" data-clarity-mask="True" onSubmit={(e) => e.preventDefault()} className="space-y-12">
      <Step n="01" title="What can we help with?">
        <div className="flex flex-wrap gap-2">
          {NEEDS.map((n) => (
            <Chip key={n} on={needs.includes(n)} onClick={() => toggle(n)}>
              {n}
            </Chip>
          ))}
        </div>
        {needs.includes("Other") && (
          <div className="mt-6 max-w-[520px]">
            <Field label="What else do you need?" name="other" optional autoFocus />
          </div>
        )}
      </Step>
      <Step n="02" title="About you">
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <Field label="Name" name="name" required autoComplete="name" />
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          <div className="sm:col-span-2">
            <Field label="Company" name="company" optional autoComplete="organization" />
          </div>
        </div>
      </Step>
      <Step n="03" title="Your project">
        <p className="mb-3 text-[13px] text-muted">Budget</p>
        <div className="flex flex-wrap gap-2">
          {BUDGETS.map((b) => (
            <Chip key={b} on={budget === b} onClick={() => setBudget(budget === b ? "" : b)}>
              {b}
            </Chip>
          ))}
        </div>
        <label className="group mt-8 block">
          <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">Tell us about your idea</span>
          <textarea
            name="message"
            required
            rows={4}
            placeholder="What are you building, and who is it for?"
            className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent pb-3 text-[18px] leading-relaxed text-ink transition-colors placeholder:text-ink/25 focus:border-brand focus:outline-none focus-visible:outline-none"
          />
        </label>
      </Step>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
          <input type="checkbox" name="consent" required className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded-[5px] border border-ink/25 accent-brand" />
          <span>
            I agree to the{" "}
            <a className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-brand" href="/terms-conditions">
              terms &amp; conditions
            </a>{" "}
            and{" "}
            <a className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-brand" href="/privacy-policy">
              privacy policy
            </a>
            , and to Vebryx contacting me about this enquiry.
          </span>
        </label>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button type="submit" className="group inline-flex h-14 items-center gap-2 rounded-full bg-brand pl-7 pr-6 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-ink disabled:opacity-60">
            Send enquiry
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </button>
          <p className="text-[14px] text-muted">We reply within a few hours.</p>
        </div>
      </div>
    </form>
  );
}
