"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";

type Item = { label: string; href: string; children?: { label: string; href: string }[] };

const ITEMS: Item[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "MVPs & Custom Platforms", href: "/services/mvp-development" },
      { label: "Prototype to Production", href: "/services/prototype-to-production" },
      { label: "Web & Mobile Apps", href: "/services/web-mobile-apps" },
      { label: "UI/UX & Prototyping", href: "/services/ui-ux-design" },
      { label: "Low-Code / No-Code", href: "/services/low-code-no-code" },
      { label: "E-commerce & Marketplaces", href: "/services/ecommerce-marketplace-development" },
      { label: "Performance Marketing", href: "/services/performance-marketing" },
      { label: "All services", href: "/services" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Healthcare & medical", href: "/industries/healthcare-medical" },
      { label: "Logistics & transportation", href: "/industries/logistics-transportation" },
      { label: "Retail & e-commerce", href: "/industries/retail-ecommerce" },
      { label: "Education & consulting", href: "/industries/education-consulting" },
      { label: "Pre-seed & seed startups", href: "/industries/pre-seed-seed-startups" },
      { label: "Recruitment & staffing", href: "/industries/recruitment-staffing" },
      { label: "SaaS startups", href: "/industries/saas-startups" },
      { label: "Industry & manufacturing", href: "/industries/industry-manufacturing" },
      { label: "All industries", href: "/industries" },
    ],
  },
  {
    label: "Company",
    href: "/about",
    children: [
      { label: "About", href: "/about" },
      { label: "Careers", href: "/careers" },
      { label: "Partner programme", href: "/partners" },
    ],
  },
  { label: "How we work", href: "/how-we-work" },
  { label: "Case studies", href: "/case-studies" },
  { label: "MVP cost calculator", href: "/mvp-cost-calculator" },
  { label: "Contact", href: "/contact" },
];

const BTN_CLOSED =
  "relative grid size-12 place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-500 lg:hidden border-white/80 bg-white/55 shadow-[0_10px_30px_-12px_rgba(14,15,49,0.35),inset_0_1px_0_rgba(255,255,255,0.95)] ring-1 ring-ink/10 backdrop-blur-xl backdrop-saturate-150";
const BTN_OPEN =
  "relative grid size-12 place-items-center rounded-full border transition-[background-color,border-color,box-shadow] duration-500 lg:hidden border-ink bg-ink [&>span]:bg-white";
const BAR = "absolute h-[2px] w-5 rounded-full bg-ink transition-transform duration-300";

const Arrow = ({ cls }: { cls: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={cls} aria-hidden="true">
    <path d="M7 7h10v10" />
    <path d="M7 17 17 7" />
  </svg>
);

/** Full-screen mobile navigation, opened from the header's hamburger button. */
export default function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [host, setHost] = useState<HTMLElement | null>(null);
  const pathname = usePathname();

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const header = document.querySelector<HTMLElement>("header");
    const btn = header?.querySelector<HTMLButtonElement>("button[aria-label$='menu']");
    if (!header || !btn) return;
    setHost(header);
    const onClick = () => setOpen((o) => !o);
    btn.addEventListener("click", onClick);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      btn.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    const btn = document.querySelector<HTMLButtonElement>("header button[aria-label$='menu']");
    if (!btn) return;
    btn.className = open ? BTN_OPEN : BTN_CLOSED;
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    btn.setAttribute("aria-expanded", String(open));
    const [a, b] = Array.from(btn.children) as HTMLElement[];
    if (a && b) {
      a.className = `${BAR} ${open ? "rotate-45" : "-translate-y-[4px]"}`;
      b.className = `${BAR} ${open ? "-rotate-45" : "translate-y-[4px]"}`;
    }
    document.documentElement.style.overflow = open ? "hidden" : "";
    if (!open) setExpanded(null);
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  if (!open || !host) return null;
  return createPortal(
    <nav aria-label="Mobile" className="pointer-events-auto fixed inset-0 z-40 flex h-dvh flex-col bg-paper lg:hidden">
      <div data-lenis-prevent="true" className="flex-1 overflow-y-auto overscroll-contain px-5 pb-8 pt-[104px] sm:px-8">
        <ul>
          {ITEMS.map((it) => {
            const isOpen = expanded === it.label;
            return it.children ? (
              <li key={it.label} className="border-b border-ink/[0.08]">
                <div className="flex items-center">
                  <a className="flex-1 py-4 text-[22px] tracking-[-0.02em] text-ink" href={it.href}>{it.label}</a>
                  <button
                    aria-expanded={isOpen}
                    aria-label={`${isOpen ? "Hide" : "Show"} ${it.label.toLowerCase()}`}
                    onClick={() => setExpanded(isOpen ? null : it.label)}
                    className="grid size-11 place-items-center rounded-full text-ink transition-colors duration-300 hover:bg-ink/[0.05]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`size-5 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} aria-hidden="true">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                </div>
                {isOpen && (
                  <ul className="overflow-hidden">
                    {it.children.map((c) => (
                      <li key={c.href + c.label}>
                        <a className="flex items-center justify-between gap-4 border-t border-ink/[0.06] py-3.5 pl-4 text-[16px] text-ink-soft transition-colors duration-300 hover:text-brand" href={c.href}>
                          {c.label}
                          <Arrow cls="size-4 shrink-0 text-muted" />
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ) : (
              <li key={it.label}>
                <a className="flex items-center justify-between border-b border-ink/[0.08] py-4 text-[22px] tracking-[-0.02em] text-ink" href={it.href}>
                  {it.label}
                  <Arrow cls="size-5 text-muted" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="shrink-0 border-t border-ink/[0.08] bg-white px-5 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 sm:px-8">
        <a href="/book-a-call" className="flex h-14 items-center justify-center gap-2 rounded-full bg-ink text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">
          Book a free strategy call
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4" aria-hidden="true">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
          </svg>
        </a>
      </div>
    </nav>,
    host,
  );
}
