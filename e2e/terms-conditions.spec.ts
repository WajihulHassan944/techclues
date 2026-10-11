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
  await page.goto("/terms-conditions");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const SECTIONS: [string, string][] = [
  ["1-scope", "1. Scope"],
  ["2-website-use", "2. Website use"],
  ["3-client-responsibilities", "3. Client responsibilities"],
  ["4-fees-and-payments", "4. Fees and payments"],
  ["5-intellectual-property", "5. Intellectual property"],
  ["6-confidentiality", "6. Confidentiality"],
  ["7-third-party-services", "7. Third-party services"],
  ["8-warranties-disclaimer", "8. Warranties disclaimer"],
  ["9-limitation-of-liability", "9. Limitation of liability"],
  ["10-termination", "10. Termination"],
  ["11-data-protection", "11. Data protection"],
  ["12-changes", "12. Changes"],
  ["13-governing-law", "13. Governing law"],
  ["contact-us", "Contact us"],
];

test.describe("terms and conditions page", () => {
  test("renders with metadata, heading, date and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Terms & Conditions | Vebryx");
    await expect(page.locator("h1")).toHaveText("Terms & conditions");
    await expect(page.getByText("Last updated", { exact: false }).first()).toBeVisible();
    await expect(page.locator("time")).toHaveAttribute("datetime", "2026-02-04");
    await expect(page.locator("time")).toHaveText("4 February 2026");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has all fourteen headings with matching anchors in the contents list", async ({ page }) => {
    await open(page);
    const headings = page.locator("main h2");
    await expect(headings).toHaveCount(14);
    const toc = page.getByRole("navigation", { name: "On this page" });
    await expect(toc.getByRole("link")).toHaveCount(14);
    for (const [id, label] of SECTIONS) {
      await expect(page.locator(`main h2[id="${id}"]`)).toHaveText(label);
      await expect(toc.getByRole("link", { name: label, exact: true })).toHaveAttribute("href", `#${id}`);
    }
  });

  test("a contents link scrolls to its section", async ({ page }) => {
    await open(page);
    const toc = page.getByRole("navigation", { name: "On this page" });
    await toc.getByRole("link", { name: "7. Third-party services", exact: true }).click();
    await expect.poll(() => page.evaluate(() => document.getElementById("7-third-party-services")!.getBoundingClientRect().top), { timeout: 6000 }).toBeLessThan(220);
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
    await expect(page.locator("main").getByRole("link", { name: "info@vebryx.co.uk" }).first()).toHaveAttribute("href", "mailto:info@vebryx.co.uk");
    await expect(page.locator('main a[href="/privacy-policy"]').first()).toBeVisible();
    await expect(page.locator('main a[href="/contact"]').first()).toBeVisible();
  });

  test("reached from the site footer without a reload", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 2));
    await page.locator("footer").getByRole("link", { name: "Terms & conditions" }).click();
    await expect(page).toHaveURL(/\/terms-conditions$/);
    await expect(page.locator("h1")).toHaveText("Terms & conditions");
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

test.describe("terms and conditions on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.locator("#contact-us").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
