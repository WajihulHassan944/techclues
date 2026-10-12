"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { api, ApiError } from "@/lib/api/client";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BUSINESS_TYPES = ["Limited company", "LLP", "Sole trader", "Partnership", "Charity or CIC", "Not registered yet"];
const BASED_IN = ["Scotland", "England", "Wales", "Northern Ireland", "Outside the UK"];
const SIZES = ["Just me", "2–9", "10–49", "50–249", "250+"];
const TURNOVER = ["Pre-revenue", "Under £100k", "£100k–£500k", "£500k–£2m", "£2m–£10m", "Over £10m", "Prefer not to say"];
const TRADING = ["Not trading yet", "Under 1 year", "1–3 years", "Over 3 years"];
const PROJECTS = ["Website", "Software platform", "Automation", "AI solution", "Something else"];
const BUDGETS = ["Under £10k", "£10k–£25k", "£25k–£50k", "£50k–£100k", "Over £100k", "Not sure yet"];
const MATCH = ["Yes, half or more", "Yes, some of it", "No", "Not sure"];
const START = ["As soon as possible", "In 1–3 months", "In 3–6 months", "Just exploring"];
const PUBLIC = ["None", "Yes", "Not sure"];
const STEPS = ["Your business", "Your project", "Your details"];

const REQUIRED: [string, string][][] = [
  [["legalName", "Add the company's legal name."], ["businessType", "Choose the type of business."], ["basedIn", "Choose where the business is based."], ["employees", "Choose the company size."]],
  [["project", "Choose what the project is."]],
  [["name", "Add your name."], ["email", "Check your email address."]],
];

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
const input = (bad?: string) =>
  cn(
    "h-12 w-full rounded-2xl border bg-white px-4 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:outline-none focus:ring-4",
    bad ? "border-[#b42318] focus:ring-[#b42318]/10" : "border-ink/12 hover:border-ink/25 focus:border-brand focus:ring-brand/10",
  );

function Label({ label, optional, hint, error, wide, children }: { label: string; optional?: boolean; hint?: string; error?: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={cn("block min-w-0", wide && "sm:col-span-2")}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px] font-medium text-ink">
        {label}
        {optional && <span className="text-[13px] font-normal text-muted">Optional</span>}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-[13px] text-[#b42318]">{error}</span> : hint && <span className="mt-1.5 block text-[12.5px] leading-snug text-muted">{hint}</span>}
    </label>
  );
}

function Select({ field, value, onChange, options, invalid }: { field?: string; value: string; onChange: (v: string) => void; options: string[]; invalid?: boolean }) {
  return (
    <span className="relative block">
      <select data-field={field} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={invalid} className={cn(input(invalid ? "x" : undefined), "cursor-pointer appearance-none pr-10", !value && "text-muted/80")}>
        <option value="">Choose…</option>
        {options.map((o) => (
          <option key={o} value={o} className="text-ink">
            {o}
          </option>
        ))}
      </select>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </span>
  );
}

function Chips({ label, field, options, value, onChange, error }: { label: string; field: string; options: string[]; value: string; onChange: (v: string) => void; error?: string }) {
  return (
    <fieldset className="min-w-0 sm:col-span-2">
      <legend className="mb-2 text-[14px] font-medium text-ink">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            data-field={i === 0 ? field : undefined}
            onClick={() => onChange(value === o ? "" : o)}
            aria-pressed={value === o}
            className={cn("h-10 rounded-full border px-4 text-[14px] transition-all duration-200 active:scale-[0.97]", value === o ? "border-ink bg-ink text-white" : error ? "border-[#b42318]/50 bg-white text-ink" : "border-ink/12 bg-white text-ink hover:border-ink/35")}
          >
            {o}
          </button>
        ))}
      </div>
      {error && <p className="mt-1.5 text-[13px] text-[#b42318]">{error}</p>}
    </fieldset>
  );
}

const Txt = (p: ComponentProps<"input">) => <input {...p} />;

/**
 * Grant funding enquiry, in three steps. Same fields, checks and messages as the original; the last
 * step checks the required details but sends nothing (not wired up yet).
 */
export default function GrantForm() {
  const [step, setStep] = useState(0);
  const [v, setV] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const title = useRef<HTMLParagraphElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const moved = useRef(false);

  useEffect(() => {
    if (!moved.current) return;
    title.current?.focus({ preventScroll: true });
    const r = form.current?.getBoundingClientRect();
    if (r && r.top < 80) form.current?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
  }, [step]);

  const set = (k: string, val: string) => {
    setV((o) => ({ ...o, [k]: val }));
    if (errors[k]) setErrors((o) => ({ ...o, [k]: undefined }));
  };
  const go = (n: number) => {
    moved.current = true;
    setErrors({});
    setStep(n);
  };

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Record<string, string> = {};
    for (const [k, msg] of REQUIRED[step]) {
      const val = (v[k] ?? "").trim();
      if (!(val && (k !== "email" || EMAIL.test(val)))) next[k] = msg;
    }
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      form.current?.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
      return;
    }
    if (step < STEPS.length - 1) {
      go(step + 1);
      return;
    }
    setStatus("submitting");
    setError("");
    try {
      await api.post("/api/public/grant", { ...v, website }, { auth: false });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  const val = (k: string) => v[k] ?? "";

  if (status === "success") {
    return (
      <div className="scroll-mt-28 rounded-[24px] bg-[#f6f7fb] p-8 text-center" role="status">
        <p className="text-[20px] font-medium text-ink">Thanks — we&apos;ll check your options.</p>
        <p className="mt-2 text-[15px] text-ink-soft">We reply within a few hours.</p>
      </div>
    );
  }

  return (
    <form ref={form} data-form="grant" data-clarity-mask="True" onSubmit={submit} noValidate className="scroll-mt-28 rounded-[24px] bg-[#f6f7fb] p-5 sm:p-7">
      <p className="text-[19px] font-medium tracking-[-0.01em] text-ink">Check your funding options</p>
      <p className="mt-1 text-[14px] text-muted">Free, with no obligation. Takes about two minutes.</p>
      <div className="mt-6 flex items-center justify-between text-[13px]">
        <p ref={title} tabIndex={-1} className="font-medium text-ink outline-none" aria-live="polite">
          {STEPS[step]}
        </p>
        <p className="tabular-nums text-muted">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>
      <div className="mt-2.5 grid grid-cols-3 gap-1.5" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s} className="h-1 overflow-hidden rounded-full bg-ink/[0.08]">
            <span className={cn("block h-full rounded-full bg-brand transition-[width] duration-500 ease-out", i <= step ? "w-full" : "w-0")} />
          </span>
        ))}
      </div>
      <div key={step} className="step-in mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {step === 0 && (
          <>
            <Label label="Company legal name" error={errors.legalName} wide hint="As registered at Companies House, or your trading name if you're not registered yet.">
              <Txt data-field="legalName" value={val("legalName")} onChange={(e) => set("legalName", e.target.value)} autoComplete="organization" placeholder="e.g. Acme Trading Ltd" aria-invalid={!!errors.legalName} className={input(errors.legalName)} />
            </Label>
            <Label label="Company no." optional>
              <Txt value={val("companyNumber")} onChange={(e) => set("companyNumber", e.target.value.toUpperCase())} placeholder="e.g. SC123456" maxLength={10} className={input()} />
            </Label>
            <Label label="Type of business" error={errors.businessType}>
              <Select field="businessType" value={val("businessType")} onChange={(x) => set("businessType", x)} options={BUSINESS_TYPES} invalid={!!errors.businessType} />
            </Label>
            <Chips label="Where is the business based?" field="basedIn" options={BASED_IN} value={val("basedIn")} onChange={(x) => set("basedIn", x)} error={errors.basedIn} />
            <Chips label="Company size (employees)" field="employees" options={SIZES} value={val("employees")} onChange={(x) => set("employees", x)} error={errors.employees} />
            <Label label="Annual turnover" optional>
              <Select value={val("turnover")} onChange={(x) => set("turnover", x)} options={TURNOVER} />
            </Label>
            <Label label="Trading for" optional>
              <Select value={val("trading")} onChange={(x) => set("trading", x)} options={TRADING} />
            </Label>
          </>
        )}
        {step === 1 && (
          <>
            <Chips label="What's the project?" field="project" options={PROJECTS} value={val("project")} onChange={(x) => set("project", x)} error={errors.project} />
            <Label label="Estimated budget" optional>
              <Select value={val("budget")} onChange={(x) => set("budget", x)} options={BUDGETS} />
            </Label>
            <Label label="When to start" optional>
              <Select value={val("start")} onChange={(x) => set("start", x)} options={START} />
            </Label>
            <Label label="Match funding" optional hint="Could you pay part of the cost? Most grants cover only some of it.">
              <Select value={val("match")} onChange={(x) => set("match", x)} options={MATCH} />
            </Label>
            <Label label="Public funding" optional hint="Any grants or loans from public bodies in the last 3 years. Schemes cap how much one business can get.">
              <Select value={val("publicFunding")} onChange={(x) => set("publicFunding", x)} options={PUBLIC} />
            </Label>
            <Label label="About the project" optional wide hint="What it will do, and what it will change for the business: time saved, new customers, jobs created.">
              <textarea
                value={val("about")}
                onChange={(e) => set("about", e.target.value)}
                rows={3}
                maxLength={1500}
                placeholder="e.g. An online booking system so we can take bookings around the clock and hire two more staff."
                className="w-full resize-y rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[15px] leading-relaxed text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 hover:border-ink/25 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10"
              />
            </Label>
          </>
        )}
        {step === 2 && (
          <>
            <Label label="Your name" error={errors.name}>
              <Txt data-field="name" value={val("name")} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className={input(errors.name)} />
            </Label>
            <Label label="Your role" optional>
              <Txt value={val("role")} onChange={(e) => set("role", e.target.value)} autoComplete="organization-title" placeholder="e.g. Director" className={input()} />
            </Label>
            <Label label="Email" error={errors.email}>
              <Txt data-field="email" value={val("email")} onChange={(e) => set("email", e.target.value)} type="email" inputMode="email" autoComplete="email" aria-invalid={!!errors.email} className={input(errors.email)} />
            </Label>
            <Label label="Phone" optional>
              <Txt value={val("phone")} onChange={(e) => set("phone", e.target.value)} type="tel" inputMode="tel" autoComplete="tel" className={input()} />
            </Label>
          </>
        )}
      </div>
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-px w-px opacity-0"
      />
      {status === "error" && (
        <p role="alert" className="mt-4 rounded-xl bg-[#fdecec] px-4 py-3 text-[14px] text-[#b42318]">
          {error}
        </p>
      )}
      <div className="mt-7 flex items-center gap-3">
        {step > 0 && (
          <button type="button" onClick={() => go(step - 1)} className="group inline-flex h-13 shrink-0 items-center gap-1.5 rounded-full px-4 text-[14px] font-medium text-ink-soft transition-colors hover:text-ink">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left size-4 transition-transform duration-300 group-hover:-translate-x-0.5" aria-hidden="true">
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back
          </button>
        )}
        <button
          type="submit"
          disabled={status === "submitting"}
          data-cta={step === STEPS.length - 1 ? "grant-check" : undefined}
          className="group inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-[0_12px_30px_-10px_rgba(0,100,255,0.7)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
        >
          {step === STEPS.length - 1 ? (status === "submitting" ? "Checking…" : "Check my options") : "Continue"}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </button>
      </div>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-muted">
        We&apos;ll use your details only to check your options and reply.{" "}
        <a href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">
          Privacy policy
        </a>
      </p>
    </form>
  );
}
