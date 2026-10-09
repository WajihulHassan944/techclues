import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

test.describe("client-side navigation", () => {
  test("header links move between pages without reloading the site", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 42));

    // Services dropdown -> service page
    await page.locator("header nav").getByRole("button", { name: "Services" }).hover();
    await page.locator("header [data-nav-panel]").getByRole("link", { name: "Performance Marketing" }).click();
    await expect(page).toHaveURL(/\/services\/performance-marketing$/);
    await expect(page.locator("h1")).toContainText("Find your first users");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(42);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(5);

    // Logo -> home
    await page.locator("header").getByRole("link", { name: /vebryx/i }).first().click();
    await expect(page).toHaveURL(/\/$/);
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(42);

    // Scroll reveal and the nav still work on the page we arrived at.
    await page.locator("header nav").getByRole("link", { name: "MVP cost calculator" }).click();
    await expect(page).toHaveURL(/\/mvp-cost-calculator$/);
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(42);
  });

  test("revealed sections, dropdown and back button keep working after navigating", async ({ page }) => {
    await page.goto("/services");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 7));
    await page.locator("#mvp-development").getByRole("link", { name: /Learn more/ }).click();
    await expect(page).toHaveURL(/\/services\/mvp-development$/);
    await page.locator("section[aria-label='Pricing']").scrollIntoViewIfNeeded();
    await expect(page.locator("section[aria-label='Pricing'] [data-reveal]").first()).toHaveAttribute("data-shown", "");
    await page.locator("header nav").getByRole("button", { name: "Services" }).hover();
    await expect(page.locator("header [data-nav-panel]:not(.hidden)")).toHaveCount(1);
    await page.goBack();
    await expect(page).toHaveURL(/\/services$/);
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(7);
  });

  test("the removed AI service is gone from the dropdown, footer and services page", async ({ page }) => {
    await page.goto("/services");
    await expect(page.getByText("AI Integration & Automation")).toHaveCount(0);
    await expect(page.locator('a[href*="ai-enablement"]')).toHaveCount(0);
  });
});
