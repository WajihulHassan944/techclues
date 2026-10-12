import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleEffects from "@/components/ArticleEffects";
import { getPublicPost, listPublicPosts } from "@/lib/api/blog";
import { formatDate, readMinutes, renderArticle } from "@/lib/blog-render";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) return {};
  return {
    title: post.seoTitle || `${post.title} | TechClues`,
    description: post.seoDescription || post.excerpt,
    alternates: { canonical: `https://techclues.co.uk/blog/${post.slug}` },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublicPost(slug);
  if (!post) notFound();

  const { html, toc } = renderArticle(post.body);
  const allPosts = await listPublicPosts();
  const related = allPosts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const minutes = readMinutes(post.body);
  const updated = post.updatedAt && new Date(post.updatedAt).getTime() - new Date(post.publishedAt).getTime() > 86_400_000 ? post.updatedAt : undefined;

  return (
    <main>
      <ArticleEffects />
      <article>
        <header className="pb-8 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
          <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[14px] text-muted">
              <a className="transition-colors hover:text-ink" href="/blog">
                Blog
              </a>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right size-3.5" aria-hidden="true">
                <path d="m9 18 6-6-6-6"></path>
              </svg>
              <span className="text-ink">{post.category}</span>
            </nav>
            <h1 className="mt-6 max-w-[1050px] text-[clamp(2.2rem,4.6vw,4.5rem)] font-normal leading-[1.05] tracking-[-0.045em] text-ink">{post.title}</h1>
            <p className="mt-5 max-w-[720px] text-[19px] leading-relaxed text-ink-soft">{post.excerpt}</p>
            <p className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-ink/10 pt-6 text-[14px] text-muted">
              <span className="text-ink">{post.author?.name ?? "TechClues team"}</span>
              <span>{formatDate(post.publishedAt)}</span>
              {updated && <span>Updated {formatDate(updated)}</span>}
              <span>{minutes} min read</span>
            </p>
          </div>
          <div className="mx-auto mt-10 w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <div className="relative aspect-[21/9] overflow-hidden rounded-[24px] sm:rounded-[36px]">
              <img alt={post.coverAlt || post.title} className="absolute inset-0 size-full object-cover" src={post.cover} />
            </div>
          </div>
        </header>
        <div className="mx-auto grid w-full max-w-[1680px] grid-cols-1 gap-12 px-5 py-[clamp(40px,5vw,80px)] sm:px-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-20 lg:px-[60px]">
          {toc.length > 0 && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <nav aria-label="On this page">
                  <p className="text-[13px] font-medium text-muted">On this page</p>
                  <div className="relative mt-4 pl-4">
                    <span className="absolute inset-y-0 left-0 w-px bg-ink/10"></span>
                    <span className="absolute left-0 top-0 w-px origin-top bg-brand" style={{ height: "100%", transform: "scaleY(0)" }}></span>
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
            <div className="text-[18px] leading-[1.75] text-ink-soft [&_h2]:mb-4 [&_h2]:mt-14 [&_h2]:scroll-mt-28 [&_h2]:text-[clamp(1.6rem,2.4vw,2.1rem)] [&_h2]:font-normal [&_h2]:leading-[1.15] [&_h2]:tracking-[-0.03em] [&_h2]:text-ink [&_h2:first-child]:mt-0 [&_h3]:mb-3 [&_h3]:mt-10 [&_h3]:scroll-mt-28 [&_h3]:text-[clamp(1.2rem,1.6vw,1.4rem)] [&_h3]:font-medium [&_h3]:tracking-[-0.02em] [&_h3]:text-ink [&_p]:mb-6 [&_ul]:my-6 [&_ul]:space-y-3 [&_li]:relative [&_li]:pl-6 [&_a]:text-ink [&_a]:underline [&_a]:decoration-brand/40 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a:hover]:decoration-brand [&_strong]:font-medium [&_strong]:text-ink [&_table]:w-full [&_table]:min-w-[520px] [&_table]:border-collapse [&_table]:text-left [&_table]:text-[15px]" dangerouslySetInnerHTML={{ __html: html }} />
            <div className="mt-14 rounded-[24px] bg-ink p-8 text-white sm:p-10">
              <p className="text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.2] tracking-[-0.03em]">Have an idea you want to test?</p>
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
        <section aria-label="More articles" className="py-[clamp(56px,7vw,110px)]">
          <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
            <p className="border-t border-ink/10 pt-10 text-[14px] font-medium text-muted">Keep reading</p>
            <div className="mt-8 grid gap-x-6 gap-y-14 md:grid-cols-2">
              {related.map((p) => (
                <a key={p._id} className="group grid gap-6" href={`/blog/${p.slug}`}>
                  <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] aspect-[16/11]">
                    <img alt={p.coverAlt || p.title} className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]" src={p.cover} />
                  </div>
                  <div>
                    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
                      <span className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">{p.category}</span>
                      <span>{formatDate(p.publishedAt)}</span>
                    </p>
                    <h2 className="mt-4 font-normal leading-[1.1] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-brand text-[clamp(1.4rem,2.2vw,1.9rem)]">{p.title}</h2>
                    <p className="mt-3 leading-relaxed text-ink-soft text-[15px]">{p.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
                      Read article
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
