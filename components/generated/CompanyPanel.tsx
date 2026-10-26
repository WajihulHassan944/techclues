/* Expanded to match the reference's two-column Company/Resources layout plus a BUILD.ONE promo card. */
import { getPublicPricing } from "@/lib/api/pricing";
import { gbp } from "@/lib/calculator";

type Item = { href: string; title: string; desc: string; icon: React.ReactNode };

const COMPANY: Item[] = [
  {
    href: "/about",
    title: "About TechClues",
    desc: "Our story and the way we partner with founders.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M10 12h4" /><path d="M10 8h4" /><path d="M14 21v-3a2 2 0 0 0-4 0v3" /><path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" /><path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
      </svg>
    ),
  },
  {
    href: "/how-we-work",
    title: "How we work",
    desc: "Our process, from first call to launch.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <rect width="8" height="8" x="3" y="3" rx="2" /><path d="M7 11v4a2 2 0 0 0 2 2h4" /><rect width="8" height="8" x="13" y="13" rx="2" />
      </svg>
    ),
  },
  {
    href: "/careers",
    title: "Careers",
    desc: "Work with us in Birmingham or Islamabad, PK.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /><rect width="20" height="14" x="2" y="6" rx="2" />
      </svg>
    ),
  },
  {
    href: "/partners",
    title: "Partner programme",
    desc: "Refer a client and receive 10% of the project.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" /><path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" />
      </svg>
    ),
  },
];

const RESOURCES: Item[] = [
  {
    href: "/blog",
    title: "Blog",
    desc: "Guides on MVP costs, AI and funding for UK founders.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
  },
  {
    href: "/mvp-cost-calculator",
    title: "MVP cost calculator",
    desc: "An instant estimate for your MVP, no call needed.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <rect width="16" height="20" x="4" y="2" rx="2" /><line x1="8" x2="16" y1="6" y2="6" /><line x1="16" x2="16" y1="14" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
      </svg>
    ),
  },
  {
    href: "/kill-my-idea",
    title: "Kill my idea",
    desc: "A free stress test for your startup idea.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />
      </svg>
    ),
  },
  {
    href: "/grant-funding",
    title: "Grant support",
    desc: "Help finding funding and preparing the application.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
        <path d="M10 18v-7" /><path d="M11.12 2.198a2 2 0 0 1 1.76.006l7.866 3.847c.476.233.31.949-.22.949H3.474c-.53 0-.695-.716-.22-.949z" /><path d="M14 18v-7" /><path d="M18 18v-7" /><path d="M3 22h18" /><path d="M6 18v-7" />
      </svg>
    ),
  },
];

function Column({ heading, items }: { heading: string; items: Item[] }) {
  return (
    <div>
      <p className="px-3.5 pb-1 pt-2 text-[13px] font-medium text-muted">{heading}</p>
      <ul>
        {items.map((it) => (
          <li key={it.href}>
            <a className="group/item flex items-start gap-3.5 rounded-[18px] p-3.5 transition-colors duration-200 hover:bg-[#f4f4f6]" href={it.href}>
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-ink text-white transition-colors duration-300 group-hover/item:bg-brand">{it.icon}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15.5px] text-ink">{it.title}</span>
                <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{it.desc}</span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function CompanyPanel() {
  const { buildOne } = await getPublicPricing();
  return (
    <div data-nav-panel="true" className="hidden absolute right-0 top-full origin-top-right pt-4">
      <div className="grid w-[min(940px,calc(100vw-48px))] grid-cols-[1fr_300px] gap-2 rounded-[30px] border border-ink/[0.1] bg-white p-3 shadow-[0_30px_60px_-30px_rgba(14,15,49,0.3)]">
        <div className="grid grid-cols-2 gap-x-2">
          <Column heading="Company" items={COMPANY} />
          <Column heading="Resources" items={RESOURCES} />
        </div>
        <div className="flex flex-col justify-between rounded-[22px] bg-[linear-gradient(135deg,#eef4ff_0%,#dbe8ff_50%,#e2f4ff_100%)] p-6">
          <div>
            <p className="text-[14px] font-medium text-brand">{buildOne.durationLabel} · {gbp(buildOne.amount)}</p>
            <p className="mt-2 text-[21px] font-semibold tracking-[-0.02em] text-ink">BUILD.ONE</p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">Build and test your core feature in a week, before you invest in the full MVP.</p>
          </div>
          <a href="/zero-one" className="mt-8 inline-flex h-12 items-center self-start rounded-full border border-ink/20 bg-white/40 px-5 text-[15px] text-ink transition-all duration-300 hover:border-ink hover:bg-ink hover:text-white">
            See how it works
          </a>
        </div>
      </div>
    </div>
  );
}
