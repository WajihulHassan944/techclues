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
  await page.goto("/contact");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const MAP = 'section[aria-label="Where we are"]';

test.describe("contact page", () => {
  test("renders with metadata, intro, contact details and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Contact Vebryx | Book a Free MVP Strategy Call");
    await expect(page.locator("h1")).toContainText("Let's build");
    await expect(page.locator("h1")).toContainText("something together.");
    await expect(page.getByText("Tell us about your idea. We'll get back to you within a few hours.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Book a free 30-minute call" })).toHaveAttribute("href", "/book-a-call");
    const main = page.locator("main");
    await expect(main.getByRole("link", { name: "sales@vebryx.co.uk" })).toHaveAttribute("href", "mailto:sales@vebryx.co.uk");
    await expect(main.getByRole("link", { name: "info@vebryx.co.uk" })).toHaveAttribute("href", "mailto:info@vebryx.co.uk");
    await expect(main.getByRole("link", { name: "+44 7446 478755" })).toHaveAttribute("href", "tel:+447446478755");
    await expect(main.getByRole("link", { name: "+44 7447 782891" })).toHaveAttribute("href", "https://wa.me/447447782891");
    await expect(main).toContainText("40 Plantation Square, Glasgow, G51 1TQ, United Kingdom");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("need chips toggle, several at once, and Other adds a focused field", async ({ page }) => {
    await open(page);
    const form = page.locator("form[data-form=contact]");
    await form.scrollIntoViewIfNeeded();
    for (const n of ["MVP", "Web or mobile app", "UI/UX design", "Low-code", "Branding", "Marketing", "Other"]) await expect(form.getByRole("button", { name: n, exact: true })).toBeVisible();
    const mvp = form.getByRole("button", { name: "MVP", exact: true });
    await mvp.click();
    await form.getByRole("button", { name: "Branding" }).click();
    await expect(mvp).toHaveAttribute("aria-pressed", "true");
    await expect(mvp).toHaveClass(/bg-brand/);
    await expect(mvp.locator("svg")).toHaveCount(1);
    await expect(form.locator("button[aria-pressed=true]")).toHaveCount(2);
    await mvp.click();
    await expect(mvp).toHaveAttribute("aria-pressed", "false");
    await expect(form.locator("input[name=other]")).toHaveCount(0);
    await form.getByRole("button", { name: "Other" }).click();
    await expect(form.locator("input[name=other]")).toBeFocused();
    await expect(form.getByText("What else do you need?")).toBeVisible();
    await form.getByRole("button", { name: "Other" }).click();
    await expect(form.locator("input[name=other]")).toHaveCount(0);
  });

  test("budget allows one choice at a time and can be cleared", async ({ page }) => {
    await open(page);
    const form = page.locator("form[data-form=contact]");
    await form.scrollIntoViewIfNeeded();
    for (const b of ["Under £6k", "£6k–£15k", "£15k–£40k", "£40k+", "Not sure yet"]) await expect(form.getByRole("button", { name: b })).toBeVisible();
    await form.getByRole("button", { name: "£6k–£15k" }).click();
    await form.getByRole("button", { name: "£40k+" }).click();
    await expect(form.getByRole("button", { name: "£6k–£15k" })).toHaveAttribute("aria-pressed", "false");
    await expect(form.getByRole("button", { name: "£40k+" })).toHaveAttribute("aria-pressed", "true");
    await form.getByRole("button", { name: "£40k+" }).click();
    await expect(form.getByRole("button", { name: "£40k+" })).toHaveAttribute("aria-pressed", "false");
  });

  test("required fields are checked and the form does not leave the page", async ({ page }) => {
    await open(page);
    const form = page.locator("form[data-form=contact]");
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    expect(await form.locator("input[name=name]").evaluate((e) => (e as HTMLInputElement).validity.valueMissing)).toBe(true);
    await form.locator("input[name=name]").fill("Sam Example");
    await form.locator("input[name=email]").fill("sam@example.com");
    await form.locator("textarea[name=message]").fill("An app for dog walkers.");
    await form.locator("input[name=consent]").check();
    expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(true);
    await form.getByRole("button", { name: "Send enquiry" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await expect(form.getByText("We reply within a few hours.")).toBeVisible();
    await expect(form.getByRole("link", { name: "terms & conditions" })).toHaveAttribute("href", "/terms-conditions");
    await expect(form.getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/privacy-policy");
  });

  test("map starts on Glasgow and hovering Karachi moves the highlight", async ({ page }) => {
    await open(page);
    const map = page.locator(MAP);
    await map.scrollIntoViewIfNeeded();
    const cards = map.locator(".sm\\:grid-cols-2 > div");
    await expect(cards.nth(0)).toHaveClass(/border-brand/);
    await expect(cards.nth(1)).not.toHaveClass(/border-brand/);
    const karachi = map.getByRole("button", { name: "Karachi, PK, Production studio" });
    await karachi.hover();
    await expect(cards.nth(1)).toHaveClass(/border-brand/);
    await expect(cards.nth(0)).not.toHaveClass(/border-brand/);
    await expect(karachi.locator("> span > span").first()).toHaveClass(/bg-white /);
    await map.getByRole("button", { name: "Glasgow, UK, Headquarters" }).focus();
    await expect(cards.nth(0)).toHaveClass(/border-brand/);
    await cards.nth(1).hover();
    await expect(cards.nth(1)).toHaveClass(/border-brand/);
  });

  test("each location shows its current local time", async ({ page }) => {
    await page.clock.install({ time: new Date("2026-07-01T12:30:00Z") });
    await open(page);
    const times = page.locator(`${MAP} p.tabular-nums`);
    await expect(times).toHaveCount(2);
    // Glasgow is on BST (UTC+1) in July, Karachi is UTC+5.
    await expect(times.nth(0)).toHaveText("13:30");
    await expect(times.nth(1)).toHaveText("17:30");
    await page.clock.fastForward(31 * 60_000);
    await expect(times.nth(0)).toHaveText("14:01");
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
});

test.describe("contact page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    await page.locator(MAP).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
