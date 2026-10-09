import { test, expect, type Page } from "@playwright/test";

const URL = "/services/mvp-development";

/** Dismisses the cookie banner; it only goes away once React has hydrated, so retry the click until it does. */
async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto(URL);
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const SECTIONS = [
  "Why it matters",
  "What's included",
  "Pricing",
  "Know before you start",
  "Prototype, MVP or full product?",
  "What you receive",
  "Technologies",
  "Talk to us",
  "Benefits",
  "Industry experience",
  "Your product partner",
  "Case study",
  "What clients say",
  "How it works",
  "Why Vebryx",
  "Questions",
  "Related insights",
  "Start your project",
];

test.describe("service page: MVP development", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("MVP Development Services for UK Startups | Vebryx");
    await expect(page.locator("h1")).toContainText("MVP development for UK startups");
    await expect(page.locator("h1")).toContainText("Turn your idea into a product people actually want.");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Services" })).toHaveAttribute("href", "/services");
    await expect(page.getByRole("link", { name: "Book a free call" }).first()).toHaveAttribute("href", "/book-a-call");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("hero entrance animation settles into the visible state", async ({ page }) => {
    await open(page);
    await page.waitForTimeout(1800);
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toHaveCSS("opacity", "1");
    for (const el of await page.locator("main .svc-in").all()) await expect(el).toHaveCSS("opacity", "1");
    const settled = await page.locator("h1 .svc-rise").evaluate((el) => {
      const r = el.getBoundingClientRect();
      const p = el.parentElement!.getBoundingClientRect();
      return r.top - p.top;
    });
    expect(settled).toBeLessThan(2);
  });

  test("has every content section in order", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual(SECTIONS);
  });

  test("opening section keeps the founder pain points", async ({ page }) => {
    await open(page);
    const why = page.locator('section[aria-label="Why it matters"]');
    for (const text of [
      "Sound familiar?",
      "You've got an idea, but you're not sure people will pay for it.",
      "Quotes from agencies are huge, vague and months long.",
      "You've been burned by a build that went over time and budget.",
    ]) {
      await expect(why).toContainText(text);
    }
    await expect(why.getByRole("button")).toHaveCount(0); // it is a plain list, not an accordion
  });

  test("hero photo parallax follows the scroll like the reference", async ({ page }) => {
    await open(page);
    const frame = page.locator("main div.-inset-y-\\[8\\%\\]").first();
    const readAt = async (targetTop: number) => {
      // Scroll so the photo's frame sits at `targetTop` px from the top of the viewport.
      await page.evaluate((top) => {
        const host = document.querySelector("main div.-inset-y-\\[8\\%\\]")!.parentElement!;
        window.scrollTo(0, host.getBoundingClientRect().top + window.scrollY - top);
      }, targetTop);
      await page.waitForTimeout(500);
      return frame.evaluate((el) => parseFloat(/translateY\(([-\d.]+)%\)/.exec((el as HTMLElement).style.transform)![1]));
    };
    // Values measured on the reference page at 1440x900 with a 468px-high frame.
    expect(await readAt(450)).toBeCloseTo(-2.05, 0);
    expect(await readAt(150)).toBeCloseTo(0.58, 0);
    expect(await readAt(0)).toBeCloseTo(1.89, 0);
    expect(await readAt(-350)).toBeCloseTo(4.96, 0);
    expect(await readAt(-700)).toBeCloseTo(6, 1); // clamped
  });

  test("pricing shows the three tiers and the ZERO.ONE offer", async ({ page }) => {
    await open(page);
    const pricing = page.locator('section[aria-label="Pricing"]');
    await pricing.scrollIntoViewIfNeeded();
    for (const text of ["Validation MVP", "£2,500", "Lean MVP", "£5,000", "Custom / SaaS", "£10,000", "£499"]) {
      await expect(pricing).toContainText(text);
    }
    await expect(pricing.getByRole("link", { name: /See ZERO\.ONE/ })).toHaveAttribute("href", "/zero-one");
  });

  test("comparison table and deliverables are complete", async ({ page }) => {
    await open(page);
    const compare = page.locator('section[aria-label="Prototype, MVP or full product?"]');
    for (const text of ["Can people use it?", "Do people want it?", "Can it grow?", "Test sessions", "Early adopters", "Around 8 weeks and beyond"]) {
      await expect(compare).toContainText(text);
    }
    const receive = page.locator('section[aria-label="What you receive"]');
    for (const text of ["Validation findings", "Prioritised feature roadmap", "Source code and documentation", "Post-launch iteration plan"]) {
      await expect(receive).toContainText(text);
    }
  });

  test("tech stack lists the tools", async ({ page }) => {
    await open(page);
    const tech = page.locator('section[aria-label="Technologies"]');
    for (const t of ["Figma", "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Supabase", "AWS", "Stripe"]) {
      await expect(tech).toContainText(t);
    }
  });

  test("FAQ accordion opens one answer at a time", async ({ page }) => {
    await open(page);
    const faq = page.locator('section[aria-label="Questions"]');
    await faq.scrollIntoViewIfNeeded();
    await expect(faq.getByRole("button")).toHaveCount(6);
    const q1 = faq.getByRole("button", { name: "How much does an MVP cost?" });
    const q3 = faq.getByRole("button", { name: "What if the idea doesn't validate?" });
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await q3.click();
    await expect(q3).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(faq).toContainText("you've saved months");
  });

  test("images load, including lazy ones", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(100);
    }
    const imgs = await page.evaluate(() => [...document.images].map((i) => ({ src: i.src, ok: i.complete && i.naturalWidth > 0 })));
    expect(imgs.length).toBeGreaterThanOrEqual(5);
    expect(imgs.filter((i) => !i.ok)).toEqual([]);
  });

  test("scroll reveal shows every visible section", async ({ page }) => {
    await open(page);
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
    await page.locator("#mvp-development").getByRole("link", { name: /Learn more/ }).click();
    await expect(page).toHaveURL(/\/services\/mvp-development$/);
    await expect(page.locator("h1")).toContainText("MVP development for UK startups");
    await page.locator("header nav button", { hasText: "Services" }).hover();
    await expect(page.locator("[data-nav-panel]:not(.hidden)")).toContainText("All services");
    await expect(page.locator("footer")).toBeAttached();
    await expect(page.locator(".chat-launcher")).toBeVisible();
  });
});

test.describe("service page: MVP development on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('section[aria-label="Prototype, MVP or full product?"]').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
