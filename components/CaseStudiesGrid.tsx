"use client";

import { useEffect, useRef, useState } from "react";

type Study = { key: string; sector: string; services: string[]; card: React.ReactNode };

const STUDIES: Study[] = [
  {
    key: "infinite-running-league",
    sector: "Sports & fitness",
    services: ["MVPs & Custom Platforms", "UI/UX & Prototyping", "Performance Marketing", "Strategy & Brand Identity"],
    card: (
      <a href="/case-studies/infinite-running-league" className="group block"><div className="relative aspect-[16/11] overflow-hidden rounded-[28px] sm:rounded-[32px]" style={{background: "linear-gradient(135deg, #0064ff 0%, #2f8cff 50%, #5cc2ff 100%)"}}><img alt="Sprinter in the starting blocks holding a relay baton on a red running track" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/case-studies/infinite-running-league.jpg" /><span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,49,0.75)_0%,rgba(14,15,49,0.1)_50%,rgba(14,15,49,0.2)_100%)]"></span><div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8"><div className="flex flex-wrap gap-2"><span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{"Sports & fitness"}</span><span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">Website</span><span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">Web app</span></div><div className="flex items-end justify-between gap-4"><p className="text-[clamp(1.7rem,3vw,2.8rem)] leading-none tracking-[-0.045em] text-white">Infinite Running League</p></div></div></div><div className="mt-5 flex items-start justify-between gap-6"><div><h2 className="text-[clamp(1.3rem,1.9vw,1.65rem)] leading-snug tracking-[-0.03em] text-ink">The first relay running league platform</h2><p className="mt-1.5 text-[15px] text-ink-soft">1,000+ sign-ups before a line of code.</p></div><span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></div></a>
    ),
  },
  {
    key: "odogwu",
    sector: "Retail & e-commerce",
    services: ["MVPs & Custom Platforms", "UI/UX & Prototyping", "E-commerce & Marketplaces"],
    card: (
      <a href="/case-studies/odogwu" className="group block"><div className="relative aspect-[16/11] overflow-hidden rounded-[28px] sm:rounded-[32px]" style={{background: "linear-gradient(135deg, #1f6b3a 0%, #35a05a 55%, #9fd9a8 100%)"}}><img alt="Stocked aisles in a grocery warehouse" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/case-studies/odogwu.jpg" /><span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,49,0.75)_0%,rgba(14,15,49,0.1)_50%,rgba(14,15,49,0.2)_100%)]"></span><div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8"><div className="flex flex-wrap gap-2"><span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{"Retail & e-commerce"}</span><span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">Website</span><span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">Web app</span></div><div className="flex items-end justify-between gap-4"><p className="text-[clamp(1.7rem,3vw,2.8rem)] leading-none tracking-[-0.045em] text-white">Odogwu Foods</p></div></div></div><div className="mt-5 flex items-start justify-between gap-6"><div><h2 className="text-[clamp(1.3rem,1.9vw,1.65rem)] leading-snug tracking-[-0.03em] text-ink">A custom online grocery store for African and Afro-Caribbean food</h2><p className="mt-1.5 text-[15px] text-ink-soft">Built for UK shoppers, with smart delivery rules.</p></div><span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></div></a>
    ),
  },
];

const ALL_SECTORS = "All sectors";
const ALL_SERVICES = "All services";
const SECTORS = [ALL_SECTORS, ...Array.from(new Set(STUDIES.map((s) => s.sector)))];
const SERVICE_ORDER = ["MVPs & Custom Platforms", "Prototype to Production", "Web & Mobile Apps", "UI/UX & Prototyping", "Low-Code / No-Code", "E-commerce & Marketplaces", "Performance Marketing", "Strategy & Brand Identity"];
const SERVICES = [ALL_SERVICES, ...SERVICE_ORDER.filter((t) => STUDIES.some((s) => s.services.includes(t)))];

const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

const Chevron = ({ open }: { open: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cn("lucide lucide-chevron-down size-4 text-muted transition-transform duration-300", open && "rotate-180")} aria-hidden="true">
    <path d="m6 9 6 6 6-6" />
  </svg>
);
const Tick = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-4 shrink-0 text-brand" aria-hidden="true">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

function Dropdown({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  // Keep the list mounted briefly so it can fade out.
  useEffect(() => {
    if (open) {
      setShown(true);
      return;
    }
    const t = setTimeout(() => setShown(false), 280);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        className={cn("flex h-11 items-center gap-2.5 rounded-full border bg-white pl-4 pr-3.5 text-[14px] transition-colors duration-300", open ? "border-ink text-ink" : "border-ink/15 text-ink hover:border-ink/40")}
      >
        <span className="text-muted">{label}</span>
        <span>{value}</span>
        <Chevron open={open} />
      </button>
      {shown && (
        <ul
          role="listbox"
          aria-label={label}
          data-lenis-prevent="true"
          className="absolute left-0 top-[calc(100%+8px)] z-30 max-h-[320px] w-[260px] origin-top overflow-y-auto overscroll-contain rounded-2xl border border-ink/10 bg-white p-1.5 shadow-[0_28px_60px_-30px_rgba(14,15,49,0.4)]"
          style={{ opacity: open ? 1 : 0, transform: open ? "none" : "translateY(-6px) scale(.98)", transition: "opacity .28s cubic-bezier(.65,0,.35,1), transform .28s cubic-bezier(.65,0,.35,1)" }}
        >
          {options.map((o) => (
            <li key={o}>
              <button
                type="button"
                role="option"
                aria-selected={o === value}
                onClick={() => {
                  onChange(o);
                  setOpen(false);
                }}
                className={cn("flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left text-[14px] transition-colors duration-200", o === value ? "bg-[#eef3ff] text-ink" : "text-ink-soft hover:bg-paper hover:text-ink")}
              >
                {o}
                {o === value && <Tick />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** The case study grid with its Sector and Service filters. */
export default function CaseStudiesGrid() {
  const [sector, setSector] = useState(ALL_SECTORS);
  const [service, setService] = useState(ALL_SERVICES);
  const list = STUDIES.filter((s) => (sector === ALL_SECTORS || s.sector === sector) && (service === ALL_SERVICES || s.services.includes(service)));
  const filtered = sector !== ALL_SECTORS || service !== ALL_SERVICES;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Dropdown label="Sector" value={sector} options={SECTORS} onChange={setSector} />
          <Dropdown label="Service" value={service} options={SERVICES} onChange={setService} />
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setSector(ALL_SECTORS);
                setService(ALL_SERVICES);
              }}
              className="h-11 px-2 text-[14px] text-muted transition-colors duration-300 hover:text-ink"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-[14px] tabular-nums text-muted">
          {list.length} {list.length === 1 ? "project" : "projects"}
        </p>
      </div>
      <p className="mt-5 flex items-start gap-2 text-[14px] leading-relaxed text-muted">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock mt-[3px] size-3.5 shrink-0 text-ink/40" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        Some of this work was built under an NDA, so a few product details stay confidential. Everything here is shared with the client&apos;s permission.
      </p>
      <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-12">
        {list.map((s) => (
          <div key={s.key} className="cs-in">
            {s.card}
          </div>
        ))}
      </div>
    </>
  );
}
