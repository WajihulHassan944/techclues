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
  await page.goto("/partners");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const EARN = 'section[aria-label="What you\'d earn"]';
const result = (page: Page) => page.locator(`${EARN} [aria-live=polite]`);
const value = (page: Page) => page.locator(`${EARN} [aria-live=polite] p`).nth(1);

test.describe("partners page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Partner Referral Programme | Earn 10% for Introductions");
    await expect(page.locator("h1")).toContainText("Introduce a project.");
    await expect(page.locator("h1")).toContainText("Earn 10% of it.");
    for (const t of ["10% of project fees", "Up to £5,000 a referral", "Paid as the client pays", "Every service counts"]) await expect(page.locator("main").first()).toContainText(t);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has every section in order", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual(["Partner Referral Programme", "What you'd earn", "Commission by project", "How it works", "Join or refer a client", "Programme rules"]);
  });

  test("calculator starts on a Lean MVP and shows 10% of £5,000", async ({ page }) => {
    await open(page);
    await page.locator(EARN).scrollIntoViewIfNeeded();
    await expect(value(page)).toHaveText("£500");
    await expect(result(page)).toContainText("MVPs & Custom Platforms · Lean MVP");
    await expect(result(page)).toContainText("10% of £5,000");
    await expect(page.locator(`${EARN} input[type=number]`)).toHaveValue("5000");
  });

  test("changing the package, value and partner level updates what you'd earn", async ({ page }) => {
    await open(page);
    await page.locator(EARN).scrollIntoViewIfNeeded();
    await page.locator(EARN).getByRole("button", { name: /Custom \/ SaaS/ }).click();
    await expect(page.locator(`${EARN} input[type=number]`)).toHaveValue("10000");
    await expect(value(page)).toHaveText("£1,000", { timeout: 3000 });
    await page.getByRole("radio", { name: "Pro partner" }).click();
    await expect(value(page)).toHaveText("£1,250", { timeout: 3000 });
    await expect(result(page)).toContainText("12.5% of £10,000");
    // above £20,000 the rate drops to 5%
    await page.locator(`${EARN} input[type=number]`).fill("30000");
    await expect(value(page)).toHaveText(`£3,000`, { timeout: 3000 }); // 12.5% of 20k = 2,500 + 5% of 10k = 500
    await expect(result(page)).toContainText("5% of the £10,000 above that");
    // capped at £5,000
    await page.locator(`${EARN} input[type=number]`).fill("200000");
    await expect(value(page)).toHaveText("£5,000", { timeout: 3000 });
    await expect(result(page)).toContainText("Capped at £5,000 a referral");
  });

  test("monthly services count six months, and ZERO.ONE is a flat £50", async ({ page }) => {
    await open(page);
    await page.locator(EARN).scrollIntoViewIfNeeded();
    await page.locator(EARN).getByRole("button", { name: "Performance Marketing" }).click();
    await expect(page.locator(`${EARN} input[type=number]`)).toHaveValue("1250");
    await expect(value(page)).toHaveText("£750", { timeout: 3000 }); // 10% of 6 x 1,250
    await expect(result(page)).toContainText("of 6 months' fees");
    await expect(result(page)).toContainText("and ad spend");
    await page.locator(EARN).getByRole("button", { name: "ZERO.ONE" }).click();
    await expect(value(page)).toHaveText("£50", { timeout: 3000 });
    await expect(page.locator(`${EARN} input[type=number]`)).toBeDisabled();
    await expect(result(page)).toContainText("Flat fee for a ZERO.ONE");
  });

  test("the AI service is not offered in the calculator or the table", async ({ page }) => {
    await open(page);
    await expect(page.locator("main")).not.toContainText("AI Integration & Automation");
  });

  test("commission table lists every project type", async ({ page }) => {
    await open(page);
    const t = page.locator('section[aria-label="Commission by project"]');
    for (const x of ["£2,500–£10,000+", "£250–£1,000+", "£313–£1,250+", "Web & Mobile Apps", "£750–£2,000+/mo", "£50 fixed", "Grant application support", "10% of our fee"]) await expect(t).toContainText(x);
  });

  test("how it works lists the four steps", async ({ page }) => {
    await open(page);
    const h = page.locator('section[aria-label="How it works"]');
    for (const x of ["Apply to join", "Introduce a client", "We confirm it in writing", "Get paid"]) await expect(h).toContainText(x);
  });

  test("join form checks required fields and shows the original messages", async ({ page }) => {
    await open(page);
    const form = page.locator("#join form");
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("button", { name: "Apply to join" }).click();
    await expect(form.getByText("Add your name.")).toBeVisible();
    await expect(form.getByText("Check your email address.")).toBeVisible();
    await expect(form.getByText("Choose what describes you best.")).toBeVisible();
    await expect(form.getByText("Please confirm you've read the programme rules.")).toBeVisible();
    await expect(form.locator('[data-field="name"]')).toBeFocused();
    await form.locator('[data-field="name"]').fill("Sam");
    await expect(form.getByText("Add your name.")).toHaveCount(0); // clears as you type
    await form.locator('[data-field="email"]').fill("nope");
    await form.getByRole("button", { name: "Freelancer" }).click();
    await expect(form.getByRole("button", { name: "Freelancer" })).toHaveAttribute("aria-pressed", "true");
    await form.getByRole("button", { name: "Freelancer" }).click();
    await expect(form.getByRole("button", { name: "Freelancer" })).toHaveAttribute("aria-pressed", "false"); // click again to unselect
    await form.getByRole("button", { name: "Apply to join" }).click();
    await expect(form.getByText("Check your email address.")).toBeVisible();
  });

  test("refer form has its own fields and checks", async ({ page }) => {
    await open(page);
    const form = page.locator("#join form");
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("tab", { name: "Refer a client" }).click();
    await expect(form.getByRole("tab", { name: "Refer a client" })).toHaveAttribute("aria-selected", "true");
    await expect(form.getByText("Already a partner? Introduce a client here, with their permission.")).toBeVisible();
    await expect(form.getByText("The client", { exact: true })).toBeVisible();
    await form.getByRole("button", { name: "Send the referral" }).click();
    for (const m of ["Add the client's name.", "Check the client's email address.", "Choose the type of project.", "Please confirm the client has agreed to be contacted."]) await expect(form.getByText(m)).toBeVisible();
    await form.locator("select").first().selectOption("Web & Mobile Apps");
    await expect(form.getByText("Choose the type of project.")).toHaveCount(0);
    await form.getByRole("tab", { name: "Become a partner" }).click();
    await expect(form.getByText("Add the client's name.")).toHaveCount(0); // errors reset when switching
  });

  test("programme rules accordion opens one answer at a time", async ({ page }) => {
    await open(page);
    const rules = page.locator('section[aria-label="Programme rules"]');
    await rules.scrollIntoViewIfNeeded();
    await expect(rules.getByRole("button")).toHaveCount(9);
    await expect(rules.getByRole("button", { name: "Who can join?" })).toHaveAttribute("aria-expanded", "true");
    await rules.getByRole("button", { name: "When and how am I paid?" }).click();
    await expect(rules.getByRole("button", { name: "When and how am I paid?" })).toHaveAttribute("aria-expanded", "true");
    await expect(rules.getByRole("button", { name: "Who can join?" })).toHaveAttribute("aria-expanded", "false");
  });

  test("the form's rules link and the hero buttons jump to their sections", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "See what you'd earn" }).click();
    await expect.poll(() => page.evaluate(() => document.querySelector("#earnings")!.getBoundingClientRect().top), { timeout: 5000 }).toBeLessThan(250);
    await page.getByRole("link", { name: "Become a partner" }).first().click();
    await expect.poll(() => page.evaluate(() => document.querySelector("#join")!.getBoundingClientRect().top), { timeout: 5000 }).toBeLessThan(250);
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

test.describe("partners page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    for (const sel of [EARN, 'section[aria-label="Commission by project"]', "#join"]) {
      await page.locator(sel).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
});
