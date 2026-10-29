import type { UkLocation } from "@/lib/data/uk-locations";

const SERVICES = [
  { label: "MVP & custom platform development", href: "/services/mvp-development" },
  { label: "Web & mobile app development", href: "/services/web-mobile-apps" },
  { label: "AI integration & automation", href: "/services/ai-enablement" },
  { label: "E-commerce & marketplace development", href: "/services/ecommerce-marketplace-development" },
  { label: "UI/UX design & prototyping", href: "/services/ui-ux-design" },
  { label: "Staff augmentation", href: "/services/staff-augmentation" },
];

export default function LocationPageMarkup({ location, all }: { location: UkLocation; all: UkLocation[] }) {
  const others = all.filter((l) => l.slug !== location.slug);

  return (
    <main>
      <header className="pb-8 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
        <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-muted">
            <a className="transition-colors hover:text-ink" href="/locations">
              Locations
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
            <span className="text-ink">{location.name}</span>
          </nav>
          <h1 className="mt-6 max-w-[1050px] text-[clamp(2.2rem,4.6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-ink">
            Software Development in {location.name}
          </h1>
          <p className="mt-5 max-w-[720px] text-[19px] leading-relaxed text-ink-soft">
            TechClues helps founders and teams across {location.name} and {location.region} validate ideas, ship
            MVPs and scale digital products — with a particular focus on {location.focus}.
          </p>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[1680px] px-5 py-[clamp(40px,5vw,80px)] sm:px-8 lg:px-[60px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-20">
          <div className="min-w-0 max-w-[740px] text-[18px] leading-[1.75] text-ink-soft">
            <h2 className="mb-4 text-[clamp(1.6rem,2.4vw,2.1rem)] font-normal leading-[1.15] tracking-[-0.03em] text-ink">
              Custom software development for {location.name} businesses
            </h2>
            <p className="mb-6">
              Whether you&apos;re a founder near {location.landmark} or an established business serving{" "}
              {location.region}, we work as a remote-first extension of your team — scoping the right MVP, building
              it fast, and iterating with you after launch. Clients in {location.name} typically start with a free
              30-minute strategy call before we put together a fixed-scope proposal.
            </p>
            <p className="mb-6">
              We regularly work with teams in {location.name} and nearby {location.nearby.join(", ")}, so we
              understand the mix of industries common to {location.region} — particularly {location.focus}. That
              means less time explaining your market and more time building.
            </p>
            <h3 className="mb-3 mt-10 text-[clamp(1.2rem,1.6vw,1.4rem)] font-medium tracking-[-0.02em] text-ink">
              What we build for clients in {location.name}
            </h3>
            <ul className="my-6 space-y-3">
              {SERVICES.map((s) => (
                <li key={s.href} className="relative pl-6">
                  <a href={s.href} className="text-ink underline decoration-brand/40 underline-offset-4 transition-colors hover:decoration-brand">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
            <h3 className="mb-3 mt-10 text-[clamp(1.2rem,1.6vw,1.4rem)] font-medium tracking-[-0.02em] text-ink">
              Why {location.name} founders work with TechClues
            </h3>
            <p className="mb-6">
              We&apos;re a UK-based studio (registered in Birmingham) working with clients across every region of
              the country, including {location.name}. You get a dedicated product team, fixed-scope pricing on MVPs,
              and weekly delivery updates — no matter which city you&apos;re building from.
            </p>
            <div className="mt-14 rounded-[24px] bg-ink p-8 text-white sm:p-10">
              <p className="text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.2] tracking-[-0.03em]">
                Building a product in {location.name}?
              </p>
              <p className="mt-2 text-[16px] text-white/65">
                Book a free 30-minute call and we&apos;ll help you scope what to build first.
              </p>
              <a href="/book-a-call" className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white pl-6 pr-5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">
                Book a free call
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>

          <aside>
            <div className="rounded-[24px] bg-paper p-6">
              <p className="text-[13px] font-medium text-muted">{location.nation}</p>
              <p className="mt-2 text-[16px] text-ink">
                {location.name} is in {location.region}. We also serve nearby {location.nearby.join(", ")}.
              </p>
            </div>
          </aside>
        </div>

        {/* Internal-linking footer: every location page links to every other location page */}
        <footer aria-label="All locations we serve" className="mt-20 border-t border-ink/10 pt-10">
          <p className="text-[14px] font-medium text-muted">TechClues also builds software for businesses in</p>
          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2.5">
            {others.map((l) => (
              <li key={l.slug}>
                <a href={`/locations/${l.slug}`} className="text-[15px] text-ink-soft underline decoration-ink/15 underline-offset-4 transition-colors hover:text-ink hover:decoration-brand">
                  {l.name}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </div>
    </main>
  );
}
