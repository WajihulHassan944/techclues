import { test, expect, type Page } from "@playwright/test";

const URL = "/mvp-cost-calculator";

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

async function details(page: Page) {
  await page.locator('input[autocomplete="name"]').fill("Test User");
  await page.locator('input[autocomplete="email"]').fill("test@example.com");
  await page.getByRole("button", { name: "Start my estimate" }).click();
}

const side = (page: Page) => page.locator("aside .min-h-\\[92px\\]");
const next = (page: Page) => page.getByRole("button", { name: "Next", exact: true });

/** Runs the wizard and returns the sidebar estimate text. */
async function run(page: Page, goal: string, platform: string, feats: string[], pace: string) {
  await details(page);
  await page.getByRole("button", { name: new RegExp(`^${goal}`) }).click();
  await next(page).click();
  await page.getByRole("button", { name: new RegExp(`^${platform}`) }).click();
  await next(page).click();
  for (const f of feats) await page.getByRole("button", { name: new RegExp(`^${f}`) }).first().click();
  await next(page).click();
  await page.getByRole("button", { name: new RegExp(`^${pace}`) }).click();
  await page.getByRole("button", { name: "See my estimate" }).click();
  // The sidebar numbers ease toward their final values, so wait for them to settle.
  const read = async () => (await side(page).innerText()).replace(/\s+/g, " ").trim();
  let last = "";
  await expect.poll(async () => { const v = await read(); const stable = v === last; last = v; return stable; }, { timeout: 5000, intervals: [400] }).toBe(true);
  return read();
}

test.describe("MVP cost calculator", () => {
  test("renders the page, shell and static sections without errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("MVP Cost Calculator UK | Estimate Your App Build | Vebryx");
    await expect(page.locator("h1")).toHaveText("What will your MVP cost?");
    await expect(page.getByText("Step 1 of 6")).toBeVisible();
    await expect(page.getByText("Add your details to unlock your instant estimate.")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Five things that shape your price." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "About your estimate." })).toBeVisible();
    await expect(page.locator("header nav")).toBeVisible();
    await expect(page.locator("footer")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("details step validates, locks later steps and unlocks on submit", async ({ page }) => {
    await open(page);
    const start = page.getByRole("button", { name: "Start my estimate" });
    await expect(start).toBeDisabled();
    for (const label of ["Goal", "Platform", "Features", "Timeline", "Estimate"]) {
      await expect(page.getByRole("button", { name: label, exact: true })).toBeDisabled();
    }
    await page.locator('input[autocomplete="name"]').fill("Test User");
    await page.locator('input[autocomplete="email"]').fill("not-an-email");
    await expect(start).toBeDisabled();
    await page.locator('input[autocomplete="email"]').fill("test@example.com");
    await expect(start).toBeEnabled();
    await start.click();
    await expect(page.getByText("Step 2 of 6")).toBeVisible();
    await expect(page.getByRole("heading", { name: "What would you like to do?" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Goal", exact: true })).toHaveAttribute("aria-current", "step");
    await expect(page.getByRole("button", { name: "Timeline", exact: true })).toBeDisabled();
    await expect(page.getByText("Pick your features to see an instant estimate.")).toBeVisible();
  });

  test("walks every step and matches the reference estimate", async ({ page }) => {
    await open(page);
    await details(page);
    // Goal and platform default to MVP / Web app
    await expect(page.getByRole("button", { name: /^Start with an MVP/ })).toHaveAttribute("aria-pressed", "true");
    await next(page).click();
    await expect(page.getByRole("heading", { name: "Which platform do you need?" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Web app/ })).toHaveAttribute("aria-pressed", "true");
    await next(page).click();
    // Features: Next is disabled until something is picked
    await expect(page.getByRole("heading", { name: "What features do you need?" })).toBeVisible();
    await expect(next(page)).toBeDisabled();
    for (const f of ["Sign up & log in", "Payments", "Real-time chat"]) await page.getByRole("button", { name: new RegExp(`^${f}`) }).click();
    await expect(page.getByText("3 selected")).toBeVisible();
    await expect(side(page)).toContainText("£5,000 – £5,282");
    await expect(side(page)).toContainText("Around £5,121 · 4 weeks");
    await next(page).click();
    await expect(page.getByRole("heading", { name: "What pace suits you?" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Standard/ })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "See my estimate" }).click();
    await expect(page.getByRole("heading", { name: "Your estimate is ready." })).toBeVisible();
    await expect(page.getByText("Step 6 of 6")).toBeVisible();
    await expect(page.getByText("Estimated total")).toBeVisible();
    await expect(page.getByText("£5,121", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Web app · Start with an MVP · Standard pace")).toBeVisible();
    await expect(page.getByText("test@example.com")).toBeVisible();
    for (const f of ["Sign up & log in", "Payments", "Real-time chat"]) await expect(page.locator("ul li", { hasText: f })).toHaveCount(1);
  });

  test("pricing matches the reference site across scenarios", async ({ page }) => {
    await open(page);
    // Values captured from the live reference calculator.
    const cases: [string, string, string[], string, string][] = [
      ["Build a full product", "Web \\+ mobile", ["AI features", "Dashboards", "Analytics", "Payments"], "Fast track", "£10,303 – £13,516 Around £11,680 · 4–5 weeks"],
      ["Update a product", "Mobile app", ["Notifications", "Search"], "Relaxed", "£428 – £605 Around £504 · 4 weeks"],
      ["Start with an MVP", "Web app", ["Sign up", "User onboarding"], "Standard", "£5,000 – £5,129 Around £5,055 · 4 weeks"],
    ];
    for (const [goal, platform, feats, pace, expected] of cases) {
      await page.goto(URL);
      await expect(page.locator("#cookie-title")).toBeVisible();
      await rejectCookies(page);
      expect(await run(page, goal, platform, feats, pace)).toBe(expected);
    }
  });

  test("navigation: step bar, back, adjust answers, start over and edit", async ({ page }) => {
    await open(page);
    await details(page);
    await next(page).click();
    await next(page).click();
    await page.getByRole("button", { name: /^Payments/ }).click();
    await next(page).click();
    await page.getByRole("button", { name: "See my estimate" }).click();
    // Jump back through the step bar, features stay selected
    await page.getByRole("button", { name: "Features", exact: true }).click();
    await expect(page.getByRole("button", { name: /^Payments/ })).toHaveAttribute("aria-pressed", "true");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "Which platform do you need?" })).toBeVisible();
    await page.getByRole("button", { name: "Estimate", exact: true }).click();
    await page.getByRole("button", { name: "Adjust answers" }).click();
    await expect(page.getByRole("heading", { name: "What would you like to do?" })).toBeVisible();
    await page.getByRole("button", { name: "Estimate", exact: true }).click();
    await page.getByRole("button", { name: "Edit" }).click();
    await expect(page.getByRole("heading", { name: "First, a little about you." })).toBeVisible();
    await expect(page.locator('input[autocomplete="name"]')).toHaveValue("Test User");
    await page.getByRole("button", { name: "Start my estimate" }).click();
    await page.getByRole("button", { name: "Start over" }).click();
    await expect(page.getByText("Step 1 of 6")).toBeVisible();
    await expect(page.getByRole("button", { name: "Start over" })).toHaveCount(0);
  });

  test("FAQ accordion opens one answer at a time", async ({ page }) => {
    await open(page);
    const q1 = page.getByRole("button", { name: "How accurate is the calculator?" });
    const q2 = page.getByRole("button", { name: "What affects the cost of an MVP?" });
    await q1.scrollIntoViewIfNeeded();
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("The number of core features, web or mobile")).toBeVisible();
  });

  test("shared header and floating widgets work on this page", async ({ page }) => {
    await open(page);
    await page.locator("header nav button", { hasText: "Services" }).hover();
    await expect(page.locator("[data-nav-panel]:not(.hidden)")).toContainText("All services");
    await page.mouse.move(700, 800);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(page.locator("header nav")).toHaveClass(/bg-white\/95/);
    await expect(page.locator(".chat-launcher")).toBeVisible();
    await expect(page.locator("a.dock-link")).toHaveCount(2);
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

test.describe("MVP cost calculator on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("fits the screen and shows the estimate row", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await details(page);
    await next(page).click();
    await expect(page.locator(".lg\\:hidden", { hasText: "Pick features" })).toBeVisible();
    await next(page).click();
    await page.getByRole("button", { name: /^Payments/ }).click();
    await expect(page.locator(".lg\\:hidden", { hasText: "£" }).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
