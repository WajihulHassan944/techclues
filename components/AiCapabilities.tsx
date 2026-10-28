"use client";

import { useEffect, useRef, useState } from "react";

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");
type Row = [string, "shipped" | "in build"];

const Mono = ({ children, className }: { children: React.ReactNode; className?: string }) => <p className={cn("font-mono text-[11px] uppercase tracking-[0.14em] text-white/45", className)}>{children}</p>;

function Status({ rows }: { rows: Row[] }) {
  return (
    <ul className="grid gap-2.5 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
      {rows.map(([n, s]) => (
        <li key={n} className="flex items-center justify-between gap-4 text-[13px] text-white/85">
          {n}
          <span className={cn("font-mono text-[11px]", s === "shipped" ? "text-brand-soft" : "text-white/45")}>{s}</span>
        </li>
      ))}
    </ul>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3.5">
      <Mono>{label}</Mono>
      <p className="mt-1 text-[28px] leading-none tracking-[-0.03em] text-white">{value}</p>
    </div>
  );
}

type Tab = { key: string; tab: string; title: string; text: string; points: string[]; metric: [string, string]; rows: Row[]; img: string };
const TABS: Tab[] = [
  {
    key: "assistants", tab: "Chatbots & Assistants", title: "Assistants That Actually Know Your Business",
    text: "Chat and voice assistants grounded in your own docs, tickets and product data — not generic answers.",
    points: ["Scoped to your own knowledge base, not the open web", "Handoff to a human the moment it's out of its depth", "Deployed on your site, in your app, or inside Slack/Teams", "Logged and reviewable, so you can see what it actually said"],
    metric: ["Resolved without a human", "61%"], rows: [["Knowledge grounding", "shipped"], ["Human handoff", "shipped"], ["Voice mode", "in build"], ["Analytics", "shipped"]], img: "/images/services/ai.jpg",
  },
  {
    key: "automation", tab: "Workflow Automation", title: "Automating the Work Nobody Enjoys",
    text: "The repetitive steps between your tools — data entry, approvals, follow-ups — handled without a person in the loop.",
    points: ["Maps your actual process before automating anything", "Connects the tools you already use, no rip-and-replace", "Exceptions route to a human instead of failing silently", "Every run logged, so you can see exactly what happened"],
    metric: ["Manual hours saved / wk", "18+"], rows: [["Trigger & routing", "shipped"], ["Exception handling", "shipped"], ["Audit log", "shipped"], ["Self-serve rules", "in build"]], img: "/images/blog/ai-funding.jpg",
  },
  {
    key: "data", tab: "Data & RAG", title: "Search and Answers Over Your Own Data",
    text: "Retrieval-augmented pipelines that let a model reason over your documents, tickets and records accurately.",
    points: ["Ingests PDFs, wikis, tickets and databases alike", "Citations back to the source, not just an answer", "Re-indexes automatically as your content changes", "Access control respected — no leaking private data"],
    metric: ["Answer accuracy", "92%"], rows: [["Ingestion pipeline", "shipped"], ["Source citations", "shipped"], ["Access control", "shipped"], ["Multi-modal search", "in build"]], img: "/images/blog/product-strategy.jpg",
  },
  {
    key: "vision", tab: "Computer Vision", title: "Vision Models for Real-World Inspection",
    text: "Image and video models trained on your own data — defect detection, counting, classification.",
    points: ["Trained on your own labelled imagery, not generic sets", "Runs on-device or in the cloud depending on latency needs", "Flags low-confidence cases for a human to check", "Retrains as new edge cases get labelled over time"],
    metric: ["Detection accuracy", "96%"], rows: [["Model training", "shipped"], ["Edge deployment", "in build"], ["Confidence flagging", "shipped"]], img: "/images/services/mvp.jpg",
  },
  {
    key: "predictive", tab: "Predictive Models", title: "Forecasts Built Into the Decision, Not a Dashboard",
    text: "Churn, demand and risk models wired directly into the workflow that acts on them.",
    points: ["Trained on your historical data, validated before trusting it", "Surfaced where the decision actually gets made", "Monitored for drift, not left to quietly go stale", "Explainable enough that a human can sanity-check it"],
    metric: ["Forecast lead time", "+3 weeks"], rows: [["Model training", "shipped"], ["Drift monitoring", "shipped"], ["Explainability", "in build"]], img: "/images/company/office-meeting.jpg",
  },
  {
    key: "ops", tab: "Integration & Ops", title: "Getting AI Safely Into Production",
    text: "Evals, guardrails and monitoring so an AI feature behaves the same in production as it did in the demo.",
    points: ["Automated evals before anything reaches production", "Guardrails against prompt injection and data leakage", "Cost and latency monitored per feature, not just overall", "A clear rollback path if a model update misbehaves"],
    metric: ["Uptime on shipped features", "99.9%"], rows: [["Eval suite", "shipped"], ["Guardrails", "shipped"], ["Cost monitoring", "shipped"], ["Rollback path", "shipped"]], img: "/images/company/team-meeting.jpg",
  },
];

/** "Every AI discipline under one roof" tabs — same mechanic as the game page's capability tabs. */
export default function AiCapabilities() {
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
  return (
    <div ref={ref} className="staff-tabs-center">
      <div role="tablist" aria-label="AI disciplines" className="mt-8 flex flex-wrap gap-2 lg:mt-10">
        {TABS.map((t, n) => (
          <button
            key={t.key}
            id={`ai-tab-${t.key}`}
            role="tab"
            aria-selected={n === i}
            aria-controls="ai-panel"
            onClick={() => {
              setManual(true);
              setI(n);
            }}
            className={cn("inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-300", n === i ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25")}
          >
            {t.tab}
          </button>
        ))}
      </div>
      <div id="ai-panel" role="tabpanel" aria-labelledby={`ai-tab-${cur.key}`} className="mt-6 grid items-center gap-8 rounded-[28px] bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-10">
        <div key={cur.key} className="gd-flip text-left">
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
          <a href="#get-started" className="group mt-8 inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-5 text-[14px] font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white">
            Talk this through with us
            <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </a>
        </div>
        <div key={`${cur.key}-v`} className="gd-flip gd-shot relative isolate min-h-[340px] overflow-hidden rounded-[24px] bg-ink text-left lg:min-h-[420px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={cur.img} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
          <span className="gd-shot-shade absolute inset-0 -z-10" />
          <div className="absolute inset-x-4 bottom-4 grid gap-3 sm:inset-x-6 sm:bottom-6 sm:grid-cols-[auto_1fr] sm:items-end">
            <Metric label={cur.metric[0]} value={cur.metric[1]} />
            <Status rows={cur.rows} />
          </div>
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
