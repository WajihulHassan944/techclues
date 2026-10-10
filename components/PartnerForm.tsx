"use client";

import { useState, type ReactNode } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const KINDS = ["Design or marketing agency", "Freelancer", "Business adviser or accountant", "Startup community or accelerator", "Past client", "Something else"];
const REACH = ["Mostly UK", "Mostly outside the UK", "Both"];
const VOLUME = ["1–2 a year", "3–5 a year", "6–10 a year", "More than 10 a year", "Not sure yet"];
const BUDGET = ["Under £5k", "£5k–£10k", "£10k–£25k", "£25k–£50k", "Over £50k", "Not sure"];
const PROJECTS = [
  "ZERO.ONE", "MVPs & Custom Platforms", "Prototype to Production", "Web & Mobile Apps", "UI/UX & Prototyping", "Low-Code / No-Code",
  "E-commerce & Marketplaces", "Performance Marketing", "Strategy & Brand Identity", "Ongoing partnership", "Grant application support",
];

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
const input = (bad?: string) =>
  cn(
    "h-12 w-full rounded-2xl border bg-white px-4 text-[15px] text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 focus:outline-none focus:ring-4",
    bad ? "border-[#b42318] focus:ring-[#b42318]/10" : "border-ink/12 hover:border-ink/25 focus:border-brand focus:ring-brand/10",
  );
const area = "w-full resize-y rounded-2xl border border-ink/12 bg-white px-4 py-3 text-[15px] leading-relaxed text-ink transition-[border-color,box-shadow] duration-200 placeholder:text-muted/70 hover:border-ink/25 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10";

function Label({ label, optional, error, wide, children }: { label: string; optional?: boolean; error?: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={cn("block min-w-0", wide && "sm:col-span-2")}>
      <span className="mb-1.5 flex items-baseline justify-between gap-3 text-[14px] font-medium text-ink">
        {label}
        {optional && <span className="text-[13px] font-normal text-muted">Optional</span>}
      </span>
      {children}
      {error && <span className="mt-1.5 block text-[13px] text-[#b42318]">{error}</span>}
    </label>
  );
}

function Select({ field, value, onChange, options, invalid }: { field?: string; value: string; onChange: (v: string) => void; options: string[]; invalid?: boolean }) {
  return (
    <span className="relative block">
      <select
        data-field={field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={invalid}
        className={cn(input(invalid ? "x" : undefined), "cursor-pointer appearance-none pr-10", !value && "text-muted/80")}
      >
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

/**
 * Become a partner / refer a client. Same fields, checks and messages as the original;
 * a form that passes the checks is not sent anywhere (not wired up yet).
 */
export default function PartnerForm() {
  const [mode, setMode] = useState<"join" | "refer">("join");
  const [v, setV] = useState<Record<string, string>>({});
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = (k: string, val: string) => {
    setV((o) => ({ ...o, [k]: val }));
    if (errors[k]) setErrors((o) => ({ ...o, [k]: "" }));
  };
  const get = (k: string) => (v[k] ?? "").trim();

  const rules: [string, string, (x: string) => boolean][] =
    mode === "join"
      ? [
          ["name", "Add your name.", (x) => !!x],
          ["email", "Check your email address.", (x) => EMAIL.test(x)],
          ["kind", "Choose what describes you best.", (x) => !!x],
        ]
      : [
          ["name", "Add your name.", (x) => !!x],
          ["email", "Check your email address.", (x) => EMAIL.test(x)],
          ["clientName", "Add the client's name.", (x) => !!x],
          ["clientEmail", "Check the client's email address.", (x) => EMAIL.test(x)],
          ["projectType", "Choose the type of project.", (x) => !!x],
        ];

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next: Record<string, string> = {};
    for (const [k, msg, ok] of rules) if (!ok(get(k))) next[k] = msg;
    if (!agreed) next.agreed = mode === "join" ? "Please confirm you've read the programme rules." : "Please confirm the client has agreed to be contacted.";
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) e.currentTarget.querySelector<HTMLElement>(`[data-field="${first}"]`)?.focus();
    // Passing the checks does not send anything yet.
  }

  const chips = (field: string, options: string[], error?: string) => (
    <fieldset className="min-w-0 sm:col-span-2">
      <legend className="mb-2 text-[14px] font-medium text-ink">What describes you best?</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            data-field={i === 0 ? field : undefined}
            onClick={() => set(field, v[field] === o ? "" : o)}
            aria-pressed={v[field] === o}
            className={cn("h-10 rounded-full border px-4 text-[14px] transition-all duration-200 active:scale-[0.97]", v[field] === o ? "border-ink bg-ink text-white" : error ? "border-[#b42318]/50 bg-white text-ink" : "border-ink/12 bg-white text-ink hover:border-ink/35")}
          >
            {o}
          </button>
        ))}
      </div>
      {error && <p className="mt-1.5 text-[13px] text-[#b42318]">{error}</p>}
    </fieldset>
  );

  return (
    <form data-form={mode === "join" ? "partner" : "partner_referral"} data-clarity-mask="True" onSubmit={submit} noValidate className="rounded-[24px] bg-[#f6f7fb] p-5 sm:p-7">
      <div role="tablist" aria-label="What would you like to do?" className="relative inline-flex w-full rounded-full bg-white p-1 ring-1 ring-ink/[0.08] sm:w-auto">
        {([["join", "Become a partner"], ["refer", "Refer a client"]] as const).map(([k, label]) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={mode === k}
            onClick={() => {
              setMode(k);
              setErrors({});
              setAgreed(false);
            }}
            className="relative h-10 min-w-0 flex-1 rounded-full px-3 text-[13.5px] font-medium sm:flex-none sm:px-5 sm:text-[14px]"
          >
            {mode === k && <span className="absolute inset-0 rounded-full bg-ink" />}
            <span className={cn("relative whitespace-nowrap", mode === k ? "text-white" : "text-ink-soft")}>{label}</span>
          </button>
        ))}
      </div>
      <p className="mt-4 text-[14px] leading-relaxed text-muted">{mode === "join" ? "Free to join. Tell us a little about you and we'll send the programme terms." : "Already a partner? Introduce a client here, with their permission."}</p>
      <div key={mode} className="step-in mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Label label="Your name" error={errors.name}>
          <input data-field="name" value={v.name ?? ""} onChange={(e) => set("name", e.target.value)} autoComplete="name" aria-invalid={!!errors.name} className={input(errors.name)} />
        </Label>
        <Label label="Your email" error={errors.email}>
          <input data-field="email" type="email" inputMode="email" value={v.email ?? ""} onChange={(e) => set("email", e.target.value)} autoComplete="email" aria-invalid={!!errors.email} className={input(errors.email)} />
        </Label>
        <Label label="Your company" optional>
          <input value={v.company ?? ""} onChange={(e) => set("company", e.target.value)} autoComplete="organization" className={input()} />
        </Label>
        <Label label="Your phone" optional>
          <input type="tel" inputMode="tel" value={v.phone ?? ""} onChange={(e) => set("phone", e.target.value)} autoComplete="tel" className={input()} />
        </Label>
        {mode === "join" ? (
          <>
            {chips("kind", KINDS, errors.kind)}
            <Label label="Website or LinkedIn" optional>
              <input value={v.website ?? ""} onChange={(e) => set("website", e.target.value)} inputMode="url" placeholder="https://" className={input()} />
            </Label>
            <Label label="Your clients are" optional>
              <Select value={v.reach ?? ""} onChange={(x) => set("reach", x)} options={REACH} />
            </Label>
            <Label label="Introductions you might make" optional wide>
              <Select value={v.volume ?? ""} onChange={(x) => set("volume", x)} options={VOLUME} />
            </Label>
            <Label label="Anything else?" optional wide>
              <textarea value={v.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={3} maxLength={1500} placeholder="Who you work with, and the kind of projects you see." className={area} />
            </Label>
          </>
        ) : (
          <>
            <div className="border-t border-ink/[0.08] pt-5 sm:col-span-2">
              <p className="text-[14px] font-medium text-ink">The client</p>
            </div>
            <Label label="Their name" error={errors.clientName}>
              <input data-field="clientName" value={v.clientName ?? ""} onChange={(e) => set("clientName", e.target.value)} aria-invalid={!!errors.clientName} className={input(errors.clientName)} />
            </Label>
            <Label label="Their company" optional>
              <input value={v.clientCompany ?? ""} onChange={(e) => set("clientCompany", e.target.value)} className={input()} />
            </Label>
            <Label label="Their email" error={errors.clientEmail}>
              <input data-field="clientEmail" type="email" inputMode="email" value={v.clientEmail ?? ""} onChange={(e) => set("clientEmail", e.target.value)} aria-invalid={!!errors.clientEmail} className={input(errors.clientEmail)} />
            </Label>
            <Label label="Their phone" optional>
              <input type="tel" inputMode="tel" value={v.clientPhone ?? ""} onChange={(e) => set("clientPhone", e.target.value)} className={input()} />
            </Label>
            <Label label="Type of project" error={errors.projectType}>
              <Select field="projectType" value={v.projectType ?? ""} onChange={(x) => set("projectType", x)} options={[...PROJECTS, "Not sure yet"]} invalid={!!errors.projectType} />
            </Label>
            <Label label="Rough budget" optional>
              <Select value={v.budget ?? ""} onChange={(x) => set("budget", x)} options={BUDGET} />
            </Label>
            <Label label="About the project" optional wide>
              <textarea value={v.notes ?? ""} onChange={(e) => set("notes", e.target.value)} rows={3} maxLength={1500} placeholder="What they want to build or improve, and any timing." className={area} />
            </Label>
          </>
        )}
        <label className="flex items-start gap-3 sm:col-span-2">
          <input
            data-field="agreed"
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (errors.agreed) setErrors((o) => ({ ...o, agreed: "" }));
            }}
            className="mt-0.5 size-5 shrink-0 cursor-pointer accent-[#0e0f31]"
          />
          <span className="text-[14px] leading-relaxed text-ink-soft">
            {mode === "join" ? (
              <>
                I&apos;ve read the{" "}
                <a href="#rules" className="text-ink underline decoration-ink/30 underline-offset-2 hover:decoration-brand">
                  programme rules
                </a>
                .
              </>
            ) : (
              "The client has agreed to Vebryx contacting them about this project."
            )}
            {errors.agreed && <span className="mt-1 block text-[13px] text-[#b42318]">{errors.agreed}</span>}
          </span>
        </label>
      </div>
      <button
        type="submit"
        data-cta={mode === "join" ? "partner-apply" : "partner-refer"}
        className="group mt-6 inline-flex h-13 w-full items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-[0_12px_30px_-10px_rgba(0,100,255,0.7)] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
      >
        {mode === "join" ? "Apply to join" : "Send the referral"}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </button>
      <p className="mt-4 text-center text-[12.5px] leading-relaxed text-muted">
        We&apos;ll use these details only for the programme.{" "}
        <a href="/privacy-policy" className="underline underline-offset-2 hover:text-ink">
          Privacy policy
        </a>
      </p>
    </form>
  );
}
