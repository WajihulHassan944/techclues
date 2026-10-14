"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Step = { node?: string; dir?: "in" | "out"; text: string; action?: "Approve" | "Take over" };
type Job = { key: string; label: string; title: string; steps: Step[] };

const JOBS: Job[] = [
  {
    key: "enquiry",
    label: "Enquiries",
    title: "A new enquiry comes in",
    steps: [
      { node: "Gmail", dir: "in", text: "Reads the new enquiry in Gmail" },
      { node: "HubSpot", dir: "in", text: "Finds the customer's history in HubSpot" },
      { node: "Google Sheets", dir: "in", text: "Checks your prices in Google Sheets" },
      { text: "Drafts a reply with prices and next steps" },
      { node: "you", dir: "out", text: "You check the draft", action: "Approve" },
      { node: "Gmail", dir: "out", text: "Sends the reply from your inbox" },
      { node: "HubSpot", dir: "out", text: "Logs the conversation in HubSpot" },
    ],
  },
  {
    key: "invoice",
    label: "Invoices",
    title: "A supplier invoice arrives",
    steps: [
      { node: "Gmail", dir: "in", text: "Picks up the PDF invoice from Gmail" },
      { text: "Reads the supplier, date, total and VAT" },
      { node: "Google Sheets", dir: "in", text: "Matches it to your purchase orders" },
      { node: "you", dir: "out", text: "Flags a mismatch for you to check", action: "Approve" },
      { node: "Xero", dir: "out", text: "Posts the bill to Xero" },
      { node: "Slack", dir: "out", text: "Lets your finance channel know in Slack" },
    ],
  },
  {
    key: "support",
    label: "Support",
    title: "A customer asks about an order",
    steps: [
      { node: "WhatsApp", dir: "in", text: "Reads the question on WhatsApp" },
      { node: "Zendesk", dir: "in", text: "Finds the order and past tickets in Zendesk" },
      { text: "Writes an answer from your help articles" },
      { node: "WhatsApp", dir: "out", text: "Replies to the customer straight away" },
      { node: "you", dir: "out", text: "Hands anything tricky to your team", action: "Take over" },
      { node: "Zendesk", dir: "out", text: "Logs the conversation in Zendesk" },
    ],
  },
  {
    key: "report",
    label: "Reports",
    title: "Your weekly report",
    steps: [
      { node: "Xero", dir: "in", text: "Pulls this week's sales from Xero" },
      { node: "HubSpot", dir: "in", text: "Pulls new leads and deals from HubSpot" },
      { node: "Google Sheets", dir: "out", text: "Updates your report in Google Sheets" },
      { text: "Writes a plain-English summary of what changed" },
      { node: "you", dir: "out", text: "You read it before it goes out", action: "Approve" },
      { node: "Slack", dir: "out", text: "Shares it with your team in Slack" },
    ],
  },
];

const NODES: { node: string; angle: number }[] = [
  { node: "Gmail", angle: -90 },
  { node: "HubSpot", angle: -45 },
  { node: "Google Sheets", angle: 0 },
  { node: "Xero", angle: 45 },
  { node: "you", angle: 90 },
  { node: "Slack", angle: 135 },
  { node: "Zendesk", angle: 180 },
  { node: "WhatsApp", angle: 225 },
];

type Tech = { name: string; href?: string; hex?: string; mark?: string };

const LOGOS: Record<string, Tech> = {
  Gmail: { name: "Gmail", href: "/logos.svg?v=1liiiom#gmail" },
  HubSpot: { name: "HubSpot", href: "/logos.svg?v=1liiiom#hubspot" },
  "Google Sheets": { name: "Google Sheets", href: "/logos.svg?v=1liiiom#google-sheets" },
  Xero: { name: "Xero", href: "/logos.svg?v=1liiiom#xero" },
  Slack: { name: "Slack", hex: "#4A154B" },
  Zendesk: { name: "Zendesk", href: "/logos.svg?v=1liiiom#zendesk" },
  WhatsApp: { name: "WhatsApp", href: "/logos.svg?v=1liiiom#whatsapp" },
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(cb: () => void) {
  const m = matchMedia(REDUCED_MOTION_QUERY);
  m.addEventListener("change", cb);
  return () => m.removeEventListener("change", cb);
}

function nodePos(angle: number) {
  return { x: 50 + 38 * Math.cos((angle * Math.PI) / 180), y: 50 + 38 * Math.sin((angle * Math.PI) / 180) };
}

function TechMark({ tech, className, textClassName }: { tech: Tech; className?: string; textClassName?: string }) {
  if (!tech.href) {
    const small = (tech.mark ?? tech.name).length > 3;
    return (
      <span
        className={`font-semibold leading-none tracking-tight ${textClassName ?? (small ? "text-[8px] sm:text-[10px]" : "text-[10px] sm:text-[13px]")}`}
        style={{ color: tech.hex }}
        role="img"
        aria-label={tech.name}
      >
        {tech.mark ?? tech.name}
      </span>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={tech.name}>
      <use href={tech.href} />
    </svg>
  );
}

export default function AiAtWork() {
  const [jobIndex, setJobIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [userClicked, setUserClicked] = useState(false);
  const [inView, setInView] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  );
  const ref = useRef<HTMLDivElement>(null);
  const job = JOBS[jobIndex];
  const totalSteps = job.steps.length;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || reducedMotion) return;
    if (stepIndex < totalSteps) {
      const delay = job.steps[stepIndex].node === "you" ? 2400 : 1600;
      const id = setTimeout(() => setStepIndex((s) => s + 1), delay);
      return () => clearTimeout(id);
    }
    if (userClicked) return;
    const id = setTimeout(() => {
      setJobIndex((i) => (i + 1) % JOBS.length);
      setStepIndex(0);
    }, 2800);
    return () => clearTimeout(id);
  }, [stepIndex, totalSteps, inView, reducedMotion, userClicked, job]);

  const currentStepIndex = reducedMotion ? totalSteps : stepIndex;
  const currentStep = currentStepIndex < totalSteps ? job.steps[currentStepIndex] : null;
  const isAgentPulsing = currentStep !== null && !currentStep.node;
  const allNodes = new Set(job.steps.map((s) => s.node).filter(Boolean));
  const usedNodes = new Set(job.steps.slice(0, currentStepIndex).map((s) => s.node).filter(Boolean));

  function selectJob(i: number) {
    setUserClicked(true);
    setJobIndex(i);
    setStepIndex(0);
  }

  return (
    <section aria-label="AI at work" className="py-[clamp(56px,7vw,110px)]">
      <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
        <div data-reveal="" style={{ "--reveal-delay": "0s", "--reveal-y": "28px" } as React.CSSProperties}>
          <p className="flex items-center gap-2 text-[14px] font-medium text-muted">
            <span className="size-1.5 rounded-full bg-brand"></span>See it work
          </p>
          <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">
            AI at work in your tools.
          </h2>
          <p className="mt-5 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
            Pick a job to see how AI moves through the tools you already use, and where you stay in control.
          </p>
        </div>

        <div role="tablist" aria-label="Example jobs" className="mt-8 flex flex-wrap gap-2 lg:mt-10">
          {JOBS.map((j, i) => (
            <button
              key={j.key}
              role="tab"
              aria-selected={i === jobIndex}
              aria-controls="ai-feed"
              onClick={() => selectJob(i)}
              className={`rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-300 ${
                i === jobIndex ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25"
              }`}
            >
              {j.label}
            </button>
          ))}
        </div>

        <div ref={ref} className="mt-8 grid items-center gap-10 lg:mt-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
          <div className="relative mx-auto aspect-square w-full max-w-[520px]">
            <span className="pointer-events-none absolute inset-[18%] rounded-full bg-brand/10 blur-3xl"></span>
            <svg aria-hidden="true" viewBox="0 0 100 100" className="absolute inset-0 size-full overflow-visible">
              <circle cx="50" cy="50" r={38} fill="none" stroke="rgba(14,15,49,0.08)" strokeWidth="0.3" strokeDasharray="0.8 1.4" />
              {NODES.map(({ node, angle }) => {
                const p = nodePos(angle);
                const isCurrent = currentStep?.node === node;
                const isUsed = usedNodes.has(node);
                return (
                  <path
                    key={node}
                    d={`M50 50 L${p.x} ${p.y}`}
                    fill="none"
                    strokeLinecap="round"
                    className={[
                      "transition-[stroke,stroke-width,opacity] duration-500",
                      isCurrent && "ai-flow",
                      isCurrent && currentStep?.dir === "in" && "ai-flow-in",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    stroke={isCurrent ? "#0064ff" : isUsed ? "rgba(0,100,255,0.35)" : "rgba(14,15,49,0.1)"}
                    strokeWidth={isCurrent ? 0.55 : 0.35}
                    style={{ opacity: allNodes.has(node) ? 1 : 0.4 }}
                  />
                );
              })}
            </svg>
            {NODES.map(({ node, angle }) => {
              const p = nodePos(angle);
              const isCurrent = currentStep?.node === node;
              const isUsed = usedNodes.has(node);
              const isYou = node === "you";
              const tech = isYou ? null : LOGOS[node];
              return (
                <div
                  key={node}
                  className={`absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center transition-opacity duration-500 ${
                    allNodes.has(node) ? "opacity-100" : "opacity-35"
                  }`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                >
                  <span
                    className={[
                      "relative grid size-11 place-items-center rounded-full border transition-all duration-500 sm:size-14",
                      isYou ? "border-ink bg-ink text-white" : "border-ink/10 bg-white",
                      isCurrent && "scale-110 border-brand shadow-[0_0_0_6px_rgba(0,100,255,0.12),0_14px_30px_-12px_rgba(0,100,255,0.55)]",
                      isCurrent && isYou && "bg-brand",
                      !isCurrent && isUsed && !isYou && "border-brand/40",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {isCurrent && <span className="ai-ping absolute inset-0 rounded-full border border-brand"></span>}
                    {isYou ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user size-5 sm:size-6" aria-hidden="true">
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                    ) : (
                      tech && <TechMark tech={tech} className="size-5 sm:size-6" textClassName="text-[9px] sm:text-[10px]" />
                    )}
                  </span>
                  <span className={`mt-1.5 hidden whitespace-nowrap text-[11.5px] transition-colors duration-500 sm:block ${isCurrent ? "font-medium text-ink" : "text-muted"}`}>
                    {isYou ? "You" : tech?.name}
                  </span>
                </div>
              );
            })}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              {isAgentPulsing && <span className="ai-ping absolute inset-0 rounded-full border-2 border-brand"></span>}
              <span
                className={`relative grid size-20 place-items-center rounded-full bg-[linear-gradient(135deg,#0064ff_0%,#0e0f31_100%)] text-white transition-shadow duration-500 sm:size-24 ${
                  isAgentPulsing ? "shadow-[0_0_0_10px_rgba(0,100,255,0.12),0_24px_50px_-16px_rgba(0,100,255,0.8)]" : "shadow-[0_20px_40px_-18px_rgba(14,15,49,0.6)]"
                }`}
              >
                <span className="whitespace-nowrap text-[13px] font-medium sm:text-[15px]">AI Agent</span>
              </span>
            </div>
          </div>

          <div
            id="ai-feed"
            role="tabpanel"
            className="relative isolate overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#0e0f31_0%,#111a4a_50%,#13307f_100%)] p-6 text-white shadow-[0_40px_80px_-40px_rgba(14,15,49,0.6)] sm:p-8"
          >
            <span className="pointer-events-none absolute -right-24 -top-28 -z-10 size-72 rounded-full bg-brand/35 blur-[90px]"></span>
            <span className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-64 rounded-full bg-brand-soft/15 blur-[90px]"></span>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-[clamp(1.3rem,1.8vw,1.6rem)] font-normal tracking-[-0.025em] text-white">{job.title}</h3>
              <span className="shrink-0 rounded-full bg-white/10 px-3 py-1 text-[12px] text-white/70">Example</span>
            </div>
            <ol className="mt-6 space-y-1">
              {job.steps.map((step, i) => {
                const status = i < currentStepIndex ? "done" : i === currentStepIndex ? "now" : "next";
                const isYou = step.node === "you";
                const tech = step.node && !isYou ? LOGOS[step.node] : null;
                return (
                  <li
                    key={`${job.key}-${i}`}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 transition-[background-color,opacity] duration-500 ${
                      status === "now" ? "bg-white/[0.08]" : ""
                    } ${status === "next" ? "opacity-45" : ""}`}
                  >
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-full border transition-colors duration-500 ${
                        status === "done" ? "border-brand bg-brand text-white" : status === "now" ? "border-brand-soft bg-transparent" : "border-white/30 bg-transparent"
                      }`}
                    >
                      {status === "done" ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5"></path>
                        </svg>
                      ) : status === "now" ? (
                        <span className="size-2 animate-pulse rounded-full bg-brand-soft"></span>
                      ) : null}
                    </span>
                    <span className={`flex-1 text-[15px] leading-snug ${isYou ? "font-medium text-white" : "text-white/85"}`}>{step.text}</span>
                    {isYou && step.action ? (
                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-[12.5px] font-medium transition-colors duration-500 ${
                          status === "done" ? "bg-[#00b67a]/20 text-[#7ee2b8]" : "bg-white text-ink"
                        }`}
                      >
                        {status === "done" ? (step.action === "Approve" ? "Approved" : "Taken over") : step.action}
                      </span>
                    ) : tech ? (
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white" title={tech.name}>
                        <TechMark tech={tech} className="size-4" textClassName="text-[7px]" />
                      </span>
                    ) : (
                      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand/30 text-white" title="AI agent">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-3.5" aria-hidden="true">
                          <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
                          <path d="M20 2v4"></path>
                          <path d="M22 4h-4"></path>
                          <circle cx="4" cy="20" r="2"></circle>
                        </svg>
                      </span>
                    )}
                  </li>
                );
              })}
            </ol>
            <div className="mt-6 flex items-center justify-between gap-4 border-t border-white/10 pt-5">
              <p className="text-[13px] leading-relaxed text-white/55">An example. We design each workflow around your tools and your rules.</p>
              {userClicked && currentStepIndex >= totalSteps && !reducedMotion && (
                <button
                  onClick={() => setStepIndex(0)}
                  className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-white transition-colors hover:text-brand-soft"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
                    <path d="M3 12a9 9 0 1 0 2.64-6.36L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Replay
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
