import { test, expect, type Page } from "@playwright/test";

/** One entry per sector detail page; the tests below run against each. */
type Sector = {
  slug: string;
  title: string;
  kicker: string;
  headline: string;
  name: string; // as shown on the /industries card
  challenges: string[];
  build: string[];
  standards: string[];
  tech: string[];
  faqFirst: string;
  faqOther: string;
  faqCount: number;
};

const SECTIONS = [
  "Challenges", "What we build", "Built for the sector", "Talk to us", "Technologies", "Case study",
  "Your product partner", "What clients say", "Questions", "Industry experience", "Start your project",
];

const SECTORS: Sector[] = [
  {
    slug: "healthcare-medical",
    title: "Healthcare Software Development in the UK | Vebryx",
    kicker: "Healthcare software development",
    headline: "Digital care that's secure, reliable and easy to use.",
    name: "Healthcare & medical",
    challenges: ["Sensitive data", "Systems that don't talk", "Busy, varied users"],
    build: ["Patient portals", "Telemedicine platforms", "EHR/EMR integration", "Remote patient monitoring"],
    standards: ["Privacy by design", "Standards-aware", "Accessible by default", "Reliable uptime"],
    tech: ["React", "Flutter", "PostgreSQL", "Microsoft Azure"],
    faqFirst: "Do you build to NHS and GDPR standards?",
    faqOther: "Can you integrate with our existing systems?",
    faqCount: 4,
  },
  {
    slug: "retail-ecommerce",
    title: "Ecommerce & Retail Software Development UK | Vebryx",
    kicker: "Ecommerce and retail software development",
    headline: "Commerce experiences that sell, on every screen.",
    name: "Retail & e-commerce",
    challenges: ["Abandoned baskets", "Disconnected channels", "Rising acquisition costs"],
    build: ["Custom storefronts", "Marketplaces", "Checkout & payments", "Inventory & orders"],
    standards: ["Speed sells", "Secure payments", "Measured growth", "Ready for peaks"],
    tech: ["Next.js", "Stripe", "Meta Ads", "Mailchimp"],
    faqFirst: "Do you build on Shopify or custom?",
    faqOther: "Can you build a marketplace?",
    faqCount: 4,
  },
  {
    slug: "pre-seed-seed-startups",
    title: "Product Development for Pre-seed & Seed Startups | Vebryx",
    kicker: "Product development for pre-seed and seed startups",
    headline: "From idea to investor-ready product.",
    name: "Pre-seed & seed startups",
    challenges: ["Limited runway", "Proving demand", "No technical co-founder"],
    build: ["Idea validation", "Lean MVPs", "Clickable prototypes", "Waitlists & launch"],
    standards: ["Clear scope and price", "Speed over polish", "Investor-ready", "A partner, not a vendor"],
    tech: ["Figma", "Supabase", "Vercel", "Stripe"],
    faqFirst: "How much does a startup MVP cost?",
    faqOther: "How fast can we launch?",
    faqCount: 4,
  },
  {
    slug: "saas-startups",
    title: "SaaS Development for UK Startups | Vebryx",
    kicker: "SaaS development for startups",
    headline: "SaaS products built to launch fast and scale well.",
    name: "SaaS startups",
    challenges: ["Rebuilding the basics", "Onboarding drop-off", "Scaling pains"],
    build: ["SaaS MVPs", "Accounts & teams", "Subscriptions & billing", "Dashboards & analytics"],
    standards: ["Multi-tenant by design", "Measure everything", "Performance at scale", "Ship continuously"],
    tech: ["Next.js", "Supabase", "Stripe", "Mixpanel"],
    faqFirst: "Can you build our SaaS from scratch?",
    faqOther: "Do you handle subscriptions?",
    faqCount: 4,
  },
  {
    slug: "logistics-transportation",
    title: "Logistics Software Development in the UK | Vebryx",
    kicker: "Logistics software development",
    headline: "Logistics software that keeps every part of the operation moving.",
    name: "Logistics & transportation",
    challenges: ["Legacy systems", "Last-mile pressure", "Compliance and sustainability"],
    build: ["Fleet management", "Transport management (TMS)", "Warehouse management (WMS)", "Route optimisation"],
    standards: ["Real-time by default", "Works offline", "Integration-first"],
    tech: ["React", "Redis", "PostgreSQL", "Google Cloud"],
    faqFirst: "Can you connect to our existing TMS or WMS?",
    faqOther: "Do driver apps work without signal?",
    faqCount: 4,
  },
  {
    slug: "education-consulting",
    title: "Edtech & Consulting Software Development UK | Vebryx",
    kicker: "Edtech and consulting software development",
    headline: "Share your expertise at scale.",
    name: "Education & consulting",
    challenges: ["Time for hire", "Scattered tools", "Keeping learners engaged"],
    build: ["Learning platforms", "Client portals", "Booking & scheduling", "Assessments & certificates"],
    standards: ["Easy for everyone", "Safe data", "Works on any device", "Built to grow"],
    tech: ["Next.js", "Supabase", "Webflow", "Zapier"],
    faqFirst: "Should we use an off-the-shelf LMS?",
    faqOther: "Can we sell courses and sessions online?",
    faqCount: 4,
  },
];

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

for (const s of SECTORS) {
  const url = `/industries/${s.slug}`;
  test.describe(`industry page: ${s.slug}`, () => {
    test("renders with metadata, hero and no errors", async ({ page }) => {
      const errors = await open(page, url);
      await expect(page).toHaveTitle(s.title);
      await expect(page.locator("h1")).toContainText(s.kicker);
      await expect(page.locator("h1")).toContainText(s.headline);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toContainText(s.name);
      await expect(page.getByRole("link", { name: "Book a free call" }).first()).toHaveAttribute("href", "/book-a-call");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });

    test("has every content section in order", async ({ page }) => {
      await open(page, url);
      const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
      expect(labels).toEqual(SECTIONS);
    });

    test("challenges, solutions, standards and tech stack are complete", async ({ page }) => {
      await open(page, url);
      const text = (label: string) => page.locator(`section[aria-label="${label}"]`);
      for (const t of s.challenges) await expect(text("Challenges")).toContainText(t);
      for (const t of s.build) await expect(text("What we build")).toContainText(t);
      for (const t of s.standards) await expect(text("Built for the sector")).toContainText(t);
      for (const t of s.tech) await expect(text("Technologies")).toContainText(t);
    });

    test("FAQ accordion opens one answer at a time", async ({ page }) => {
      await open(page, url);
      const faq = page.locator('section[aria-label="Questions"]');
      await faq.scrollIntoViewIfNeeded();
      const buttons = faq.getByRole("button");
      await expect(buttons).toHaveCount(s.faqCount);
      await expect(faq.getByRole("button", { name: s.faqFirst })).toHaveAttribute("aria-expanded", "true");
      await faq.getByRole("button", { name: s.faqOther }).click();
      await expect(faq.getByRole("button", { name: s.faqOther })).toHaveAttribute("aria-expanded", "true");
      await expect(faq.getByRole("button", { name: s.faqFirst })).toHaveAttribute("aria-expanded", "false");
    });

    test("hero photo parallax follows the scroll", async ({ page }) => {
      await open(page, url);
      const frame = page.locator('main div[class*="-inset-y-["]').first();
      await frame.scrollIntoViewIfNeeded();
      const a = await frame.evaluate((e) => (e as HTMLElement).style.transform);
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(400);
      const b = await frame.evaluate((e) => (e as HTMLElement).style.transform);
      expect(a).toMatch(/translateY/);
      expect(b).not.toBe(a);
    });

    test("images load, including lazy ones", async ({ page }) => {
      await open(page, url);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 700) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(100);
      }
      const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
      expect(broken).toEqual([]);
    });

    test("scroll reveal shows every visible section", async ({ page }) => {
      await open(page, url);
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

    test("is reached from the industries page without a reload", async ({ page }) => {
      await open(page, "/industries");
      await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 3));
      await page.locator(`main a[href="${url}"]`).first().click();
      await expect(page).toHaveURL(new RegExp(`${url}$`));
      await expect(page.locator("h1")).toContainText(s.headline);
      expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(3);
    });
  });

  test.describe(`industry page: ${s.slug} on mobile`, () => {
    test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    test("fits the screen", async ({ page }) => {
      await open(page, url);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  });
}
