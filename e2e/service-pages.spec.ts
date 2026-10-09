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
const sections = (compare: string, extraAfterIncluded?: string) =>
  COMMON_SECTIONS.flatMap((s) => (s === "__COMPARE__" ? [compare] : s === "What's included" && extraAfterIncluded ? [s, extraAfterIncluded] : [s]));

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
  {
    slug: "low-code-no-code",
    title: "No-Code & Low-Code Development Agency UK | Vebryx",
    kicker: "No-code and low-code development",
    headline: "A working product in days, not months.",
    serviceCard: "Low-Code / No-Code",
    sections: sections("Low-code or custom code?", "Low-code against custom code"),
    painPoints: [
      "You need to test an idea before committing to a full build.",
      "Your team runs on spreadsheets and manual work.",
      "Budget is tight, but you still need something that works.",
    ],
    pricing: ["Launch", "£2,500", "Business", "£5,000", "Advanced", "£8,500"],
    compareLabel: "Low-code or custom code?",
    compare: ["Speed to launch", "Days to weeks", "Weeks to months", "Platform subscriptions", "Validation and internal tools"],
    receive: ["Platform recommendation", "Working app or portal", "Team training session", "Upgrade path to custom code"],
    tech: ["Bubble", "Webflow", "Softr", "Shopify"],
    faqFirst: "How much does it cost?",
    faqOther: "Is low-code good enough for real users?",
    faqOtherAnswer: "We'll tell you honestly when custom code is the better choice.",
    faqCount: 7,
    minImages: 4,
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
    await expect(page.locator(SEC).getByText("Improving with real users").first()).toBeVisible();
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
    await expect(lanes.nth(0)).toContainText("Real users are in");
    await expect(lanes.nth(1)).toContainText("built to grow without limits");
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
