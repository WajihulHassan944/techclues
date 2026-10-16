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
  noCaseStudy?: boolean; // some sectors have no case study yet
};

const SECTIONS = [
  "Challenges", "What we build", "Built for the sector", "Talk to us", "Technologies", "Case study",
  "Your product partner", "What clients say", "Questions", "Industry experience", "Start your project",
];

const SECTORS: Sector[] = [
  {
    slug: "healthcare-medical",
    title: "UK Healthcare Software Development | TechClues",
    kicker: "Software development for healthcare",
    headline: "Safe, dependable digital care that people find simple to use.",
    name: "Medical & healthcare",
    challenges: ["Confidential information", "Platforms that never connect", "Hectic, diverse users"],
    build: ["Portals for patients", "Remote consultation platforms", "EHR/EMR connectivity", "Patient monitoring from afar"],
    standards: ["Privacy built in", "Standards-aware", "Accessibility as standard", "Dependable availability"],
    tech: ["React", "Flutter", "PostgreSQL", "Microsoft Azure"],
    faqFirst: "Do you build to NHS and GDPR standards?",
    faqOther: "Can you integrate with our existing systems?",
    faqCount: 4,
    noCaseStudy: true,
  },
  {
    slug: "retail-ecommerce",
    title: "Retail & Ecommerce Software Development in the UK | TechClues",
    kicker: "Retail and ecommerce software development",
    headline: "Shopping journeys built to sell on any screen.",
    name: "E-commerce & retail",
    challenges: ["Deserted carts", "Fragmented channels", "Costlier customer acquisition"],
    build: ["Bespoke storefronts", "Marketplaces", "Payments & checkout", "Stock & orders"],
    standards: ["Fast shops sell", "Safe payments", "Tracked growth", "Prepared for surges"],
    tech: ["Next.js", "Stripe", "Meta Ads", "Mailchimp"],
    faqFirst: "Do you build on Shopify or custom?",
    faqOther: "Can you build a marketplace?",
    faqCount: 4,
    noCaseStudy: true,
  },
  {
    slug: "pre-seed-seed-startups",
    title: "Building Products for Pre-seed & Seed Startups | TechClues",
    kicker: "Product development for seed and pre-seed startups",
    headline: "Concept to investor-ready product.",
    name: "Seed & pre-seed startups",
    challenges: ["Short runway", "Demonstrating demand", "Lacking a technical co-founder"],
    build: ["Idea validation", "Lean MVPs", "Clickable prototypes", "Launch & waitlists"],
    standards: ["Fixed scope and price", "Pace before polish", "Investor-ready", "A partner, rather than a supplier"],
    tech: ["Figma", "Supabase", "Vercel", "Stripe"],
    faqFirst: "How much does a startup MVP cost?",
    faqOther: "How fast can we launch?",
    faqCount: 4,
  },
  {
    slug: "saas-startups",
    title: "UK Startup SaaS Development | TechClues",
    kicker: "Startup SaaS development",
    headline: "SaaS products designed for quick launches and healthy scaling.",
    name: "SaaS startups",
    challenges: ["Redoing the fundamentals", "Onboarding attrition", "Growing pains"],
    build: ["MVPs for SaaS", "Teams & accounts", "Billing & subscriptions", "Analytics & dashboards"],
    standards: ["Designed to be multi-tenant", "Track everything", "Speed when scaling", "Release continuously"],
    tech: ["Next.js", "Supabase", "Stripe", "Mixpanel"],
    faqFirst: "Can you build our SaaS from scratch?",
    faqOther: "Do you handle subscriptions?",
    faqCount: 4,
    noCaseStudy: true,
  },
  {
    slug: "logistics-transportation",
    title: "UK Logistics Software Development | TechClues",
    kicker: "Software development for logistics",
    headline: "Logistics software to keep every stage of the operation in motion.",
    name: "Transport & logistics",
    challenges: ["Legacy systems", "Last-mile pressure", "Compliance and sustainability pressures"],
    build: ["Fleet management", "Managing transport (TMS)", "Managing warehouses (WMS)", "Route optimisation"],
    standards: ["Real-time as standard", "Works offline", "Integration-first"],
    tech: ["React", "Redis", "PostgreSQL", "Google Cloud"],
    faqFirst: "Can you connect to our existing TMS or WMS?",
    faqOther: "Do driver apps work without signal?",
    faqCount: 4,
    noCaseStudy: true,
  },
  {
    slug: "education-consulting",
    title: "Software Development for Edtech & Consulting in the UK | TechClues",
    kicker: "Software development for edtech and consulting",
    headline: "Take your knowledge to more people.",
    name: "Consulting & education",
    challenges: ["Hours for sale", "Fragmented software", "Holding learner attention"],
    build: ["Training platforms", "Customer portals", "Reservations & appointments", "Tests & certification"],
    standards: ["Simple for all", "Protected data", "Runs on every device", "Made to scale"],
    tech: ["Next.js", "Supabase", "Webflow", "Zapier"],
    faqFirst: "Should we use an off-the-shelf LMS?",
    faqOther: "Can we sell courses and sessions online?",
    faqCount: 4,
    noCaseStudy: true,
  },
  {
    slug: "recruitment-staffing",
    title: "UK Recruitment Software Development | TechClues",
    kicker: "Software development for recruitment",
    headline: "Faster placements of stronger candidates.",
    name: "Staffing & recruitment",
    challenges: ["Paperwork pile-up", "Lost applicants", "Unlinked tools"],
    build: ["Vacancy boards", "Applicant portals", "Customer portals", "Intelligent matching"],
    standards: ["GDPR-ready", "Integration-first", "Mobile-friendly", "Open and even-handed"],
    tech: ["React", "Zapier", "Make", "HubSpot"],
    faqFirst: "Can you integrate with our ATS or CRM?",
    faqOther: "Can you build a job board?",
    faqCount: 4,
    noCaseStudy: true,
  },
  {
    slug: "industry-manufacturing",
    title: "UK Manufacturing Software Development | TechClues",
    kicker: "Software development for manufacturing",
    headline: "Contemporary software for the shop floor.",
    name: "Manufacturing & industry",
    challenges: ["Spreadsheets and paper", "Limited visibility", "Ageing systems"],
    build: ["Production dashboards", "Maintenance apps", "Quality management", "Supply & inventory"],
    standards: ["Designed for the floor", "Fits alongside what you have", "Dependable and secure", "Gradual change"],
    tech: ["React", "Python", "Redis", "Microsoft Azure"],
    faqFirst: "Can you connect to our ERP or machines?",
    faqOther: "Will the apps work on the shop floor?",
    faqCount: 4,
    noCaseStudy: true,
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
      await expect(page.getByRole("link", { name: "Arrange a free call" }).first()).toHaveAttribute("href", "/book-a-call");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });

    test("has every content section in order", async ({ page }) => {
      await open(page, url);
      const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
      expect(labels).toEqual(s.noCaseStudy ? SECTIONS.filter((l) => l !== "Case study") : SECTIONS);
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
