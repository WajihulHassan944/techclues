import { test, expect, type Page } from "@playwright/test";

const SECTORS = [
  ["Healthcare & medical", "healthcare-medical"],
  ["Logistics & transportation", "logistics-transportation"],
  ["Retail & e-commerce", "retail-ecommerce"],
  ["Education & consulting", "education-consulting"],
  ["Pre-seed & seed startups", "pre-seed-seed-startups"],
  ["Recruitment & staffing", "recruitment-staffing"],
  ["SaaS startups", "saas-startups"],
  ["Industry & manufacturing", "industry-manufacturing"],
] as const;

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
  await page.goto("/industries");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

test.describe("industries page", () => {
  test("renders with the right metadata, intro and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Industries We Serve | Sector Software & MVPs | Vebryx");
    await expect(page.locator("h1")).toContainText("Built for your sector.");
    await expect(page.locator("h1")).toContainText("Not just your screen.");
    await expect(page.locator("main").getByText("Eight sectors where we know the users, the rules and what good looks like.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("lists the eight sectors with numbers, summaries, photos and links", async ({ page }) => {
    await open(page);
    for (const [i, [name, slug]] of SECTORS.entries()) {
      const card = page.locator(`main a[href="/industries/${slug}"]`).first();
      await expect(card).toHaveCount(1);
      await expect(card.getByRole("heading", { name })).toBeVisible();
      await expect(card).toContainText(String(i + 1).padStart(2, "0"));
      await expect(card).toContainText("Explore");
      await expect(card.locator("img")).toHaveAttribute("src", /\/industries\/[a-z-]+\.jpg$/);
    }
  });

  test("cards light up on hover", async ({ page }) => {
    await open(page);
    const card = page.locator('main a[href="/industries/saas-startups"]');
    await card.scrollIntoViewIfNeeded();
    const veil = card.locator("span[aria-hidden].opacity-0").first();
    await expect(veil).toHaveCSS("opacity", "0");
    await card.hover();
    await expect(veil).toHaveCSS("opacity", "1");
  });

  test("has the sector-knowledge, partner, reviews and call-to-action sections", async ({ page }) => {
    await open(page);
    for (const label of ["Why sector knowledge matters", "Your product partner", "What clients say", "Start your project"])
      await expect(page.locator(`section[aria-label="${label}"]`)).toHaveCount(1);
    await expect(page.getByText("We know the workflows")).toBeVisible();
    await expect(page.getByText("Standards built in")).toBeAttached();
    await expect(page.getByText("Faster from the start")).toBeAttached();
  });

  test("a sector card goes there without reloading the site", async ({ page }) => {
    await open(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 1));
    await page.locator("header nav").getByRole("button", { name: "Industries" }).hover();
    await expect(page.locator("[data-nav-panel]:not(.hidden)")).toContainText("All industries");
    await page.mouse.move(700, 800);
    await expect(page.locator("footer")).toBeAttached();
    await expect(page.locator(".chat-launcher")).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(1);
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

test.describe("industries page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
  });
});
