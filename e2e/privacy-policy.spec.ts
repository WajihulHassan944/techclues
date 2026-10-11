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
  await page.goto("/privacy-policy");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const SECTIONS: [string, string][] = [
  ["1-information-we-collect", "1. Information we collect"],
  ["2-how-we-use-your-information", "2. How we use your information"],
  ["3-how-we-share-your-information", "3. How we share your information"],
  ["4-international-data-transfers", "4. International data transfers"],
  ["5-data-security", "5. Data security"],
  ["6-data-retention", "6. Data retention"],
  ["7-your-legal-rights", "7. Your legal rights"],
  ["8-cookies", "8. Cookies"],
  ["9-third-party-links", "9. Third-party links"],
  ["10-changes-to-this-policy", "10. Changes to this policy"],
  ["contact-us", "Contact us"],
];

test.describe("privacy policy page", () => {
  test("renders with metadata, heading, date and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Privacy Policy | TechClues");
    await expect(page.locator("h1")).toHaveText("Privacy policy");
    await expect(page.getByText("Last updated", { exact: false }).first()).toBeVisible();
    await expect(page.locator("time")).toHaveAttribute("datetime", "2026-10-09");
    await expect(page.locator("time")).toHaveText("9 October 2026");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has all eleven headings with matching anchors in the contents list", async ({ page }) => {
    await open(page);
    const headings = page.locator("main h2");
    await expect(headings).toHaveCount(11);
    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveCount(11);
    for (const [id, label] of SECTIONS) {
      await expect(page.locator(`main h2[id="${id}"]`)).toHaveText(label);
      await expect(toc.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", `#${id}`);
    }
  });

  test("a contents link scrolls to its section", async ({ page }) => {
    await open(page);
    const toc = page.getByRole("navigation", { name: "On this page" });
    await toc.getByRole("link", { name: "8. Cookies", exact: true }).click();
    await expect.poll(() => page.evaluate(() => document.getElementById("8-cookies")!.getBoundingClientRect().top), { timeout: 6000 }).toBeLessThan(220);
    await toc.getByRole("link", { name: "Contact us", exact: true }).click();
    await expect.poll(() => page.evaluate(() => document.getElementById("contact-us")!.getBoundingClientRect().top), { timeout: 6000 }).toBeLessThan(220);
  });

  test("the contents list stays in view while reading", async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.scrollTo(0, 1500));
    await page.waitForTimeout(500);
    const top = await page.getByRole("navigation", { name: "On this page" }).evaluate((e) => e.getBoundingClientRect().top);
    expect(top).toBeGreaterThan(60);
    expect(top).toBeLessThan(200); // sticks just below the header
  });

  test("contact details and cross-links are right", async ({ page }) => {
    await open(page);
    const c = page.locator("#contact-us").locator("xpath=following::ul[1]");
    await expect(c).toContainText("TechClues Limited:");
    await expect(c).toContainText("125 Hazelville Road, Birmingham, England, United Kingdom");
    await expect(c).toContainText("SC879816 (registered in Scotland)");
    await expect(page.locator("main").getByRole("link", { name: "info@techclues.co.uk" }).first()).toHaveAttribute("href", "mailto:info@techclues.co.uk");
    await expect(page.locator('main a[href="/terms-conditions"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/contact"]').first()).toBeVisible();
  });

  test("reached from the site footer without a reload", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 2));
    await page.locator("footer").getByRole("link", { name: "Privacy policy" }).click();
    await expect(page).toHaveURL(/\/privacy-policy$/);
    await expect(page.locator("h1")).toHaveText("Privacy policy");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(2);
  });

  test("scroll reveal shows every visible section", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(70);
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
});

test.describe("privacy policy on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator("#contact-us").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
