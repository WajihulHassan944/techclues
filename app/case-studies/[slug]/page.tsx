import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleEffects from "@/components/ArticleEffects";
import { getPublicCaseStudy, listPublicCaseStudies } from "@/lib/api/case-studies";
import { renderArticle } from "@/lib/blog-render";
import { industryLabel, serviceLabel } from "@/lib/case-study-meta";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cs = await getPublicCaseStudy(slug);
  if (!cs) return {};
  return {
    title: cs.seoTitle || `${cs.title} | TechClues`,
    description: cs.seoDescription || cs.excerpt,
    alternates: { canonical: `https://techclues.co.uk/case-studies/${cs.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = await getPublicCaseStudy(slug);
  if (!cs) notFound();

  const { html, toc } = renderArticle(cs.body);
  const allStudies = await listPublicCaseStudies();
  const related = allStudies.filter((s) => s.slug !== cs.slug).slice(0, 2);

  return (
    <main>
      <ArticleEffects />
      <article>
        <header className="pb-8 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
          <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-muted">
              <a className="transition-colors hover:text-ink" href="/case-studies">
                Case studies
              </a>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right size-3.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              <span className="text-ink">{industryLabel(cs.industry)}</span>
            </nav>
            <h1 className="mt-6 max-w-[1050px] text-[clamp(2.2rem,4.6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-ink">{cs.title}</h1>
            <p className="mt-5 max-w-[720px] text-[19px] leading-relaxed text-ink-soft">{cs.excerpt}</p>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-6 text-[14px] text-muted">
              <span className="text-ink">{cs.client}</span>
              {cs.services.map((s) => (
                <span key={s} className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">
                  {serviceLabel(s)}
                </span>
              ))}
            </p>
          </div>
          <div className="mx-auto mt-10 w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <div className="relative aspect-[21/9] overflow-hidden rounded-[24px] sm:rounded-[36px]">
              <img alt={cs.coverAlt || cs.title} className="absolute inset-0 size-full object-cover" src={cs.cover} />
            </div>
          </div>
        </header>

        {cs.results.length > 0 && (
          <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <dl className="grid gap-6 border-y border-ink/10 py-8 sm:grid-cols-3">
              {cs.results.map((r, i) => (
                <div key={i}>
                  <dd className="text-[clamp(1.8rem,3vw,2.6rem)] leading-none tracking-[-0.04em] text-ink">{r.value}</dd>
                  <dt className="mt-2 text-[14px] text-ink-soft">{r.label}</dt>
                </div>
              ))}
            </dl>
          </div>
        )}

        <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-12 px-5 py-[clamp(40px,5vw,80px)] sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20 lg:px-[60px]">
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <nav aria-label="On this page">
                  <p className="text-[13px] font-medium text-muted">On this page</p>
                  <div className="relative mt-4 pl-4">
                    <span className="absolute inset-y-0 left-0 w-px bg-ink/10"></span>
                    <ul className="space-y-2.5">
                      {toc.map((h) => (
                        <li key={h.id}>
                          <a href={`#${h.id}`} className={`block text-[14px] leading-snug transition-colors duration-300 text-muted hover:text-ink${h.level === 3 ? " pl-3" : ""}`}>
                            {h.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </nav>
              </div>
            </aside>
          )}
          <div className="min-w-0 max-w-[740px]">
            <div className="text-[18px] leading-[1.75] text-ink-soft [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:scroll-mt-28 [&_h2]:text-[clamp(1.6rem,2.4vw,2.1rem)] [&_h2]:font-normal [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.03em] [&_h2]:text-ink [&_h2:first-child]:mt-0 [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:scroll-mt-28 [&_h3]:text-[clamp(1.2rem,1.6vw,1.4rem)] [&_h3]:font-medium [&_h3]:tracking-[-0.02em] [&_h3]:text-ink [&_p]:mb-6 [&_ul]:my-6 [&_ul]:space-y-3 [&_li]:relative [&_li]:pl-6 [&_a]:text-ink [&_a]:underline [&_a]:decoration-brand/40 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:decoration-brand [&_strong]:font-medium [&_strong]:text-ink" dangerouslySetInnerHTML={{ __html: html }} />

            {cs.images.length > 0 && (
              <div className="mt-10 grid gap-5 sm:grid-cols-2">
                {cs.images.map((src, i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-[20px]">
                    <img alt={`${cs.title} screenshot ${i + 1}`} className="absolute inset-0 size-full object-cover" src={src} />
                  </div>
                ))}
              </div>
            )}

            {cs.testimonial.quote && (
              <figure className="mt-12 rounded-[24px] bg-paper p-8 sm:p-10">
                <blockquote className="text-[clamp(1.2rem,1.9vw,1.6rem)] leading-[1.35] tracking-[-0.02em] text-ink">“{cs.testimonial.quote}”</blockquote>
                {(cs.testimonial.author || cs.testimonial.role) && (
                  <figcaption className="mt-5 text-[14px] text-muted">
                    {cs.testimonial.author}
                    {cs.testimonial.author && cs.testimonial.role ? ", " : ""}
                    {cs.testimonial.role}
                  </figcaption>
                )}
              </figure>
            )}

            <div className="mt-14 rounded-[24px] bg-ink p-8 text-white sm:p-10">
              <p className="text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.2] tracking-[-0.03em]">Have a project like this one?</p>
              <p className="mt-2 text-[16px] text-white/65">Book a free 30-minute call and we&apos;ll help you work out what to validate first.</p>
              <a href="/book-a-call" className="group mt-6 inline-flex h-12 items-center gap-2 rounded-full bg-white pl-6 pr-5 text-[15px] font-medium text-ink transition-colors duration-300 hover:bg-brand hover:text-white">
                Book a free call
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </article>
      {related.length > 0 && (
        <section aria-label="More case studies" className="py-[clamp(56px,7vw,110px)]">
          <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <p className="border-t border-ink/10 pt-10 text-[14px] font-medium text-muted">Keep reading</p>
            <div className="mt-8 grid gap-x-6 gap-y-14 md:grid-cols-2">
              {related.map((s) => (
                <a key={s._id} className="group grid gap-6" href={`/case-studies/${s.slug}`}>
                  <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[16/11]">
                    <img alt={s.coverAlt || s.title} className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" src={s.cover} />
                  </div>
                  <div>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                      <span className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">{industryLabel(s.industry)}</span>
                    </p>
                    <h2 className="mt-4 font-normal leading-[1.1] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-brand text-[clamp(1.4rem,2.2vw,1.9rem)]">{s.title}</h2>
                    <p className="mt-3 leading-relaxed text-ink-soft text-[15px]">{s.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
                      Read the case study
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
                        <path d="M7 7h10v10"></path>
                        <path d="M7 17 17 7"></path>
                      </svg>
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
