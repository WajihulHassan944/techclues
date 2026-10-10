"use client";

import { useEffect, useRef, useState } from "react";

type Pkg = { name: string; price: number | null; from: boolean; kind: "project" | "monthly" | "flat" };
type Type = { key: string; name: string; group: string; packages: Pkg[] };

const GROUPS = ["Build", "Design & brand", "Monthly services", "Quick starts"];
const TYPES: Type[] = [
  { key: "zero-one", name: "ZERO.ONE", group: "Quick starts", packages: [{ name: "Core feature, built and tested in a week", price: 499, from: false, kind: "flat" }] },
  { key: "mvp-development", name: "MVPs & Custom Platforms", group: "Build", packages: [
    { name: "Validation MVP", price: 2500, from: true, kind: "project" },
    { name: "Lean MVP", price: 5000, from: true, kind: "project" },
    { name: "Custom / SaaS", price: 10000, from: true, kind: "project" },
  ] },
  { key: "prototype-to-production", name: "Prototype to Production", group: "Build", packages: [
    { name: "Code audit", price: 750, from: false, kind: "project" },
    { name: "Hardening sprint", price: 3500, from: true, kind: "project" },
  ] },
  { key: "web-mobile-apps", name: "Web & Mobile Apps", group: "Build", packages: [
    { name: "Web app · Starter", price: 5000, from: true, kind: "project" },
    { name: "Web app · Business", price: 8500, from: true, kind: "project" },
    { name: "Web app · Advanced", price: 15000, from: true, kind: "project" },
    { name: "Mobile app · Starter", price: 7500, from: true, kind: "project" },
    { name: "Mobile app · Business", price: 12500, from: true, kind: "project" },
    { name: "Mobile app · Advanced", price: 20000, from: true, kind: "project" },
  ] },
  { key: "ui-ux-design", name: "UI/UX & Prototyping", group: "Design & brand", packages: [
    { name: "Essential", price: 1000, from: true, kind: "project" },
    { name: "Product", price: 2000, from: true, kind: "project" },
    { name: "Complete", price: 3500, from: true, kind: "project" },
  ] },
  { key: "low-code-no-code", name: "Low-Code / No-Code", group: "Build", packages: [
    { name: "Launch", price: 2500, from: true, kind: "project" },
    { name: "Business", price: 5000, from: true, kind: "project" },
    { name: "Advanced", price: 8500, from: true, kind: "project" },
  ] },
  { key: "ecommerce-marketplace-development", name: "E-commerce & Marketplaces", group: "Build", packages: [
    { name: "Online store · Basic", price: 1000, from: false, kind: "project" },
    { name: "Online store · Growth", price: 2000, from: true, kind: "project" },
    { name: "Online store · Advanced", price: 3500, from: true, kind: "project" },
    { name: "Marketplace · Launch", price: 5000, from: true, kind: "project" },
    { name: "Marketplace · Growth", price: 8500, from: true, kind: "project" },
    { name: "Marketplace · Scale", price: 15000, from: true, kind: "project" },
  ] },
  { key: "performance-marketing", name: "Performance Marketing", group: "Monthly services", packages: [
    { name: "Launch", price: 750, from: false, kind: "monthly" },
    { name: "Growth", price: 1250, from: false, kind: "monthly" },
    { name: "Scale", price: 2000, from: true, kind: "monthly" },
  ] },
  { key: "brand-strategy", name: "Strategy & Brand Identity", group: "Design & brand", packages: [
    { name: "Essential", price: 750, from: true, kind: "project" },
    { name: "Identity", price: 1500, from: true, kind: "project" },
    { name: "Complete", price: 2500, from: true, kind: "project" },
  ] },
  { key: "ongoing", name: "Ongoing partnership", group: "Monthly services", packages: [{ name: "Support, improvements and growth, monthly", price: null, from: false, kind: "monthly" }] },
  { key: "grant", name: "Grant application support", group: "Quick starts", packages: [{ name: "Preparing a grant application", price: null, from: false, kind: "project" }] },
];

const money = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`;
const pct = (n: number) => `${Number((100 * n).toFixed(1))}%`;
const start = (p: Pkg) => p.price ?? (p.kind === "monthly" ? 1000 : 5000);
const cn = (...a: (string | false | undefined)[]) => a.filter(Boolean).join(" ");

/** 10% (Pro: 12.5%) of fees up to £20,000 and 5% above, monthly services count 6 months, capped at £5,000. */
function commission(value: number, kind: Pkg["kind"], tier: "partner" | "pro") {
  if (kind === "flat") return { total: 50, capped: false, lines: [{ label: "Flat fee for a ZERO.ONE", amount: 50 }] };
  const base = kind === "monthly" ? 6 * value : value;
  const rate = tier === "pro" ? 0.125 : 0.1;
  const low = Math.min(base, 20000);
  const high = Math.max(0, base - 20000);
  const lines = [
    {
      label: kind === "monthly" ? `${pct(rate)} of 6 months' fees${high ? ` up to ${money(20000)}` : ""} (${money(low)})` : `${pct(rate)} of ${high ? `the first ${money(20000)}` : money(low)}`,
      amount: low * rate,
    },
  ];
  if (high) lines.push({ label: `${pct(0.05)} of the ${money(high)} above that`, amount: 0.05 * high });
  const sum = lines.reduce((a, l) => a + l.amount, 0);
  return { total: Math.min(sum, 5000), capped: sum > 5000, lines };
}

/** Counts to its new value over 0.6s. */
function useTween(target: number) {
  const [v, setV] = useState(target);
  const cur = useRef(target);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur.current = target;
      setV(target);
      return;
    }
    const from = cur.current;
    const t0 = performance.now();
    let raf = 0;
    const ease = (p: number) => 1 - Math.pow(1 - p, 4); // close to the original's cubic-bezier(.16,1,.3,1)
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / 600);
      cur.current = from + (target - from) * ease(p);
      setV(cur.current);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export default function PartnersCalculator() {
  const [typeKey, setTypeKey] = useState("mvp-development");
  const type = TYPES.find((t) => t.key === typeKey)!;
  const [pkgIdx, setPkgIdx] = useState(1);
  const pkg = type.packages[Math.min(pkgIdx, type.packages.length - 1)];
  const [value, setValue] = useState(start(pkg));
  const [tier, setTier] = useState<"partner" | "pro">("partner");
  const c = commission(value || 0, pkg.kind, tier);
  const shown = useTween(c.total);
  const editable = pkg.kind !== "flat";

  const pickType = (key: string) => {
    const t = TYPES.find((x) => x.key === key)!;
    const i = Math.min(1, t.packages.length - 1);
    setTypeKey(key);
    setPkgIdx(i);
    setValue(start(t.packages[i]));
  };
  const pickPkg = (i: number) => {
    setPkgIdx(i);
    setValue(start(type.packages[i]));
  };

  return (
    <div className="grid gap-4 rounded-[28px] border border-ink/[0.08] bg-white p-5 sm:p-7 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-8 lg:p-8">
      <div className="min-w-0 space-y-6">
        <div>
          <p className="text-[14px] font-medium text-ink">Type of project</p>
          <div className="mt-3 space-y-3">
            {GROUPS.map((g) => (
              <div key={g}>
                <p className="mb-1.5 text-[12px] font-medium uppercase tracking-[0.06em] text-muted">{g}</p>
                <div className="flex flex-wrap gap-2">
                  {TYPES.filter((t) => t.group === g).map((t) => (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => pickType(t.key)}
                      aria-pressed={t.key === typeKey}
                      className={cn("h-9 rounded-full border px-3.5 text-[13.5px] transition-all duration-200 active:scale-[0.97]", t.key === typeKey ? "border-ink bg-ink text-white" : "border-ink/12 bg-white text-ink hover:border-ink/35")}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {type.packages.length > 1 && (
          <div>
            <p className="text-[14px] font-medium text-ink">Package</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {type.packages.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => pickPkg(i)}
                  aria-pressed={p === pkg}
                  className={cn("rounded-2xl border px-3.5 py-2 text-left transition-all duration-200 active:scale-[0.98]", p === pkg ? "border-brand bg-ice" : "border-ink/12 bg-white hover:border-ink/35")}
                >
                  <span className={cn("block text-[13.5px] font-medium", p === pkg ? "text-brand-ink" : "text-ink")}>{p.name}</span>
                  {p.price !== null && (
                    <span className="block text-[12px] tabular-nums text-muted">
                      {p.from ? "from " : ""}
                      {money(p.price)}
                      {p.kind === "monthly" ? " a month" : ""}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-[14px] font-medium text-ink">{pkg.kind === "monthly" ? "Monthly fee" : "Project value"}</span>
            <span className="relative block">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[15px] text-muted">£</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                step={pkg.kind === "monthly" ? 50 : 250}
                value={editable ? value : (pkg.price ?? 0)}
                disabled={!editable}
                onChange={(e) => setValue(Math.max(0, Math.min(1e6, Number(e.target.value) || 0)))}
                className="h-12 w-full rounded-2xl border border-ink/12 bg-white pl-8 pr-4 text-[15px] tabular-nums text-ink transition-[border-color,box-shadow] duration-200 hover:border-ink/25 focus:border-brand focus:outline-none focus:ring-4 focus:ring-brand/10 disabled:bg-[#f6f7fb] disabled:text-muted"
              />
            </span>
            <span className="mt-1.5 block text-[12.5px] text-muted">{editable ? (pkg.from || pkg.price === null ? "Prices start here; change it to the quoted value." : "Excluding VAT.") : "ZERO.ONE has a single price."}</span>
          </label>
          <div>
            <span className="mb-1.5 block text-[14px] font-medium text-ink">You are</span>
            <div role="radiogroup" aria-label="Partner level" className="relative inline-flex w-full rounded-full bg-paper p-1 ring-1 ring-ink/[0.08]">
              <span
                aria-hidden="true"
                className="absolute rounded-full bg-ink"
                style={{ top: 4, bottom: 4, left: 4, width: "calc(50% - 4px)", transform: tier === "pro" ? "translateX(100%)" : "none", transition: "transform .35s cubic-bezier(.16,1,.3,1)" }}
              />
              {(["partner", "pro"] as const).map((t) => (
                <button key={t} type="button" role="radio" aria-checked={tier === t} onClick={() => setTier(t)} className="relative h-10 flex-1 rounded-full text-[13.5px] font-medium">
                  <span className={cn("relative transition-colors duration-300", tier === t ? "text-white" : "text-ink-soft")}>{t === "partner" ? "Partner" : "Pro partner"}</span>
                </button>
              ))}
            </div>
            <span className="mt-1.5 block text-[12.5px] text-muted">Pro: 3+ paid referrals in 12 months.</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between rounded-[22px] bg-[#f6f7fb] p-6 ring-1 ring-ink/[0.05] sm:p-7" aria-live="polite">
        <div>
          <p className="text-[13px] font-medium text-muted">You&apos;d earn</p>
          <p className="mt-2 text-[clamp(2.6rem,5vw,3.8rem)] font-light leading-none tracking-[-0.05em] tabular-nums text-ink">{money(shown)}</p>
          <p className="mt-2 text-[13.5px] text-ink-soft">
            {type.name}
            {type.packages.length > 1 ? ` · ${pkg.name}` : ""}
          </p>
        </div>
        <div className="mt-6 border-t border-ink/[0.08] pt-5">
          <ul className="space-y-2 text-[13.5px]">
            {c.lines.map((l) => (
              <li key={l.label} className="flex items-baseline justify-between gap-4">
                <span className="text-ink-soft">{l.label}</span>
                <span className="shrink-0 tabular-nums text-ink">{money(l.amount)}</span>
              </li>
            ))}
            {c.capped && (
              <li className="flex items-baseline justify-between gap-4 text-[#8a4b00]">
                <span>Capped at {money(5000)} a referral</span>
                <span className="shrink-0 tabular-nums">{money(5000)}</span>
              </li>
            )}
          </ul>
          <p className="mt-4 text-[12.5px] leading-relaxed text-muted">
            Paid as the client pays, within 14 days of each payment. On our fees excluding VAT{pkg.kind === "monthly" ? " and ad spend" : ""}.
          </p>
        </div>
      </div>
    </div>
  );
}
