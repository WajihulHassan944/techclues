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
  await page.goto("/services/ai-enablement");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

test.describe("service page: ai-enablement — AI at work widget", () => {
  test("renders with metadata, h1 and no console errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("UK AI Integration Services for Businesses | TechClues");
    await expect(page.locator("h1")).toContainText("Services for AI integration");
    await expect(page.locator("h1")).toContainText("AI worth its place inside your product.");
    expect(errors).toEqual([]);
  });

  test("has no horizontal overflow at 390px wide", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await open(page);
    const fits = await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    expect(fits).toBe(true);
  });

  test("job tabs are keyboard accessible and switch the feed panel", async ({ page }) => {
    await open(page);
    const widget = page.locator('section[aria-label="AI at work"]');
    await widget.scrollIntoViewIfNeeded();

    const tabs = widget.getByRole("tab");
    await expect(tabs).toHaveCount(4);
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    for (const tab of await tabs.all()) await expect(tab).toHaveAttribute("aria-controls", "ai-feed");

    const feed = widget.locator("#ai-feed");
    await expect(feed).toContainText("A fresh enquiry arrives");

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");
    await expect(feed).toContainText("An invoice comes in from a supplier");
    await expect(feed.getByRole("heading", { name: "An invoice comes in from a supplier" })).toBeVisible();
  });

  test("steps auto-advance while the widget is in view", async ({ page }) => {
    await open(page);
    const widget = page.locator('section[aria-label="AI at work"]');
    await widget.scrollIntoViewIfNeeded();
    const feed = widget.locator("#ai-feed");

    // Step 0 ("now") starts on the first line of the enquiry job.
    await expect(feed.locator("li").first()).toContainText("Opens the new enquiry in Gmail");
    // After the first step's 1600ms delay it should have advanced onto the second line.
    await page.waitForTimeout(2200);
    await expect(feed.locator("li").nth(1)).toContainText("Looks up the customer's past activity in HubSpot");
  });

  test("clicking a tab stops the loop and shows a Replay button at the end", async ({ page }) => {
    await open(page);
    const widget = page.locator('section[aria-label="AI at work"]');
    await widget.scrollIntoViewIfNeeded();
    await widget.getByRole("tab", { name: "Invoices" }).click();

    const replay = widget.getByRole("button", { name: "Replay" });
    await expect(replay).toHaveCount(0);
    // The invoice job has 6 steps; the "you" step pauses for 2400ms, the rest for 1600ms.
    await page.waitForTimeout(6 * 1700 + 2400);
    await expect(replay).toBeVisible();

    await replay.click();
    await expect(widget.locator("#ai-feed li").first()).toContainText("Collects the PDF invoice from Gmail");
  });

  test("respects prefers-reduced-motion by showing the completed state with no timers", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await open(page);
    const widget = page.locator('section[aria-label="AI at work"]');
    await widget.scrollIntoViewIfNeeded();
    const feed = widget.locator("#ai-feed");

    await expect(feed.getByText("Approved")).toBeVisible();
    const doneIcons = feed.locator("li svg.size-3\\.5");
    const initialCount = await doneIcons.count();
    await page.waitForTimeout(2000);
    await expect(doneIcons).toHaveCount(initialCount);
  });

  test("FAQ accordion shows the 7 ai-enablement questions from the backend", async ({ page }) => {
    await open(page);
    const faq = page.locator('section[aria-label="Questions"]');
    await faq.scrollIntoViewIfNeeded();
    await expect(faq.getByRole("button")).toHaveCount(7);
    await expect(faq).toContainText("How much does it cost?");
    await expect(faq).toContainText("Which models do you use?");
  });

  test("navigates here from the header, footer, homepage and services page without a reload", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 1));

    await page.locator("header nav").getByRole("button", { name: "Services" }).hover();
    await page.locator("header [data-nav-panel]").getByRole("link", { name: "AI Integration & Automation" }).click();
    await expect(page).toHaveURL(/\/services\/ai-enablement$/);
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(1);

    await page.goBack();
    await expect(page).toHaveURL(/\/$/);
    await page.locator("#ai").getByRole("link", { name: "AI services" }).click();
    await expect(page).toHaveURL(/\/services\/ai-enablement$/);
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(1);

    await page.goto("/services");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 2));
    await page.locator("#ai-enablement").getByRole("link", { name: /Find out more/ }).click();
    await expect(page).toHaveURL(/\/services\/ai-enablement$/);
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(2);

    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.locator("footer").getByRole("link", { name: "AI Integration & Automation" }).click();
    await expect(page).toHaveURL(/\/services\/ai-enablement$/);
  });
});
