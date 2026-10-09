import Link from "next/link";
import { Button } from "@/components/Button";
import { Section, Eyebrow, Heading } from "@/components/Section";
import {
  projects, stats, services, aiCapabilities, aiSteps, aiProcess, stack,
  caseStudies, phases, reasons, industries, faqs, posts,
} from "@/lib/data";

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section>
        <div className="mx-auto max-w-[1320px] px-5 pb-10 pt-4 sm:px-0">
          <Link href="/zero-one" className="inline-flex items-center gap-3 rounded-full border border-line bg-white py-1 pl-1 pr-4 text-sm text-ink-soft">
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-medium text-white">New</span>
            Fast-track offer: prototype your core feature in one week, £499 →
          </Link>
          <p className="mt-9 text-lg font-medium text-brand">MVP studio · Glasgow, UK</p>
          <h1 className="mt-4 text-[44px] font-normal leading-[0.98] tracking-[-0.05em] sm:text-[88px]">
            Ideas that ship.<br />
            Backed by{" "}
            <span className="inline-block rounded-full bg-ink px-6 text-white sm:px-8">real demand</span>
          </h1>
          <div className="relative mt-12 min-h-[420px] overflow-hidden rounded-[2.5rem] bg-[linear-gradient(115deg,#d8e6ff_0%,#8ec0ff_30%,#1f6dff_62%,#0e0f31_100%)] p-8 sm:min-h-[520px] sm:p-14">
            <div className="max-w-xl rounded-[2rem] bg-white/80 p-8 backdrop-blur">
              <p className="text-3xl font-normal tracking-[-0.03em]">Prove the idea, then build it.</p>
              <p className="mt-3 text-ink-soft">Put your concept in front of real people first. We then develop just the features they ask for, often within 2–4 weeks.</p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button href="/book-a-call">Book a free strategy call</Button>
                <span className="text-sm text-muted">A 30-minute chat, no strings attached</span>
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink-soft">
                <span className="rounded-full bg-white px-4 py-1.5 shadow-sm">★ Trustpilot 4.3</span>
                <span className="rounded-full bg-white px-4 py-1.5 shadow-sm">Shopify Partner</span>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-hidden border-y border-line bg-white py-5">
          <div className="animate-marquee flex w-max gap-12 whitespace-nowrap text-base text-muted">
            {[...projects, ...projects].map((p, i) => <span key={i}>{p}</span>)}
          </div>
        </div>
      </section>

      {/* Stats */}
      <Section className="!py-14">
        <dl className="grid grid-cols-2 gap-8 text-center lg:grid-cols-5">
          {stats.map((s) => (
            <div key={s.note}>
              <dt className="text-5xl font-normal tracking-[-0.04em]">{s.value}<span className="text-lg"> {s.label}</span></dt>
              <dd className="mt-1 text-sm text-muted">{s.note}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* Company */}
      <Section className="bg-white">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="aspect-[4/3] rounded-[2rem] bg-gradient-to-br from-sky via-ice to-mint" aria-hidden />
          <div>
            <Eyebrow>Company</Eyebrow>
            <Heading>Where ideas become products.</Heading>
            <p className="mt-5 text-ink-soft">
              Techclues is a product studio for founders. We check that people want an idea before we invest in building it, so your budget goes where it counts.
            </p>
            <p className="mt-4 text-ink-soft">Designers, engineers and strategists work as one group alongside you, from the first call through launch and afterwards.</p>
            <dl className="mt-6 grid gap-2 text-sm text-ink-soft">
              <div><dt className="inline font-medium text-ink">Headquarters: </dt><dd className="inline">Glasgow, UK</dd></div>
              <div><dt className="inline font-medium text-ink">Production studio: </dt><dd className="inline">Karachi, PK</dd></div>
            </dl>
            <Button href="/about" variant="ghost" className="mt-7">More about us</Button>
          </div>
        </div>
        <div className="mt-16 rounded-[2rem] bg-ice p-8 sm:p-12">
          <h3 className="text-2xl font-semibold">Our approach</h3>
          <p className="mt-3 max-w-3xl text-ink-soft">
            Many products stall because demand was never confirmed. We start with real user feedback and build only what is proven useful, which means a quicker launch and a smaller bill.
          </p>
          <Button href="/how-we-work" className="mt-6">See how we work</Button>
        </div>
      </Section>

      {/* Services */}
      <Section>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>Services</Eyebrow><Heading>All the help your product needs.</Heading></div>
          <Button href="/services" variant="ghost">All services</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Link key={s.title} href={s.href} className="group rounded-[2rem] border border-line bg-white p-7 transition hover:-translate-y-1 hover:shadow-xl">
              <span className="text-sm font-medium text-brand">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{s.text}</p>
            </Link>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-between gap-5 rounded-[2rem] bg-mint p-8">
          <div>
            <p className="text-sm font-medium text-success">Grant application support</p>
            <h3 className="mt-1 text-2xl font-semibold">Might your project qualify for a grant?</h3>
            <p className="mt-2 max-w-xl text-sm text-ink-soft">We search for innovation and technology funding that fits, and handle the application paperwork for you.</p>
          </div>
          <Button href="/grant-funding">See funding options</Button>
        </div>
      </Section>

      {/* AI */}
      <Section className="bg-ink text-white">
        <Eyebrow>AI integration</Eyebrow>
        <h2 className="max-w-3xl text-4xl font-normal leading-[1.04] tracking-[-0.04em] sm:text-6xl">AI that fits the tools you already use.</h2>
        <p className="mt-5 max-w-2xl text-white/70">Nothing needs replacing. We wire AI into your team&apos;s current tools and your own software through APIs.</p>
        <div className="mt-8 flex flex-wrap gap-2">
          {aiCapabilities.map((c, i) => (
            <span key={c} className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/80">
              {String(i + 1).padStart(2, "0")} {c}
            </span>
          ))}
        </div>
        <div className="mt-12 rounded-[2rem] bg-white/5 p-8">
          <h3 className="text-xl font-semibold">Assistants &amp; chatbots</h3>
          <p className="mt-2 max-w-2xl text-sm text-white/70">Support and sales assistants that reply in your brand voice and escalate to a human when needed.</p>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {aiSteps.map((s, i) => (
              <div key={s.title} className="rounded-2xl bg-white/10 p-5">
                <span className="text-xs text-brand-soft">0{i + 1}</span>
                <p className="mt-1 font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-white/60">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
        <h3 className="mt-14 text-2xl font-semibold">Our approach to adding AI</h3>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {aiProcess.map((s, i) => (
            <div key={s.title}>
              <span className="text-sm text-brand-soft">0{i + 1}</span>
              <p className="mt-1 text-lg font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-white/60">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[2rem] bg-brand p-8">
          <div>
            <p className="text-sm text-white/80">Start here</p>
            <h3 className="text-2xl font-semibold">Begin with an AI audit.</h3>
            <p className="mt-2 max-w-xl text-sm text-white/80">We review your systems and data, then choose the few automations with the best payoff. If you proceed to a build, the audit fee is credited.</p>
            <p className="mt-2 text-sm font-medium">Audit £1,500 · roughly two weeks · builds from £3,000</p>
          </div>
          <Button href="/book-a-call" variant="light">Book a free call</Button>
        </div>
      </Section>

      {/* Stack */}
      <Section>
        <Eyebrow>How it works</Eyebrow>
        <Heading>A modern, dependable toolset.</Heading>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(stack).map(([group, items]) => (
            <div key={group} className="rounded-[2rem] border border-line bg-white p-6">
              <h3 className="font-semibold">{group}</h3>
              <div className="mt-4 flex flex-wrap gap-2 [&_span]:max-w-full">
                {items.map((t) => <span key={t} className="rounded-full bg-ice px-3 py-1 text-xs text-ink-soft">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Case studies */}
      <Section className="bg-white">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>Selected work</Eyebrow><Heading>Products we have brought to life.</Heading></div>
          <Button href="/case-studies" variant="ghost">All case studies</Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {caseStudies.map((c) => (
            <Link key={c.name} href={c.href} className="group overflow-hidden rounded-[2rem] border border-line transition hover:shadow-xl">
              <div className="aspect-[16/10]" style={{ background: `linear-gradient(135deg, ${c.from}, ${c.to})` }} aria-hidden />
              <div className="p-7">
                <p className="text-xs text-muted">{c.tag} · Website · Web app</p>
                <p className="mt-2 text-sm font-medium text-brand">{c.name}</p>
                <h3 className="mt-1 text-xl font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-ink-soft">{c.text}</p>
                <span className="mt-4 inline-block text-sm font-medium text-brand">View case study →</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>How we work</Eyebrow>
            <Heading>Eight phases from concept to launch.</Heading>
            <p className="mt-4 max-w-xl text-ink-soft">A workflow centred on validation, with clear milestones and user input throughout.</p>
          </div>
          <Button href="/book-a-call">Book a free strategy call</Button>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {phases.map((p, i) => (
            <div key={p.name} className="rounded-[2rem] border border-line bg-white p-6">
              <p className="text-xs font-medium text-brand">Phase 0{i + 1}</p>
              <h3 className="mt-2 text-xl font-semibold">{p.name}</h3>
              <p className="mt-2 text-sm text-ink-soft">{p.text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Why + industries */}
      <Section className="bg-ice">
        <div className="grid gap-14 lg:grid-cols-2">
          <div>
            <Eyebrow>Why work with us</Eyebrow>
            <Heading>Focus on what counts.</Heading>
            <ul className="mt-8 space-y-6">
              {reasons.map((r) => (
                <li key={r.title}>
                  <h3 className="font-semibold">{r.title}</h3>
                  <p className="text-sm text-ink-soft">{r.text}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-3xl font-normal tracking-[-0.04em] sm:text-5xl">Sectors we work in.</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {industries.map((i) => (
                <Link key={i.href} href={i.href} className="rounded-2xl bg-white px-5 py-4 text-sm font-medium transition hover:text-brand hover:shadow-md">
                  {i.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonial */}
      <Section>
        <Eyebrow>What clients say</Eyebrow>
        <div className="rounded-[2rem] border border-line bg-white p-8 sm:p-12">
          <p className="text-sm text-muted">4.3 on Trustpilot · Shopify Partner</p>
          <blockquote className="mt-4 max-w-3xl text-2xl font-medium leading-snug">
            “The team kept us informed throughout and we always understood where the project stood.”
          </blockquote>
          <p className="mt-5 text-sm text-ink-soft">Sample client · placeholder testimonial</p>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-white">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <Eyebrow>FAQ</Eyebrow>
            <Heading>Common questions.</Heading>
            <p className="mt-4 text-ink-soft">Still unsure? Send us a message and we will get back to you quickly.</p>
            <p className="mt-2 font-medium text-brand">hello@techclues.example</p>
          </div>
          <div className="divide-y divide-line rounded-[2rem] border border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  {f.q}<span className="text-brand transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-sm text-ink-soft">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Insights */}
      <Section>
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div><Eyebrow>Insights</Eyebrow><Heading>Ideas for building well.</Heading></div>
          <Button href="/blog" variant="ghost">All articles</Button>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.href} href={p.href} className="rounded-[2rem] border border-line bg-white p-7 transition hover:shadow-xl">
              <span className="text-xs font-medium text-brand">{p.tag}</span>
              <h3 className="mt-2 text-xl font-semibold">{p.title}</h3>
              <span className="mt-4 inline-block text-sm text-brand">Read article →</span>
            </Link>
          ))}
          <div className="rounded-[2rem] bg-brand p-7 text-white">
            <span className="text-xs">Free download</span>
            <h3 className="mt-2 text-xl font-semibold">The Techclues MVP guide</h3>
            <p className="mt-2 text-sm text-white/80">What we have learned from testing and launching products.</p>
            <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-sm font-medium text-brand">Get the guide</span>
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="!pt-0">
        <div className="rounded-[2rem] bg-gradient-to-br from-brand to-brand-ink p-10 text-center text-white sm:p-16">
          <h2 className="text-4xl font-normal tracking-[-0.04em] sm:text-6xl">Have an idea to test?</h2>
          <p className="mx-auto mt-4 max-w-xl text-white/85">Book a free half-hour call. We will give an honest view on whether it is worth building and what that would involve.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button href="/book-a-call" variant="light">Book your free strategy call</Button>
            <Button href="/mvp-cost-calculator" className="border border-white/40 !bg-transparent hover:!bg-white/10">Get an instant estimate</Button>
          </div>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-white/80">
            <li>No obligation</li><li>Fixed scope and price</li><li>Full ownership of the code</li>
          </ul>
        </div>
      </Section>
    </>
  );
}
