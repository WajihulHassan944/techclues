import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, path: string) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto(path);
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

test.describe("blog page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page, "/blog");
    await expect(page).toHaveTitle("MVP & Startup Insights | Vebryx Blog");
    await expect(page.locator("h1")).toContainText("Notes for founders");
    await expect(page.locator("h1")).toContainText("who build.");
    await expect(page.getByText("Practical guides on validating ideas, product strategy and building MVPs that work.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("shows the three articles with their details and links", async ({ page }) => {
    await open(page, "/blog");
    const list = page.locator('section[aria-label="Articles"]');
    await expect(list.locator('a[href^="/blog/"]')).toHaveCount(3);
    const first = list.locator('a[href="/blog/mvp-software-development-age-of-ai"]');
    await expect(first.getByRole("heading", { name: "MVP Software Development in the Age of AI" })).toBeVisible();
    for (const t of ["AI", "6 October 2026", "16 min read", "Read article"]) await expect(first).toContainText(t);
    const second = list.locator('a[href="/blog/ai-funding-uk-scotland"]');
    await expect(second.getByRole("heading", { name: "Funding for AI projects in the UK and Scotland" })).toBeVisible();
    for (const t of ["Funding", "25 September 2026", "7 min read"]) await expect(second).toContainText(t);
    const third = list.locator('a[href="/blog/mvp-cost-uk"]');
    await expect(third.getByRole("heading", { name: "How much does an MVP cost in the UK?" })).toBeVisible();
    for (const t of ["Costs", "26 August 2026", "6 min read"]) await expect(third).toContainText(t);
    await expect(list.locator("img")).toHaveCount(3);
  });

  test("newsletter form stays on the page when submitted", async ({ page }) => {
    await open(page, "/blog");
    const news = page.locator('section[aria-label="Newsletter"]');
    await news.scrollIntoViewIfNeeded();
    await expect(news).toContainText("New guides, straight to your inbox.");
    await news.getByLabel("Your email").fill("sam@example.com");
    await news.getByRole("button", { name: "Subscribe" }).click();
    await expect(page).toHaveURL(/\/blog$/);
    await expect(news.getByLabel("Your email")).toHaveValue("sam@example.com");
  });

  test("an article card opens without reloading the site", async ({ page }) => {
    await open(page, "/blog");
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 6));
    await page.locator('a[href="/blog/ai-funding-uk-scotland"]').click();
    await expect(page).toHaveURL(/\/blog\/ai-funding-uk-scotland$/);
    await expect(page.locator("h1")).toContainText("Funding for AI projects in the UK and Scotland");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(6);
  });

  test("scroll reveal shows every visible section", async ({ page }) => {
    await open(page, "/blog");
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 400) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(500);
    const stuck = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]:not([data-shown])")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .map((el) => el.className || el.outerHTML.slice(0, 80)),
    );
    expect(stuck).toEqual([]);
  });
});

type Post = { slug: string; title: string; h1: string; category: string; date: string; read: string; toc: number; firstHeading: string; secondHeading: string; other: [string, string] };
const POSTS: Post[] = [
  {
    slug: "mvp-software-development-age-of-ai",
    title: "MVP Software Development in the Age of AI | Vebryx",
    h1: "MVP Software Development in the Age of AI",
    category: "AI",
    date: "6 October 2026",
    read: "16 min read",
    toc: 13,
    firstHeading: "What Is MVP Software Development?",
    secondHeading: "How AI Has Changed MVP Development",
    other: ["Funding for AI projects in the UK and Scotland", "/blog/ai-funding-uk-scotland"],
  },
  {
    slug: "ai-funding-uk-scotland",
    title: "AI Funding for UK & Scottish Businesses (2026) | Vebryx",
    h1: "Funding for AI projects in the UK and Scotland",
    category: "Funding",
    date: "25 September 2026",
    read: "7 min read",
    toc: 8,
    firstHeading: "The short answer",
    secondHeading: "R&D tax relief",
    other: ["MVP Software Development in the Age of AI", "/blog/mvp-software-development-age-of-ai"],
  },
  {
    slug: "mvp-cost-uk",
    title: "MVP Cost in UK and How Much Startups Should Budget | Vebryx",
    h1: "How much does an MVP cost in the UK?",
    category: "Costs",
    date: "26 August 2026",
    read: "6 min read",
    toc: 9,
    firstHeading: "The short answer",
    secondHeading: "What an MVP budget actually pays for",
    other: ["MVP Software Development in the Age of AI", "/blog/mvp-software-development-age-of-ai"],
  },
];

for (const p of POSTS) {
  test.describe(`blog post: ${p.slug}`, () => {
    const url = `/blog/${p.slug}`;
    const toc = (page: Page) => page.getByRole("navigation", { name: "On this page" });

    test("renders with metadata, header details and no errors", async ({ page }) => {
      const errors = await open(page, url);
      await expect(page).toHaveTitle(p.title);
      await expect(page.locator("h1")).toHaveText(p.h1);
      const head = page.locator("main").first();
      for (const t of [p.category, p.date, p.read, "Vebryx team"]) await expect(head).toContainText(t);
      await expect(page.getByRole("link", { name: "Blog", exact: true }).first()).toHaveAttribute("href", "/blog");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });

    test("contents list has a link for every section heading", async ({ page }) => {
      await open(page, url);
      await expect(toc(page).getByRole("link")).toHaveCount(p.toc);
      await expect(toc(page).getByRole("link").first()).toHaveText(p.firstHeading);
      for (const l of await toc(page).getByRole("link").all()) {
        const id = decodeURIComponent((await l.getAttribute("href"))!.slice(1));
        await expect(page.locator(`main [id="${id}"]`)).toHaveCount(1);
      }
    });

    test("contents highlights the section being read and its line fills with scroll", async ({ page }) => {
      await open(page, url);
      const links = toc(page).getByRole("link");
      const bar = toc(page).locator("span.bg-brand");
      const scale = async () => Number((await bar.evaluate((e) => (e as HTMLElement).style.transform)).replace(/[^0-9.]/g, ""));
      await expect(links.first()).toHaveClass(/font-medium/);
      await expect(links.nth(1)).toHaveClass(/text-muted/);
      expect(await scale()).toBeLessThan(0.05);
      // read the second section
      await page.evaluate((txt) => {
        const h = [...document.querySelectorAll("main h2")].find((e) => e.textContent?.trim() === txt)!;
        window.scrollTo(0, h.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.2);
      }, p.secondHeading);
      await expect(links.nth(1)).toHaveClass(/font-medium/, { timeout: 5000 });
      await expect(links.first()).toHaveClass(/text-muted/);
      expect(await scale()).toBeGreaterThan(0.03);
      // bottom of the page fills the line
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await expect.poll(scale, { timeout: 5000 }).toBeGreaterThan(0.97);
    });

    test("a contents link jumps toward its heading, as on the original", async ({ page }) => {
      await open(page, url);
      const link = toc(page).getByRole("link").nth(1);
      const href = await link.getAttribute("href");
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${url}${href}$`));
      // The original's smooth scroll lands partway when later sections are not rendered yet, so only check it moved down.
      await expect.poll(() => page.evaluate(() => window.scrollY), { timeout: 6000 }).toBeGreaterThan(800);
    });

    test("keep reading shows only the other article we have", async ({ page }) => {
      await open(page, url);
      const more = page.locator('section[aria-label="More articles"]');
      await more.scrollIntoViewIfNeeded();
      await expect(more.locator('a[href^="/blog/"]')).toHaveCount(1);
      await expect(more.getByRole("heading", { name: p.other[0] })).toBeVisible();
      await expect(more.locator(`a[href="${p.other[1]}"]`)).toHaveCount(1);
    });

    test("links only go to pages that exist", async ({ page }) => {
      await open(page, url);
      const hrefs = await page.locator("main a[href^='/']").evaluateAll((els) => [...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!.split("#")[0].split("?")[0]))]);
      for (const h of hrefs) expect(["/blog", "/blog/ai-funding-uk-scotland", "/blog/mvp-cost-uk", "/blog/mvp-software-development-age-of-ai", "/kill-my-idea", "/grant-funding", "/book-a-call", "/mvp-cost-calculator", "/contact", "/services", "/case-studies", "/zero-one", ""].concat(["/services/mvp-development", "/services/prototype-to-production", "/services/low-code-no-code", "/services/web-mobile-apps", "/services/performance-marketing", "/services/ui-ux-design", "/services/brand-strategy", "/services/ecommerce-marketplace-development"])).toContain(h);
    });

    test("images load and scroll reveal settles", async ({ page }) => {
      await open(page, url);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 600) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(70);
      }
      await page.waitForTimeout(500);
      const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
      expect(broken).toEqual([]);
      const stuck = await page.evaluate(() => [...document.querySelectorAll("[data-reveal]:not([data-shown])")].filter((el) => el.getBoundingClientRect().width > 0).map((el) => el.className));
      expect(stuck).toEqual([]);
    });
  });
}

test.describe("blog on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  for (const path of ["/blog", "/blog/mvp-software-development-age-of-ai", "/blog/ai-funding-uk-scotland", "/blog/mvp-cost-uk"]) {
    test(`${path} fits the screen`, async ({ page }) => {
      await open(page, path);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 900) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(50);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
});
