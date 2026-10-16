/* game-development service page. Content follows the reference service; layout uses the site's own theme. */
import Accordion from "./Accordion";
import GameCapabilities from "./GameCapabilities";
import GameFx from "./GameFx";
import GameHero from "./GameHero";
import StaffSeatForm from "./StaffSeatForm";
import { Arrow, Eyebrow, H2, SEC, WRAP, rv } from "./ServiceParts";
import { getFaqs } from "@/lib/api/faqs";
import { fallbackFaqs } from "@/lib/faq-fallbacks/game-development";

const STATS = [
  ["2", "Production engines: Unity and Unreal"],
  ["6", "Platforms, console to XR"],
  ["5", "Disciplines under one roof"],
  ["Free", "Discovery call to start"],
];

const STACK = ["Unity3D", "Unreal Engine", "UEFN and Verse", "Blender", "3DS Max", "Mobile", "PC", "Console", "VR and XR headsets", "Web"];

const DIFFERENCE: [string, string, React.ReactNode][] = [
  [
    "Engine-native engineering.",
    "We build on current Unity and Unreal pipelines and engine roadmaps on every build, never on workarounds, so your project stays maintainable.",
    <path key="a" d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  ],
  [
    "Quality and security by process.",
    "QA, certification and platform submission are part of every build, and player data and live builds are handled with the same care on every project.",
    <path key="b" d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Zm-11-1 2 2 4-4" />,
  ],
  [
    "A playable proof first.",
    "A prototype proves the core loop before full spend, and every milestone ships as a build you can play, not a slide deck.",
    <path key="c" d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9Zm0 0v6h6M8 13h8M8 17h5" />,
  ],
];

const MODELS = [
  ["Ongoing", "Dedicated Team Extension", "Game developers, artists and engineers embedded directly into your team and pipeline.", "Best for delivery power without hiring overhead"],
  ["Project-based", "Full Studio Build", "The studio behind your player-facing title, owning the build end to end from concept through launch and live ops.", "Best for a defined title"],
];

const STEPS = [
  ["Discovery", "Scope concept, audience, platform and budget in a free call."],
  ["Prototype", "A playable MVP proves the core loop before full spend."],
  ["Production", "Art, engineering and design in agile sprints, with a build every milestone."],
  ["QA and Optimisation", "Functional and performance testing keeps it launch-ready."],
  ["Launch and Live Ops", "Cross-platform ship, then updates, content and analytics."],
];

const INDUSTRIES = [
  ["Healthcare and Pharma", "Therapeutic and training simulations with 3D modelling and motion tracking."],
  ["Education and Edutainment", "Virtual campuses and live classes that make learning interactive."],
  ["Real Estate and Architecture", "Real-time property tours and architectural walkthroughs."],
  ["Marketing and Advertising", "Advergames and branded worlds that earn attention across devices."],
  ["Sports and Fitness", "Motion-tracked fitness apps and VR sports training with interactive 3D avatars."],
  ["Entertainment and Media", "Original IP across MMO and naval combat formats for mobile, PC and console."],
];

const TOOLS: [string, string[]][] = [
  ["Engines", ["Unreal Engine", "Unity3D", "UEFN + Verse"]],
  ["Art & DCC", ["Blender", "3DS Max", "Maya", "ZBrush", "Substance"]],
  ["Multiplayer & Backend", ["Photon", "Mirror", "Dedicated Servers", "AWS", "GCP"]],
  ["Platforms & XR", ["iOS", "Android", "Steam", "PlayStation", "Xbox", "Switch", "Meta Quest", "visionOS"]],
];

const NEEDS = ["Just a concept", "Prototype or vertical slice built", "In production, need capacity", "Live title, need live ops"];

export default async function GameDevelopmentMarkup() {
  const serviceFaqs = await getFaqs();
  const faqs = serviceFaqs["game-development"]?.length ? serviceFaqs["game-development"] : fallbackFaqs;
  return (
    <main>
      <GameFx />
      <section className="game-hero pb-4 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
        <GameHero />
        <div className={`${WRAP} flex flex-col items-center text-center`}>
          <nav aria-label="Breadcrumb" className="svc-in flex items-center gap-1.5 text-[14px] text-muted" style={{ "--d": "0s", "--y": "10px" } as React.CSSProperties}>
            <a className="transition-colors hover:text-ink" href="/services">
              Services
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="text-ink">Game Development</span>
          </nav>
          <h1 className="mt-6 max-w-[1100px] text-ink">
            <span className="block text-[15px] font-medium tracking-normal text-brand sm:text-[16px]">Game development</span>
            <span className="mt-4 block overflow-hidden pb-[0.12em] text-[clamp(2.4rem,5.4vw,5.5rem)] font-normal leading-[1.03] tracking-[-0.05em]">
              <span className="svc-rise block" style={{ "--d": "0.1s" } as React.CSSProperties}>
                Game development that ships and scales.
              </span>
            </span>
          </h1>
          <div className="svc-in flex flex-col items-center" style={{ "--d": "0.3s", "--y": "16px" } as React.CSSProperties}>
            <p className="mt-4 max-w-[640px] text-[18px] leading-relaxed text-ink-soft">
              Unlock boundless potential with enterprise-grade game development across Unity, Unreal Engine, VR and XR, UEFN and the metaverse, from first concept to launch and live ops.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <a href="#get-started" data-cta="service-hero-game-project" className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">
                Discuss your game project
                <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#engagement" className="group relative inline-flex items-center gap-1.5 text-[16px] font-medium text-ink">
                See how we work with you
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
                      <span className="block text-[clamp(2rem,3.4vw,3.2rem)] font-normal leading-none tracking-[-0.04em]" {...(/^\d+$/.test(n) ? { "data-count": n } : {})}>{n}</span>
                      <span className="mt-3 block text-[15px] text-white/65">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Overview" className={SEC}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>Overview</Eyebrow>
            <H2>From concept to live ops, one studio.</H2>
            <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
              TechClues builds games and real-time 3D experiences across Unity, Unreal, VR and XR, UEFN and the metaverse, from MMOs and VR platforms to metaverse worlds, UEFN islands and architectural visualisation.
            </p>
            <p className="mt-4 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
              Art, engineering and platform work sit together, so a title moves from concept through launch and into live ops without being handed between vendors.
            </p>
          </div>
          <div data-reveal="" style={rv("0.1s")}>
            <p className="flex items-center gap-4 text-[13px] font-medium uppercase tracking-[0.12em] text-brand">
              The stack we build on
              <span className="h-px flex-1 bg-ink/10" />
            </p>
            <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
              {STACK.map((s) => (
                <li key={s} className="flex items-center gap-3 rounded-2xl bg-[#f1f0f6] px-5 py-3.5 text-[16px] text-ink">
                  <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-label="The difference" className="py-[clamp(24px,4vw,48px)]">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
              <span className="pointer-events-none absolute -right-28 -top-36 -z-10 size-[420px] rounded-full bg-brand/40 blur-[100px]" />
              <Eyebrow light>The difference</Eyebrow>
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">Why studios pick TechClues over a dev shop.</h2>
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {DIFFERENCE.map(([t, d, icon]) => (
                  <div key={t} data-tilt="" className="gx-tilt rounded-[22px] border border-white/12 bg-white/[0.04] p-7">
                    <svg viewBox="0 0 24 24" className="size-6 text-brand-soft" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {icon}
                    </svg>
                    <h3 className="mt-6 text-[clamp(1.25rem,1.7vw,1.5rem)] leading-snug tracking-[-0.02em]">{t}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/65">{d}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Under the hood" className={SEC}>
        <div className={WRAP}>
          <div className="rounded-[28px] bg-[#f1f0f6] p-5 sm:rounded-[36px] sm:p-10 lg:p-14">
            <div data-reveal="" style={rv()} className="flex flex-col items-center text-center">
              <Eyebrow>Under the hood</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Every discipline your title needs, under one roof.</h2>
            </div>
            <GameCapabilities />
          </div>
        </div>
      </section>

      <section id="engagement" aria-label="Engagement models" className={`${SEC} scroll-mt-24`}>
        <div className={WRAP}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="" style={rv()}>
              <Eyebrow>Engagement models</Eyebrow>
              <H2>Two ways to bring us in.</H2>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a href="#get-started" className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">
                Let&apos;s talk
                <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
            {MODELS.map(([tag, title, text, best], n) => (
              <div key={tag} data-reveal="" style={rv(`${n * 0.07}s`)}>
                <div data-tilt="" className="gx-tilt relative flex h-full flex-col rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                  <span className="absolute right-7 top-6 text-[clamp(2.4rem,4vw,3.6rem)] leading-none tracking-[-0.04em] text-ink/[0.07]">0{n + 1}</span>
                  <span className="staff-chip staff-chip-0 w-fit">{tag}</span>
                  <h3 className="mt-6 text-[clamp(1.4rem,2vw,1.8rem)] tracking-[-0.03em] text-ink">{title}</h3>
                  <p className="mt-3 max-w-[520px] text-[15px] leading-relaxed text-ink-soft">{text}</p>
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
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">From first call to live ops.</h2>
              <ol className="relative mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
                <span className="absolute left-0 right-0 top-[5px] hidden h-px bg-white/15 lg:block" aria-hidden="true" />
                {STEPS.map(([t, d], n) => (
                  <li key={t} data-level={n + 1} className="gx-level relative">
                    <span className="relative block size-[11px] rounded-full bg-brand-soft" />
                    <div className="mt-6 h-[calc(100%-1.5rem)] rounded-[22px] border border-white/12 bg-white/[0.04] p-6">
                      <p className="font-mono text-[12px] text-brand-soft">0{n + 1}</p>
                      <h3 className="mt-5 text-[clamp(1.2rem,1.6vw,1.4rem)] tracking-[-0.02em]">{t}</h3>
                      <p className="mt-3 text-[15px] leading-relaxed text-white/65">{d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Industries" className={SEC}>
        <div className={WRAP}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="" style={rv()}>
              <Eyebrow>Industries</Eyebrow>
              <H2>Where our worlds go to work.</H2>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/industries">
                All industries
              </a>
            </div>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
            {INDUSTRIES.map(([t, d], n) => (
              <div key={t} data-reveal="" style={rv(`${(n % 3) * 0.06}s`)}>
                <div data-tilt="" className="gx-tilt h-full rounded-[24px] bg-[#f1f0f6] p-7 transition-colors duration-500 hover:bg-white hover:shadow-[0_30px_60px_-40px_rgba(14,15,49,0.4)] sm:p-8">
                  <span className="text-[13px] tabular-nums text-brand">0{n + 1}</span>
                  <h3 className="mt-6 text-[clamp(1.25rem,1.7vw,1.5rem)] leading-snug tracking-[-0.025em] text-ink">{t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Tools and technologies" className={SEC}>
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>Tools &amp; technologies</Eyebrow>
            <H2>The stack behind every title we ship.</H2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
            {TOOLS.map(([g, items], n) => (
              <div key={g} data-reveal="" style={rv(`${(n % 2) * 0.07}s`)}>
                <div data-tilt="" className="gx-tilt h-full rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                  <p className="text-[13px] font-medium uppercase tracking-[0.12em] text-brand">{g}</p>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {items.map((t) => (
                      <li key={t} className="rounded-full bg-[#f1f0f6] px-4 py-2 text-[15px] text-ink">
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Questions" className={SEC}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-normal leading-[1.06] tracking-[-0.04em] text-ink">Frequently asked questions.</h2>
            <p className="mt-5 max-w-[380px] text-[16px] leading-relaxed text-ink-soft">The vision stays yours. We build it. Bring a napkin sketch or a stalled build. In one free call we will map the fastest route to a title players love.</p>
            <a href="#get-started" className="mt-6 inline-flex text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand">
              Let&apos;s talk
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
            <Eyebrow>Get started</Eyebrow>
            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-normal leading-[1.05] tracking-[-0.04em] text-ink">Tell us about the title you want to build.</h2>
            <ul className="mt-8 grid gap-3">
              {["Bring a concept, a stalled build, or a live title", "One call to map scope, platform and art fidelity", "A route to a vertical slice, not a vague estimate"].map((t) => (
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
            <StaffSeatForm formName="game-development" endpoint="/api/public/game-development" companyLabel="Studio / Company" needLabel="What brings you here today?" needOptions={NEEDS} needError="Choose what brings you here." briefLabel="Tell us about the title" extras={false} />
          </div>
        </div>
      </section>
    </main>
  );
}
