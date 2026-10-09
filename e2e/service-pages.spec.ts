import { test, expect, type Page } from "@playwright/test";

/** One entry per service detail page; the generic tests below run against each. */
type Svc = {
  slug: string;
  title: string;
  kicker: string; // first line of the h1
  headline: string; // second line of the h1
  serviceCard: string; // heading on /services that links here
  sections: string[];
  painPoints: string[]; // plain list in the opening section
  pricing: string[];
  compareLabel: string;
  compare: string[];
  receive: string[];
  tech: string[];
  faqFirst: string;
  faqOther: string;
  faqOtherAnswer: string;
  faqCount: number;
  minImages: number;
};

const COMMON_SECTIONS = [
  "Why it matters", "What's included", "Pricing", "Know before you start", "__COMPARE__", "What you receive", "Technologies",
  "Talk to us", "Benefits", "Industry experience", "Your product partner", "Case study", "What clients say", "How it works",
  "Why Vebryx", "Questions", "Related insights", "Start your project",
];
const sections = (compare: string) => COMMON_SECTIONS.map((s) => (s === "__COMPARE__" ? compare : s));

const PAGES: Svc[] = [
  {
    slug: "mvp-development",
    title: "MVP Development Services for UK Startups | Vebryx",
    kicker: "MVP development for UK startups",
    headline: "Turn your idea into a product people actually want.",
    serviceCard: "MVPs & Custom Platforms",
    sections: sections("Prototype, MVP or full product?"),
    painPoints: [
      "You've got an idea, but you're not sure people will pay for it.",
      "Quotes from agencies are huge, vague and months long.",
      "You've been burned by a build that went over time and budget.",
    ],
    pricing: ["Validation MVP", "£2,500", "Lean MVP", "£5,000", "Custom / SaaS", "£10,000", "£499"],
    compareLabel: "Prototype, MVP or full product?",
    compare: ["Can people use it?", "Do people want it?", "Can it grow?", "Test sessions", "Early adopters", "Around 8 weeks and beyond"],
    receive: ["Validation findings", "Prioritised feature roadmap", "Source code and documentation", "Post-launch iteration plan"],
    tech: ["Figma", "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "AWS", "Stripe"],
    faqFirst: "How much does an MVP cost?",
    faqOther: "What if the idea doesn't validate?",
    faqOtherAnswer: "you've saved months",
    faqCount: 6,
    minImages: 5,
  },
  {
    slug: "prototype-to-production",
    title: "Make Your AI-Built App Production-Ready | Vebryx",
    kicker: "AI-built app to production, for UK founders",
    headline: "Your AI-built app, ready for real users.",
    serviceCard: "Prototype to Production",
    sections: sections("Keep prompting, harden or rebuild?"),
    painPoints: [
      "It works in the demo, but you wouldn't trust it with real customers' data.",
      "Every new prompt fixes one thing and breaks two others.",
      "Logins, payments or the App Store review are where it all stalls.",
    ],
    pricing: ["Code audit", "£750", "Hardening sprint", "£3,500", "2–4 weeks"],
    compareLabel: "Keep prompting, harden or rebuild?",
    compare: ["Keep prompting", "Harden it", "Rebuild", "It's still a demo", "Audited and fixed", "Tailored quote"],
    receive: ["Code and security audit report", "Costed plan for the sprint", "Automated tests for critical flows", "Production hosting, backups and monitoring"],
    tech: ["Lovable", "Bolt.new", "Replit", "Cursor", "Next.js", "Supabase"],
    faqFirst: "How much does it cost?",
    faqOther: "Will you rebuild everything?",
    faqOtherAnswer: "",
    faqCount: 7,
    minImages: 5,
  },
];

async function rejectCookies(page: Page) {
  // The banner only disappears once React has hydrated, so retry the click until it does.
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, slug: string) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto(`/services/${slug}`);
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const fits = (page: Page) => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

for (const svc of PAGES) {
  test.describe(`service page: ${svc.slug}`, () => {
    test("renders with metadata, hero and no errors", async ({ page }) => {
      const errors = await open(page, svc.slug);
      await expect(page).toHaveTitle(svc.title);
      await expect(page.locator("h1")).toContainText(svc.kicker);
      await expect(page.locator("h1")).toContainText(svc.headline);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
      await expect(page.getByRole("link", { name: "Book a free call" }).first()).toHaveAttribute("href", "/book-a-call");
      expect(await fits(page)).toBe(true);
      expect(errors).toEqual([]);
    });

    test("hero entrance animation settles into the visible state", async ({ page }) => {
      await open(page, svc.slug);
      await page.waitForTimeout(1800);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toHaveCSS("opacity", "1");
      for (const el of await page.locator("main .svc-in").all()) await expect(el).toHaveCSS("opacity", "1");
      const top = await page.locator("h1 .svc-rise").evaluate((el) => el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top);
      expect(top).toBeLessThan(2);
    });

    test("has every content section in order", async ({ page }) => {
      await open(page, svc.slug);
      const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
      expect(labels).toEqual(svc.sections);
    });

    test("opening section keeps the pain points as a plain list", async ({ page }) => {
      await open(page, svc.slug);
      const why = page.locator('section[aria-label="Why it matters"]');
      await expect(why).toContainText("Sound familiar?");
      for (const text of svc.painPoints) await expect(why).toContainText(text);
      await expect(why.getByRole("button")).toHaveCount(0);
    });

    test("pricing, comparison, deliverables and tech stack are complete", async ({ page }) => {
      await open(page, svc.slug);
      const pricing = page.locator('section[aria-label="Pricing"]');
      for (const text of svc.pricing) await expect(pricing).toContainText(text);
      const compare = page.locator(`section[aria-label="${svc.compareLabel}"]`);
      for (const text of svc.compare) await expect(compare).toContainText(text);
      const receive = page.locator('section[aria-label="What you receive"]');
      for (const text of svc.receive) await expect(receive).toContainText(text);
      const tech = page.locator('section[aria-label="Technologies"]');
      for (const text of svc.tech) await expect(tech).toContainText(text);
    });

    test("FAQ accordion opens one answer at a time", async ({ page }) => {
      await open(page, svc.slug);
      const faq = page.locator('section[aria-label="Questions"]');
      await faq.scrollIntoViewIfNeeded();
      await expect(faq.getByRole("button")).toHaveCount(svc.faqCount);
      const first = faq.getByRole("button", { name: svc.faqFirst });
      const other = faq.getByRole("button", { name: svc.faqOther });
      await expect(first).toHaveAttribute("aria-expanded", "true");
      await other.click();
      await expect(other).toHaveAttribute("aria-expanded", "true");
      await expect(first).toHaveAttribute("aria-expanded", "false");
      if (svc.faqOtherAnswer) await expect(faq).toContainText(svc.faqOtherAnswer);
    });

    test("hero photo parallax follows the scroll like the reference", async ({ page }) => {
      await open(page, svc.slug);
      const sel = "main div.-inset-y-\\[8\\%\\]";
      const readAt = async (targetTop: number) => {
        await page.evaluate(
          ([s, top]) => {
            const host = document.querySelector(s as string)!.parentElement!;
            window.scrollTo(0, host.getBoundingClientRect().top + window.scrollY - (top as number));
          },
          [sel, targetTop],
        );
        await page.waitForTimeout(500);
        return page.locator(sel).first().evaluate((el) => parseFloat(/translateY\(([-\d.]+)%\)/.exec((el as HTMLElement).style.transform)![1]));
      };
      // The offset is -6% + 12% x progress, where progress = (viewport - top) / (viewport + height).
      const frameH = await page.locator(sel).first().evaluate((el) => el.parentElement!.getBoundingClientRect().height);
      const expected = (top: number) => Math.min(6, Math.max(-6, -6 + (12 * (900 - top)) / (900 + frameH)));
      for (const top of [450, 150, 0, -350]) expect(await readAt(top)).toBeCloseTo(expected(top), 0);
      expect(await readAt(-700)).toBeCloseTo(6, 1);
    });

    test("images load, including lazy ones", async ({ page }) => {
      await open(page, svc.slug);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 700) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(100);
      }
      const imgs = await page.evaluate(() => [...document.images].map((i) => ({ src: i.src, ok: i.complete && i.naturalWidth > 0 })));
      expect(imgs.length).toBeGreaterThanOrEqual(svc.minImages);
      expect(imgs.filter((i) => !i.ok)).toEqual([]);
    });

    test("scroll reveal shows every visible section", async ({ page }) => {
      await open(page, svc.slug);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 500) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(400);
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

    test("is reachable from the services page and shares the site chrome", async ({ page }) => {
      await page.goto("/services");
      await expect(page.locator("#cookie-title")).toBeVisible();
      await rejectCookies(page);
      await page.locator(`#${svc.slug}`).getByRole("link", { name: /Learn more/ }).click();
      await expect(page).toHaveURL(new RegExp(`/services/${svc.slug}$`));
      await expect(page.locator("h1")).toContainText(svc.kicker);
      await page.locator("header nav button", { hasText: "Services" }).hover();
      await expect(page.locator("[data-nav-panel]:not(.hidden)")).toContainText("All services");
      await expect(page.locator("footer")).toBeAttached();
      await expect(page.locator(".chat-launcher")).toBeVisible();
    });
  });

  test.describe(`service page: ${svc.slug} on mobile`, () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

    test("fits the screen", async ({ page }) => {
      await open(page, svc.slug);
      expect(await fits(page)).toBe(true);
      await page.locator(`section[aria-label="${svc.compareLabel}"]`).scrollIntoViewIfNeeded();
      expect(await fits(page)).toBe(true);
    });
  });
}
