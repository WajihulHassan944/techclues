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
    key: "cycle", tab: "Full Cycle", title: "Full Cycle Development",
    text: "Development from the first concept and design right through to release and support after launch.",
    points: ["Concept work, design and pre-production planning", "Main engineering work in Unity and Unreal", "QA, certification and submission to each platform", "Updates after launch and ongoing live support"],
    metric: ["Build health", "100%"], rows: [["Concept", "shipped"], ["Engineering", "in build"], ["QA", "shipped"], ["Live Ops", "shipped"]], img: "/images/game/studio.jpg",
  },
  {
    key: "art", tab: "Art & Assets", title: "Game Art and Asset Creation",
    text: "Characters, environments, props and animation produced with premium modelling and texturing.",
    points: ["Modelling of characters and creatures", "Environment art and world creation", "Rigging plus animation", "Technical art and shader development"],
    metric: ["Polycount", "42K"], rows: [["Characters", "shipped"], ["Environments", "in build"], ["VFX", "shipped"]], img: "/images/game/art3d.jpg",
  },
  {
    key: "xr", tab: "AR / VR / XR", title: "AR, VR and XR Development",
    text: "Immersive AR and VR games made with the newest interactive 3D tech.",
    points: ["Native builds aimed at Quest, Vision Pro and PSVR2", "Hand tracking and spatial interaction design work", "Performance optimisation for standalone headsets", "AR experiences on mobile and wearable devices"],
    metric: ["Frame rate", "90 FPS"], rows: [["Quest 3", "shipped"], ["Vision Pro", "in build"], ["PC VR", "shipped"]], img: "/images/game/vr.jpg",
  },
  {
    key: "multi", tab: "Multiplayer", title: "Multiplayer and Networked Games",
    text: "Dependable networking, server architecture and cloud integration to power online play.",
    points: ["Architecture for dedicated servers and matchmaking", "Client-server netcode with lag compensation", "Cloud scaling to handle concurrent players", "Cross-platform play with synced progression"],
    metric: ["Ping", "42ms"], rows: [["Matchmaking", "shipped"], ["Replication", "in build"], ["Anti-cheat", "shipped"]], img: "/images/game/lan.jpg",
  },
  {
    key: "web3", tab: "Web3 & Metaverse", title: "Web3 and Metaverse",
    text: "Wallet sign-in, digital collectibles and ownable land built into genuine gameplay loops.",
    points: ["Wallet integration with on-chain identity", "NFT-backed items that serve a real purpose", "Mechanics for land and asset ownership", "Design of the marketplace and economy"],
    metric: ["Gas cost", "-30%"], rows: [["Wallet Connect", "shipped"], ["Marketplace", "in build"], ["Smart Contract", "shipped"]], img: "/images/game/neon-city.jpg",
  },
  {
    key: "uefn", tab: "UEFN & Verse", title: "UEFN and Verse",
    text: "Bespoke Fortnite islands featuring tailor-made environments and original gameplay logic.",
    points: ["Bespoke islands created in UEFN", "Original gameplay logic coded in Verse", "Devices and props made from the ground up", "Publishing ready for Discover, plus iteration"],
    metric: ["Status", "Published to Discover"], rows: [["Island Build", "shipped"], ["Verse Scripting", "in build"], ["Playtesting", "shipped"]], img: "/images/game/code.jpg",
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

  const cur = TABS[i];
  return (
    <div ref={ref} className="staff-tabs-center">
      <div role="tablist" aria-label="Disciplines" className="mt-8 flex flex-wrap gap-2 lg:mt-10">
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
            className={cn("inline-flex items-center gap-2.5 rounded-full px-5 py-2.5 text-[14px] font-medium transition-colors duration-300", n === i ? "bg-ink text-white" : "bg-white text-ink-soft ring-1 ring-ink/10 hover:text-ink hover:ring-ink/25")}
          >
            {t.tab}
          </button>
        ))}
      </div>
      <div id="game-panel" role="tabpanel" aria-labelledby={`game-tab-${cur.key}`} className="mt-6 grid items-center gap-8 rounded-[28px] bg-white p-6 sm:p-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:p-10">
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
