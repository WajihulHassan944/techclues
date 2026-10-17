/* ai-enablement service page content, generated from the saved markup. */
import Accordion from "./Accordion";
import AiAtWork from "./AiAtWork";
import { getFaqs } from "@/lib/api/faqs";

export default async function AiEnablementMarkup() {
  const serviceFaqs = await getFaqs();
  return (
    <>
<main>
        
        <section className="pb-4 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
            <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px] flex flex-col items-center text-center">
                <nav aria-label="Breadcrumb" className="svc-in flex items-center gap-1.5 text-[14px] text-muted" style={{"--d": "0s", "--y": "10px"} as React.CSSProperties}><a className="transition-colors hover:text-ink" href="/services">Services</a><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right size-3.5" aria-hidden="true"><path d="m9 18 6-6-6-6"></path></svg><span className="text-ink">{"Automation & AI Integration"}</span></nav>
                <h1 className="mt-6 max-w-[1100px] text-ink"><span className="block text-[15px] font-medium tracking-normal text-brand sm:text-[16px]">Services for AI integration</span><span className="mt-4 block overflow-hidden pb-[0.12em] text-[clamp(2.4rem,5.4vw,5.5rem)] font-normal leading-[1.03] tracking-[-0.05em]"><span className="svc-rise block" style={{"--d": "0.1s"} as React.CSSProperties}>AI worth its place inside your product.</span></span>
                </h1>
                <div className="svc-in flex flex-col items-center" style={{"--d": "0.3s", "--y": "16px"} as React.CSSProperties}>
                    <p className="mt-4 max-w-[620px] text-[18px] leading-relaxed text-ink-soft">We apply AI where it delivers returns: within the product you have today, or within a fresh one designed around it.</p>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4"><a href="/book-a-call" data-cta="service-hero-book-call" className="group inline-flex h-13 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">Arrange a free call<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a>
                        <a href="#pricing" className="group relative inline-flex items-center gap-1.5 text-[16px] font-medium text-ink">View pricing<span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-100 transition-transform duration-500 group-hover:origin-left group-hover:scale-x-0 bg-ink/30"></span><span className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-brand transition-transform delay-150 duration-500 group-hover:scale-x-100"></span></a>
                    </div>
                    <div className="mt-8 flex flex-wrap items-center justify-center gap-3"><a href="https://uk.trustpilot.com/review/techclues.co.uk" target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-3 rounded-full border border-ink/10 bg-white py-2 pl-3 pr-4 text-[14px] text-ink transition-colors hover:border-ink/30"><span className="flex gap-0.5" role="img" aria-label="4.3 out of 5 stars"><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "29.999999999999982%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span></span><span><strong className="font-semibold">4.3</strong><span className="text-muted"> on </span><span className="inline-flex items-center gap-1 font-semibold tracking-[-0.01em] text-ink align-middle"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.15em] shrink-0"><path d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z" fill="#00B67A"></path></svg>Trustpilot</span></span></a></div>
                </div>
            </div>
        </section>
        <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px] pb-4 pt-6">
            <div className="svc-in relative aspect-[4/3] overflow-hidden rounded-[24px] bg-ink sm:aspect-auto sm:h-[clamp(280px,52vh,560px)] sm:rounded-[36px]" style={{"--d": "0.45s", "--y": "30px"} as React.CSSProperties}>
                <div className="absolute -inset-y-[8%] inset-x-0" style={{transform: "translateY(-6%)"}}><img alt="A developer working on code at a laptop" className="object-cover" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/services/ai.jpg" /></div><span className="absolute inset-0 bg-[linear-gradient(to_top,rgba(14,15,49,0.25),transparent_50%)]"></span></div>
        </div>
        <section aria-label="Why it matters" className="py-[clamp(56px,7vw,110px)]">
            <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px] grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
                <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                    <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>{"Automation & AI Integration"}</p>
                    <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Sound like you?</h2>
                    <p className="mt-5 max-w-[440px] text-[17px] leading-relaxed text-ink-soft">Teams with genuine work to automate, or an idea reliant on AI.</p>
                    <p className="mt-6 max-w-[440px] text-[15px] leading-relaxed text-muted">Made your app using AI tools such as Lovable or Cursor?
                        <a className="inline-flex items-center gap-1 font-medium text-ink underline decoration-ink/25 underline-offset-4 transition-colors duration-300 hover:text-brand hover:decoration-brand" href="/services/prototype-to-production">Explore Prototype to Production<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-3.5" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a></p>
                </div>
                <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}>
                    <ul className="border-t border-ink/10">
                        <li className="flex items-start gap-4 border-b border-ink/10 py-6"><span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#fdecec] text-[#d64545]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-3.5" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></span>
                            <span className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug tracking-[-0.015em] text-ink">Your people lose hours on tasks a model could draft within seconds.</span>
                        </li>
                        <li className="flex items-start gap-4 border-b border-ink/10 py-6"><span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#fdecec] text-[#d64545]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-3.5" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></span>
                            <span className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug tracking-[-0.015em] text-ink">The AI features you've tried were unreliable or off-brand.</span>
                        </li>
                        <li className="flex items-start gap-4 border-b border-ink/10 py-6"><span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#fdecec] text-[#d64545]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x size-3.5" aria-hidden="true"><path d="M18 6 6 18"></path><path d="m6 6 12 12"></path></svg></span>
                            <span className="text-[clamp(1.1rem,1.6vw,1.35rem)] leading-snug tracking-[-0.015em] text-ink">You can't tell what's achievable, or what it costs to keep running.</span>
                        </li>
                    </ul>
                </div>
            </div>
        </section>
        <section aria-label="What's included" className="py-[clamp(56px,7vw,110px)]">
            <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>What we cover</p>
                        <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">All handled, from start to finish.</h2>
                    </div>
                </div>
                <ol className="mt-10 grid border-t border-ink/10 md:grid-cols-2 md:gap-x-16 lg:mt-14">
                    <li>
                        <div data-reveal="" className="grid h-full grid-cols-[32px_1fr] gap-4 border-b border-ink/10 py-7" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="pt-1.5 text-[13px] tabular-nums text-brand">01</span><span><span className="block text-[clamp(1.25rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">AI audit</span><span className="mt-1.5 block max-w-[440px] text-[15px] leading-relaxed text-ink-soft">A targeted review that pinpoints which tasks deserve automating, and which don't.</span></span>
                        </div>
                    </li>
                    <li>
                        <div data-reveal="" className="grid h-full grid-cols-[32px_1fr] gap-4 border-b border-ink/10 py-7" style={{"--reveal-delay": "0.06s", "--reveal-y": "28px"} as React.CSSProperties}><span className="pt-1.5 text-[13px] tabular-nums text-brand">02</span><span><span className="block text-[clamp(1.25rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">Responses drawn from your data</span><span className="mt-1.5 block max-w-[440px] text-[15px] leading-relaxed text-ink-soft">Assistants and search that reply from your own documents, citing sources.</span></span>
                        </div>
                    </li>
                    <li>
                        <div data-reveal="" className="grid h-full grid-cols-[32px_1fr] gap-4 border-b border-ink/10 py-7" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="pt-1.5 text-[13px] tabular-nums text-brand">03</span><span><span className="block text-[clamp(1.25rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">AI built into your product</span><span className="mt-1.5 block max-w-[440px] text-[15px] leading-relaxed text-ink-soft">Drafting, summarising, searching, tagging and recommending, all built in.</span></span>
                        </div>
                    </li>
                    <li>
                        <div data-reveal="" className="grid h-full grid-cols-[32px_1fr] gap-4 border-b border-ink/10 py-7" style={{"--reveal-delay": "0.06s", "--reveal-y": "28px"} as React.CSSProperties}><span className="pt-1.5 text-[13px] tabular-nums text-brand">04</span><span><span className="block text-[clamp(1.25rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">Automating your workflows</span><span className="mt-1.5 block max-w-[440px] text-[15px] leading-relaxed text-ink-soft">Handle documents, emails and tickets with no manual effort.</span></span>
                        </div>
                    </li>
                    <li>
                        <div data-reveal="" className="grid h-full grid-cols-[32px_1fr] gap-4 border-b border-ink/10 py-7" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="pt-1.5 text-[13px] tabular-nums text-brand">05</span><span><span className="block text-[clamp(1.25rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">Model set-up</span><span className="mt-1.5 block max-w-[440px] text-[15px] leading-relaxed text-ink-soft">Plug in the best-suited model, or fine-tune one where it pays its way.</span></span>
                        </div>
                    </li>
                    <li>
                        <div data-reveal="" className="grid h-full grid-cols-[32px_1fr] gap-4 border-b border-ink/10 py-7" style={{"--reveal-delay": "0.06s", "--reveal-y": "28px"} as React.CSSProperties}><span className="pt-1.5 text-[13px] tabular-nums text-brand">06</span><span><span className="block text-[clamp(1.25rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">{"Safeguards & monitoring"}</span><span className="mt-1.5 block max-w-[440px] text-[15px] leading-relaxed text-ink-soft">Quality and spend remain visible thanks to testing, fallback plans and usage tracking.</span></span>
                        </div>
                    </li>
                </ol>
            </div>
        </section>
        <AiAtWork />
        <section id="pricing" aria-label="Pricing" className="py-[clamp(56px,7vw,110px)] scroll-mt-24">
            <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Pricing</p>
                        <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Begin with an AI audit.</h2>
                    </div>
                </div>
                <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                    <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-ink-soft">A sensible first move: before you commit to building, we identify which work is worth automating and price it.</p>
                </div>
                <ol className="gap-4 md:gap-5 grid mt-10 lg:mt-14 md:grid-cols-2">
                    <li>
                        <div data-reveal="" className="h-full" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[28px] p-7 sm:p-10 bg-ink text-white"><span className="pointer-events-none absolute -right-24 -top-28 -z-10 size-72 rounded-full bg-brand/45 blur-[90px]"></span>
                                <p className="text-[13px] font-medium text-brand-soft">Step 1</p>
                                <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,2rem)] font-normal tracking-[-0.03em]">AI audit</h3>
                                <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="leading-none tracking-[-0.045em] text-[clamp(2.4rem,4vw,3.5rem)]">{"£1,500"}</span><span className="text-[15px] text-white/60">Around two weeks</span></p>
                                <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-white/70">Systems and data are mapped first; then we shortlist the best one or two automations by payback.</p>
                                <ul className="mt-7 grid gap-3 border-t pt-7 border-white/15">
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-white/85">Session with your team</span></li>
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-white/85">Review of systems and data</span></li>
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-white/85">Short list with projected return</span></li>
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-white/85">Build plan with costs</span></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div data-reveal="" className="h-full" style={{"--reveal-delay": "0.08s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <div className="relative isolate flex h-full flex-col overflow-hidden rounded-[28px] p-7 sm:p-10 border border-ink/10 bg-white text-ink">
                                <p className="text-[13px] font-medium text-brand">Step 2</p>
                                <h3 className="mt-2 text-[clamp(1.5rem,2.2vw,2rem)] font-normal tracking-[-0.03em]">Build</h3>
                                <p className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1"><span className="text-[15px] text-muted">From</span><span className="leading-none tracking-[-0.045em] text-[clamp(2.4rem,4vw,3.5rem)]">{"£3,000"}</span><span className="text-[15px] text-muted">Settled during the audit</span></p>
                                <p className="mt-5 max-w-[460px] text-[16px] leading-relaxed text-ink-soft">We fit the automation into the tools you use today, try it against real examples, then release it.</p>
                                <ul className="mt-7 grid gap-3 border-t pt-7 border-ink/10">
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-ink">Integration with systems</span></li>
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-ink">Trials using real examples</span></li>
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-ink">Safeguards and monitoring</span></li>
                                    <li className="flex items-start gap-3 text-[15px]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check mt-0.5 size-4 shrink-0 text-brand" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg><span className="text-ink">Handing it over</span></li>
                                </ul>
                            </div>
                        </div>
                    </li>
                </ol>
                <div data-reveal="" className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                    <p className="flex items-center gap-2.5 text-[15px] text-ink"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check lucide-verified size-5 shrink-0 text-brand" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m16 9-5.5 5.5L8 12"></path></svg>{"If you proceed to build, we deduct the £1,500 audit fee from the total."}</p><a href="/book-a-call" data-cta="ai-enablement-pricing-book-call" className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand sm:self-auto">Arrange a free call<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a></div>
            </div>
        </section>
        <div className="cv-auto">
            <section aria-label="Know before you start" className="py-[clamp(56px,7vw,110px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px] grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
                    <div>
                        <div data-reveal="" className="lg:sticky lg:top-32" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Worth knowing first</p>
                            <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">What makes AI hold up in production.</h2>
                            <p className="mt-5 max-w-[440px] text-[17px] leading-relaxed text-ink-soft">A demo is simple; a dependable AI feature takes more. Here is how we bridge that gap.</p>
                        </div>
                    </div>
                    <ol className="border-t border-ink/10">
                        <li>
                            <div data-reveal="" className="grid gap-3 border-b border-ink/10 py-8 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-10" style={{"--reveal-delay": "0.05s", "--reveal-y": "28px"} as React.CSSProperties}><span className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tracking-[-0.04em] text-brand">01</span>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.75rem)] font-normal leading-tight tracking-[-0.03em] text-ink">Begin with the job, not the model</h3>
                                    <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">Choose a single task with a clear result, for example writing a reply or pulling data from invoices. A tight task is simpler to measure, costs less to run and is much likelier to hold up once real users arrive.</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div data-reveal="" className="grid gap-3 border-b border-ink/10 py-8 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-10" style={{"--reveal-delay": "0.05s", "--reveal-y": "28px"} as React.CSSProperties}><span className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tracking-[-0.04em] text-brand">02</span>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.75rem)] font-normal leading-tight tracking-[-0.03em] text-ink">Base answers on your own material</h3>
                                    <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">With retrieval, the model checks your documents before replying and names its sources. Answers stay up to date, and confident but wrong output becomes much rarer than when a model relies on memory.</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div data-reveal="" className="grid gap-3 border-b border-ink/10 py-8 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-10" style={{"--reveal-delay": "0.05s", "--reveal-y": "28px"} as React.CSSProperties}><span className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tracking-[-0.04em] text-brand">03</span>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.75rem)] font-normal leading-tight tracking-[-0.03em] text-ink">Test quality ahead of launch</h3>
                                    <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">We assemble real examples into a test set and measure accuracy, speed and cost against it. Opinion turns into evidence, and you see when a cheaper model could do the same work.</p>
                                </div>
                            </div>
                        </li>
                        <li>
                            <div data-reveal="" className="grid gap-3 border-b border-ink/10 py-8 sm:grid-cols-[72px_1fr] sm:gap-6 sm:py-10" style={{"--reveal-delay": "0.05s", "--reveal-y": "28px"} as React.CSSProperties}><span className="text-[clamp(1.6rem,2.4vw,2.2rem)] leading-none tracking-[-0.04em] text-brand">04</span>
                                <div>
                                    <h3 className="text-[clamp(1.3rem,2vw,1.75rem)] font-normal leading-tight tracking-[-0.03em] text-ink">Plan for spend, privacy and failures</h3>
                                    <p className="mt-3 max-w-[620px] text-[16px] leading-relaxed text-ink-soft sm:text-[17px]">With usage-based pricing, costs rise as you succeed, so we watch spending from the first day. We settle which data may leave your systems, and plan a sensible fallback for when a model runs slowly or is down.</p>
                                </div>
                            </div>
                        </li>
                    </ol>
                </div>
            </section>
        </div>
        <div className="cv-auto">
            <section aria-label="Prompting, retrieval or fine-tuning?" className="py-[clamp(56px,7vw,110px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Compare</p>
                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Prompt, retrieve or fine-tune?</h2>
                        </div>
                    </div>
                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <p className="mt-5 max-w-[560px] text-[17px] leading-relaxed text-ink-soft">Three routes to making a model useful for your business. Plenty of products blend them.</p>
                    </div>
                    <div data-reveal="" className="mt-10 hidden md:block lg:mt-14" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <table className="w-full table-fixed border-separate border-spacing-0 text-left">
                            <thead>
                                <tr>
                                    <th className="w-[18%] pb-4"></th>
                                    <th scope="col" className="px-6 pb-4 pt-6 align-bottom text-[clamp(1.1rem,1.6vw,1.4rem)] font-normal tracking-[-0.02em] text-ink">Prompting</th>
                                    <th scope="col" className="px-6 pb-4 pt-6 align-bottom text-[clamp(1.1rem,1.6vw,1.4rem)] font-normal tracking-[-0.02em] text-ink">Retrieval (RAG)</th>
                                    <th scope="col" className="px-6 pb-4 pt-6 align-bottom text-[clamp(1.1rem,1.6vw,1.4rem)] font-normal tracking-[-0.02em] text-ink">Fine-tuning</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th scope="row" className="border-t border-ink/10 py-5 pr-4 align-top text-[14px] font-medium text-muted">Best for</th>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Simple, general jobs</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Replies drawn from your own content</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">A steady format or tone</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="border-t border-ink/10 py-5 pr-4 align-top text-[14px] font-medium text-muted">Your own data</th>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Not used</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Fetched at answer time</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Taught to the model</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="border-t border-ink/10 py-5 pr-4 align-top text-[14px] font-medium text-muted">Starting effort</th>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Low</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Medium</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">High</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="border-t border-ink/10 py-5 pr-4 align-top text-[14px] font-medium text-muted">Staying up to date</th>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Change the prompt</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Refresh the documents</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Retrain</td>
                                </tr>
                                <tr>
                                    <th scope="row" className="border-t border-ink/10 py-5 pr-4 align-top text-[14px] font-medium text-muted">Cost to run</th>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Lowest</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Moderate</td>
                                    <td className="px-6 py-5 align-top text-[15px] leading-relaxed border-t border-ink/10 text-ink-soft">Costlier to set up</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-10 grid gap-4 md:hidden">
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <div className="rounded-[24px] p-6 border border-ink/[0.08] bg-white text-ink">
                                <h3 className="text-[1.3rem] font-normal tracking-[-0.02em]">Prompting</h3>
                                <dl className="mt-4 grid gap-3">
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Best for</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Simple, general jobs</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Your own data</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Not used</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Starting effort</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Low</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Staying up to date</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Change the prompt</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Cost to run</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Lowest</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <div className="rounded-[24px] p-6 border border-ink/[0.08] bg-white text-ink">
                                <h3 className="text-[1.3rem] font-normal tracking-[-0.02em]">Retrieval (RAG)</h3>
                                <dl className="mt-4 grid gap-3">
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Best for</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Replies drawn from your own content</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Your own data</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Fetched at answer time</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Starting effort</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Medium</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Staying up to date</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Refresh the documents</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Cost to run</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Moderate</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <div className="rounded-[24px] p-6 border border-ink/[0.08] bg-white text-ink">
                                <h3 className="text-[1.3rem] font-normal tracking-[-0.02em]">Fine-tuning</h3>
                                <dl className="mt-4 grid gap-3">
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Best for</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">A steady format or tone</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Your own data</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Taught to the model</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Starting effort</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">High</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Staying up to date</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Retrain</dd>
                                    </div>
                                    <div className="border-t pt-3 border-ink/10"><dt className="text-[13px] text-muted">Cost to run</dt>
                                        <dd className="mt-0.5 text-[15px] text-ink-soft">Costlier to set up</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="cv-auto">
            <section aria-label="What you receive" className="py-[clamp(56px,7vw,110px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-6 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16 lg:py-20"><span className="pointer-events-none absolute -left-32 -top-40 -z-10 size-[460px] rounded-full bg-brand/35 blur-[110px]"></span><span className="pointer-events-none absolute -bottom-48 right-[-10%] -z-10 size-[420px] rounded-full bg-brand-soft/15 blur-[120px]"></span>
                            <div className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
                                <div>
                                    <p className="flex items-center gap-2 text-[14px] font-medium text-white/60"><span className="size-1.5 rounded-full bg-brand"></span>What you get</p>
                                    <h2 className="mt-4 text-[clamp(2rem,3.6vw,3.5rem)] font-normal leading-[1.04] tracking-[-0.04em]">All you take away.</h2>
                                    <p className="mt-5 max-w-[380px] text-[16px] leading-relaxed text-white/60">Everything is yours, documented and ready to use, with or without us.</p>
                                    <ul className="mt-8 flex flex-wrap gap-2">
                                        <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-3.5 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Documented</li>
                                        <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-3.5 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Passed to you</li>
                                        <li className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-[13px] text-white/80"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check size-3.5 text-brand-soft" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>Yours for good</li>
                                    </ul>
                                </div>
                                <ol className="grid sm:grid-cols-2 sm:gap-x-10">
                                    <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">01</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">AI audit and build plan with costs</span></li>
                                    <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">02</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Data and privacy check</span></li>
                                        <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">03</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Prototype that works</span></li>
                                            <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">04</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Test set for quality, with results</span></li>
                                                <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">05</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Built into your product</span></li>
                                                    <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">06</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Safeguards and fallbacks</span></li>
                                                        <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">07</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Tracking of usage and costs</span></li>
                                                            <li className="group flex items-baseline gap-5 border-t border-white/10 py-5 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-brand-soft/60 sm:py-6"><span className="w-6 shrink-0 text-[13px] tabular-nums text-brand-soft">08</span><span className="text-[17px] leading-snug tracking-[-0.01em] text-white/85 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:text-white sm:text-[18px]">Team handover with documentation</span></li>
                                </ol>
                        </div>
                    </div>
                </div>
        </div>
        </section>
        </div>
        <div className="cv-auto">
            <section aria-label="Technologies" className="border-y border-ink/[0.06] bg-[linear-gradient(180deg,#eef3ff_0%,#fafbff_100%)] py-[clamp(64px,8vw,120px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Technology stack</p>
                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Dependable tools, picked to suit your product.</h2>
                        </div>
                    </div>
                    <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:mt-14 lg:grid-cols-4 xl:grid-cols-6">
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Anthropic Claude"><use href="/logos.svg?v=1liiiom#claude"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Anthropic Claude</span><span className="mt-1 text-[13px] text-muted">Models</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.04s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><span className="font-semibold leading-none tracking-tight text-[15px] sm:text-[18px]" style={{color: "#0e0f31"}} role="img" aria-label="OpenAI">OpenAI</span></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">OpenAI</span><span className="mt-1 text-[13px] text-muted">Models</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.08s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Google Gemini"><use href="/logos.svg?v=1liiiom#gemini"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Google Gemini</span><span className="mt-1 text-[13px] text-muted">Models</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.12s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Hugging Face"><use href="/logos.svg?v=1liiiom#hugging-face"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Hugging Face</span><span className="mt-1 text-[13px] text-muted">Models</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.16s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Python"><use href="/logos.svg?v=1liiiom#python"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Python</span><span className="mt-1 text-[13px] text-muted">Build</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.2s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="LangChain"><use href="/logos.svg?v=1liiiom#langchain"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">LangChain</span><span className="mt-1 text-[13px] text-muted">Build</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="PyTorch"><use href="/logos.svg?v=1liiiom#pytorch"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">PyTorch</span><span className="mt-1 text-[13px] text-muted">Build</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.04s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Node.js"><use href="/logos.svg?v=1liiiom#node-js"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Node.js</span><span className="mt-1 text-[13px] text-muted">Build</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.08s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Next.js"><use href="/logos.svg?v=1liiiom#next-js"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Next.js</span><span className="mt-1 text-[13px] text-muted">Build</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.12s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="PostgreSQL"><use href="/logos.svg?v=1liiiom#postgresql"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">PostgreSQL</span><span className="mt-1 text-[13px] text-muted">Data</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.16s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Supabase"><use href="/logos.svg?v=1liiiom#supabase"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Supabase</span><span className="mt-1 text-[13px] text-muted">Data</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.2s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Redis"><use href="/logos.svg?v=1liiiom#redis"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Redis</span><span className="mt-1 text-[13px] text-muted">Data</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><span className="font-semibold leading-none tracking-tight text-[20px] sm:text-[26px]" style={{color: "#FF9900"}} role="img" aria-label="AWS">AWS</span></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">AWS</span><span className="mt-1 text-[13px] text-muted">Cloud</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.04s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><span className="font-semibold leading-none tracking-tight text-[15px] sm:text-[18px]" style={{color: "#0078D4"}} role="img" aria-label="Microsoft Azure">Azure</span></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Microsoft Azure</span><span className="mt-1 text-[13px] text-muted">Cloud</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.08s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Google Cloud"><use href="/logos.svg?v=1liiiom#google-cloud"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Google Cloud</span><span className="mt-1 text-[13px] text-muted">Cloud</span></div>
                        </li>
                        <li>
                            <div data-reveal="" className="group flex h-full flex-col items-center justify-center rounded-[24px] border border-ink/[0.07] bg-white px-3 py-6 text-center transition-[border-color,translate,box-shadow] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:-translate-y-1 hover:border-brand/25 hover:shadow-[0_24px_48px_-28px_rgba(0,100,255,0.45)] sm:py-10" style={{"--reveal-delay": "0.12s", "--reveal-y": "28px"} as React.CSSProperties}><span className="grid size-14 place-items-center rounded-2xl bg-paper transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-110 sm:size-20"><svg viewBox="0 0 24 24" className="size-9 sm:size-11" role="img" aria-label="Vercel"><use href="/logos.svg?v=1liiiom#vercel"></use></svg></span>
                                <span className="mt-4 text-[15px] tracking-[-0.01em] text-ink sm:mt-5 sm:text-[17px]">Vercel</span><span className="mt-1 text-[13px] text-muted">Cloud</span></div>
                        </li>
                    </ul>
                </div>
            </section>
        </div>
        <div className="cv-auto">
            <section aria-label="Talk to us" className="py-[clamp(24px,4vw,48px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <div className="relative isolate flex flex-col gap-6 overflow-hidden rounded-[24px] bg-ink px-7 py-8 text-white sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-9"><span className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_140%_at_100%_0%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31,#0a1f6b)]"></span>
                            <div>
                                <p className="text-[clamp(1.3rem,2.2vw,1.75rem)] tracking-[-0.03em]">{"Interested in ai integration & automation?"}</p>
                                <p className="mt-2 max-w-[460px] text-[15px] leading-relaxed text-white/65">Say what you need and we'll reply with a proposed plan, a delivery schedule and a transparent cost.</p>
                            </div>
                            <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center"><a href="/book-a-call" data-cta="service-inline-book-call" className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-6 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">Arrange a free call<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a>
                                <a data-cta="service-inline-estimate" className="inline-flex h-12 items-center justify-center rounded-full border border-white/25 px-6 text-[15px] font-medium text-white transition-colors duration-300 hover:border-white hover:bg-white/10" href="/mvp-cost-calculator">Estimate the cost</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="cv-auto">
            <section aria-label="Benefits" className="py-[clamp(56px,7vw,110px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                        <div className="relative isolate overflow-hidden rounded-[28px] bg-ink px-7 py-12 text-white sm:rounded-[36px] sm:px-12 sm:py-16 lg:px-16"><span className="pointer-events-none absolute -right-28 -top-36 -z-10 size-[420px] rounded-full bg-brand/40 blur-[100px]"></span>
                            <p className="flex items-center gap-2 text-[14px] font-medium text-white/60"><span className="size-1.5 rounded-full bg-brand"></span>What you gain</p>
                            <div className="mt-10 grid gap-10 sm:grid-cols-3 sm:gap-6">
                                <div className="border-t border-white/15 pt-6">
                                    <p className="text-[clamp(1.8rem,3vw,2.8rem)] font-normal leading-none tracking-[-0.04em]">Time returned</p>
                                    <p className="mt-3 text-[16px] text-white/65">Manual work done in seconds.</p>
                                </div>
                                <div className="border-t border-white/15 pt-6">
                                    <p className="text-[clamp(1.8rem,3vw,2.8rem)] font-normal leading-none tracking-[-0.04em]">Sourced answers</p>
                                    <p className="mt-3 text-[16px] text-white/65">Replies built on your data, with citations.</p>
                                </div>
                                <div className="border-t border-white/15 pt-6">
                                    <p className="text-[clamp(1.8rem,3vw,2.8rem)] font-normal leading-none tracking-[-0.04em]">Spending you can see</p>
                                    <p className="mt-3 text-[16px] text-white/65">Usage and spend monitored from the first day.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
        <div className="cv-auto">
            <section aria-label="Industry experience" className="py-[clamp(56px,7vw,110px)]">
                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Sector experience</p>
                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Industries we know well.</h2>
                        </div>
                        <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}><a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/industries">Every industry</a></div>
                    </div>
                    <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4">
                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/healthcare-medical" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">01</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"Medical & healthcare"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
                        <div data-reveal="" style={{"--reveal-delay": "0.06s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/logistics-transportation" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">02</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"Transport & logistics"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
                    <div data-reveal="" style={{"--reveal-delay": "0.12s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/retail-ecommerce" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">03</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"E-commerce & retail"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
                <div data-reveal="" style={{"--reveal-delay": "0.18s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/education-consulting" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">04</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"Consulting & education"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
        <div data-reveal="" style={{"--reveal-delay": "0.24s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/pre-seed-seed-startups" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">05</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"Seed & pre-seed startups"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
            <div data-reveal="" style={{"--reveal-delay": "0.3s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/recruitment-staffing" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">06</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"Staffing & recruitment"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
                <div data-reveal="" style={{"--reveal-delay": "0.36s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/saas-startups" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">07</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">SaaS startups</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
                    <div data-reveal="" style={{"--reveal-delay": "0.42s", "--reveal-y": "28px"} as React.CSSProperties}><a href="/industries/industry-manufacturing" className="group relative isolate flex h-full min-h-[160px] flex-col justify-between overflow-hidden rounded-[24px] border border-ink/[0.08] bg-white p-6 transition-colors duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] hover:border-transparent"><span aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(120%_90%_at_100%_100%,#0064ff_0%,rgba(0,100,255,0)_60%),linear-gradient(135deg,#0e0f31_0%,#0a1f6b_55%,#0050d6_100%)] opacity-0 transition-opacity duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:opacity-100"></span><span className="text-[13px] tabular-nums text-muted transition-colors duration-500 group-hover:text-white/60">08</span><span className="flex items-end justify-between gap-3"><span className="text-[19px] leading-snug tracking-[-0.02em] text-ink transition-colors duration-500 group-hover:text-white">{"Manufacturing & industry"}</span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 shrink-0 text-muted transition-all duration-300 group-hover:rotate-45 group-hover:text-white" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></a></div>
                        </div>
                        </div>
                        </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="Your product partner" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px] grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-20">
                                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                        <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Why founders rely on us</p>
                                        <h2 className="mt-4 text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">A partner you can trust.</h2><a href="/book-a-call" className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-ink pl-6 pr-5 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-brand">Kick off a project<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a></div>
                                    <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}>
                                        <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                                            <div className="border-t border-ink/10 pt-5">
                                                <dd className="whitespace-nowrap text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none tracking-[-0.04em] text-ink">23+</dd><dt className="mt-2 text-[14px] text-muted">Products launched</dt></div>
                                            <div className="border-t border-ink/10 pt-5">
                                                <dd className="whitespace-nowrap text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none tracking-[-0.04em] text-ink">4.3</dd><dt className="mt-2 text-[14px] text-muted">Trustpilot score</dt></div>
                                            <div className="border-t border-ink/10 pt-5">
                                                <dd className="whitespace-nowrap text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none tracking-[-0.04em] text-ink">{"2–4"}<span className="ml-1.5 text-[0.5em] tracking-[-0.02em] text-ink-soft">weeks</span></dd><dt className="mt-2 text-[14px] text-muted">Idea to proven MVP</dt></div>
                                            <div className="border-t border-ink/10 pt-5">
                                                <dd className="whitespace-nowrap text-[clamp(1.8rem,2.8vw,2.6rem)] leading-none tracking-[-0.04em] text-ink">2<span className="ml-1.5 text-[0.5em] tracking-[-0.02em] text-ink-soft">locations</span></dd><dt className="mt-2 text-[14px] text-muted">{"Islamabad, PK & Birmingham, UK"}</dt></div>
                                        </dl>
                                </div>
                        </div>
                        </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="Case study" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Case study</p>
                                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Watch it work.</h2>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}><a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/case-studies">Browse every case study</a></div>
                                    </div>
                                    <div data-reveal="" className="mt-10 lg:mt-14" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                        <a className="group grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:gap-14" href="https://oradentdentalclinic.com" target="_blank" rel="noopener noreferrer">
                                            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] sm:rounded-[32px]" style={{background: "linear-gradient(135deg, #0064ff 0%, #2f8cff 50%, #5cc2ff 100%)"}}><img alt="Oradent Dental Clinic website homepage" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/case-studies/oradent.jpg" /></div>
                                            <div>
                                                <p className="text-[13px] text-muted">Healthcare</p>
                                                <p className="mt-2 text-[clamp(1.8rem,3vw,2.8rem)] leading-none tracking-[-0.045em] text-ink">Oradent Dental Clinic</p>
                                                <p className="mt-4 text-[18px] text-ink">Dental clinic website</p>
                                                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">A dental clinic website with its services, two locations and online appointment booking.</p><span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink transition-colors group-hover:text-brand">Visit site<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></div>
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="What clients say" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Client feedback</p>
                                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Straight from them.</h2>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}><a href="https://uk.trustpilot.com/review/techclues.co.uk" target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-2.5 text-[15px] text-ink"><span className="flex gap-0.5" role="img" aria-label="4.3 out of 5 stars"><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "29.999999999999982%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span></span><span><strong className="font-semibold">4.3</strong> on <span className="inline-flex items-center gap-1 font-semibold tracking-[-0.01em] text-ink align-middle"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.15em] shrink-0"><path d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z" fill="#00B67A"></path></svg>Trustpilot</span></span></a></div>
                                    </div>
                                    <div className="mt-10 grid gap-4 lg:mt-14 lg:grid-cols-3">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <figure className="flex h-full flex-col justify-between gap-8 rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                                                <blockquote className="text-[17px] leading-relaxed text-ink">{"“"}
                                                    Great communication and clear project updates from beginning to end. We always knew what stage the app was in.
                                                    {"”"}</blockquote>
                                                <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]"><span className="font-medium text-ink">Abernathy</span><span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars"><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true">
                                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                                        </svg>
                                                        </span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                        <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                            <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                                <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                                    </span><span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#00875a]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check lucide-verified size-3.5" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m16 9-5.5 5.5L8 12"></path></svg> Verified</span></figcaption>
                                            </figure>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.07s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <figure className="flex h-full flex-col justify-between gap-8 rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                                                <blockquote className="text-[17px] leading-relaxed text-ink">{"“"}
                                                    We appreciated their focus on building only the most important features. It saved time and kept the project streamlined.
                                                    {"”"}</blockquote>
                                                <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]"><span className="font-medium text-ink">Micheal Chong</span><span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars"><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true">
                                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                                        </svg>
                                                        </span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                        <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                            <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                                <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                                    </span><span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#00875a]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check lucide-verified size-3.5" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m16 9-5.5 5.5L8 12"></path></svg> Verified</span></figcaption>
                                            </figure>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.14s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <figure className="flex h-full flex-col justify-between gap-8 rounded-[24px] border border-ink/[0.08] bg-white p-7 sm:p-8">
                                                <blockquote className="text-[17px] leading-relaxed text-ink">{"“"}
                                                    The development team did an excellent job building our first mobile prototype. The UI was simple but functional, which is exactly what we needed.
                                                    {"”"}</blockquote>
                                                <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[14px]"><span className="font-medium text-ink">Alan beith</span><span className="flex gap-0.5" role="img" aria-label="5 out of 5 stars"><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true">
                                                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                                                        </svg>
                                                        </span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                        <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                            <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                                <span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span>
                                                                    </span><span className="inline-flex items-center gap-1 text-[12px] font-medium text-[#00875a]"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check lucide-verified size-3.5" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m16 9-5.5 5.5L8 12"></path></svg> Verified</span></figcaption>
                                            </figure>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="How it works" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>The process</p>
                                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">Four simple steps.</h2>
                                        </div>
                                    </div>
                                    <ol className="relative mt-10 grid gap-8 lg:mt-14 lg:grid-cols-4 lg:gap-6"><span className="absolute left-0 right-0 top-[22px] hidden h-px bg-ink/10 lg:block" aria-hidden="true"></span>
                                        <li>
                                            <div data-reveal="" className="relative" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><span className="relative grid size-11 place-items-center rounded-full bg-ink text-[14px] font-medium text-white">1</span>
                                                <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.1em] text-brand">Compass</p>
                                                <h3 className="mt-2 text-[clamp(1.4rem,2vw,1.8rem)] font-normal tracking-[-0.03em] text-ink">Audit</h3>
                                                <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-ink-soft">A review of which tasks merit automating, plus the data behind them.</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div data-reveal="" className="relative" style={{"--reveal-delay": "0.08s", "--reveal-y": "28px"} as React.CSSProperties}><span className="relative grid size-11 place-items-center rounded-full bg-ink text-[14px] font-medium text-white">2</span>
                                                <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.1em] text-brand">Pillar</p>
                                                <h3 className="mt-2 text-[clamp(1.4rem,2vw,1.8rem)] font-normal tracking-[-0.03em] text-ink">Prototype</h3>
                                                <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-ink-soft">Prove the approach fast, using real examples.</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div data-reveal="" className="relative" style={{"--reveal-delay": "0.16s", "--reveal-y": "28px"} as React.CSSProperties}><span className="relative grid size-11 place-items-center rounded-full bg-ink text-[14px] font-medium text-white">3</span>
                                                <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.1em] text-brand">Forge · Bridge</p>
                                                <h3 className="mt-2 text-[clamp(1.4rem,2vw,1.8rem)] font-normal tracking-[-0.03em] text-ink">Integrate</h3>
                                                <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-ink-soft">Embed it in your product, with safeguards.</p>
                                            </div>
                                        </li>
                                        <li>
                                            <div data-reveal="" className="relative" style={{"--reveal-delay": "0.24s", "--reveal-y": "28px"} as React.CSSProperties}><span className="relative grid size-11 place-items-center rounded-full bg-ink text-[14px] font-medium text-white">4</span>
                                                <p className="mt-6 text-[12px] font-medium uppercase tracking-[0.1em] text-brand">Sentinel · Everest</p>
                                                <h3 className="mt-2 text-[clamp(1.4rem,2vw,1.8rem)] font-normal tracking-[-0.03em] text-ink">{"Assess & launch"}</h3>
                                                <p className="mt-2 max-w-[300px] text-[15px] leading-relaxed text-ink-soft">Rate quality, track costs, then release.</p>
                                            </div>
                                        </li>
                                    </ol>
                                    <div data-reveal="" className="mt-10" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}><a className="group inline-flex items-center gap-1.5 text-[15px] font-medium text-ink hover:text-brand" href="/how-we-work">Explore our complete eight-phase process<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></a></div>
                                </div>
                            </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="Why TechClues" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Why choose TechClues</p>
                                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">What draws founders to us.</h2>
                                        </div>
                                    </div>
                                    <div className="mt-10 grid gap-4 md:grid-cols-3 lg:mt-14">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <div className="group h-full rounded-[24px] bg-[#f1f0f6] p-7 transition-colors duration-500 hover:bg-white sm:p-8"><span className="grid size-12 place-items-center rounded-xl bg-white text-ink transition-colors duration-500 group-hover:bg-brand group-hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flask-conical size-5" aria-hidden="true"><path d="M14 2v6a2 2 0 0 0 .245.96l5.51 10.08A2 2 0 0 1 18 22H6a2 2 0 0 1-1.755-2.96l5.51-10.08A2 2 0 0 0 10 8V2"></path><path d="M6.453 15h11.094"></path><path d="M8.5 2h7"></path></svg></span>
                                                <h3 className="mt-8 text-[clamp(1.3rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">Validate first</h3>
                                                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">We check demand up front, so real users stand behind each feature.</p>
                                            </div>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.07s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <div className="group h-full rounded-[24px] bg-[#f1f0f6] p-7 transition-colors duration-500 hover:bg-white sm:p-8"><span className="grid size-12 place-items-center rounded-xl bg-white text-ink transition-colors duration-500 group-hover:bg-brand group-hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scale size-5" aria-hidden="true"><path d="M12 3v18"></path><path d="m19 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M3 7h1a17 17 0 0 0 8-2 17 17 0 0 0 8 2h1"></path><path d="m5 8 3 8a5 5 0 0 1-6 0zV7"></path><path d="M7 21h10"></path></svg></span>
                                                <h3 className="mt-8 text-[clamp(1.3rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">Defined scope, honest price</h3>
                                                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">Open pricing with frequent updates. No surprises.</p>
                                            </div>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.14s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <div className="group h-full rounded-[24px] bg-[#f1f0f6] p-7 transition-colors duration-500 hover:bg-white sm:p-8"><span className="grid size-12 place-items-center rounded-xl bg-white text-ink transition-colors duration-500 group-hover:bg-brand group-hover:text-white"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layers lucide-layers-3 size-5" aria-hidden="true"><path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path></svg></span>
                                                <h3 className="mt-8 text-[clamp(1.3rem,1.8vw,1.6rem)] tracking-[-0.025em] text-ink">Made to grow</h3>
                                                    <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">Tried-and-tested tech such as React, Next.js and AWS, built for growth.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="Questions" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px] grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
                                    <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                        <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>FAQ</p>
                                        <h2 className="mt-4 text-[clamp(1.9rem,3.2vw,3rem)] font-normal leading-[1.06] tracking-[-0.04em] text-ink">Frequently asked questions.</h2>
                                    </div>
                                    <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}>
                                        <Accordion items={serviceFaqs["ai-enablement"]} />
                                </div>
                        </div>
                        </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="Related insights" className="py-[clamp(56px,7vw,110px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <p className="flex items-center gap-2 text-[14px] font-medium text-muted"><span className="size-1.5 rounded-full bg-brand"></span>Insights</p>
                                            <h2 className="mt-4 max-w-[900px] text-[clamp(2.1rem,4.2vw,4.25rem)] font-normal leading-[1.04] tracking-[-0.04em] text-ink">More to read.</h2>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0.1s", "--reveal-y": "28px"} as React.CSSProperties}><a className="text-[15px] font-medium text-ink underline decoration-ink/30 underline-offset-4 hover:decoration-brand" href="/blog">View all</a></div>
                                    </div>
                                    <div className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:mt-14 lg:grid-cols-3">
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <a className="group grid gap-6" href="/blog/ai-integration-uk-smes">
                                                <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[16/11]"><img alt="A developer working on code at a laptop" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/services/ai.jpg" /></div>
                                                <div>
                                                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted"><span className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">AI</span><span>3 July 2026</span><span>· 5 min read</span></p>
                                                    <h2 className="mt-4 font-normal leading-[1.1] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-brand text-[clamp(1.4rem,2.2vw,1.9rem)]">UK SMEs and AI integration: a practical guide</h2>
                                                    <p className="mt-3 leading-relaxed text-ink-soft text-[15px]">Where small and medium businesses see AI pay off first, how it fits into your existing systems, and what UK GDPR means for it.</p><span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">Read the piece<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></div>
                                            </a>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <a className="group grid gap-6" href="/blog/ai-funding-uk-scotland">
                                                <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[16/11]"><img alt="Victorian and modern buildings side by side in Glasgow" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/blog/ai-funding.jpg" /></div>
                                                <div>
                                                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted"><span className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">Funding</span><span>25 September 2026</span><span>· 7 min read</span></p>
                                                    <h2 className="mt-4 font-normal leading-[1.1] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-brand text-[clamp(1.4rem,2.2vw,1.9rem)]">Scotland and the UK: how to fund AI projects</h2>
                                                    <p className="mt-3 leading-relaxed text-ink-soft text-[15px]">Which routes are really open to UK and Scottish firms wanting to adopt AI, covering Scotland's AI adoption programme, what has been paused, and how to shape a project that doesn't rely on a grant.</p><span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">Read the piece<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></div>
                                            </a>
                                        </div>
                                        <div data-reveal="" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                            <a className="group grid gap-6" href="/blog/mvp-cost-uk">
                                                <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[16/11]"><img alt="A team planning a product together at a whiteboard" className="object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" style={{position: "absolute", height: "100%", width: "100%", left: 0, top: 0, right: 0, bottom: 0, color: "transparent"}} src="/images/services/mvp.jpg" /></div>
                                                <div>
                                                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted"><span className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">Costs</span><span>26 August 2026</span><span>· 6 min read</span></p>
                                                    <h2 className="mt-4 font-normal leading-[1.1] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-brand text-[clamp(1.4rem,2.2vw,1.9rem)]">What should an MVP cost you in the UK?</h2>
                                                    <p className="mt-3 leading-relaxed text-ink-soft text-[15px]">What goes into an MVP budget, the four decisions that shift the price most, and the expenses founders overlook. Backed by real figures from our own pricing.</p><span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">Read the piece<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true"><path d="M7 7h10v10"></path><path d="M7 17 17 7"></path></svg></span></div>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="cv-auto">
                            <section aria-label="Start your project" className="pb-[clamp(72px,10vw,160px)] pt-[clamp(32px,4vw,64px)]">
                                <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
                                    <div data-reveal="" className="text-center" style={{"--reveal-delay": "0s", "--reveal-y": "28px"} as React.CSSProperties}>
                                        <h2 className="mx-auto max-w-[900px] text-[clamp(2.4rem,5.4vw,5.5rem)] font-normal leading-[1.03] tracking-[-0.05em] text-ink">Want to take the first step?</h2>
                                        <p className="mx-auto mt-5 max-w-[480px] text-[18px] leading-relaxed text-ink-soft">Grab a free 30-minute slot and we'll plot out your journey with you.</p>
                                        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><a href="/book-a-call" data-cta="page-book-call" className="group inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink pl-7 pr-6 text-[15px] font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-[0_14px_40px_-10px_rgba(0,100,255,0.7)] sm:w-auto">Arrange your free strategy call<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg></a>
                                            <a data-cta="page-estimate" className="inline-flex h-14 w-full items-center justify-center rounded-full border border-ink/15 px-7 text-[15px] font-medium text-ink transition-colors duration-300 hover:border-ink hover:bg-ink hover:text-white sm:w-auto" href="/mvp-cost-calculator">Receive a quick estimate</a>
                                        </div>
                                        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[14px] text-muted">
                                            <li className="inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-clock size-4 text-brand" aria-hidden="true"><path d="M16 14v2.2l1.6 1"></path><path d="M16 2v3"></path><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338"></path><path d="M3 9h5.859"></path><path d="M8 2v3"></path><circle cx="16" cy="16" r="6"></circle></svg>30 minutes, no strings attached</li>
                                            <li className="inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check size-4 text-brand" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path><path d="m9 12 2 2 4-4"></path></svg>Price and scope settled in advance</li>
                                            <li className="inline-flex items-center gap-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-check lucide-verified size-4 text-brand" aria-hidden="true"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m16 9-5.5 5.5L8 12"></path></svg>Everything we make belongs to you</li>
                                            <li><a href="https://uk.trustpilot.com/review/techclues.co.uk" target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-2 transition-colors hover:text-ink"><span className="flex gap-0.5" role="img" aria-label="4.3 out of 5 stars"><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "100%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span><span className="relative grid place-items-center overflow-hidden bg-[#dcdce6] size-4"><span className="absolute inset-y-0 left-0 bg-[#00b67a]" style={{width: "29.999999999999982%"}}></span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star relative fill-white text-white size-2.5" aria-hidden="true"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path></svg></span></span><span><strong className="font-semibold text-ink">4.3</strong> on <span className="inline-flex items-center gap-1 font-semibold tracking-[-0.01em] text-ink align-middle"><svg viewBox="0 0 24 24" aria-hidden="true" className="size-[1.15em] shrink-0"><path d="M17.227 16.67l2.19 6.742-7.413-5.388 5.223-1.354zM24 9.31h-9.165L12.005.589l-2.84 8.723L0 9.3l7.422 5.397-2.84 8.714 7.422-5.388 4.583-3.326L24 9.311z" fill="#00B67A"></path></svg>Trustpilot</span></span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </section>
                        </div>
    </main>
    </>
  );
}
