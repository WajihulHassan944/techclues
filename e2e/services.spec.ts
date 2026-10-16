import { test, expect, type Page } from "@playwright/test";

const SERVICES = [
  ["MVPs & Bespoke Platforms", "mvp-development", "01"],
  ["Prototype into Production", "prototype-to-production", "02"],
  ["Automation & AI Integration", "ai-enablement", "03"],
  ["Web & Mobile Applications", "web-mobile-apps", "04"],
  ["UI/UX & Prototype work", "ui-ux-design", "05"],
  ["No-Code / Low-Code", "low-code-no-code", "06"],
  ["Marketplaces & E-commerce", "ecommerce-marketplace-development", "07"],
  ["Performance Marketing", "performance-marketing", "08"],
  ["Brand Identity & Strategy", "brand-strategy", "09"],
  ["Staff Augmentation", "staff-augmentation", "10"],
  ["Game Creation", "game-development", "11"],
] as const;

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
  await page.goto("/services");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

test.describe("services page", () => {
  test("renders with the right metadata, intro and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Our Services | MVP Development, Apps, Design & Growth | TechClues");
    await expect(page.locator("h1")).toContainText("Whatever your");
    await expect(page.locator("h1")).toContainText("product requires.");
    await expect(page.getByText("A single team covers everything, from testing the idea to expanding once live.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("intro animation ends in the visible final state", async ({ page }) => {
    await open(page);
    await page.waitForTimeout(1500);
    for (const sel of ["main p.svc-in", "main ul.svc-in"]) {
      await expect(page.locator(sel).first()).toHaveCSS("opacity", "1");
    }
    const lines = page.locator("h1 .svc-rise");
    await expect(lines).toHaveCount(2);
    for (const i of [0, 1]) {
      const box = await lines.nth(i).evaluate((el) => {
        const r = el.getBoundingClientRect();
        const p = el.parentElement!.getBoundingClientRect();
        return { top: r.top - p.top, bottom: p.bottom - r.bottom };
      });
      expect(box.top).toBeLessThan(2); // settled inside its clipping box
    }
  });

  test("lists every service with numbers, links, inclusions and audience", async ({ page }) => {
    await open(page);
    for (const [name, slug, num] of SERVICES) {
      const card = page.locator(`#${slug}`);
      await expect(card).toHaveCount(1);
      await expect(card.getByRole("heading", { name })).toBeVisible();
      await expect(card).toContainText(num);
      await expect(card.getByRole("link", { name: /Find out more/ })).toHaveAttribute("href", `/services/${slug}`);
      await expect(card).toContainText("What we cover");
      await expect(card).toContainText("Best for:");
    }
  });

  test("jump chips scroll to the matching card", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "Performance Marketing" }).first().click();
    await expect.poll(async () => page.evaluate(() => Math.round(document.querySelector("#performance-marketing")!.getBoundingClientRect().top)), { timeout: 5000 }).toBeLessThan(260);
    await expect.poll(async () => page.evaluate(() => Math.round(document.querySelector("#performance-marketing")!.getBoundingClientRect().top)), { timeout: 5000 }).toBeGreaterThan(-20);
    expect(page.url()).toContain("/services");
  });

  test("ways-to-work pricing tiers and calls to action", async ({ page }) => {
    await open(page);
    const section = page.locator('section[aria-label="Ways to work with us"]');
    await section.scrollIntoViewIfNeeded();
    await expect(section).toContainText("Choose the model that suits.");
    await expect(section).toContainText("From £2,500");
    await expect(section).toContainText("From £10,000");
    await expect(section.getByRole("link", { name: "Work out your MVP cost" })).toHaveAttribute("href", "/mvp-cost-calculator");
    await expect(section.getByRole("link", { name: "Get in touch" }).first()).toBeVisible();
    await expect(page.locator('section[aria-label="Start your project"]')).toBeVisible();
  });

  test("shared header, footer and floating widgets are present", async ({ page }) => {
    await open(page);
    await page.locator("header nav button", { hasText: "Industries" }).hover();
    await expect(page.locator("[data-nav-panel]:not(.hidden)")).toContainText("All industries");
    await page.mouse.move(700, 800);
    await expect(page.locator("footer")).toBeAttached();
    await expect(page.locator(".chat-launcher")).toBeVisible();
    await expect(page.locator("a.dock-link")).toHaveCount(2);
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

  test("all images load", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 800) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(100);
    }
    const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
    expect(broken).toEqual([]);
  });
});

test.describe("services page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("fits the screen and the menu links to Services", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(page.locator("nav[aria-label='Mobile']").getByRole("link", { name: "Services", exact: true })).toHaveAttribute("href", "/services");
  });
});
