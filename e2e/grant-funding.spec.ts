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
  await page.goto("/grant-funding");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const form = (page: Page) => page.locator("form[data-form=grant]");
const cont = (page: Page) => form(page).getByRole("button", { name: "Continue" });

async function fillStep1(page: Page) {
  const f = form(page);
  await f.locator('[data-field="legalName"]').fill("Acme Trading Ltd");
  await f.locator('[data-field="businessType"]').selectOption("Limited company");
  await f.getByRole("button", { name: "Scotland" }).click();
  await f.getByRole("button", { name: "2–9" }).click();
}

test.describe("grant funding page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Help Applying for Grants for UK Tech Projects | TechClues");
    await expect(page.locator("h1")).toContainText("Might your project be");
    await expect(page.locator("h1")).toContainText("grant-funded?");
    for (const t of ["Qualification screening", "Case for investment", "Budgeting and expenses", "Application check", "Describe your company and what you", "We spot what might suit you", "We put the application together alongside you"]) await expect(page.locator("main")).toContainText(t);
    await expect(page.getByText("Funding decisions are made by the grant provider.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Guide to UK funding" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has the form section and the questions", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual(["Grant application support", "Questions"]);
    const faq = page.locator('section[aria-label="Questions"]');
    await faq.scrollIntoViewIfNeeded();
    await expect(faq.getByRole("button")).toHaveCount(5);
    await expect(faq.locator("button[aria-expanded=true]")).toHaveCount(1);
    await faq.getByRole("button").nth(2).click();
    await expect(faq.getByRole("button").nth(2)).toHaveAttribute("aria-expanded", "true");
    await expect(faq.locator("button[aria-expanded=true]")).toHaveCount(1);
  });

  test("starts on step one with every field and option", async ({ page }) => {
    await open(page);
    const f = form(page);
    await f.scrollIntoViewIfNeeded();
    await expect(f).toContainText("Explore your funding options");
    await expect(f).toContainText("Free and without obligation. It takes around two minutes.");
    await expect(f.getByText("About your business", { exact: true })).toBeVisible();
    await expect(f.getByText("Step 1 of 3")).toBeVisible();
    for (const t of ["Company legal name", "Company number", "Business type", "Where is the business located?", "Number of employees", "Annual turnover", "Time trading"]) await expect(f).toContainText(t);
    for (const o of ["Scotland", "England", "Wales", "Northern Ireland", "Outside the UK", "Just me", "2–9", "10–49", "50–249", "250+"]) await expect(f.getByRole("button", { name: o, exact: true })).toBeVisible();
    await expect(f.locator('[data-field="businessType"] option')).toHaveText(["Select…", "Limited company", "LLP", "Sole trader", "Partnership", "Charity or CIC", "Not registered yet"]);
    await expect(f.getByRole("button", { name: "Back" })).toHaveCount(0);
  });

  test("step one shows the original messages for missing answers and clears them as you fill", async ({ page }) => {
    await open(page);
    const f = form(page);
    await f.scrollIntoViewIfNeeded();
    await cont(page).click();
    for (const m of ["Enter the company's legal name.", "Select the type of business.", "Select where the business is based.", "Select the company size."]) await expect(f.getByText(m)).toBeVisible();
    await expect(f.locator('[data-field="legalName"]')).toBeFocused();
    await expect(f.getByText("Step 1 of 3")).toBeVisible(); // did not move on
    await f.locator('[data-field="legalName"]').fill("Acme");
    await expect(f.getByText("Enter the company's legal name.")).toHaveCount(0);
    await f.getByRole("button", { name: "England" }).click();
    await expect(f.getByText("Select where the business is based.")).toHaveCount(0);
    await f.getByRole("button", { name: "England" }).click();
    await expect(f.getByRole("button", { name: "England" })).toHaveAttribute("aria-pressed", "false"); // click again to unselect
  });

  test("the company number is upper-cased and limited to ten characters", async ({ page }) => {
    await open(page);
    const f = form(page);
    await f.scrollIntoViewIfNeeded();
    const no = f.getByPlaceholder("e.g. SC123456");
    await no.fill("sc1234567890123");
    await expect(no).toHaveValue("SC12345678");
  });

  test("moves through the three steps, keeps answers, and Back works", async ({ page }) => {
    await open(page);
    const f = form(page);
    await f.scrollIntoViewIfNeeded();
    await fillStep1(page);
    await cont(page).click();
    await expect(f.getByText("Step 2 of 3")).toBeVisible();
    await expect(f.getByText("About your project", { exact: true })).toBeVisible();
    for (const o of ["Website", "Software platform", "Automation", "AI solution", "Something else"]) await expect(f.getByRole("button", { name: o, exact: true })).toBeVisible();
    for (const t of ["Expected budget", "Preferred start", "Match funding", "Public funding", "Project details"]) await expect(f).toContainText(t);
    await expect(f.getByRole("button", { name: "Back" })).toBeVisible();
    await cont(page).click();
    await expect(f.getByText("Select the kind of project.")).toBeVisible();
    await f.getByRole("button", { name: "Automation" }).click();
    await f.locator("select").nth(1).selectOption("In 1–3 months");
    await cont(page).click();
    await expect(f.getByText("Step 3 of 3")).toBeVisible();
    await expect(f.getByText("Contact details", { exact: true })).toBeVisible();
    await expect(f.getByRole("button", { name: "Review my options" })).toBeVisible();
    await f.getByRole("button", { name: "Back" }).click();
    await expect(f.getByRole("button", { name: "Automation" })).toHaveAttribute("aria-pressed", "true");
    await f.getByRole("button", { name: "Back" }).click();
    await expect(f.locator('[data-field="legalName"]')).toHaveValue("Acme Trading Ltd");
    await expect(f.getByRole("button", { name: "Scotland" })).toHaveAttribute("aria-pressed", "true");
  });

  test("the last step needs a name and a valid email, and sends nothing", async ({ page }) => {
    await open(page);
    const f = form(page);
    await f.scrollIntoViewIfNeeded();
    await fillStep1(page);
    await cont(page).click();
    await f.getByRole("button", { name: "Website" }).click();
    await cont(page).click();
    await f.getByRole("button", { name: "Review my options" }).click();
    await expect(f.getByText("Enter your name.")).toBeVisible();
    await expect(f.getByText("Please check your email address.")).toBeVisible();
    await f.locator('[data-field="name"]').fill("Sam Example");
    await f.locator('[data-field="email"]').fill("nope");
    await f.getByRole("button", { name: "Review my options" }).click();
    await expect(f.getByText("Please check your email address.")).toBeVisible();
    await f.locator('[data-field="email"]').fill("sam@example.com");
    await f.getByRole("button", { name: "Review my options" }).click();
    await expect(f.getByText("Enter your name.")).toHaveCount(0);
    await expect(page).toHaveURL(/\/grant-funding$/);
    await expect(f.getByText("Step 3 of 3")).toBeVisible(); // not wired up: nothing happens
    await expect(f.getByRole("link", { name: "Privacy policy" })).toHaveAttribute("href", "/privacy-policy");
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

test.describe("grant funding page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen through the steps", async ({ page }) => {
    await open(page);
    await form(page).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await fillStep1(page);
    await cont(page).click();
    await expect(form(page).getByText("Step 2 of 3")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
