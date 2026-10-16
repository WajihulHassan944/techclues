/* staff-augmentation service page. Content follows the reference service; layout uses the site's own components and theme. */
import Accordion from "./Accordion";
import StaffCapabilities from "./StaffCapabilities";
import StaffSeatForm from "./StaffSeatForm";
import { getFaqs } from "@/lib/api/faqs";
import { fallbackFaqs } from "@/lib/faq-fallbacks/staff-augmentation";

const SEC = "py-[clamp(56px,7vw,110px)]";
const WRAP = "mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]";
const rv = (d = "0s") => ({ "--reveal-delay": d, "--reveal-y": "28px" }) as React.CSSProperties;
const Arrow = ({ className = "size-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
const Eyebrow = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <p className={`flex items-center gap-2 text-[14px] font-medium ${light ? "text-white/60" : "text-muted"}`}>
    <span className="size-1.5 rounded-full bg-brand" />
    {children}
  </p>
);
const H2 = ({ children, light }: { children: React.ReactNode; light?: boolean }) => (
  <h2 className={`mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] ${light ? "text-white" : "text-ink"}`}>{children}</h2>
);

const STATS = [
  ["200+", "Products delivered"],
  ["280+", "Successful jobs"],
  ["25+", "Projects shipped"],
  ["20+", "Team members"],
];

const CHALLENGES = [
  ["Hiring timeline", "Months to fill one seat", "A full-time hiring cycle runs 8 to 12 weeks before anyone writes a line of code.", "staff-chip-0"],
  ["Skill gap", "The specialist you cannot find", "One niche platform or AI and ML hire can stall a roadmap, and that talent is scarce.", "staff-chip-1"],
  ["IP ownership", "Unclear who owns the work", "Loose vendor terms leave code, models, and pipelines without a clean ownership claim.", "staff-chip-2"],
  ["Bench risk", "Capacity you carry year round", "Scaling a team for one project means paying for that headcount long after it ships.", "staff-chip-3"],
];

const STAYS = ["The roadmap", "The code and the IP", "Production learning", "Architectural decisions", "Model and data context", "Day-to-day management", "Release cadence", "Team structure"];

const MODELS = [
  ["Nearshore", "Nearshore Delivery", "Engineers in aligned time zones for near real-time overlap with your team's working hours.", "Best for close collaboration without full onshore cost"],
  ["Onshore", "Onshore Delivery", "Engineers based in your own region for direct, same-time-zone collaboration and on-site availability.", "Best for regulated or client-facing engagements"],
  ["Offshore", "Offshore Delivery", "Engineers operating from our global delivery centres as a dedicated, cost-efficient extension of your team.", "Best for scaling capacity cost-effectively"],
];

const STEPS = [
  ["Scope the Gap", "Define the exact skill, seniority, and time commitment needed."],
  ["Match and Vet", "Candidates matched from our engineer pool, vetted for the role, shared with you for final approval."],
  ["Onboard and Integrate", "Engineer joins your tools, sprints, and stand-ups directly."],
  ["Scale as Needed", "Add, reduce, or swap capacity as your roadmap changes."],
];

const INDUSTRIES = [
  ["SaaS and B2B Software", "Scaling engineering capacity through growth phases without over-hiring.", "/industries/saas-startups", "/industries/saas.jpg"],
  ["E-commerce and Retail", "Seasonal and peak-load engineering capacity.", "/industries/retail-ecommerce", "/industries/retail.jpg"],
  ["Startups", "Senior engineers on tap while you validate, build, and raise.", "/industries/pre-seed-seed-startups", "/industries/startups.jpg"],
  ["Healthcare", "Compliance-aware engineering capacity added on demand.", "/industries/healthcare-medical", "/industries/healthcare.jpg"],
];

const CASES = [
  ["Sports & Fitness", "Infinite Running League: a running platform shipped by an embedded product team", "Application engineering", "/case-studies/infinite-running-league", "/images/case-studies/infinite-running-league.jpg"],
  ["Food & Retail", "Odogwu Foods: an online store and operations tooling, built inside the client's workflow", "Web and e-commerce", "/case-studies/odogwu", "/images/case-studies/odogwu.jpg"],
];

export default async function StaffAugmentationMarkup() {
  const serviceFaqs = await getFaqs();
  const faqs = serviceFaqs["staff-augmentation"]?.length ? serviceFaqs["staff-augmentation"] : fallbackFaqs;
  return (
    <main>
      <section className="pb-4 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
        <div className={`${WRAP} flex flex-col items-center text-center`}>
          <nav aria-label="Breadcrumb" className="svc-in flex items-center gap-1.5 text-[14px] text-muted" style={{ "--d": "0s", "--y": "10px" } as React.CSSProperties}>
            <a className="transition-colors hover:text-ink" href="/services">
              Services
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="text-ink">Staff Augmentation</span>
          </nav>
          <h1 className="mt-6 max-w-[1100px] text-ink">
            <span className="block text-[15px] font-medium tracking-normal text-brand sm:text-[16px]">Staff augmentation</span>
            <span className="mt-4 block overflow-hidden pb-[0.12em] text-[clamp(2.4rem,5.4vw,5.5rem)] font-normal leading-[1.03] tracking-[-0.05em]">
              <span className="svc-rise block" style={{ "--d": "0.1s" } as React.CSSProperties}>
                Our engineers and AI team, inside yours.
              </span>
            </span>
          </h1>
          <div className="svc-in flex flex-col items-center" style={{ "--d": "0.3s", "--y": "16px" } as React.CSSProperties}>
            <p className="mt-4 max-w-[620px] text-[18px] leading-relaxed text-ink-soft">
              From the first day, vetted engineers and AI specialists sit within your team, so architectural choices and lessons from production stay in your organisation.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <a href="#get-started" data-cta="service-hero-scope-team" className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">
                Define your team
                <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#engagement" className="group relative inline-flex items-center gap-1.5 text-[16px] font-medium text-ink">
                Explore engagement models
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 bg-ink/30 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0" />
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform delay-150 duration-500 group-hover:scale-x-100" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="In numbers" className="py-[clamp(24px,4vw,48px)]">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-7 py-10 text-white sm:rounded-[36px] sm:px-12 sm:py-12 lg:px-16">
              <span className="pointer-events-none absolute -right-28 -top-36 -z-10 size-[420px] rounded-full bg-brand/40 blur-[100px]" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                {STATS.map(([n, l]) => (
                  <div key={l} className="border-t border-white/15 pt-6">
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="block text-[clamp(2rem,3.4vw,3.2rem)] font-normal leading-none tracking-[-0.04em]">{n}</span>
                      <span className="mt-3 block text-[15px] text-white/65">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Key challenges" className={SEC}>
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>Main challenges</Eyebrow>
            <H2>Where recruitment holds back delivery.</H2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {CHALLENGES.map(([tag, title, text, chip], n) => (
              <div key={tag} data-reveal="" style={rv(`${n * 0.07}s`)}>
                <div className="group h-full rounded-[24px] bg-[#f1f0f6] p-7 transition-colors duration-500 hover:bg-white hover:shadow-[0_30px_60px_-40px_rgba(14,15,49,0.35)] sm:p-8">
                  <span className={`staff-chip ${chip}`}>{tag}</span>
                  <h3 className="mt-6 text-[clamp(1.3rem,1.8vw,1.6rem)] leading-snug tracking-[-0.025em] text-ink">{title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Our approach" className={SEC}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>How we operate</Eyebrow>
            <H2>Your team, never a separate one.</H2>
            <p className="mt-6 max-w-[520px] text-[17px] leading-relaxed text-ink-soft">
              Our TechClues engineers and AI specialists slot into your current team structure, work with your tools and follow your process, rather than operating as a separate vendor team alongside.
            </p>
            <p className="mt-4 max-w-[520px] text-[17px] leading-relaxed text-ink-soft">
              Lessons from production, architectural choices, and model and data context remain with your organisation rather than walking out with an outside team. The roadmap, code and IP stay fully under your control; sourcing, vetting and employment are our job.
            </p>
          </div>
          <div data-reveal="" style={rv("0.1s")}>
            <p className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-[0.12em] text-brand">
              What you keep
              <span className="h-px flex-1 bg-ink/10" />
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {STAYS.map((s) => (
                <li key={s} className="flex items-center gap-3 rounded-2xl bg-[#f1f0f6] px-5 py-3.5 text-[16px] text-ink">
                  <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="Capabilities" className={SEC}>
        <div className={WRAP}>
          <div className="rounded-[28px] bg-[#f1f0f6] p-5 sm:rounded-[36px] sm:p-10 lg:p-14">
            <div data-reveal="" style={rv()} className="flex flex-col items-center text-center">
              <Eyebrow>Capabilities</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Roles you can bring in, and how they fit.</h2>
            </div>
            <div className="staff-tabs-center">
              <StaffCapabilities />
            </div>
          </div>
        </div>
      </section>

      <section id="engagement" aria-label="Engagement models" className={`${SEC} scroll-mt-24`}>
        <div className={WRAP}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="" style={rv()}>
              <Eyebrow>Collaboration options</Eyebrow>
              <H2>Pick the location for your team.</H2>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a href="#get-started" className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">
                Get in touch
                <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
            {MODELS.map(([tag, title, text, best], n) => (
              <div key={tag} data-reveal="" style={rv(`${n * 0.07}s`)}>
                <div className="relative flex h-full flex-col rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                  <span className="absolute right-7 top-6 text-[clamp(2.4rem,4vw,3.6rem)] leading-none tracking-[-0.04em] text-ink/[0.07]">0{n + 1}</span>
                  <span className="staff-chip w-fit staff-chip-0">{tag}</span>
                  <h3 className="mt-6 text-[clamp(1.4rem,2vw,1.8rem)] tracking-[-0.03em] text-ink">{title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{text}</p>
                  <p className="mt-auto border-t border-ink/10 pt-5 text-[12px] font-medium uppercase tracking-[0.08em] text-brand-ink" style={{ marginTop: "auto" }}>
                    {best}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Process" className="py-[clamp(24px,4vw,48px)]">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
              <span className="pointer-events-none absolute -right-28 -top-36 -z-10 size-[420px] rounded-full bg-brand/40 blur-[100px]" />
              <Eyebrow light>Process</Eyebrow>
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">From vacant seat to engineer shipping code.</h2>
              <ol className="relative mt-12 grid gap-8 lg:grid-cols-4 lg:gap-5">
                <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-white/15 lg:block" aria-hidden="true" />
                {STEPS.map(([t, d], n) => (
                  <li key={t} className="relative">
                    <span className="relative block size-[11px] rounded-full bg-brand-soft" />
                    <div className="mt-6 h-[calc(100%-1.5rem)] rounded-[22px] border border-white/12 bg-white/[0.04] p-6">
                      <p className="font-mono text-[12px] text-brand-soft">0{n + 1}</p>
                      <h3 className="mt-5 text-[clamp(1.25rem,1.7vw,1.5rem)] tracking-[-0.02em]">{t}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/65">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Industries we serve" className={SEC}>
        <div className={WRAP}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="" style={rv()}>
              <Eyebrow>Sectors we work in</Eyebrow>
              <H2>Where extra capacity pays off quickest.</H2>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/industries">
                See further
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
            {INDUSTRIES.map(([t, d, href, img], n) => (
              <div key={t} data-reveal="" style={rv(`${n * 0.06}s`)}>
                <a href={href} className="group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[24px] bg-ink p-6 text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <span aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(14,15,49,0)_30%,rgba(14,15,49,0.9)_100%)]" />
                  <h3 className="text-[clamp(1.2rem,1.6vw,1.45rem)] tracking-[-0.02em]">{t}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-white/75">{d}</p>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Case studies" className={SEC}>
        <div className={WRAP}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="" style={rv()}>
              <Eyebrow>Case histories</Eyebrow>
              <H2>Teams that delivered after filling their seats.</H2>
              <p className="mt-5 max-w-[520px] text-[17px] leading-relaxed text-ink-soft">Engineers embedded within the client’s own team.</p>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/case-studies">
                View every case study
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:mt-14">
            {CASES.map(([sector, title, tag, href, img], n) => (
              <div key={href} data-reveal="" style={rv(`${n * 0.08}s`)}>
                <a href={href} className="group block h-full overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white transition-shadow duration-500 hover:shadow-[0_30px_60px_-40px_rgba(14,15,49,0.4)]">
                  <div className="aspect-[16/9] overflow-hidden bg-[#f1f0f6]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-6 sm:p-8">
                    <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-brand-ink">{sector}</p>
                    <h3 className="mt-3 text-[clamp(1.2rem,1.7vw,1.5rem)] leading-snug tracking-[-0.025em] text-ink">{title}</h3>
                    <p className="mt-4 flex items-center justify-between text-[14px] text-muted">
                      {tag}
                      <span className="inline-flex items-center gap-1.5 text-ink">
                        Read the full case study <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </span>
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Questions" className={SEC}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-normal leading-[1.06] tracking-[-0.04em] text-ink">Common questions answered.</h2>
            <p className="mt-5 max-w-[360px] text-[16px] leading-relaxed text-ink-soft">Still wondering about vetting, timelines, or who ends up owning what we build?</p>
            <a href="/book-a-call" className="mt-6 inline-flex text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand">
              Get in touch
            </a>
          </div>
          <div data-reveal="" style={rv("0.1s")}>
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      <section id="get-started" aria-label="Get started" className="scroll-mt-24 pb-[clamp(72px,10vw,160px)] pt-[clamp(32px,4vw,64px)]">
        <div className={`${WRAP} grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>Begin here</Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-normal leading-[1.05] tracking-[-0.04em] text-ink">Tell us which role you need to fill.</h2>
            <p className="mt-5 max-w-[440px] text-[17px] leading-relaxed text-ink-soft">Scoping the role takes just one conversation. You review profiles matched to it, instead of a generic bench list.</p>
            <ul className="mt-8 grid gap-3">
              {["Bring the skill gap or headcount you need filled", "One conversation to scope seniority, stack, and timeline", "Matched candidates within days, not weeks"].map((t) => (
                <li key={t} className="flex items-start gap-3 text-[16px] text-ink">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="" style={rv("0.1s")} className="relative rounded-[28px] border border-ink/[0.08] bg-white p-6 sm:p-10">
            <StaffSeatForm />
          </div>
        </div>
      </section>
    </main>
  );
}
