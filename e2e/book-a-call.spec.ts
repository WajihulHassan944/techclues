import { test, expect, type Page } from "@playwright/test";

test.use({ timezoneId: "Europe/London", locale: "en-GB" });

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, path = "/book-a-call") {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto(path);
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const days = (page: Page) => page.locator('button[aria-label*="available"]');
const times = (page: Page) => page.locator("ul[data-lenis-prevent] > li > div > button:first-child");
const nextBtn = (page: Page) => page.locator('button[aria-label^="Next: book"]:not([inert])');

test.describe("book a call page", () => {
  test("renders the intro, steps and trust badge with metadata", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Book a free MVP strategy call | TechClues");
    await expect(page.locator("h1")).toHaveText("Let's talk aboutyour idea.");
    const main = page.locator("main");
    for (const t of ["Free MVP strategy call.", "30 minutes", "Video call", "Free, no obligation", "We review your idea", "We define your MVP strategy", "We deliver your roadmap", "4.3", "Trustpilot", "Instant confirmation and a calendar invite by email"]) await expect(main).toContainText(t);
    await expect(page.locator('a[href="https://uk.trustpilot.com/review/techclues.co.uk"]')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("calendar offers weekday slots from 9:00 to 17:00 London time", async ({ page }) => {
    await open(page);
    await expect(page.getByRole("heading", { name: "Choose a time" })).toBeVisible();
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    expect(await days(page).count()).toBeGreaterThan(5);
    for (const l of await days(page).evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")!))) expect(l).not.toMatch(/^(Saturday|Sunday)/);
    await expect(times(page)).toHaveCount(17);
    await expect(times(page).first()).toHaveText("9:00");
    await expect(times(page).last()).toHaveText("17:00");
    await expect(page.getByRole("combobox", { name: "Time zone" })).toHaveValue("Europe/London");
  });

  test("choosing a day lists its times and a time reveals Next", async ({ page }) => {
    await open(page);
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    await days(page).nth(2).click();
    await expect(days(page).nth(2)).toHaveAttribute("aria-pressed", "true");
    await expect(days(page).first()).toHaveAttribute("aria-pressed", "false");
    const t = times(page).nth(3);
    await t.click();
    await expect(t).toHaveAttribute("aria-pressed", "true");
    await expect(nextBtn(page)).toHaveCount(1);
    await expect(nextBtn(page)).toBeVisible();
  });

  test("month arrows: previous is disabled in the current month, next moves on and back", async ({ page }) => {
    await open(page);
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    const title = page.locator("h3[aria-live]");
    const first = await title.textContent();
    await expect(page.getByRole("button", { name: "Previous month" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Next month" })).toBeEnabled();
    await page.getByRole("button", { name: "Next month" }).click();
    await expect(title).not.toHaveText(first!);
    await page.getByRole("button", { name: "Previous month" }).click();
    await expect(title).toHaveText(first!);
  });

  test("time zone change updates the listed times", async ({ page }) => {
    await open(page);
    await expect(times(page).first()).toBeVisible({ timeout: 10_000 });
    const before = await times(page).first().textContent();
    await page.getByRole("combobox", { name: "Time zone" }).selectOption("America/New_York");
    await expect(times(page).first()).toBeVisible({ timeout: 10_000 });
    await expect(times(page).first()).not.toHaveText(before!);
  });

  test("details step validates, goes back, and confirms without sending anything", async ({ page }) => {
    await open(page);
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    await times(page).nth(1).click();
    await nextBtn(page).click();
    await expect(page.getByRole("heading", { name: "Your details" })).toBeVisible();
    await expect(page.getByText("Free MVP strategy call · 30 min · London time")).toBeVisible();
    await page.getByRole("button", { name: "Confirm booking" }).click();
    await expect(page.getByText("Add your name.")).toBeVisible();
    await expect(page.getByText("Check your email address.")).toBeVisible();
    await page.getByRole("button", { name: "Change time" }).click();
    await expect(page.getByRole("heading", { name: "Choose a time" })).toBeVisible();
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    await times(page).nth(1).click();
    await nextBtn(page).click();
    await page.locator("#booking-name").fill("Sam Taylor");
    await page.locator("#booking-email").fill("sam@example.com");
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") posts.push(r.url());
    });
    await page.getByRole("button", { name: "Confirm booking" }).click();
    await expect(page.getByRole("heading", { name: "You're booked, Sam." })).toBeVisible({ timeout: 8000 });
    await expect(page.getByText("sam@example.com")).toBeVisible();
    for (const t of ["30 minutes", "Add to Google Calendar", "Apple or Outlook calendar", "Reschedule or cancel"]) await expect(page.locator("main")).toContainText(t);
    expect(posts).toEqual([]);
  });

  test("name and email are prefilled from the query string", async ({ page }) => {
    await open(page, "/book-a-call?name=Ada%20Lovelace&email=ada@example.com");
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    await times(page).first().click();
    await nextBtn(page).click();
    await expect(page.locator("#booking-name")).toHaveValue("Ada Lovelace");
    await expect(page.locator("#booking-email")).toHaveValue("ada@example.com");
  });

  test("reached from the site header without a reload", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 9));
    await page.locator('a[href="/book-a-call"]').first().click();
    await expect(page).toHaveURL(/\/book-a-call$/);
    await expect(page.getByRole("heading", { name: "Choose a time" })).toBeVisible({ timeout: 10_000 });
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(9);
  });
});

test.describe("book a call on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("fits the screen and lists times below the calendar", async ({ page }) => {
    await open(page);
    await expect(days(page).first()).toBeVisible({ timeout: 10_000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(times(page).first()).toBeAttached();
  });
});
