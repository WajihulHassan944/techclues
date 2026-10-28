/* AI enablement service page — rebuilt with the same cinematic structure as the game
 * development page (hero, stats, marquee, collage, capability tabs, process, industries,
 * tools, form), using AI-specific content and a canvas neural-network hero instead of a photo. */
import Accordion from "./Accordion";
import AiAtWork from "./AiAtWork";
import AiCapabilities from "./AiCapabilities";
import AiCollage from "./AiCollage";
import AiHeroFx from "./AiHeroFx";
import GameFx from "./GameFx";
import GameCube from "./GameCube";
import GameModes from "./GameModes";
import StaffSeatForm from "./StaffSeatForm";
import { Arrow, Eyebrow, H2, SEC, WRAP, rv } from "./ServiceParts";
import { getFaqs } from "@/lib/api/faqs";
import { getPublicService } from "@/lib/api/services";
import { fallbackFaqs } from "@/lib/faq-fallbacks/ai-enablement";

const STATS: [string, string][] = [
  ["3", "Model providers we build on, chosen per task"],
  ["92", "% retrieval accuracy on a typical RAG build"],
  ["2", "Weeks to a working prototype, typically"],
  ["Free", "Discovery call to start"],
];

const STACK = ["OpenAI", "Anthropic", "Gemini", "LangChain", "LlamaIndex", "Pinecone", "pgvector", "Zapier", "n8n", "Azure AI", "AWS Bedrock", "Hugging Face"];

const DIFFERENCE: [string, string, React.ReactNode][] = [
  [
    "Grounded in your data, not a demo.",
    "Every assistant and automation we ship is wired to your own systems and documents from day one, so it works on your real cases, not a cherry-picked one.",
    <path key="a" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 5v5l3 3" />,
  ],
  [
    "A human stays in the loop.",
    "Confidence thresholds, review steps and handoff paths are part of the build, not an afterthought — nothing irreversible happens without a person able to see it coming.",
    <path key="b" d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M12 7a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 14-3-3m0 0a3 3 0 1 0-4-4 3 3 0 0 0 4 4Z" />,
  ],
  [
    "Evaluated before it ships.",
    "An eval suite and a defined success metric exist before anything reaches production, so you know whether a feature is actually working, not just whether it demos well.",
    <path key="c" d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />,
  ],
];

const MODELS = [
  ["Embedded team", "AI Specialist Inside Your Team", "An AI engineer embedded directly into your product team and codebase, working to your existing roadmap and process.", "Best for ongoing AI capability without a hiring cycle", "/images/company/team-meeting.jpg"],
  ["Scoped build", "A Defined AI Feature, Delivered", "We scope, build and ship one specific AI feature end to end — an assistant, an automation, a model — with a fixed outcome in mind.", "Best for a clear brief and a fixed budget", "/images/services/ai.jpg"],
];

const STEPS = [
  ["Discovery", "Scope the use case, the data involved, and what success actually looks like, on a free call."],
  ["Prototype", "A working proof of concept against real data, before any production commitment."],
  ["Build", "Engineering in focused sprints, with guardrails and evals built in from the start, not bolted on."],
  ["Evaluation", "Accuracy, cost and latency tested against the success metric agreed at discovery."],
  ["Launch & Monitor", "Shipped with monitoring in place, then tuned as real usage comes in."],
];

const INDUSTRIES: [string, string, string][] = [
  ["Healthcare & medical", "Intake triage, clinical documentation support and scheduling assistants, with a human always in the loop.", "/images/blog/idea-validation.jpg"],
  ["Retail & e-commerce", "Product recommendation, returns automation and support assistants grounded in your catalogue.", "/images/services/marketing.jpg"],
  ["Recruitment & staffing", "CV screening, candidate matching and interview scheduling automated without losing the human decision.", "/images/services/brand.jpg"],
  ["SaaS & startups", "Usage-based churn signals, support deflection and onboarding assistants built into the product itself.", "/images/blog/product-strategy.jpg"],
  ["Logistics & transportation", "Dispatch matching, delay prediction and document automation across a moving fleet.", "/images/services/rescue.jpg"],
  ["Manufacturing", "Visual inspection, stock reconciliation and supplier invoice automation on the factory floor.", "/images/services/lowcode.jpg"],
];

const TOOLS: [string, string[]][] = [
  ["Model providers", ["OpenAI", "Anthropic", "Google Gemini", "Open-weight (Llama, Mistral)"]],
  ["Retrieval & data", ["LangChain", "LlamaIndex", "Pinecone", "pgvector", "Elasticsearch"]],
  ["Automation & orchestration", ["n8n", "Zapier", "Temporal", "Custom pipelines"]],
  ["Infrastructure", ["Azure AI", "AWS Bedrock", "GCP Vertex AI", "Hugging Face", "On-prem / self-hosted"]],
];

const MARQUEE = ["OpenAI", "Anthropic", "Gemini", "LangChain", "LlamaIndex", "Pinecone", "pgvector", "Zapier", "n8n", "Azure AI", "AWS Bedrock", "Hugging Face", "Temporal", "Elasticsearch"];

const NEEDS = ["Not sure where to start", "Have a specific workflow to automate", "Already built something, needs work", "Want an AI feature added to our product"];

export default async function AiEnablementMarkup() {
  const [serviceFaqs, service] = await Promise.all([getFaqs(), getPublicService("ai-enablement")]);
  const faqs = serviceFaqs["ai-enablement"]?.length ? serviceFaqs["ai-enablement"] : fallbackFaqs;
  return (
    <main className="gdp">
      <GameFx />
      <section className="gd-hero">
        <AiHeroFx />
        <div className="gd-hero-inner">
          <nav aria-label="Breadcrumb" className="svc-in flex items-center gap-1.5 text-[14px]" style={{ "--d": "0s", "--y": "10px" } as React.CSSProperties}>
            <a className="text-white/60 transition-colors hover:text-white" href="/services">
              Services
            </a>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-3.5 text-white/50" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="text-white">Automation &amp; AI Integration</span>
          </nav>
          <h1 className="mt-7 max-w-[980px] text-white">
            <span className="gd-kicker">{service?.heroEyebrow ?? "Automation & AI integration"}</span>
            <span className="mt-5 block overflow-hidden pb-[0.12em] text-[clamp(2.7rem,6.2vw,6.4rem)] font-normal leading-[1.02] tracking-[-0.05em]">
              <span className="svc-rise block" style={{ "--d": "0.1s" } as React.CSSProperties}>
                {service?.heroHeadline ?? "AI that earns its place in your product."}
              </span>
            </span>
          </h1>
          <div className="svc-in" style={{ "--d": "0.3s", "--y": "16px" } as React.CSSProperties}>
            <p className="mt-6 max-w-[620px] text-[18px] leading-relaxed text-white/75">
              {service?.heroSubheading ?? "We apply AI where it delivers returns: inside the product you have today, or inside a fresh one designed around it — grounded in your data, with a human always in the loop."}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href="#get-started" data-cta="service-hero-ai-project" className="group inline-flex h-13 items-center gap-2 rounded-full bg-white pl-6 pr-5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">
                Talk through your AI idea
                <Arrow className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#engagement" className="group relative inline-flex items-center gap-1.5 text-[16px] font-medium text-white">
                Find out how we collaborate
                <span className="absolute -bottom-1 left-0 h-px w-full bg-white/40 transition-transform duration-500 group-hover:scale-x-0" />
                <span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform delay-150 duration-500 group-hover:scale-x-100" />
              </a>
            </div>
          </div>
          <ul className="gd-hero-facts svc-in" style={{ "--d": "0.5s", "--y": "20px" } as React.CSSProperties}>
            {["Chatbots & assistants", "Workflow automation", "RAG & search", "Computer vision"].map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <section aria-label="In numbers" className="gd-stats">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div data-scrub="" className="gd-scrub gd-dark gd-stats-panel relative isolate overflow-hidden rounded-[28px] px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
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
            <H2>AI wired into how you actually work.</H2>
            <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">
              We apply AI where it delivers a measurable return: automating the repetitive steps between your tools, grounding a chatbot in your own documentation, or adding a model to a feature your product already needs.
            </p>
            <p className="mt-4 max-w-[540px] text-[17px] leading-relaxed text-ink-soft">Because the engineer who builds the feature also defines the evals and guardrails around it, nothing ships that hasn&apos;t been tested against your real data first.</p>
            <ul className="mt-8 flex flex-wrap gap-2.5">
              {STACK.map((t) => (
                <li key={t} className="rounded-full border border-ink/10 bg-white px-4 py-2 text-[14px] text-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="" style={rv("0.1s")}>
            <AiCollage />
          </div>
        </div>
      </section>

      <section aria-label="The difference" className="py-[clamp(24px,4vw,48px)]">
        <div className={WRAP}>
          <div data-reveal="" style={rv()}>
            <div data-scrub="" className="gd-scrub gd-dark relative isolate overflow-hidden rounded-[28px] px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16">
              <GameCube size={150} className="gd-cube-r" />
              <GameCube size={70} tint="#ff8fd0" className="gd-cube-r2" />
              <Eyebrow light>Our edge</Eyebrow>
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">AI that behaves the same in production as it did in the demo.</h2>
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

      <section aria-label="Capabilities" className={SEC}>
        <div className={WRAP}>
          <div className="rounded-[28px] bg-[#f1f0f6] p-5 sm:rounded-[36px] sm:p-10 lg:p-14">
            <div data-reveal="" style={rv()} className="flex flex-col items-center text-center">
              <Eyebrow>Disciplines</Eyebrow>
              <h2 className="mx-auto mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Every AI discipline your product requires.</h2>
            </div>
            <AiCapabilities />
          </div>
        </div>
      </section>

      <section id="engagement" aria-label="Engagement models" className={`${SEC} scroll-mt-24`}>
        <div className={WRAP}>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div data-reveal="" style={rv()}>
              <Eyebrow>Collaboration options</Eyebrow>
              <H2>Two routes to working with us.</H2>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a href="#get-started" className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">
                Get in touch
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
              <Eyebrow light>Process</Eyebrow>
              <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em]">Discovery call through to a monitored launch.</h2>
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
              <H2>Where we&apos;ve put AI to work.</H2>
            </div>
            <div data-reveal="" style={rv("0.1s")}>
              <a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/industries">
                Every industry
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
            <Eyebrow>Technologies &amp; tools</Eyebrow>
            <H2>What powers each AI feature we ship.</H2>
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

      <AiAtWork />

      <section aria-label="Questions" className={`${SEC} gd-faq-sec`}>
        <div className={`${WRAP} grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}>
          <div data-reveal="" style={rv()}>
            <Eyebrow>FAQs</Eyebrow>
            <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-normal leading-[1.06] tracking-[-0.04em] text-ink">Common questions answered.</h2>
            <p className="mt-5 max-w-[380px] text-[16px] leading-relaxed text-ink-soft">Bring a rough idea or a stalled AI project. In one free call we&apos;ll map the quickest, safest route to something that actually works in production.</p>
            <a href="#get-started" className="mt-6 inline-flex text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand">
              Get in touch
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
            <GameCube size={110} tint="#9b6bff" className="gd-cube-bl" />
            <div data-reveal="" style={rv()}>
              <Eyebrow light>Begin here</Eyebrow>
              <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] font-normal leading-[1.05] tracking-[-0.04em] text-white">Describe the AI feature you&apos;d like us to build.</h2>
              <ul className="mt-8 grid gap-3">
                {["Bring a rough idea, a stalled build, or a live product", "One call to map the use case, data and success metric", "A route to a working prototype, not a vague estimate"].map((t) => (
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
              <StaffSeatForm formName="ai-enablement" endpoint="/api/public/ai-enablement" companyLabel="Company" needLabel="What brings you here today?" needOptions={NEEDS} needError="Choose what brings you here." briefLabel="Tell us about the use case" extras={false} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
