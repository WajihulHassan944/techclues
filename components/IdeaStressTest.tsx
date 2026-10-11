"use client";

import { useEffect, useRef, useState } from "react";
import { gbp } from "@/lib/calculator";
import { ALTERNATIVES, CUSTOMERS, EDGES, FEATURE_CHOICES, INITIAL, PROBLEMS, buildReport, type Answers, type Option, type Report, type Verdict } from "@/lib/idea-verdict";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const STEPS = 3;
const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const icon = (cls: string, paths: React.ReactNode, sw = 2) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
    {paths}
  </svg>
);
const Check = ({ cls, sw }: { cls: string; sw?: number }) => icon(`lucide lucide-check ${cls}`, <path d="M20 6 9 17l-5-5" />, sw);
const ArrowRight = ({ cls }: { cls: string }) => icon(`lucide lucide-arrow-right ${cls}`, <><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></>);
const ArrowLeft = ({ cls }: { cls: string }) => icon(`lucide lucide-arrow-left ${cls}`, <><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></>);
const Reset = ({ cls }: { cls: string }) => icon(`lucide lucide-rotate-ccw ${cls}`, <><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /></>);
const Skull = ({ cls }: { cls: string }) => icon(`lucide lucide-skull ${cls}`, <><path d="m12.5 17-.5-1-.5 1h1z" /><path d="M15 22a1 1 0 0 0 1-1v-1a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20v1a1 1 0 0 0 1 1z" /><circle cx="15" cy="12" r="1" /><circle cx="9" cy="12" r="1" /></>);
const Alert = ({ cls, sw }: { cls: string; sw?: number }) => icon(`lucide lucide-circle-alert ${cls}`, <><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></>, sw);
const Triangle = ({ cls, sw }: { cls: string; sw?: number }) => icon(`lucide lucide-triangle-alert ${cls}`, <><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" /></>, sw);

const VERDICT: Record<Verdict, { chip: string; label: string; Icon: (p: { cls: string; sw?: number }) => React.ReactElement }> = {
  strong: { chip: "bg-[#e9f7ef] text-[#146c3b]", label: "Holds up", Icon: Check },
  watch: { chip: "bg-[#fff4e5] text-[#a35a00]", label: "Watch this", Icon: Triangle },
  risk: { chip: "bg-[#fdecec] text-[#b22c2c]", label: "Weak point", Icon: Alert },
};

/** Spinning dotted sphere shown while the verdict is "worked out". */
function Orbs({ size, label }: { size: number; label: string }) {
  const dots = useRef(
    Array.from({ length: 110 }, (_, a) => {
      const y = 1 - (a / 109) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const t = Math.PI * (3 - Math.sqrt(5)) * a;
      return { x: Math.cos(t) * r, y, z: Math.sin(t) * r, fade: Math.round(100 * (0.45 + ((37 * a) % 55) / 100)) / 100 };
    }),
  ).current;
  const d = size / 2;
  const m = Math.round(100 * Math.max(1.8, 0.042 * size)) / 100;
  const r2 = (v: number) => Math.round(100 * v) / 100;
  return (
    <span role="status" aria-label={label} className="relative inline-block shrink-0 align-middle" style={{ width: size, height: size, perspective: 4 * size }}>
      <span className="orb-sphere absolute inset-0 block">
        {dots.map((p, i) => (
          <span key={i} className="absolute left-1/2 top-1/2 block rounded-full bg-brand" style={{ width: m, height: m, marginLeft: r2(-m / 2), marginTop: r2(-m / 2), opacity: p.fade, transform: `translate3d(${r2(p.x * d)}px, ${r2(p.y * d)}px, ${r2(p.z * d)}px)` }} />
        ))}
      </span>
    </span>
  );
}

function Title({ title, text, children }: { title: string; text: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[clamp(1.5rem,2.4vw,2.1rem)] font-normal leading-tight tracking-[-0.035em] text-ink">{title}</h2>
      <p className="mt-2 text-[16px] text-ink-soft">{text}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Group({ title, hint, first, children }: { title: string; hint?: string; first?: boolean; children: React.ReactNode }) {
  return (
    <div className={cn(!first && "mt-7 border-t border-ink/[0.08] pt-6")}>
      <h3 className="text-[16px] font-medium text-ink">{title}</h3>
      {hint && <p className="mt-0.5 text-[14px] text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Radios({ label, options, value, onPick }: { label: string; options: Option[]; value: string; onPick: (id: string) => void }) {
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.id === value;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            title={o.hint}
            onClick={() => onPick(o.id)}
            className={cn("inline-flex items-center gap-1.5 rounded-full border px-4 py-2.5 text-left text-[14px] transition-[border-color,background-color,color] duration-300", on ? "border-brand bg-brand text-white" : "border-ink/[0.12] text-ink hover:border-brand/40")}
          >
            {on && <Check cls="size-3.5 shrink-0" sw={2.4} />}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

function ReportView({ report, idea }: { report: Report; idea: string }) {
  return (
    <div>
      <div className="rounded-[24px] bg-ink p-6 text-white sm:p-8">
        <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand-soft">Idea stress test</p>
        <h2 className="mt-3 text-[clamp(1.8rem,3.4vw,2.8rem)] font-normal leading-[1.08] tracking-[-0.04em]">{report.headline}</h2>
        <p className="mt-3 max-w-[560px] text-[16px] leading-relaxed text-white/70">{report.summary}</p>
        <p className="mt-5 border-t border-white/15 pt-4 text-[14px] italic text-white/55">“{idea.trim()}”</p>
      </div>
      <ul className="mt-8 grid gap-3">
        {report.sections.map((s) => {
          const v = VERDICT[s.verdict];
          return (
            <li key={s.title} className="rounded-[20px] border border-ink/[0.08] p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[17px] tracking-[-0.01em] text-ink">{s.title}</h3>
                <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium", v.chip)}>
                  <v.Icon cls="size-3.5" sw={2.2} />
                  {v.label}
                </span>
              </div>
              <p className="mt-2.5 text-[15px] leading-relaxed text-ink-soft">{s.text}</p>
            </li>
          );
        })}
      </ul>
      <div className="mt-8 rounded-[20px] bg-paper p-5 sm:p-6">
        <h3 className="text-[17px] tracking-[-0.01em] text-ink">Questions to answer before you build</h3>
        <ol className="mt-4 grid gap-3">
          {report.questions.map((q, i) => (
            <li key={q} className="flex gap-3 text-[15px] leading-relaxed text-ink-soft">
              <span className="text-[13px] tabular-nums text-brand">{String(i + 1).padStart(2, "0")}</span>
              {q}
            </li>
          ))}
        </ol>
      </div>
      {report.cost && (
        <p className="mt-5 text-[14px] text-muted">
          For reference, the scope you picked would cost roughly {gbp(report.cost.min)}–{gbp(report.cost.max)} to build as a web MVP.{" "}
          <a href="/mvp-cost-calculator" className="text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand">
            Refine the estimate
          </a>
          .
        </p>
      )}
      <div className="mt-8 flex flex-col gap-3 rounded-[24px] bg-[linear-gradient(135deg,#0e0f31,#0a1f6b)] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-[clamp(1.2rem,2vw,1.6rem)] tracking-[-0.02em]">Still want to build it?</p>
          <p className="mt-1.5 max-w-[420px] text-[15px] text-white/65">Bring it to a free 30-minute call and we&apos;ll plan what to validate first.</p>
          <a href="/zero-one" className="mt-3 inline-flex items-center gap-1.5 text-[14px] font-medium text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white">
            Or build the core and test it with ZERO.ONE for £499
            <ArrowRight cls="size-3.5" />
          </a>
        </div>
        <a href="/book-a-call" data-cta="kill-my-idea-book-call" className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">
          Let&apos;s talk
          <ArrowRight cls="size-4 transition-transform duration-300 group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}

/**
 * The idea stress test: three short steps, then a verdict worked out on the page.
 * Contact details are checked but not sent anywhere (not wired up yet).
 */
export default function IdeaStressTest() {
  const [step, setStep] = useState(0);
  const [a, setA] = useState<Answers>(INITIAL);
  const [who, setWho] = useState({ name: "", email: "" });
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const set = <K extends keyof Answers>(k: K, v: Answers[K]) => setA((o) => ({ ...o, [k]: v }));
  const report = phase === "done" ? buildReport(a) : null;
  const canNext = step !== 0 || a.idea.trim().length > 15;
  const last = step === STEPS - 1;
  const validWho = who.name.trim().length > 0 && EMAIL.test(who.email.trim());

  const submit = () => {
    if (!validWho) return;
    setPhase("running");
    timer.current = setTimeout(() => setPhase("done"), 1400);
  };
  const reset = () => {
    clearTimeout(timer.current);
    setA(INITIAL);
    setStep(0);
    setPhase("idle");
  };
  const toggleFeature = (id: string) => set("features", a.features.includes(id) ? a.features.filter((x) => x !== id) : [...a.features, id]);

  return (
    <div className="mx-auto max-w-[900px]">
      <div className="rounded-[28px] border border-ink/[0.08] bg-white p-5 shadow-[0_30px_80px_-50px_rgba(14,15,49,0.35)] sm:rounded-[32px] sm:p-10">
        <div className="flex items-center justify-between gap-4">
          <p className="text-[13px] text-muted">{phase === "done" ? "The verdict" : `Step ${step + 1} of ${STEPS}`}</p>
          {(step > 0 || phase === "done") && (
            <button onClick={reset} className="inline-flex items-center gap-1.5 text-[13px] text-muted transition-colors hover:text-ink">
              <Reset cls="size-3.5" /> Start again
            </button>
          )}
        </div>
        <ol className="mt-4 grid grid-cols-3 gap-1.5">
          {Array.from({ length: STEPS }, (_, i) => (
            <li key={i} className="h-1.5 overflow-hidden rounded-full bg-ink/[0.07]">
              <span className="block h-full rounded-full bg-[linear-gradient(90deg,#0050d6,#0064ff,#4d8dff)]" style={{ width: phase === "done" || i <= step ? "100%" : "0%", transition: "width .5s cubic-bezier(.65,0,.35,1)" }} />
            </li>
          ))}
        </ol>
        <div className="relative mt-8 min-h-[320px] sm:mt-10">
          {phase === "running" ? (
            <div className="kmi-fade grid place-items-center py-16 text-center">
              <Orbs size={72} label="Stress testing your idea" />
              <p className="mt-6 text-[17px] text-ink">Looking for the weak points…</p>
            </div>
          ) : report ? (
            <div className="kmi-rise">
              <ReportView report={report} idea={a.idea} />
            </div>
          ) : (
            <div key={step} className="kmi-step">
              {step === 0 && (
                <Title title="What's the idea?" text="One or two sentences is plenty. Plain words beat pitch language.">
                  <textarea
                    value={a.idea}
                    onChange={(e) => set("idea", e.target.value)}
                    rows={4}
                    autoFocus
                    placeholder="e.g. An app that lets dental clinics fill last-minute cancellations from a waiting list automatically."
                    className="w-full resize-none rounded-2xl border border-ink/10 bg-paper p-4 text-[16px] leading-relaxed text-ink placeholder:text-muted/70 focus:border-brand focus:bg-white focus:outline-none"
                  />
                  <p className="mt-2 text-[13px] text-muted">{a.idea.trim().length < 16 ? "A little more detail, please." : "That'll do."}</p>
                  <Group title="Who is it for?" hint="The narrower, the better your odds.">
                    <Radios label="Who is it for?" options={CUSTOMERS} value={a.customer} onPick={(v) => set("customer", v)} />
                    <input
                      value={a.customerDetail}
                      onChange={(e) => set("customerDetail", e.target.value)}
                      placeholder="Optional: who exactly? e.g. private dental practices in the UK"
                      className="mt-3 h-12 w-full rounded-xl border border-ink/10 bg-paper px-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:bg-white focus:outline-none"
                    />
                  </Group>
                </Title>
              )}
              {step === 1 && (
                <Title title="Your market" text="Three quick calls. Be honest: these decide most products.">
                  <Group title="What do they use today?" hint="Every problem has a workaround, even a bad one." first>
                    <Radios label="What do they use today?" options={ALTERNATIVES} value={a.alternatives} onPick={(v) => set("alternatives", v)} />
                  </Group>
                  <Group title="How much does the problem hurt?">
                    <Radios label="How much does the problem hurt?" options={PROBLEMS} value={a.problem} onPick={(v) => set("problem", v)} />
                  </Group>
                  <Group title="Why you, and not them?" hint="The one you'd defend in front of a customer.">
                    <Radios label="Why you, and not them?" options={EDGES} value={a.edge} onPick={(v) => set("edge", v)} />
                  </Group>
                </Title>
              )}
              {step === 2 && (
                <Title title="What must the first version do?" text="Only what's needed to prove people want it. Then add your details to see the verdict.">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                    {FEATURE_CHOICES.map((f) => {
                      const on = a.features.includes(f.id);
                      return (
                        <button
                          key={f.id}
                          onClick={() => toggleFeature(f.id)}
                          aria-pressed={on}
                          className={cn("rounded-2xl border px-3 py-3 text-[14px] transition-[border-color,background-color,translate] duration-300 hover:-translate-y-0.5", on ? "border-brand bg-brand/[0.05] text-ink" : "border-ink/[0.08] text-ink-soft hover:border-brand/30")}
                        >
                          {f.name}
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-3 text-[13px] text-muted">{a.features.length} selected. Fewer is usually better.</p>
                  <div className="mt-8 grid gap-3 border-t border-ink/10 pt-6 sm:grid-cols-2">
                    <input value={who.name} onChange={(e) => setWho({ ...who, name: e.target.value })} placeholder="Your name" autoComplete="name" className="h-12 w-full rounded-xl border border-ink/10 bg-paper px-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:bg-white focus:outline-none" />
                    <input value={who.email} onChange={(e) => setWho({ ...who, email: e.target.value })} placeholder="Email" type="email" autoComplete="email" className="h-12 w-full rounded-xl border border-ink/10 bg-paper px-4 text-[15px] text-ink placeholder:text-muted/70 focus:border-brand focus:bg-white focus:outline-none" />
                  </div>
                  <p className="mt-2 text-[12px] text-muted">So we can follow up on your verdict. We won&apos;t pass your idea to anyone.</p>
                </Title>
              )}
            </div>
          )}
        </div>
        {phase === "idle" && (
          <div className="mt-8 flex items-center justify-between gap-4 border-t border-ink/[0.08] pt-6">
            <button onClick={() => setStep((s) => Math.max(0, s - 1))} className={cn("inline-flex items-center gap-1.5 text-[15px] text-ink transition-opacity", step === 0 && "pointer-events-none opacity-0")}>
              <ArrowLeft cls="size-4" /> Back
            </button>
            <button
              onClick={() => (last ? submit() : canNext && setStep((s) => s + 1))}
              disabled={last ? !validWho : !canNext}
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand disabled:cursor-not-allowed disabled:bg-ink/25"
            >
              {last ? "Try to kill it" : "Next"}
              {last ? <Skull cls="size-4" /> : <ArrowRight cls="size-4 transition-transform duration-300 group-enabled:group-hover:translate-x-1" />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
