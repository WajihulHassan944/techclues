"use client";

import { useState, type ComponentProps } from "react";

const NEEDS = ["One specialist", "A full team", "Short-term coverage", "Not sure yet"];
const SIZES = ["1 – 50 employees", "51 – 200 employees", "201 – 1,000 employees", "1,000+ employees"];
const TIMELINES = ["Immediately", "Within 1 – 3 months", "Within 3 – 6 months", "Just exploring"];
const CODES = [
  ["+44", "United Kingdom"], ["+1", "United States"], ["+1", "Canada"], ["+92", "Pakistan"], ["+971", "United Arab Emirates"], ["+966", "Saudi Arabia"], ["+974", "Qatar"],
  ["+965", "Kuwait"], ["+973", "Bahrain"], ["+968", "Oman"], ["+91", "India"], ["+61", "Australia"], ["+49", "Germany"], ["+33", "France"], ["+65", "Singapore"],
];
const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const line = "mt-2 h-11 w-full border-b border-ink/15 bg-transparent text-[17px] text-ink transition-colors focus:border-brand focus:outline-none focus-visible:outline-none";

function Field({ label, error, ...rest }: { label: string; error?: string } & ComponentProps<"input">) {
  return (
    <label className="group block">
      <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">{label}</span>
      <input {...rest} aria-invalid={!!error} className={cn(line, error && "border-[#d64545]")} />
      {error && <span className="mt-1.5 block text-[13px] text-[#d64545]">{error}</span>}
    </label>
  );
}

function Select({ label, options, error, ...rest }: { label: string; options: string[]; error?: string } & ComponentProps<"select">) {
  return (
    <label className="group block">
      <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">{label}</span>
      <select {...rest} aria-invalid={!!error} className={cn(line, "appearance-none pr-6", error && "border-[#d64545]")} style={{ backgroundRepeat: "no-repeat", backgroundSize: "16px", backgroundPosition: "right 2px center", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230e0f31' stroke-opacity='.5' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
        <option value="">Select</option>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      {error && <span className="mt-1.5 block text-[13px] text-[#d64545]">{error}</span>}
    </label>
  );
}

/**
 * "Tell us the seat you need filled" form. Front-end only for now: it validates, then shows the
 * thank-you state. Submission to the backend is wired up separately.
 */
export default function StaffSeatForm() {
  const [v, setV] = useState({ first: "", last: "", company: "", need: "", email: "", code: "+44", phone: "", brief: "", size: "", timeline: "", consent: false, marketing: false, website: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const set = <K extends keyof typeof v>(k: K, val: (typeof v)[K]) => setV((s) => ({ ...s, [k]: val }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const err: Record<string, string> = {};
    if (!v.first.trim()) err.first = "Add your first name.";
    if (!v.last.trim()) err.last = "Add your last name.";
    if (!v.need) err.need = "Choose what you need.";
    if (!EMAIL.test(v.email.trim())) err.email = "Check your work email.";
    if (!v.consent) err.consent = "We need your consent to reply.";
    setErrors(err);
    if (Object.keys(err).length) return;
    setDone(true);
  };

  if (done) {
    return (
      <div role="status" className="rounded-[24px] bg-[#f1f0f6] p-8 text-center sm:p-12">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-brand text-white">
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
        </span>
        <p className="mt-5 text-[clamp(1.5rem,2.4vw,2rem)] tracking-[-0.03em] text-ink">Thanks, that&apos;s with us.</p>
        <p className="mx-auto mt-2 max-w-[420px] text-[16px] leading-relaxed text-ink-soft">A TechClues engineer will read it and come back to you, usually within one business day.</p>
      </div>
    );
  }

  return (
    <form data-form="staff-augmentation" data-clarity-mask="True" noValidate onSubmit={submit} className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
      <Field label="First name" name="first" autoComplete="given-name" value={v.first} onChange={(e) => set("first", e.target.value)} error={errors.first} />
      <Field label="Last name" name="last" autoComplete="family-name" value={v.last} onChange={(e) => set("last", e.target.value)} error={errors.last} />
      <Field label="Company" name="company" autoComplete="organization" value={v.company} onChange={(e) => set("company", e.target.value)} />
      <Select label="What do you need?" name="need" options={NEEDS} value={v.need} onChange={(e) => set("need", e.target.value)} error={errors.need} />
      <Field label="Work email" name="email" type="email" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
      <div className="grid gap-4" style={{ gridTemplateColumns: "120px minmax(0,1fr)" }}>
        <label className="group block">
          <span className="text-[13px] text-muted">Code</span>
          <select name="code" value={v.code} onChange={(e) => set("code", e.target.value)} className={line} aria-label="Country code">
            {CODES.map(([c, n]) => (
              <option key={n} value={c}>
                {c} {n}
              </option>
            ))}
          </select>
        </label>
        <Field label="Phone number" name="phone" type="tel" autoComplete="tel-national" value={v.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <label className="group block sm:col-span-2">
        <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">The role, stack, and timeline</span>
        <textarea name="brief" rows={3} value={v.brief} onChange={(e) => set("brief", e.target.value)} className="mt-2 w-full resize-y border-b border-ink/15 bg-transparent py-2 text-[17px] text-ink transition-colors focus:border-brand focus:outline-none" />
      </label>
      <Select label="Company size" name="size" options={SIZES} value={v.size} onChange={(e) => set("size", e.target.value)} />
      <Select label="Timeline to start" name="timeline" options={TIMELINES} value={v.timeline} onChange={(e) => set("timeline", e.target.value)} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v.website} onChange={(e) => set("website", e.target.value)} className="absolute -left-[9999px] h-0 w-0 opacity-0" />
      <div className="grid gap-3 sm:col-span-2">
        <label className="flex items-start gap-3 text-[14px] leading-snug text-ink-soft">
          <input type="checkbox" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#0064ff]" />
          <span>I agree to allow TechClues to store and process my personal data so it can reply to this request.</span>
        </label>
        {errors.consent && <span className="-mt-1 block text-[13px] text-[#d64545]">{errors.consent}</span>}
        <label className="flex items-start gap-3 text-[14px] leading-snug text-ink-soft">
          <input type="checkbox" checked={v.marketing} onChange={(e) => set("marketing", e.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#0064ff]" />
          <span>I agree to receive other communications from TechClues.</span>
        </label>
        <p className="text-[13px] text-muted">
          We care about your privacy. Learn how we handle your data in our{" "}
          <a href="/privacy-policy" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand">
            Privacy Policy
          </a>
          .
        </p>
      </div>
      <div className="sm:col-span-2">
        <button type="submit" className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink pl-7 pr-6 text-[15px] font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-[0_14px_40px_-10px_rgba(0,100,255,0.7)] sm:w-auto">
          Let&apos;s talk
          <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
        </button>
      </div>
    </form>
  );
}
