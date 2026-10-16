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
  "Why TechClues", "Questions", "Related insights", "Start your project",
];
const sections = (compare: string | null, extraAfterIncluded?: string) =>
  COMMON_SECTIONS.flatMap((s) => (s === "__COMPARE__" ? (compare ? [compare] : []) : s === "What's included" && extraAfterIncluded ? [s, extraAfterIncluded] : [s]));

const PAGES: Svc[] = [
  {
    slug: "mvp-development",
    title: "UK Startup MVP Development Services | TechClues",
    kicker: "UK startup MVP development",
    headline: "Shape your idea into something people genuinely want.",
    serviceCard: "MVPs & Custom Platforms",
    sections: sections("Prototype, MVP or full product?"),
    painPoints: [
      "You have an idea, but doubt that people would pay for it.",
      "Agency quotes come back enormous, woolly and stretching over months.",
      "A past build has overrun on time and budget and left you burned.",
    ],
    pricing: ["Validation MVP", "£2,500", "Lean MVP", "£5,000", "Bespoke / SaaS", "£10,000", "£499"],
    compareLabel: "Prototype, MVP or full product?",
    compare: ["Is it usable?", "Is there demand?", "Can it scale?", "Usability sessions", "First adopters", "Roughly 8 weeks, sometimes longer"],
    receive: ["Findings from validation", "Roadmap of ranked features", "Source code with documentation", "Iteration plan after launch"],
    tech: ["Figma", "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "AWS", "Stripe"],
    faqFirst: "How much does an MVP cost?",
    faqOther: "What if the idea doesn't validate?",
    faqOtherAnswer: "you've saved months",
    faqCount: 6,
    minImages: 5,
  },
  {
    slug: "prototype-to-production",
    title: "Turn Your AI-Built App Into a Production-Ready Product | TechClues",
    kicker: "Taking UK founders' AI-built apps into production",
    headline: "Real users can rely on your AI-built app.",
    serviceCard: "Prototype to Production",
    sections: sections("Keep prompting, harden or rebuild?"),
    painPoints: [
      "It runs fine in the demo, yet you'd never let real customers' data near it.",
      "Each fresh prompt repairs one problem and causes two more.",
      "Logins, payments and the App Store review are the points where progress stops.",
    ],
    pricing: ["Audit of code", "£750", "Sprint for hardening", "£3,500", "2–4 weeks"],
    compareLabel: "Keep prompting, harden or rebuild?",
    compare: ["Carry on prompting", "Toughen it", "Rebuild", "Just a demo so far", "Checked, then repaired", "Bespoke quotation"],
    receive: ["Audit report on code and security", "Sprint plan with costs", "Automated testing of critical flows", "Monitoring, backups and hosting for production"],
    tech: ["Lovable", "Bolt.new", "Replit", "Cursor", "Next.js", "Supabase"],
    faqFirst: "How much does it cost?",
    faqOther: "Will you rebuild everything?",
    faqOtherAnswer: "",
    faqCount: 7,
    minImages: 5,
  },
  {
    slug: "ai-enablement",
    title: "UK AI Integration Services for Businesses | TechClues",
    kicker: "Services for AI integration",
    headline: "AI worth its place inside your product.",
    serviceCard: "AI Integration & Automation",
    sections: (() => {
      const s = sections("Prompting, retrieval or fine-tuning?");
      s.splice(s.indexOf("Pricing"), 0, "AI at work");
      return s;
    })(),
    painPoints: [
      "Your people lose hours on tasks a model could draft within seconds.",
      "The AI features you've tried were unreliable or off-brand.",
      "You can't tell what's achievable, or what it costs to keep running.",
    ],
    pricing: ["AI audit", "£1,500", "Build", "£3,000", "Around two weeks"],
    compareLabel: "Prompting, retrieval or fine-tuning?",
    compare: ["Simple, general jobs", "Replies drawn from your own content", "A steady format or tone", "Not used", "Fetched at answer time", "Taught to the model"],
    receive: ["AI audit and build plan with costs", "Data and privacy check", "Prototype that works", "Team handover with documentation"],
    tech: ["Claude", "OpenAI", "Gemini", "Hugging Face", "Python", "LangChain", "PyTorch", "Node.js", "Next.js", "PostgreSQL", "Supabase", "Redis"],
    faqFirst: "How much does it cost?",
    faqOther: "Which models do you use?",
    faqOtherAnswer: "Claude, OpenAI and Gemini",
    faqCount: 7,
    minImages: 4,
  },
  {
    slug: "low-code-no-code",
    title: "UK Agency for No-Code & Low-Code Development | TechClues",
    kicker: "Low-code and no-code development",
    headline: "A usable product within days, rather than months.",
    serviceCard: "Low-Code / No-Code",
    sections: sections("Low-code or custom code?", "Low-code against custom code"),
    painPoints: [
      "Before you commit to a full build, an idea needs testing.",
      "Spreadsheets and manual effort keep your team going.",
      "Funds are limited, but what you get still has to work.",
    ],
    pricing: ["Launch", "£2,500", "Business", "£5,000", "Advanced", "£8,500"],
    compareLabel: "Low-code or custom code?",
    compare: ["Time to go live", "A few days to a few weeks", "Several weeks to a few months", "Platform subscriptions", "Validation work and internal tools"],
    receive: ["Platform recommendation", "Live app or portal", "Staff training session", "Route to upgrade to custom code"],
    tech: ["Bubble", "Webflow", "Softr", "Shopify"],
    faqFirst: "How much does it cost?",
    faqOther: "Is low-code good enough for real users?",
    faqOtherAnswer: "We'll tell you honestly when custom code is the better choice.",
    faqCount: 7,
    minImages: 4,
  },
  {
    slug: "performance-marketing",
    title: "UK Startup Performance Marketing Agency | TechClues",
    kicker: "Performance marketing aimed at startups",
    headline: "Land your first users and keep new ones arriving.",
    serviceCard: "Performance Marketing",
    sections: sections("Paid social or paid search?", "How a marketing funnel works"),
    painPoints: [
      "Launched, yet no one is signing up.",
      "Money goes on ads, but you can't see what is working.",
      "You want evidence of demand before you build further.",
    ],
    pricing: ["Launch", "£750", "Growth", "£1,250", "Scale", "£2,000"],
    compareLabel: "Paid social or paid search?",
    compare: ["Audiences grouped by interests and profile", "Users actively looking for an answer", "Meta, LinkedIn, TikTok"],
    receive: ["Research into audience and channels", "Budget plan and campaign strategy", "A/B tests", "Recommendations for growth"],
    tech: ["Google Ads", "Meta Ads", "Mixpanel", "Mailchimp"],
    faqFirst: "How much do you charge?",
    faqOther: "What budget do I need?",
    faqOtherAnswer: "We'll recommend a starting budget and scale what works.",
    faqCount: 7,
    minImages: 4,
  },
  {
    slug: "web-mobile-apps",
    title: "West Midlands & UK App Development Company | TechClues",
    kicker: "App development across the West Midlands and the whole UK",
    headline: "Apps for web and mobile that load fast and run everywhere.",
    serviceCard: "Web & Mobile Apps",
    sections: sections("Native, cross-platform or web app?", "How your app is built"),
    painPoints: [
      "Your app today is slow, buggy or tricky to alter.",
      "One product must run across web, iOS and Android.",
      "You can't tell which technology will endure.",
    ],
    pricing: ["Starter", "£5,000", "Business", "£8,500", "Advanced", "£15,000"],
    compareLabel: "Native, cross-platform or web app?",
    compare: ["A codebase per platform", "Hardware-intensive apps and games", "Tools that belong on the web"],
    receive: ["Technical architecture blueprint", "iOS plus Android apps", "Store launch: App Store, Google Play", "Source code with documentation"],
    tech: ["React", "Flutter", "Firebase", "Vercel"],
    faqFirst: "How much does an app cost?",
    faqOther: "Do you build native or cross-platform apps?",
    faqOtherAnswer: "Usually cross-platform with React Native or Flutter",
    faqCount: 7,
    minImages: 4,
  },
  {
    slug: "ecommerce-marketplace-development",
    title: "UK E-commerce & Marketplace Development | TechClues",
    kicker: "Marketplace and e-commerce development",
    headline: "A web store or marketplace that's effortless to buy from and to manage.",
    serviceCard: "E-commerce & Marketplaces",
    sections: sections("Shopify, WooCommerce or a custom build?"),
    painPoints: [
      "Visitors reach your shop, but not enough of them purchase.",
      "Keeping catalogue, pricing and inventory current takes far too long.",
      "Sellers, buyers and payouts must work together in your marketplace.",
    ],
    pricing: ["Basic", "£1,000", "Growth", "£2,000", "Advanced", "£3,500"],
    compareLabel: "Shopify, WooCommerce or a custom build?",
    compare: ["Quick launches, minimal maintenance", "Stores that already use WordPress", "Native, shaped around your rules"],
    receive: ["Shop or marketplace styling", "Payment and checkout setup", "Back-office training", "Going live and hand-off"],
    tech: ["Shopify", "WooCommerce", "Stripe", "Xero"],
    faqFirst: "How much does an online store or marketplace cost?",
    faqOther: "Are you a Shopify Partner?",
    faqOtherAnswer: "TechClues is a Shopify Partner",
    faqCount: 8,
    minImages: 4,
  },
  {
    slug: "ui-ux-design",
    title: "West Midlands UI/UX Design & Prototyping Agency | TechClues",
    kicker: "Prototyping and UI/UX design",
    headline: "Design people grasp within seconds.",
    serviceCard: "UI/UX & Prototyping",
    sections: sections("UX and UI: what's the difference?", "Example designs"),
    painPoints: [
      "Users sign up, get lost, then leave.",
      "Rivals make your product look old-fashioned.",
      "Developers must guess how screens ought to work.",
    ],
    pricing: ["Essential", "£1,000", "Product", "£2,000", "Complete", "£3,500"],
    compareLabel: "UX and UI: what's the difference?",
    compare: ["The process", "Its look and feel", "Task completion and drop-off rates"],
    receive: ["Findings from user research", "Clickable prototype", "Results of usability testing", "Developer-ready Figma"],
    tech: ["Figma", "Framer", "Maze", "Storybook"],
    faqFirst: "How much does design cost?",
    faqOther: "Do you only design, or build too?",
    faqOtherAnswer: "hire us for design only",
    faqCount: 7,
    minImages: 4,
  },
  {
    slug: "brand-strategy",
    title: "West Midlands Branding Agency for Startups | TechClues",
    kicker: "Identity and brand strategy built for startups",
    headline: "A brand that earns people's trust from their very first click.",
    serviceCard: "Strategy & Brand Identity",
    sections: sections(null),
    painPoints: [
      "It's hard to say what sets you apart.",
      "Placed beside rivals, your brand appears homemade.",
      "No two pages or posts quite match.",
    ],
    pricing: ["Essential", "£750", "Identity", "£1,500", "Complete", "£2,500"],
    compareLabel: "",
    compare: [],
    receive: ["Review of market and competitors", "Statement of positioning", "Brand rulebook", "Launch materials"],
    tech: ["Figma", "Adobe Illustrator", "Miro", "Notion"],
    faqFirst: "How much does branding cost?",
    faqOther: "Do you design logos only?",
    faqOtherAnswer: "best results come from positioning first",
    faqCount: 7,
    minImages: 4,
  },
];

// Pages whose case study isn't built yet have no "Case study" block.
const NO_CASE_STUDY = ["prototype-to-production", "low-code-no-code", "web-mobile-apps", "ecommerce-marketplace-development", "ui-ux-design", "brand-strategy"];
for (const svc of PAGES) if (NO_CASE_STUDY.includes(svc.slug)) svc.sections = svc.sections.filter((l) => l !== "Case study");

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
      await expect(page.getByRole("link", { name: "Arrange a free call" }).first()).toHaveAttribute("href", "/book-a-call");
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
      await expect(why).toContainText("Sound like you?");
      for (const text of svc.painPoints) await expect(why).toContainText(text);
      await expect(why.getByRole("button")).toHaveCount(0);
    });

    test("pricing, comparison, deliverables and tech stack are complete", async ({ page }) => {
      await open(page, svc.slug);
      const pricing = page.locator('section[aria-label="Pricing"]');
      for (const text of svc.pricing) await expect(pricing).toContainText(text);
      if (svc.compareLabel) {
        const compare = page.locator(`section[aria-label="${svc.compareLabel}"]`);
        for (const text of svc.compare) await expect(compare).toContainText(text);
      }
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
      await page.locator(`#${svc.slug}`).getByRole("link", { name: /Find out more/ }).click();
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
      await page.locator(`section[aria-label="${svc.compareLabel || "Pricing"}"]`).scrollIntoViewIfNeeded();
      expect(await fits(page)).toBe(true);
    });
  });
}

test.describe("service page: low-code-no-code timeline", () => {
  const SEC = 'section[aria-label="Low-code against custom code"]';
  const slider = (page: Page) => page.getByRole("slider", { name: "Timeline" });

  async function openTimeline(page: Page) {
    await open(page, "low-code-no-code");
    await page.locator(SEC).scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
  }
  const value = async (page: Page) => Number(await slider(page).getAttribute("aria-valuenow"));

  test("plays by itself once on screen, then offers a replay", async ({ page }) => {
    await openTimeline(page);
    await expect.poll(() => value(page), { timeout: 4000 }).toBeGreaterThan(5);
    await expect(page.getByRole("button", { name: "Pause" })).toBeVisible();
    await expect.poll(() => value(page), { timeout: 14_000 }).toBe(100);
    await expect(page.getByRole("button", { name: "Replay" })).toBeVisible();
    await expect(slider(page)).toHaveAttribute("aria-valuetext", "Months: low-code Live, custom code Live");
    await expect(page.locator(SEC).getByText("v1 live")).toHaveCount(2); // both lanes are live by the end
    await page.getByRole("button", { name: "Replay" }).click();
    await expect.poll(() => value(page), { timeout: 3000 }).toBeLessThan(60);
  });

  test("pause holds the position and play resumes from it", async ({ page }) => {
    await openTimeline(page);
    await expect.poll(() => value(page), { timeout: 4000 }).toBeGreaterThan(10);
    await page.getByRole("button", { name: "Pause" }).click();
    const held = await value(page);
    await page.waitForTimeout(800);
    expect(await value(page)).toBe(held);
    await expect(page.getByRole("button", { name: "Play" })).toBeVisible();
    await page.getByRole("button", { name: "Play" }).click();
    await expect.poll(() => value(page), { timeout: 4000 }).toBeGreaterThan(held + 5);
  });

  test("keyboard moves the timeline and the phases follow", async ({ page }) => {
    await openTimeline(page);
    await page.getByRole("button", { name: "Pause" }).click().catch(() => {});
    await slider(page).focus();
    await page.keyboard.press("Home");
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "0");
    await expect(slider(page)).toHaveAttribute("aria-valuetext", "Days: low-code Scope, custom code Scope");
    for (let i = 0; i < 2; i++) await page.keyboard.press("ArrowRight"); // 10
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "10");
    await expect(slider(page)).toHaveAttribute("aria-valuetext", "Days: low-code Build and connect, custom code Design");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("ArrowRight"); // 25
    await expect(slider(page)).toHaveAttribute("aria-valuetext", "Weeks: low-code Live, custom code Build");
    await expect(page.locator(SEC).getByText("Getting better with real users").first()).toBeVisible();
    for (let i = 0; i < 9; i++) await page.keyboard.press("ArrowRight"); // 70
    await expect(slider(page)).toHaveAttribute("aria-valuetext", "Months: low-code Live, custom code Test");
    await expect(page.locator(SEC).getByText("v3", { exact: true })).toHaveCSS("opacity", "1");
    await expect(page.locator(SEC).getByText("v4", { exact: true })).toHaveCSS("opacity", "0");
    await page.keyboard.press("End");
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("ArrowRight"); // clamped
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "100");
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowLeft"); // clamped
    await expect(slider(page)).toHaveAttribute("aria-valuenow", "0");
  });

  test("clicking and dragging the track scrubs the timeline", async ({ page }) => {
    await openTimeline(page);
    await page.getByRole("button", { name: "Pause" }).click().catch(() => {});
    const track = slider(page).locator("xpath=..");
    const box = (await track.boundingBox())!;
    await page.mouse.click(box.x + box.width * 0.5, box.y + 60);
    await expect.poll(() => value(page), { timeout: 2000 }).toBeGreaterThan(48);
    await expect.poll(() => value(page), { timeout: 2000 }).toBeLessThan(52);
    // Dragging works from the track (as on the reference page, pressing on the thumb itself does not start a drag).
    await page.mouse.move(box.x + box.width * 0.3, box.y + 60);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.9, box.y + 60, { steps: 6 });
    await page.mouse.up();
    await expect.poll(() => value(page), { timeout: 2000 }).toBeGreaterThan(86);
    // The phase text under each lane follows the position (90 = both lanes live)
    const lanes = page.locator(SEC).locator("div.\\[grid-area\\:1\\/1\\]:not([aria-hidden='true'])");
    await expect(lanes).toHaveCount(2);
    await expect(lanes.nth(0)).toContainText("Genuine users are on board");
    await expect(lanes.nth(1)).toContainText("built to scale with no ceiling");
  });

  test("region labels highlight as the timeline moves", async ({ page }) => {
    await openTimeline(page);
    await page.getByRole("button", { name: "Pause" }).click().catch(() => {});
    await slider(page).focus();
    const region = (name: string) => page.locator(SEC).getByText(name, { exact: true }).first();
    await page.keyboard.press("Home");
    await expect(region("Days")).toHaveClass(/text-ink(?!\/)/);
    for (let i = 0; i < 6; i++) await page.keyboard.press("ArrowRight"); // 30
    await expect(region("Weeks")).toHaveClass(/text-ink(?!\/)/);
    await expect(region("Days")).toHaveClass(/text-muted/);
    await page.keyboard.press("End");
    await expect(region("Months")).toHaveClass(/text-ink(?!\/)/);
  });
});

test.describe("service page: performance-marketing funnel", () => {
  const SEC = 'section[aria-label="How a marketing funnel works"]';
  const panel = (page: Page, key: string) => page.locator(`${SEC} #funnel-${key}`);

  async function openFunnel(page: Page) {
    await open(page, "performance-marketing");
    await page.locator(SEC).scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
  }

  test("starts on Reach and clicking a funnel stage shows its panel", async ({ page }) => {
    await openFunnel(page);
    await expect(panel(page, "reach")).toHaveAttribute("aria-hidden", "false");
    await expect(panel(page, "convert")).toHaveAttribute("aria-hidden", "true");
    await page.locator(SEC).getByRole("tab", { name: /sign up or buy/ }).click();
    await expect(panel(page, "convert")).toHaveAttribute("aria-hidden", "false");
    await expect(panel(page, "reach")).toHaveAttribute("aria-hidden", "true");
    await expect(panel(page, "convert")).toContainText("Conversion rate");
    await expect(panel(page, "convert")).toContainText("Google Tag Manager");
    await expect(panel(page, "convert")).toContainText("Stage 3 of 4");
  });

  test("after testing counts the figures up and shows the multiplier", async ({ page }) => {
    await openFunnel(page);
    const live = page.locator(`${SEC} [aria-live=polite]`);
    await expect(live).toContainText("9 customers");
    await expect(live).toContainText("3 returning");
    await page.getByRole("radio", { name: "Post-test" }).click();
    await expect(page.getByRole("radio", { name: "Post-test" })).toHaveAttribute("aria-checked", "true");
    await expect(live).toContainText("18 customers", { timeout: 3000 });
    await expect(live).toContainText("9 returning");
    await expect(live).toContainText("2× as many customers", { timeout: 3000 });
    await page.locator(SEC).getByRole("tab", { name: /click through/ }).click();
    await expect(panel(page, "click")).toContainText("2%");
    await page.getByRole("radio", { name: "Pre-test" }).click();
    await expect(live).toContainText("9 customers", { timeout: 3000 });
    await expect(panel(page, "click")).toContainText("1.5%");
  });

  test("rotates through the stages by itself until you pick one", async ({ page }) => {
    await openFunnel(page);
    await expect(panel(page, "click")).toHaveAttribute("aria-hidden", "false", { timeout: 9000 });
    await page.locator(SEC).getByRole("tab", { name: /return for more/ }).click();
    await page.mouse.move(5, 5);
    await page.waitForTimeout(6500);
    await expect(panel(page, "return")).toHaveAttribute("aria-hidden", "false");
  });

  test("particles run inside the funnel", async ({ page }) => {
    await openFunnel(page);
    await expect.poll(() => page.locator(`${SEC} svg circle[opacity]:not([opacity="0"])`).count(), { timeout: 5000 }).toBeGreaterThan(3);
  });
});

test.describe("service page: web-mobile-apps interactions", () => {
  const SEC = 'section[aria-label="How your app is built"]';
  const tab = (page: Page, name: string | RegExp) => page.locator(SEC).getByRole("tab", { name });

  async function openArch(page: Page) {
    await open(page, "web-mobile-apps");
    await page.locator(SEC).scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
  }

  test("picking a layer opens the stack and swaps the tools", async ({ page }) => {
    await openArch(page);
    await expect(tab(page, /Mobile & web apps/)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(`${SEC} #arch-tech`)).toContainText("Tailwind CSS");
    await tab(page, /^04\s*Data/).click();
    await expect(tab(page, /^04\s*Data/)).toHaveAttribute("aria-selected", "true");
    await expect(page.locator(`${SEC} #arch-tech li`)).toHaveCount(5, { timeout: 3000 });
    await expect(page.locator(`${SEC} #arch-tech`)).toContainText("PostgreSQL");
    await expect(page.locator(`${SEC} #arch-tech`)).not.toContainText("Tailwind CSS");
    await tab(page, /^05\s*Cloud/).click();
    await expect(page.locator(`${SEC} #arch-tech`)).toContainText("Microsoft Azure", { timeout: 3000 });
  });

  test("layers above the chosen one lift away and the chosen one is highlighted", async ({ page }) => {
    await openArch(page);
    const layers = page.locator(`${SEC} [style*="preserve-3d"] > .cursor-pointer`);
    await expect(layers).toHaveCount(5);
    await tab(page, /^03\s*Back end/).click();
    await expect(layers.nth(2)).toHaveCSS("transform", /.+/);
    await expect(layers.nth(2).locator("> div").nth(1)).toHaveClass(/border-brand\/60/);
    await expect(layers.nth(0).locator("> div").nth(1)).toHaveCSS("opacity", "0.35");
    await expect(layers.nth(3).locator("> div").nth(1)).toHaveCSS("opacity", "1");
  });

  test("clicking the stack itself selects that layer", async ({ page }) => {
    await openArch(page);
    await page.locator(`${SEC} [style*="preserve-3d"] > .cursor-pointer`).nth(4).dispatchEvent("click");
    await expect(tab(page, /^05\s*Cloud/)).toHaveAttribute("aria-selected", "true");
  });

  test("steps through the layers by itself until you hover", async ({ page }) => {
    await openArch(page);
    await expect(tab(page, /^02\s*Integrations/)).toHaveAttribute("aria-selected", "true", { timeout: 7000 });
    await page.locator(`${SEC} #arch-tech`).hover();
    await page.locator(SEC).getByRole("tab").nth(0).hover();
    await page.waitForTimeout(4500);
    await expect(tab(page, /^02\s*Integrations/)).toHaveAttribute("aria-selected", "true");
  });

  test("pricing switches between web and mobile apps", async ({ page }) => {
    await open(page, "web-mobile-apps");
    const pr = page.locator("#pricing");
    await pr.scrollIntoViewIfNeeded();
    await expect(pr.locator("#pricing-panel-0")).toBeVisible();
    await expect(pr.locator("#pricing-panel-1")).toBeHidden();
    await pr.getByRole("tab", { name: "Mobile application" }).click();
    await expect(pr.getByRole("tab", { name: "Mobile application" })).toHaveAttribute("aria-selected", "true");
    await expect(pr.locator("#pricing-panel-1")).toBeVisible();
    await expect(pr.locator("#pricing-panel-0")).toBeHidden();
    for (const p of ["£7,500", "£12,500", "£20,000"]) await expect(pr.locator("#pricing-panel-1")).toContainText(p);
    await pr.getByRole("tab", { name: "Web app" }).click();
    await expect(pr.locator("#pricing-panel-0")).toContainText("£15,000");
  });
});

test.describe("service page: ecommerce-marketplace-development pricing", () => {
  test("switches between online store and marketplace plans", async ({ page }) => {
    await open(page, "ecommerce-marketplace-development");
    const pr = page.locator("#pricing");
    await pr.scrollIntoViewIfNeeded();
    await expect(pr.locator("#pricing-panel-0")).toBeVisible();
    await pr.getByRole("tab", { name: "Marketplace" }).click();
    await expect(pr.locator("#pricing-panel-1")).toBeVisible();
    await expect(pr.locator("#pricing-panel-0")).toBeHidden();
    await expect(pr.locator("#pricing-panel-1")).toContainText("£5,000");
  });
});

test.describe("service page: ui-ux-design showcase", () => {
  test("shows the six example screens", async ({ page }) => {
    await open(page, "ui-ux-design");
    const sec = page.locator('section[aria-label="Example designs"]');
    await sec.scrollIntoViewIfNeeded();
    await expect(sec.getByRole("heading", { name: "Made to be used." })).toBeVisible();
    for (const n of ["banking app", "class booking", "product page", "analytics dashboard", "activity tracker", "boarding pass"])
      await expect(sec.locator(`figure[aria-label="Example: ${n}"]`)).toHaveCount(1);
  });
});

test.describe("homepage: Our approach statement", () => {
  test("words fill in as the statement scrolls through the screen", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    const words = page.locator("section p", { hasText: "Most products fail" }).locator("> span");
    await expect(words).toHaveCount(30);
    await words.first().scrollIntoViewIfNeeded();
    const op = (i: number) => words.nth(i).evaluate((e) => Number(getComputedStyle(e).opacity));
    // Below the fold: dim. Scroll it to the top third: filled.
    await page.evaluate(() => {
      const p = [...document.querySelectorAll("section p")].find((e) => e.textContent?.startsWith("Most products fail"))!;
      window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.9);
    });
    await expect.poll(() => op(29)).toBeCloseTo(0.14, 1);
    await page.evaluate(() => {
      const p = [...document.querySelectorAll("section p")].find((e) => e.textContent?.startsWith("Most products fail"))!;
      window.scrollTo(0, p.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.1);
    });
    await expect.poll(() => op(29)).toBeGreaterThan(0.95);
    await page.evaluate(() => {
      const p = [...document.querySelectorAll("section p")].find((e) => e.textContent?.startsWith("Most products fail"))!;
      const r = p.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - window.innerHeight * 0.85 + (0.35 * window.innerHeight + r.height) * 0.5);
    });
    await expect.poll(async () => (await op(0)) > 0.99 && (await op(29)) < 0.3).toBe(true);
  });
});
