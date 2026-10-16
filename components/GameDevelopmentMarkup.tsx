/* game-development service page. Content follows the reference service; layout uses the site's own theme. */
import Accordion from "./Accordion";
import GameCapabilities from "./GameCapabilities";
import GameFx from "./GameFx";
import GameHero from "./GameHero";
import GameModes from "./GameModes";
import GameCube from "./GameCube";
import GameCollage from "./GameCollage";
import StaffSeatForm from "./StaffSeatForm";
import { Arrow, Eyebrow, H2, SEC, WRAP, rv } from "./ServiceParts";
import { getFaqs } from "@/lib/api/faqs";
import { fallbackFaqs } from "@/lib/faq-fallbacks/game-development";

const STATS: [string, string][] = [
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
  ["Embedded team", "Dedicated Team Extension", "Game developers, artists and engineers embedded directly into your team and pipeline.", "Best for delivery power without hiring overhead", "/images/game/team.jpg"],
  ["Full studio", "Full Studio Build", "The studio behind your player-facing title, owning the build end to end from concept through launch and live ops.", "Best for a defined title", "/images/game/coding.jpg"],
];

const STEPS = [
  ["Discovery", "Scope concept, audience, platform and budget in a free call."],
  ["Prototype", "A playable MVP proves the core loop before full spend."],
  ["Production", "Art, engineering and design in agile sprints, with a build every milestone."],
  ["QA and Optimisation", "Functional and performance testing keeps it launch-ready."],
  ["Launch and Live Ops", "Cross-platform ship, then updates, content and analytics."],
];


const INDUSTRIES = [
  ["Healthcare and Pharma", "Therapeutic and training simulations with 3D modelling and motion tracking.", "/images/game/vr-man.jpg"],
  ["Education and Edutainment", "Virtual campuses and live classes that make learning interactive.", "/images/game/player.jpg"],
  ["Real Estate and Architecture", "Real-time property tours and architectural walkthroughs.", "/images/game/skyline.jpg"],
  ["Marketing and Advertising", "Advergames and branded worlds that earn attention across devices.", "/images/game/signs.jpg"],
  ["Sports and Fitness", "Motion-tracked fitness apps and VR sports training with interactive 3D avatars.", "/images/game/stadium.jpg"],
  ["Entertainment and Media", "Original IP across MMO and naval combat formats for mobile, PC and console.", "/images/game/arcade.jpg"],
];

const MARQUEE = ["Unity", "Unreal Engine", "UEFN", "Blender", "Maya", "ZBrush", "Substance", "Photon", "Mirror", "AWS", "Meta Quest", "visionOS", "PlayStation", "Xbox", "Switch", "Steam"];

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
    <main className="gdp">
      <GameFx />
      <section className="gd-hero">
        <GameHero />
        <div className="gd-hero-inner">
          <nav aria-label="Breadcrumb" className="svc-in flex items-center gap-1.5 text-[14px]" style={{ "--d": "0s", "--y": "10px" } as React.CSSProperties}>
            <a className="text-white/60 transition-colors hover:text-white" href="/services">
              Services
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-white/50" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="text-white">Game Development</span>
          </nav>
          <h1 className="mt-7 max-w-[980px] text-white">
            <span className="gd-kicker">Game development</span>
            <span className="mt-5 block overflow-hidden pb-[0.12em] text-[clamp(2.7rem,6.2vw,6.4rem)] font-normal leading-[1.02] tracking-[-0.05em]">
              <span className="svc-rise block" style={{ "--d": "0.1s" } as React.CSSProperties}>
                Game development that ships and scales.
              </span>
            </span>
          </h1>
          <div className="svc-in" style={{ "--d": "0.3s", "--y": "16px" } as React.CSSProperties}>
            <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-white/75">
              Unlock boundless potential with enterprise-grade game development across Unity, Unreal Engine, VR and XR, UEFN and the metaverse, from first concept to launch and live ops.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#get-started" data-cta="service-hero-game-project" className="group inline-flex h-13 items-center gap-2 rounded-full bg-white pl-6 pr-5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">
                Discuss your game project
                <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#engagement" className="group relative inline-flex items-center gap-1.5 text-[16px] font-medium text-white">
                See how we work with you
                <span className="absolute -bottom-1 left-0 h-px w-full bg-white/40 transition-transform duration-500 group-hover:scale-x-0" />
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform delay-150 duration-500 group-hover:scale-x-100" />
              </a>
            </div>
          </div>
          <ul className="gd-hero-facts svc-in" style={{ "--d": "0.5s", "--y": "20px" } as React.CSSProperties}>
            {["Unity and Unreal", "AR / VR / XR", "UEFN and Verse", "Web3 and metaverse"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="In numbers" className="gd-stats">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div data-scrub="" className="gd-scrub gd-stats-panel relative isolate overflow-hidden rounded-[28px] px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/game/street.jpg" alt="" loading="lazy" data-parallax="60" className="gd-parallax-img absolute inset-0 -z-20 size-full object-cover" />
              <span className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(5,7,28,0.92),rgba(5,7,28,0.7))]" />
              <dl className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
                {STATS.map(([n, l]) => (
                  <div key={l} className="border-t border-white/25 pt-6">
                    <dt className="sr-only">{l}</dt>
                    <dd>
                      <span className="block text-[clamp(2.4rem,4.4vw,4.2rem)] font-normal leading-none tracking-[-0.04em]" {...(/^\d+$/.test(n) ? { "data-count": n } : {})}>
                        {n}
                      </span>
                      <span className="mt-3 block text-[15px] text-white/70">{l}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section aria-label="Technology" className="gd-marquee" aria-hidden="false">
        <div className="gd-marquee-track" aria-hidden="true">
          {[...MARQUEE, ...MARQUEE].map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </section>

      <section aria-label="Overview" className={SEC}>
        <div className={`${WRAP} grid items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>Overview</Eyebrow>
            <H2>From concept to live ops, one studio.</H2>
            <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
              TechClues builds games and real-time 3D experiences across Unity, Unreal, VR and XR, UEFN and the metaverse, from MMOs and VR platforms to metaverse worlds, UEFN islands and architectural visualisation.
            </p>
            <p className="mt-4 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
              Art, engineering and platform work sit together, so a title moves from concept through launch and into live ops without being handed between vendors.
            </p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {STACK.map((t) => (
                <li key={t} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[14px] text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="" style={rv("0.1s")}>
            <GameCollage />
          </div>
        </div>
      </section>

      <section aria-label="The difference" className="py-[clamp(24px,4vw,48px)]">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div data-scrub="" className="gd-scrub gd-dark relative isolate overflow-hidden rounded-[28px] px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
              <GameCube size={150} className="gd-cube-r" />
              <GameCube size={70} tint="#ff8fd0" className="gd-cube-r2" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/game/stage.jpg" alt="" loading="lazy" data-parallax="50" className="gd-parallax-img absolute inset-0 -z-20 size-full object-cover" />
              <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,28,0.88),rgba(5,7,28,0.94))]" />
              <Eyebrow light>The difference</Eyebrow>
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">Why studios pick TechClues over a dev shop.</h2>
              <div className="mt-12 grid gap-4 md:grid-cols-3">
                {DIFFERENCE.map(([t, d, icon]) => (
                  <div key={t} data-tilt="" className="gd-tilt gd-glass rounded-[22px] p-7">
                    <svg viewBox="0 0 24 24" className="size-7 text-[#8fd0ff]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {icon}
                    </svg>
                    <h3 className="mt-6 text-[clamp(1.25rem,1.7vw,1.5rem)] leading-snug tracking-[-0.02em]">{t}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/70">{d}</p>
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
          <GameModes modes={MODELS.map(([badge, title, text, best, img]) => ({ badge, title, text, best, img }))} />
        </div>
      </section>

      <section aria-label="Process" className="py-[clamp(24px,4vw,48px)]">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div data-quest="" data-scrub="" className="gd-scrub gd-dark relative isolate overflow-hidden rounded-[28px] px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/game/team.jpg" alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
              <span className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,7,28,0.93),rgba(5,7,28,0.97))]" />
              <Eyebrow light>Process</Eyebrow>
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">From first call to live ops.</h2>
              <ol className="relative mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-5 lg:gap-4">
                <span className="gd-path" aria-hidden="true">
                  <i />
                </span>
                {STEPS.map(([t, d], n) => (
                  <li key={t} data-level={n + 1} className="gd-step relative">
                    <span className="gd-node" />
                    <div className="mt-6 h-[calc(100%-1.5rem)] rounded-[22px] border border-white/12 bg-white/[0.04] p-6">
                      <p className="text-[13px] tabular-nums text-[#8fd0ff]">{`0${n + 1}`}</p>
                      <h3 className="mt-4 text-[clamp(1.2rem,1.6vw,1.4rem)] tracking-[-0.02em]">{t}</h3>
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
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:mt-14">
            {INDUSTRIES.map(([t, d, img], n) => (
              <div key={t} data-reveal="" style={rv(`${(n % 3) * 0.07}s`)}>
                <article data-tilt="" className="gd-tilt gd-card group relative isolate flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-[26px] p-7 text-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" loading="lazy" className="gd-card-img absolute inset-0 -z-20 size-full object-cover" />
                  <span className="gd-card-shade absolute inset-0 -z-10" />
                  <span className="text-[13px] tabular-nums text-white/60">{`0${n + 1}`}</span>
                  <h3 className="mt-2 text-[clamp(1.3rem,1.8vw,1.6rem)] leading-snug tracking-[-0.025em]">{t}</h3>
                  <p className="mt-2 max-w-[360px] text-[15px] leading-relaxed text-white/75">{d}</p>
                </article>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Tools and technologies" className={`${SEC} gd-tools`}>
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>Tools &amp; technologies</Eyebrow>
            <H2>The stack behind every title we ship.</H2>
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:mt-14">
            {TOOLS.map(([g, items], n) => (
              <div key={g} data-reveal="" style={rv(`${(n % 2) * 0.07}s`)}>
                <div data-tilt="" className="gd-tilt gd-toolcard h-full rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                  <p className="gd-toolhead text-[13px] font-medium uppercase tracking-[0.12em] text-brand">{g}</p>
                  <ul className="mt-5 flex flex-wrap gap-2.5">
                    {items.map((t, k) => (
                      <li key={t} style={{ "--i": k } as React.CSSProperties} className="gd-toolchip rounded-full bg-[#f1f0f6] px-4 py-2 text-[15px] text-ink">
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

      <section aria-label="Questions" className={`${SEC} gd-faq-sec`}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-normal leading-[1.06] tracking-[-0.04em] text-ink">Frequently asked questions.</h2>
            <p className="mt-5 max-w-[380px] text-[16px] leading-relaxed text-ink-soft">The vision stays yours. We build it. Bring a napkin sketch or a stalled build. In one free call we will map the fastest route to a title players love.</p>
            <a href="#get-started" className="mt-6 inline-flex text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand">
              Let&apos;s talk
            </a>
          </div>
          <div data-reveal="" style={rv("0.1s")} className="gd-faq">
            <Accordion items={faqs} />
          </div>
        </div>
      </section>

      <section id="get-started" aria-label="Get started" className="scroll-mt-24 pb-[clamp(72px,10vw,160px)] pt-[clamp(32px,4vw,64px)]">
        <div className={WRAP}>
          <div data-scrub="" className="gd-scrub gd-dark gd-form gd-aurora relative isolate grid gap-12 overflow-hidden rounded-[28px] p-7 sm:rounded-[36px] sm:p-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:p-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <GameCube size={110} tint="#9b6bff" className="gd-cube-bl" />
            <img src="/images/game/coding.jpg" alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover" />
            <span className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(5,7,28,0.94),rgba(10,18,80,0.9))]" />
            <div data-reveal="" style={rv()}>
              <Eyebrow light>Get started</Eyebrow>
              <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-normal leading-[1.05] tracking-[-0.04em] text-white">Tell us about the title you want to build.</h2>
              <ul className="mt-8 grid gap-3">
                {["Bring a concept, a stalled build, or a live title", "One call to map scope, platform and art fidelity", "A route to a vertical slice, not a vague estimate"].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-[16px] text-white/90">
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
            <div data-reveal="" style={rv("0.1s")} className="gd-formcard gd-glowborder relative rounded-[24px] p-6 sm:p-10">
              <StaffSeatForm formName="game-development" endpoint="/api/public/game-development" companyLabel="Studio / Company" needLabel="What brings you here today?" needOptions={NEEDS} needError="Choose what brings you here." briefLabel="Tell us about the title" extras={false} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
