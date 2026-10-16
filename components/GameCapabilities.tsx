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

const S = { fill: "none", stroke: "currentColor", strokeWidth: 1.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const Art = ({ children }: { children: React.ReactNode }) => (
  <svg viewBox="0 0 200 140" className="mx-auto h-full max-h-[240px] w-full text-brand-soft" aria-hidden="true" {...S}>
    {children}
  </svg>
);

const arts: Record<string, React.ReactNode> = {
  cycle: (
    <Art>
      <rect x="40" y="38" width="120" height="64" rx="32" />
      <rect x="86" y="54" width="36" height="26" rx="4" />
      <path d="m92 74 8-9 6 6 4-3 6 6" />
      <path d="M62 62h12M68 56v12" />
      <circle cx="138" cy="58" r="3" />
      <circle cx="146" cy="68" r="3" />
      <circle cx="46" cy="104" r="20" opacity=".5" />
      <circle cx="154" cy="104" r="20" opacity=".5" />
    </Art>
  ),
  art: (
    <Art>
      <path d="M100 24 148 52v52l-48 28-48-28V52Z" />
      <path d="M100 24v52m0 0 48-24m-48 24-48-24m48 24v56" opacity=".6" />
      <path d="m76 64 24 14 24-14M76 90l24 14 24-14" opacity=".35" />
    </Art>
  ),
  xr: (
    <Art>
      <path d="M46 52c0-8 6-14 14-14h80c8 0 14 6 14 14v34c0 8-6 14-14 14h-22l-8-12h-24l-8 12H60c-8 0-14-6-14-14Z" />
      <circle cx="76" cy="70" r="13" />
      <circle cx="124" cy="70" r="13" />
      <path d="M46 62H34m132 0h-12" opacity=".6" />
    </Art>
  ),
  net: (
    <Art>
      <circle cx="100" cy="70" r="14" />
      {[[40, 36], [160, 36], [34, 108], [166, 108]].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r="9" />
          <path d={`M${x} ${y} L100 70`} opacity=".5" strokeDasharray="3 4" />
        </g>
      ))}
    </Art>
  ),
  chain: (
    <Art>
      <path d="M70 44h40a24 24 0 0 1 0 48H70Z" opacity=".55" />
      <circle cx="132" cy="68" r="26" />
      <path d="M124 60h14m-14 16h14M131 54v28" />
      <path d="M52 100h48" opacity=".4" />
    </Art>
  ),
  uefn: (
    <Art>
      <rect x="30" y="30" width="140" height="84" rx="8" />
      <path d="M30 48h140M62 48v66" opacity=".6" />
      <path d="M74 66h40M74 78h56M74 90h30" opacity=".7" />
      <path d="M40 62h14M40 74h14M40 86h14" opacity=".4" />
    </Art>
  ),
};

type Tab = { key: string; tab: string; title: string; text: string; points: string[]; metric: [string, string]; rows: Row[]; art: string };
const TABS: Tab[] = [
  {
    key: "cycle", tab: "Full Cycle", title: "Full Cycle Development",
    text: "End-to-end development from initial concept and design to deployment and post-launch support.",
    points: ["Concept, design and pre-production planning", "Core engineering across Unity and Unreal", "QA, certification and platform submission", "Post-launch updates and live support"],
    metric: ["Build health", "100%"], rows: [["Concept", "shipped"], ["Engineering", "in build"], ["QA", "shipped"], ["Live Ops", "shipped"]], art: "cycle",
  },
  {
    key: "art", tab: "Art & Assets", title: "Game Art and Asset Creation",
    text: "Characters, environments, props and animation using high-end modelling and texturing.",
    points: ["Character and creature modelling", "Environment art and world building", "Rigging and animation", "Technical art and shader work"],
    metric: ["Polycount", "42K"], rows: [["Characters", "shipped"], ["Environments", "in build"], ["VFX", "shipped"]], art: "art",
  },
  {
    key: "xr", tab: "AR / VR / XR", title: "AR, VR and XR Development",
    text: "Immersive AR and VR games built on the latest interactive 3D technologies.",
    points: ["Native builds for Quest, Vision Pro and PSVR2", "Hand tracking and spatial interaction design", "Performance tuning for standalone headsets", "AR experiences for mobile and wearables"],
    metric: ["Frame rate", "90 FPS"], rows: [["Quest 3", "shipped"], ["Vision Pro", "in build"], ["PC VR", "shipped"]], art: "xr",
  },
  {
    key: "multi", tab: "Multiplayer", title: "Multiplayer and Networked Games",
    text: "Robust network support, server architecture and cloud integration for online play.",
    points: ["Dedicated server and matchmaking architecture", "Client-server netcode and lag compensation", "Cloud scaling for concurrent players", "Cross-platform play and progression sync"],
    metric: ["Ping", "42ms"], rows: [["Matchmaking", "shipped"], ["Replication", "in build"], ["Anti-cheat", "shipped"]], art: "net",
  },
  {
    key: "web3", tab: "Web3 & Metaverse", title: "Web3 and Metaverse",
    text: "Wallet sign-in, digital collectibles and ownable land wired into real gameplay loops.",
    points: ["Wallet integration and on-chain identity", "NFT-backed items with real utility", "Land and asset ownership mechanics", "Marketplace and economy design"],
    metric: ["Gas cost", "-30%"], rows: [["Wallet Connect", "shipped"], ["Marketplace", "in build"], ["Smart Contract", "shipped"]], art: "chain",
  },
  {
    key: "uefn", tab: "UEFN & Verse", title: "UEFN and Verse",
    text: "Custom Fortnite islands with bespoke environments and original gameplay logic.",
    points: ["Custom islands built in UEFN", "Original gameplay logic written in Verse", "Devices and props authored from scratch", "Discovery-ready publishing and iteration"],
    metric: ["Status", "Published to Discover"], rows: [["Island Build", "shipped"], ["Verse Scripting", "in build"], ["Playtesting", "shipped"]], art: "uefn",
  },
];

/** "Every discipline under one roof" tabs. Rotates while visible until a tab is chosen. */
export default function GameCapabilities() {
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

  useEffect(() => {
    if (!seen) return;
    const key = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || /input|textarea|select/i.test((e.target as HTMLElement)?.tagName)) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= TABS.length) {
        setManual(true);
        setI(n - 1);
      }
    };
    addEventListener("keydown", key);
    return () => removeEventListener("keydown", key);
  }, [seen]);

  const cur = TABS[i];
  return (
    <div ref={ref} className="staff-tabs-center">
      <p className="gx-mono mt-8 text-center text-muted">Select your class · press 1–6</p>
      <div role="tablist" aria-label="Disciplines" className="mt-4 flex flex-wrap gap-2">
        {TABS.map((t, n) => (
          <button
            key={t.key}
            id={`game-tab-${t.key}`}
            role="tab"
            aria-selected={n === i}
            aria-controls="game-panel"
            onClick={() => {
              setManual(true);
              setI(n);
            }}
            className={cn("inline-flex items-center gap-2.5 rounded-full py-2.5 pl-3 pr-5 text-[14px] font-medium transition-colors duration-300", n === i ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25")}
          >
            <kbd aria-hidden="true" className="gx-key">{n + 1}</kbd>
            {t.tab}
          </button>
        ))}
      </div>
      <div id="game-panel" role="tabpanel" aria-labelledby={`game-tab-${cur.key}`} className="mt-6 grid items-center gap-8 rounded-[28px] bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-10">
        <div key={cur.key} className="staff-fade text-left">
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
            Discuss this with us
            <svg viewBox="0 0 24 24" className="size-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
          </a>
        </div>
        <div key={`${cur.key}-v`} className="staff-fade gx-crt relative isolate grid min-h-[300px] gap-4 overflow-hidden rounded-[24px] bg-[linear-gradient(135deg,#0e0f31_0%,#111a4a_55%,#13307f_100%)] p-5 text-left sm:grid-cols-[1.2fr_1fr] sm:p-6">
          <span className="pointer-events-none absolute -right-20 -top-24 -z-10 size-64 rounded-full bg-brand/35 blur-[80px]" />
          <div className="grid place-items-center rounded-2xl border border-white/10 bg-white/[0.03] p-4">{arts[cur.art]}</div>
          <div className="grid content-start gap-3">
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
