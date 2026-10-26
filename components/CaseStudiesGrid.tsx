"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicCaseStudy } from "@/lib/api/case-studies";
import { industryLabel, serviceLabel } from "@/lib/case-study-meta";

const ALL_SECTORS = "All sectors";
const ALL_SERVICES = "All services";

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

function Card({ study }: { study: PublicCaseStudy }) {
  return (
    <a href={`/case-studies/${study.slug}`} className="group block">
      <div className="relative aspect-[16/11] overflow-hidden rounded-[28px] sm:rounded-[32px] bg-[linear-gradient(135deg,#0064ff_0%,#2f8cff_50%,#5cc2ff_100%)]">
        <img alt={study.coverAlt || study.title} loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" src={study.cover} />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,49,0.75)_0%,rgba(14,15,49,0.1)_50%,rgba(14,15,49,0.2)_100%)]"></span>
        <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            {study.featured && <span className="rounded-full border border-white/25 bg-brand/80 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">Featured</span>}
            <span className="rounded-full border border-white/25 bg-ink/40 px-3 py-1 text-[12px] font-medium text-white backdrop-blur-md">{industryLabel(study.industry)}</span>
          </div>
          <div className="flex items-end justify-between gap-4">
            <p className="text-[clamp(1.7rem,3vw,2.8rem)] leading-none tracking-[-0.045em] text-white">{study.client}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h2 className="text-[clamp(1.3rem,1.9vw,1.65rem)] leading-snug tracking-[-0.03em] text-ink">{study.title}</h2>
          <p className="mt-1.5 text-[15px] text-ink-soft">{study.excerpt}</p>
          <p className="mt-3 text-[13px] text-muted">{study.services.map(serviceLabel).join(" · ")}</p>
          <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink transition-colors group-hover:text-brand">Read the case study</span>
        </div>
        <span className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-ink/15 transition-all duration-500 group-hover:rotate-45 group-hover:border-ink group-hover:bg-ink group-hover:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-5" aria-hidden="true">
            <path d="M7 7h10v10"></path>
            <path d="M7 17 17 7"></path>
          </svg>
        </span>
      </div>
    </a>
  );
}

/** The case study grid with its Sector and Service filters. `studies` comes from the public API
 *  (see lib/api/case-studies.ts) — only published case studies are ever passed in. */
export default function CaseStudiesGrid({ studies }: { studies: PublicCaseStudy[] }) {
  const [sector, setSector] = useState(ALL_SECTORS);
  const [service, setService] = useState(ALL_SERVICES);

  const sectors = [ALL_SECTORS, ...Array.from(new Set(studies.map((s) => industryLabel(s.industry))))];
  const serviceList = [ALL_SERVICES, ...Array.from(new Set(studies.flatMap((s) => s.services.map(serviceLabel))))];

  const list = studies.filter((s) => (sector === ALL_SECTORS || industryLabel(s.industry) === sector) && (service === ALL_SERVICES || s.services.map(serviceLabel).includes(service)));
  const filtered = sector !== ALL_SECTORS || service !== ALL_SERVICES;

  if (studies.length === 0) {
    return <p className="text-[16px] text-ink-soft">New case studies are on the way — check back soon.</p>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-6">
        <div className="flex flex-wrap items-center gap-2.5">
          <Dropdown label="Sector" value={sector} options={sectors} onChange={setSector} />
          <Dropdown label="Service" value={service} options={serviceList} onChange={setService} />
          {filtered && (
            <button
              type="button"
              onClick={() => {
                setSector(ALL_SECTORS);
                setService(ALL_SERVICES);
              }}
              className="h-11 px-2 text-[14px] text-muted transition-colors duration-300 hover:text-ink"
            >
              Reset
            </button>
          )}
        </div>
        <p className="text-[14px] tabular-nums text-muted">
          {list.length} {list.length === 1 ? "project" : "projects"}
        </p>
      </div>
      <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-12">
        {list.map((s) => (
          <div key={s._id} className="cs-in">
            <Card study={s} />
          </div>
        ))}
      </div>
    </>
  );
}
