"use client";

import { useEffect, useRef, useState } from "react";

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const Label = ({ children }: { children: React.ReactNode }) => <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">{children}</p>;
const Bar = ({ pct, children, note }: { pct: number; children: React.ReactNode; note: string }) => (
  <div>
    <div className="flex items-center justify-between text-[13px] text-white/85">
      <span>{children}</span>
      <span className="font-mono text-[11px] text-brand-soft">{note}</span>
    </div>
    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
      <span className="block h-full rounded-full bg-brand-soft" style={{ width: `${pct}%` }} />
    </div>
  </div>
);
const Tile = ({ className, children }: { className?: string; children: React.ReactNode }) => <div className={cn("rounded-2xl border border-white/10 bg-white/[0.04] p-4", className)}>{children}</div>;
const Dot = () => <span className="size-1.5 shrink-0 rounded-full bg-brand-soft" />;

function AiMl() {
  return (
    <div className="grid gap-3">
      <Label>Fine-tune run</Label>
      <Tile className="grid gap-4">
        <Bar pct={100} note="loaded">Base model</Bar>
        <Bar pct={100} note="12.4k rows">Your data</Bar>
        <Bar pct={62} note="running">Eval harness</Bar>
      </Tile>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tile className="grid place-items-center py-8 text-center">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Eval score</p>
            <p className="mt-1 text-[40px] font-normal leading-none tracking-[-0.03em] text-white">
              +18<span className="ml-1 text-[16px] text-white/55">pts</span>
            </p>
            <p className="mt-1.5 font-mono text-[11px] text-white/40">vs base model</p>
          </div>
        </Tile>
        <Tile>
          <Label>Deployed to</Label>
          <ul className="mt-3 grid gap-2 text-[13px] text-white/80">
            {["your MLOps pipeline", "your model registry", "your monitoring"].map((t) => (
              <li key={t} className="flex items-center gap-2.5">
                <Dot />
                {t}
              </li>
            ))}
          </ul>
        </Tile>
      </div>
    </div>
  );
}

function FullStack() {
  const seats = [
    ["Frontend", "React · Vue"],
    ["Backend", "Node · .NET · Java"],
    ["Mobile", "iOS · Android · RN"],
    ["DevOps", "K8s · Terraform"],
    ["QA", "automation · manual"],
    ["Platform", "APIs · data"],
  ];
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <Label>Seats available</Label>
        <span className="font-mono text-[11px] text-white/40">pod or individual</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {seats.map(([n, t]) => (
          <Tile key={n} className="p-3.5">
            <p className="text-[14px] text-white">{n}</p>
            <p className="mt-1 font-mono text-[11px] text-white/45">{t}</p>
          </Tile>
        ))}
      </div>
      <Tile className="flex items-center justify-between">
        <span className="text-[13px] text-white/85">Pod ready</span>
        <span className="flex items-center gap-3">
          <span className="flex gap-1.5">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <span key={i} className={cn("h-1.5 w-6 rounded-full", i < 4 ? "bg-brand-soft" : "bg-white/15")} />
            ))}
          </span>
          <span className="font-mono text-[11px] text-brand-soft">4 of 6</span>
        </span>
      </Tile>
    </div>
  );
}

function DataFlow() {
  const nodes = [
    ["Sources", "app db · events · 3rd party", null],
    ["Pipeline", "ingest · dbt", "tests green"],
    ["Warehouse", "AI ready", "your account"],
  ] as const;
  return (
    <div className="grid gap-3">
      <Label>Data platform</Label>
      <div className="grid items-stretch gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {nodes.map(([n, t, note], i) => (
          <div key={n} className="contents">
            <Tile className="grid content-between gap-6 py-5">
              <div>
                <p className="text-[15px] text-white">{n}</p>
                <p className="mt-1.5 font-mono text-[11px] leading-relaxed text-white/45">{t}</p>
              </div>
              {note && <p className="flex items-center gap-2 font-mono text-[11px] text-brand-soft"><Dot />{note}</p>}
            </Tile>
            {i < 2 && (
              <span className="hidden items-center text-brand-soft sm:flex" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14m-5-5 5 5-5 5" /></svg>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function Onboarding() {
  const rows = [
    ["w1", "Role scoped", "skill, seniority, hours", "done"],
    ["w2", "Profiles shared", "vetted for this role", "done"],
    ["w3", "Your approval", "you pick the engineer", "done"],
    ["w4", "First commit", "in your repo", "week 4"],
  ];
  return (
    <div className="grid gap-3">
      <Label>Start-up timeline</Label>
      <Tile className="grid gap-1 p-3">
        {rows.map(([w, t, s, st], i) => (
          <div key={w} className="flex items-center gap-4 rounded-xl px-2 py-3">
            <span className={cn("grid size-8 shrink-0 place-items-center rounded-full font-mono text-[11px]", i < 3 ? "bg-brand text-white" : "border border-brand-soft text-brand-soft")}>{w}</span>
            <span className="flex-1">
              <span className="block text-[14px] text-white">{t}</span>
              <span className="block font-mono text-[11px] text-white/45">{s}</span>
            </span>
            <span className={cn("font-mono text-[11px]", i < 3 ? "text-brand-soft" : "text-white")}>{st}</span>
          </div>
        ))}
      </Tile>
    </div>
  );
}

function Integration() {
  const cols: [string, [string, string][]][] = [
    ["In progress", [["Checkout API", "your dev"], ["Auth refactor", "embedded"]]],
    ["In review", [["Rate limiter", "embedded"]]],
    ["Done", [["Webhooks", "your dev"], ["Cache layer", "embedded"]]],
  ];
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <Label>Your sprint board</Label>
        <span className="font-mono text-[11px] text-white/40">sprint 24</span>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {cols.map(([h, cards]) => (
          <Tile key={h} className="p-3">
            <p className="mb-3 px-1 font-mono text-[11px] uppercase tracking-[0.1em] text-white/45">{h}</p>
            <div className="grid gap-2">
              {cards.map(([t, who]) => (
                <div key={t} className="rounded-xl bg-white/[0.06] px-3 py-2.5">
                  <p className="text-[13px] text-white">{t}</p>
                  <p className={cn("mt-1 font-mono text-[10.5px]", who === "embedded" ? "text-brand-soft" : "text-white/45")}>{who}</p>
                </div>
              ))}
            </div>
          </Tile>
        ))}
      </div>
      <Tile className="flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-white/45">Your tools</span>
        {["Jira", "Slack", "GitHub"].map((t) => (
          <span key={t} className="rounded-full border border-white/15 px-3 py-1 text-[12px] text-white/85">{t}</span>
        ))}
      </Tile>
    </div>
  );
}

function Scaling() {
  const q = [["Q1", 3], ["Q2", 6], ["Q3", 9], ["Q4", 4]] as const;
  return (
    <div className="grid gap-3">
      <div className="flex items-baseline justify-between">
        <Label>Headcount by quarter</Label>
        <span className="font-mono text-[11px] text-white/40">flexes with roadmap</span>
      </div>
      <Tile className="flex h-[190px] items-end justify-around gap-4 px-6 pb-4 pt-5">
        {q.map(([n, v]) => (
          <div key={n} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <span className="text-[14px] text-white">{v}</span>
            <span className="w-full max-w-[56px] rounded-t-lg bg-brand-soft" style={{ height: `${(v / 9) * 100 - 14}%` }} />
            <span className="font-mono text-[11px] text-white/45">{n}</span>
          </div>
        ))}
      </Tile>
      <div className="grid gap-3 sm:grid-cols-2">
        <Tile className="flex items-center justify-between"><span className="text-[13px] text-white/70">Severance cost</span><span className="font-mono text-[13px] text-brand-soft">£0</span></Tile>
        <Tile className="flex items-center justify-between"><span className="text-[13px] text-white/70">Bench carried</span><span className="font-mono text-[13px] text-brand-soft">None</span></Tile>
      </div>
    </div>
  );
}

const TABS = [
  {
    key: "ai",
    tab: "AI and ML",
    title: "AI Engineers and ML Specialists",
    text: "Model fine-tuning, deployment and MLOps, built into your own AI roadmap instead of split off as a separate stream of work.",
    points: ["Fine-tuning and evaluation run on your own data", "Deployment and MLOps within the pipelines you already have", "Your team keeps the model and data knowledge", "Follows your AI roadmap rather than a parallel one"],
    Visual: AiMl,
  },
  {
    key: "fullstack",
    tab: "Full Stack",
    title: "Full Stack Coverage",
    text: "Specialists in frontend, backend, mobile, DevOps and QA, supplied one at a time or as a pod.",
    points: ["Single specialists to fill one vacant seat", "Ready-made pods when an entire workstream needs people", "Mobile, web and platform engineers drawn from one pool", "DevOps and QA on offer next to the build roles"],
    Visual: FullStack,
  },
  {
    key: "data",
    tab: "Data",
    title: "Data Scientists and Data Engineers",
    text: "Pipeline architecture and AI-ready data infrastructure, created side by side with your own team.",
    points: ["Pipelines designed together with your data owners", "AI-ready infrastructure instead of one-time extracts", "Experience with warehouses and streaming on many stacks", "The knowledge remains with your team once we finish"],
    Visual: DataFlow,
  },
  {
    key: "onboarding",
    tab: "Onboarding",
    title: "Rapid Onboarding",
    text: "Vetted engineers are matched to you and brought into your team, usually in a matter of weeks.",
    points: ["Matches drawn from a pool of engineers we have already vetted", "Vetting tailored to the role before you see any profile", "Your team always has the last word", "Start dates counted in weeks rather than hiring quarters"],
    Visual: Onboarding,
  },
  {
    key: "integration",
    tab: "Integration",
    title: "Direct Team Integration",
    text: "Engineers follow your sprint rhythm, join your stand-ups and use your tools, with no separate reporting line.",
    points: ["Your sprint rhythm and ceremonies, not ours", "Your tools, whether Jira, Slack, GitHub or the others", "Reports within the team structure you already have", "No extra vendor status calls for you to run"],
    Visual: Integration,
  },
  {
    key: "scaling",
    tab: "Scaling",
    title: "Flexible Scaling",
    text: "Increase or cut headcount as the roadmap changes, with no hiring or redundancy round.",
    points: ["Grow for a delivery push, then shrink afterwards", "Change a role when the roadmap takes a new shape", "You carry no severance or bench cost", "TechClues takes care of employment and payroll"],
    Visual: Scaling,
  },
];

/** Role tabs with an example panel each. Rotates on its own while visible until a tab is chosen. */
export default function StaffCapabilities() {
  const [i, setI] = useState(0);
  const [manual, setManual] = useState(false);
  const [seen, setSeen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!seen || manual || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI((n) => (n + 1) % TABS.length), 7000);
    return () => clearTimeout(t);
  }, [i, seen, manual]);

  const cur = TABS[i];
  const V = cur.Visual;
  return (
    <div ref={ref}>
      <div role="tablist" aria-label="Roles you can add" className="mt-8 flex flex-wrap gap-2 lg:mt-10">
        {TABS.map((t, n) => (
          <button
            key={t.key}
            id={`staff-tab-${t.key}`}
            role="tab"
            aria-selected={n === i}
            aria-controls="staff-panel"
            onClick={() => {
              setManual(true);
              setI(n);
            }}
            className={cn("rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-300", n === i ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25")}
          >
            {t.tab}
          </button>
        ))}
      </div>
      <div id="staff-panel" role="tabpanel" aria-labelledby={`staff-tab-${cur.key}`} className="mt-6 grid items-center gap-8 rounded-[28px] bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-10">
        <div key={cur.key} className="staff-fade">
          <h3 className="text-[clamp(1.6rem,2.4vw,2.2rem)] font-normal leading-tight tracking-[-0.03em] text-ink">{cur.title}</h3>
          <p className="mt-4 max-w-[460px] text-[16px] leading-relaxed text-ink-soft">{cur.text}</p>
          <ul className="mt-6 grid gap-3">
            {cur.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[15px] leading-snug text-ink">
                <span className="mt-[7px] size-1.5 shrink-0 rotate-45 bg-brand" />
                {p}
              </li>
            ))}
          </ul>
          <a href="/book-a-call" className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-[14px] font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white">
            Speak with us about this role
            <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </a>
        </div>
        <div key={`${cur.key}-v`} className="staff-fade relative isolate overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0e0f31_0%,#111a4a_55%,#13307f_100%)] p-5 sm:p-6">
          <span className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-brand/35 blur-[80px]" />
          <V />
        </div>
      </div>
      <div className="mt-6 flex justify-center gap-2" aria-hidden="true">
        {TABS.map((t, n) => (
          <span key={t.key} className={cn("h-1.5 rounded-full transition-all duration-500", n === i ? "w-7 bg-brand" : "w-1.5 bg-ink/15")} />
        ))}
      </div>
    </div>
  );
}
