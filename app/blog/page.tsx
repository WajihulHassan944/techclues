import type { Metadata } from "next";
import Link from "next/link";
import { listPublicPosts } from "@/lib/api/blog";
import { formatDate } from "@/lib/blog-render";

export const metadata: Metadata = {
  title: "MVP & Startup Insights | TechClues Blog",
  description:
    "Practical guides for founders on validating ideas, product strategy and building MVPs that work, from a West Midlands product studio.",
  alternates: { canonical: "https://techclues.co.uk/blog" },
};

function Card({ post, big }: { post: Awaited<ReturnType<typeof listPublicPosts>>[number]; big?: boolean }) {
  return (
    <a className={big ? "group grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-14" : "group grid gap-6"} href={`/blog/${post.slug}`}>
      <div className={`relative overflow-hidden rounded-[24px] sm:rounded-[32px] ${big ? "aspect-[16/10]" : "aspect-[16/11]"}`}>
        <img
          alt={post.coverAlt || post.title}
          className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
          src={post.cover}
        />
      </div>
      <div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-muted">
          <span className="rounded-full bg-[#eef3ff] px-3 py-1 font-medium text-brand">{post.category}</span>
          <span>{formatDate(post.publishedAt)}</span>
        </p>
        <h2 className={`mt-4 font-normal leading-[1.1] tracking-[-0.035em] text-ink transition-colors duration-300 group-hover:text-brand ${big ? "text-[clamp(1.9rem,3.4vw,3.2rem)]" : "text-[clamp(1.4rem,2.2vw,1.9rem)]"}`}>
          {post.title}
        </h2>
        <p className={`mt-3 leading-relaxed text-ink-soft ${big ? "text-[17px]" : "text-[15px]"}`}>{post.excerpt}</p>
        <span className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-medium text-ink">
          Read article
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up-right size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true">
            <path d="M7 7h10v10"></path>
            <path d="M7 17 17 7"></path>
          </svg>
        </span>
      </div>
    </a>
  );
}

export default async function Page() {
  const posts = await listPublicPosts();
  const [first, ...rest] = posts;

  return (
    <main>
      <section className="pb-6 pt-[124px] sm:pt-[150px] lg:pt-[170px]">
        <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
          <div className="grid gap-8 lg:grid-cols-[1.8fr_1fr] lg:items-end lg:gap-16">
            <div>
              <p className="flex items-center gap-2 text-[14px] font-medium text-muted">
                <span className="size-1.5 rounded-full bg-brand"></span>Blog
              </p>
              <h1 className="mt-5 text-[clamp(2.6rem,5.6vw,5.75rem)] font-normal leading-[1.02] tracking-[-0.05em] text-ink">
                Notes for founders<span className="block text-ink/35">who build.</span>
              </h1>
            </div>
            <p className="max-w-[420px] text-[18px] leading-relaxed text-ink-soft lg:pb-3">Practical guides on validating ideas, product strategy and building MVPs that work.</p>
          </div>
        </div>
      </section>
      <section aria-label="Articles" className="py-[clamp(40px,5vw,80px)]">
        <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
          <div className="border-t border-ink/10 pt-10 lg:pt-14">
            {posts.length === 0 ? (
              <p className="text-[16px] text-ink-soft">New guides are on the way — check back soon.</p>
            ) : (
              <>
                <Card post={first} big />
                {rest.length > 0 && (
                  <div className="mt-16 grid gap-x-6 gap-y-14 border-t border-ink/10 pt-14 md:grid-cols-2 lg:mt-20">
                    {rest.map((p) => (
                      <Card key={p._id} post={p} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
      <section aria-label="Newsletter" className="py-[clamp(56px,7vw,110px)]">
        <div className="mx-auto w-full max-w-[1680px] px-5 sm:px-8 lg:px-[60px]">
          <div className="relative isolate grid gap-10 overflow-hidden rounded-[28px] bg-ink p-8 text-white sm:rounded-[36px] sm:p-12 lg:grid-cols-2 lg:items-end lg:gap-16 lg:p-16">
            <span className="pointer-events-none absolute -right-28 -top-36 -z-10 size-[420px] rounded-full bg-brand/40 blur-[100px]"></span>
            <div>
              <h2 className="text-[clamp(1.9rem,3.4vw,3.2rem)] font-normal leading-[1.08] tracking-[-0.04em]">New guides, straight to your inbox.</h2>
              <p className="mt-4 max-w-[420px] text-[16px] text-white/65">No spam. Just practical notes on building better products.</p>
            </div>
            <form data-form="newsletter" data-clarity-mask="True" className="group/form relative flex items-center gap-4 border-t border-white/20 pt-6">
              <label htmlFor="newsletter-email" className="sr-only">
                Your email
              </label>
              <input id="newsletter-email" type="email" required placeholder="Your email" className="w-0 min-w-0 flex-1 bg-transparent text-[17px] text-white placeholder:text-white/45 focus:outline-none" />
              <button type="submit" aria-label="Subscribe" className="grid size-14 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-all duration-300 hover:border-white hover:bg-white hover:text-ink">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-right size-5" aria-hidden="true">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </button>
              <span className="absolute left-0 top-0 h-px w-0 bg-brand-soft transition-all duration-500 group-focus-within/form:w-full"></span>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
