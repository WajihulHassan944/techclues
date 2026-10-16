"use client";

import { useState, type ComponentProps } from "react";
import { api } from "@/lib/api/client";

const Arrow = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const Tick = ({ className, strokeWidth = 2 }: { className: string; strokeWidth?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-check ${className}`} aria-hidden="true">
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

function Field({ label, ...rest }: { label: string } & ComponentProps<"input">) {
  return (
    <label className="group block">
      <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">{label}</span>
      <input {...rest} className="mt-2 h-11 w-full border-b border-ink/15 bg-transparent text-[18px] text-ink transition-colors focus:border-brand focus:outline-none focus-visible:outline-none" />
    </label>
  );
}

export default function ZeroOneBriefForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [callHref, setCallHref] = useState("/book-a-call");
  const [error, setError] = useState("");
  const sent = state === "sent";

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "sending") return;
    const form = e.currentTarget;
    const d = new FormData(form);
    const v = (k: string) => String(d.get(k) ?? "").trim();
    setState("sending");
    setError("");
    try {
      await api.post(
        "/api/public/zero-one",
        { name: v("name"), email: v("email"), company: v("company"), phone: v("phone"), idea: v("idea"), consent: d.get("consent") === "on", website: v("website") },
        { auth: false },
      );
      setCallHref(`/book-a-call?${new URLSearchParams({ name: v("name"), email: v("email"), company: v("company"), notes: `BUILD.ONE: ${v("idea")}`.slice(0, 500) })}`);
      form.reset();
      setState("sent");
    } catch {
      setState("error");
      setError("Something went wrong sending your brief. Please try again.");
    }
  }

  return (
    <form data-form="zero_one_brief" data-slot-form="true" data-clarity-mask="True" onSubmit={submit} className="space-y-12">
      <Step n="01" title="Your idea">
        <label className="group block">
          <span className="text-[13px] text-muted transition-colors group-focus-within:text-brand">What&apos;s the idea, in a sentence or two?</span>
          <textarea name="idea" required rows={2} maxLength={1500} placeholder="e.g. An app that fills last-minute dental cancellations." className="mt-2 w-full resize-none border-b border-ink/15 bg-transparent pb-3 text-[18px] leading-relaxed text-ink transition-colors placeholder:text-ink/25 focus:border-brand focus:outline-none focus-visible:outline-none"></textarea>
        </label>
      </Step>
      <Step n="02" title="About you">
        <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
          <Field label="Name" name="name" required autoComplete="name" />
          <Field label="Email" name="email" type="email" required autoComplete="email" />
          <Field label="Company name" name="company" required autoComplete="organization" />
          <Field label="Contact number" name="phone" type="tel" required autoComplete="tel" minLength={7} />
        </div>
      </Step>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-px w-px opacity-0" />
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[14px] leading-relaxed text-ink-soft">
          <input type="checkbox" name="consent" required className="mt-0.5 size-[18px] shrink-0 cursor-pointer rounded-[5px] border border-ink/25 accent-brand" />
          <span>
            I agree to the{" "}
            <a className="text-ink underline decoration-ink/30 underline-offset-4 transition-colors hover:decoration-brand" href="/privacy-policy">
              privacy policy
            </a>
            , and to TechClues contacting me about this brief.
          </span>
        </label>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <button type="submit" disabled={state === "sending"} className="group inline-flex h-14 cursor-pointer items-center gap-2 rounded-full bg-brand pl-7 pr-6 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-ink disabled:opacity-60">
            {state === "sending" ? (
              <>Sending…</>
            ) : sent ? (
              <>
                Brief sent <Tick className="size-4" />
              </>
            ) : (
              <>
                Send my brief
                <Arrow />
              </>
            )}
          </button>
          {!sent && <p className="text-[14px] text-muted">No payment now. We&apos;ll review it first.</p>}
        </div>
        {state === "error" && (
          <p role="alert" className="mt-4 rounded-xl bg-[#fdecec] px-4 py-3 text-[14px] text-[#b42318]">
            {error}
          </p>
        )}
        {sent && (
          <div className="mt-6 rounded-2xl bg-[#e9f7ef] p-5 text-[15px] leading-relaxed text-[#146c3b]">
            <p className="flex items-start gap-3">
              <Tick className="mt-0.5 size-4 shrink-0" strokeWidth={2.5} />
              <span>Thanks, your brief is with our team. Pick a time for your 30-minute scope call now, or we&apos;ll be in touch to book it.</span>
            </p>
            <a href={callHref} data-cta="zero-one-book-call" className="group mt-4 inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[14.5px] font-medium text-white transition-colors duration-300 hover:bg-brand">
              Pick a time for your call
              <Arrow />
            </a>
          </div>
        )}
      </div>
    </form>
  );
}
