import { test, expect, type Page } from "@playwright/test";

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
  await page.goto("/how-we-work");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const PHASES = ["Ignition", "Compass", "Pillar", "Canvas", "Forge", "Bridge", "Sentinel", "Everest"];

test.describe("how we work page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("How We Work | Our 8-Phase MVP Development Process");
    await expect(page.locator("h1")).toContainText("From idea to launch,");
    await expect(page.locator("h1")).toContainText("step by step.");
    await expect(page.getByText("Eight phases, each with a clear purpose, take your idea from a first spark to a product live in the world.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has every section in order", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual(["The product journey", "A typical timeline", "Nothing hidden", "Start your project"]);
  });

  test("hero entrance animation settles into the visible state", async ({ page }) => {
    await open(page);
    await page.waitForTimeout(2200);
    await expect(page.getByRole("link", { name: "Scroll through the journey" })).toHaveCSS("opacity", "1");
    await expect(page.locator("main p.svc-in").first()).toHaveCSS("opacity", "1");
    const lines = page.locator("h1 .svc-rise");
    await expect(lines).toHaveCount(2);
    for (const i of [0, 1]) {
      const top = await lines.nth(i).evaluate((el) => el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top);
      expect(top).toBeLessThan(2);
    }
  });

  test("the scroll prompt jumps to the journey", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "Scroll through the journey" }).click();
    await expect.poll(() => page.evaluate(() => document.querySelector("#journey")!.getBoundingClientRect().top), { timeout: 5000 }).toBeLessThan(200);
  });

  test("lists the eight phases with what you do, what we do and the deliverables", async ({ page }) => {
    await open(page);
    const steps = page.locator("li[data-step]");
    await expect(steps).toHaveCount(8);
    for (const [i, name] of PHASES.entries()) {
      await expect(steps.nth(i)).toContainText(name);
      await expect(steps.nth(i)).toContainText(String(i + 1).padStart(2, "0"));
      await expect(steps.nth(i)).toContainText("You");
      await expect(steps.nth(i)).toContainText("Vebryx");
    }
    await expect(steps.nth(4)).toContainText("Weekly demos");
    await expect(steps.nth(4)).toContainText("Typically weeks 4–7");
    await expect(steps.nth(7)).toContainText("Go-live approved");
    await expect(steps.nth(0)).toContainText("Idea map");
  });

  test("a phase lights up while it is in the upper part of the screen", async ({ page }) => {
    await open(page);
    const first = page.locator("li#step-ignition");
    const third = page.locator("li#step-pillar");
    const dot = (li: ReturnType<Page["locator"]>) => li.locator("> div > span.rounded-full");
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(dot(first)).toHaveClass(/bg-paper/);
    await first.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3));
    await expect(dot(first)).toHaveClass(/bg-brand/);
    await expect(first.locator("> span[aria-hidden]")).toHaveClass(/bg-brand/);
    await expect(dot(third)).toHaveClass(/bg-paper/);
    await third.evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.3));
    await expect(dot(third)).toHaveClass(/bg-brand/);
    await expect(dot(first)).toHaveClass(/bg-paper/); // scrolled past: lights off again
  });

  test("timeline bars grow in when they come into view", async ({ page }) => {
    await open(page);
    const bars = page.locator("[data-bar]");
    await expect(bars).toHaveCount(8);
    await expect(bars.first()).toHaveCSS("opacity", "0");
    await page.locator('section[aria-label="A typical timeline"]').evaluate((el) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY));
    for (let i = 0; i < 8; i++) await expect(bars.nth(i)).toHaveCSS("opacity", "1", { timeout: 6000 });
    await expect(bars.nth(7)).toHaveCSS("transform", "matrix(1, 0, 0, 1, 0, 0)");
    const section = page.locator('section[aria-label="A typical timeline"]');
    for (const w of ["Week 1", "Week 8"]) await expect(section).toContainText(w);
    await expect(section).toContainText("Timelines vary with scope.");
  });

  test("transparency promises and the call to action are there", async ({ page }) => {
    await open(page);
    const t = page.locator('section[aria-label="Nothing hidden"]');
    for (const x of ["Live in Vebtrack", "Price agreed up front", "Weekly demos", "Direct access", "Honest timelines", "You own everything", "No lock-in"]) await expect(t).toContainText(x);
    await expect(page.locator('section[aria-label="Start your project"]')).toHaveCount(1);
  });

  test("scroll reveal shows every visible section", async ({ page }) => {
    await open(page);
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

  test("the header's How we work link goes here without a reload", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 9));
    await page.locator("header nav").getByRole("link", { name: "How we work" }).click();
    await expect(page).toHaveURL(/\/how-we-work$/);
    await expect(page.locator("h1")).toContainText("From idea to launch,");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(9);
  });
});

test.describe("how we work page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator('section[aria-label="A typical timeline"]').scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
