import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, path = "/zero-one") {
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

test.describe("ZERO.ONE page", () => {
  test("renders the hero with metadata and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("ZERO.ONE | Build & Test Your Core Feature in a Week | TechClues");
    await expect(page.locator("h1")).toContainText("ZERO.ONE");
    await expect(page.locator("h1")).toContainText("From idea to something real.");
    const main = page.locator("main");
    for (const t of ["From TechClues", "£499", "1 week", "Build → Test → Learn", "4 projects a month · £499 off any build booked within 30 days", "Who it's for", "Two ways to find out", "Why now", "Good ideas don't stay open for long."]) await expect(main).toContainText(t);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("hero letters roll in and settle on the title", async ({ page }) => {
    await open(page);
    await page.waitForTimeout(3200);
    const rolls = page.locator("h1 .zero-roll");
    await expect(rolls).toHaveCount(7);
    const settled = await rolls.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().top - (e.parentElement as HTMLElement).getBoundingClientRect().top)));
    for (const s of settled) expect(s).toBeLessThan(-100);
    await expect(page.locator("h1 .zero-dot")).toBeVisible();
  });

  test("hero buttons scroll to the brief form and the week section", async ({ page }) => {
    await open(page);
    await page.locator('[data-cta="zero-one-hero-brief"]').click();
    await expect(page).toHaveURL(/#brief$/);
    await expect.poll(() => page.evaluate(() => document.getElementById("brief")!.getBoundingClientRect().top), { timeout: 8000 }).toBeLessThan(300);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.getByRole("link", { name: "How the week works" }).click();
    await expect(page).toHaveURL(/#week$/);
  });

  test("cost comparison counts up when scrolled into view", async ({ page }) => {
    await open(page);
    const card = page.locator("div.rounded-\\[24px\\]", { hasText: "Two ways to find out" });
    await expect(card).toContainText("£0");
    await card.scrollIntoViewIfNeeded();
    await expect(card).toContainText("£15,000", { timeout: 8000 });
    await expect(card).toContainText("£499", { timeout: 8000 });
    await expect(card).toContainText("7 days");
    await expect(card.getByText("3%", { exact: true })).toBeVisible();
    await expect(card.getByText("About 3% of the cost, and you know in a week.")).toBeVisible();
  });

  test("brief form checks the fields, then shows the thank-you with a booking link", async ({ page }) => {
    await open(page);
    const form = page.locator('form[data-form="zero_one_brief"]');
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("button", { name: "Send my brief" }).click();
    await expect(form.getByRole("button", { name: "Send my brief" })).toBeVisible();
    await expect(form.locator("textarea[name=idea]:invalid")).toHaveCount(1);
    await form.locator("textarea[name=idea]").fill("An app that fills dental cancellations.");
    await form.locator("input[name=name]").fill("Sam Taylor");
    await form.locator("input[name=email]").fill("sam@example.com");
    await form.locator("input[name=company]").fill("Acme");
    await form.locator("input[name=phone]").fill("07123456789");
    await form.locator("input[name=consent]").check();
    const posts: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST") posts.push(r.url());
    });
    await form.getByRole("button", { name: "Send my brief" }).click();
    await expect(form.getByText("Thanks, your brief is with our team.")).toBeVisible({ timeout: 5000 });
    await expect(form.getByRole("button", { name: /Brief sent/ })).toBeVisible();
    const link = form.locator('[data-cta="zero-one-book-call"]');
    await expect(link).toHaveAttribute("href", /^\/book-a-call\?name=Sam\+Taylor&email=sam%40example\.com&company=Acme&notes=ZERO\.ONE/);
    expect(posts).toEqual([]);
    await link.click();
    await expect(page).toHaveURL(/\/book-a-call\?/);
    await expect(page.getByRole("heading", { name: "Choose a time" })).toBeVisible({ timeout: 10_000 });
  });

  test("floating Book your slot button shows after scrolling, but not over the form", async ({ page }) => {
    await open(page);
    const fab = page.locator('[data-cta="zero-one-floating-slot"]');
    await expect(fab).toHaveCount(0);
    await page.evaluate(() => window.scrollTo(0, 1200));
    await expect(fab).toHaveCount(1);
    await expect(fab).toContainText("Book your slot");
    await expect(fab).toContainText("£499");
    await page.locator("#brief").scrollIntoViewIfNeeded();
    await expect(fab).toHaveCount(0, { timeout: 4000 });
  });

  test("FAQ has the eight questions and the accordion toggles", async ({ page }) => {
    await open(page);
    const faq = page.locator('section[aria-label="Questions"]');
    await faq.scrollIntoViewIfNeeded();
    const qs = faq.locator("button[aria-expanded]");
    await expect(qs).toHaveCount(8);
    await expect(qs.first()).toHaveAttribute("aria-expanded", "true");
    await qs.nth(2).click();
    await expect(qs.nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(qs.first()).toHaveAttribute("aria-expanded", "false");
    await expect(faq).toContainText("Is ZERO.ONE a discount?");
  });

  test("links only go to pages that exist", async ({ page }) => {
    await open(page);
    const hrefs = await page.locator("main a[href^='/']").evaluateAll((els) => [...new Set(els.map((e) => (e as HTMLAnchorElement).getAttribute("href")!.split("#")[0].split("?")[0]))]);
    for (const h of hrefs) expect(["", "/book-a-call", "/grant-funding", "/mvp-cost-calculator", "/privacy-policy", "/services/mvp-development", "/services", "/contact", "/case-studies"]).toContain(h);
  });

  test("scroll reveal settles and images load", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 600) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(70);
    }
    await page.waitForTimeout(500);
    expect(await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src))).toEqual([]);
    expect(await page.evaluate(() => [...document.querySelectorAll("[data-reveal]:not([data-shown])")].filter((el) => el.getBoundingClientRect().width > 0).map((el) => el.className))).toEqual([]);
  });
});

test.describe("ZERO.ONE on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
  });
});
