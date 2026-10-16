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
  await page.goto("/kill-my-idea");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const IDEA = "An app that lets dental clinics fill last-minute cancellations from a waiting list.";
const next = (page: Page) => page.getByRole("button", { name: "Continue" });

async function toStep3(page: Page, picks: { customer?: string; alternatives?: string; problem?: string; edge?: string } = {}) {
  await page.locator("textarea").fill(IDEA);
  if (picks.customer) await page.getByRole("radio", { name: picks.customer }).click();
  await next(page).click();
  if (picks.alternatives) await page.getByRole("radio", { name: picks.alternatives }).click();
  if (picks.problem) await page.getByRole("radio", { name: picks.problem }).click();
  if (picks.edge) await page.getByRole("radio", { name: picks.edge }).click();
  await next(page).click();
  await expect(page.getByRole("heading", { name: "What must the first version do?" })).toBeVisible();
}

async function submit(page: Page) {
  await page.getByPlaceholder("Full name", { exact: true }).first().fill("Sam Example");
  await page.getByPlaceholder("Email address", { exact: true }).first().fill("sam@example.com");
  await page.getByRole("button", { name: "Try and kill it" }).click();
}

test.describe("kill my idea page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Kill My Idea | Free Tool to Validate Your Startup Idea");
    await expect(page.locator("h1")).toContainText("Sure your idea is brilliant?");
    await expect(page.locator("h1")).toContainText("Spare two minutes; we’ll tear it apart.");
    await expect(page.getByText("Products tend to fall over on the same few assumptions.")).toBeVisible();
    await expect(page.getByText("Step 1 of 3")).toBeVisible();
    for (const t of ["Two minutes", "Seven vulnerable areas", "Frank, never harsh"]) await expect(page.locator('section[aria-label="How it works"]')).toContainText(t);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("step one needs a real idea before Next works", async ({ page }) => {
    await open(page);
    await expect(next(page)).toBeDisabled();
    await expect(page.getByText("Please add a little more detail.")).toBeVisible();
    await page.locator("textarea").fill("too short");
    await expect(next(page)).toBeDisabled();
    await page.locator("textarea").fill("An app for dog walkers in cities");
    await expect(page.getByText("That is enough.")).toBeVisible();
    await expect(next(page)).toBeEnabled();
    // "Who is it for" starts on a specific job role and can be changed
    await expect(page.getByRole("radio", { name: "A particular job role" })).toHaveAttribute("aria-checked", "true");
    await page.getByRole("radio", { name: "Nearly everyone" }).click();
    await expect(page.getByRole("radio", { name: "Nearly everyone" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("radio", { name: "A particular job role" })).toHaveAttribute("aria-checked", "false");
  });

  test("steps move forward and back, and the progress bar follows", async ({ page }) => {
    await open(page);
    const bars = page.locator("main ol").first().locator("li > span");
    await expect(bars.nth(1)).toHaveCSS("width", "0px");
    await page.locator("textarea").fill(IDEA);
    await next(page).click();
    await expect(page.getByText("Step 2 of 3")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your market" })).toBeVisible();
    await expect(bars.nth(1)).not.toHaveCSS("width", "0px");
    await page.getByRole("button", { name: "Back" }).click();
    await expect(page.getByText("Step 1 of 3")).toBeVisible();
    await expect(page.locator("textarea")).toHaveValue(IDEA); // answers are kept
    await next(page).click();
    await next(page).click();
    await expect(page.getByText("Step 3 of 3")).toBeVisible();
    await expect(page.getByRole("button", { name: "Try and kill it" })).toBeDisabled();
  });

  test("the last step needs a name and a valid email", async ({ page }) => {
    await open(page);
    await toStep3(page);
    const go = page.getByRole("button", { name: "Try and kill it" });
    await page.getByPlaceholder("Full name", { exact: true }).first().fill("Sam");
    await page.getByPlaceholder("Email address", { exact: true }).first().fill("nope");
    await expect(go).toBeDisabled();
    await page.getByPlaceholder("Email address", { exact: true }).first().fill("sam@example.com");
    await expect(go).toBeEnabled();
    await page.getByRole("button", { name: "Real-time chat" }).click();
    await page.getByRole("button", { name: "Payments" }).click();
    await expect(page.getByText("2 selected. Fewer is normally better.")).toBeVisible();
    await page.getByRole("button", { name: "Payments" }).click();
    await expect(page.getByText("1 selected. Fewer is normally better.")).toBeVisible();
  });

  test("a sound idea survives", async ({ page }) => {
    await open(page);
    await toStep3(page);
    await submit(page);
    await expect(page.getByRole("status", { name: "Stress testing your idea" })).toBeVisible();
    await expect(page.getByText("Hunting for weak points…")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Your idea held up." })).toBeVisible({ timeout: 6000 });
    await expect(page.getByText("Your verdict", { exact: true })).toBeVisible();
    await expect(page.getByText(`“${IDEA}”`)).toBeVisible();
    for (const t of ["Intended customer", "Current alternatives", "Central problem", "What sets you apart", "MVP scope", "Possible risks"]) await expect(page.getByRole("heading", { name: t })).toBeVisible();
    await expect(page.getByText("Stands firm", { exact: true })).toHaveCount(5);
    await expect(page.getByText("Soft spot", { exact: true })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Questions to settle before you build" })).toBeVisible();
    await expect(page.getByRole("link", { name: /Get in touch/ })).toHaveAttribute("href", "/book-a-call");
    await expect(page.getByRole("link", { name: /BUILD.ONE for £499/ })).toHaveAttribute("href", "/zero-one");
    await expect(page.getByText("As a guide, the scope you chose")).toHaveCount(0); // no features picked
  });

  test("a risky idea is called out and priced", async ({ page }) => {
    await open(page);
    await toStep3(page, { customer: "Nearly everyone", alternatives: "Nothing that I know of", problem: "It would be a pleasant extra", edge: "To be honest, I am not sure yet" });
    for (const f of ["Real-time chat", "AI features", "Payments", "Sign up & log in", "Admin panel"]) await page.getByRole("button", { name: f }).click();
    await submit(page);
    await expect(page.getByRole("heading", { name: "This is the one we would kill first." })).toBeVisible({ timeout: 6000 });
    await expect(page.getByText("Soft spot", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("5 features makes a full product, not a minimum viable one.")).toBeVisible();
    await expect(page.getByText(/Nearly everyone” is the commonest way for an MVP to die/)).toBeVisible();
    await expect(page.getByText(/As a guide, the scope you chose would cost around £[\d,]+–£[\d,]+ to build as a web MVP\./)).toBeVisible();
    await expect(page.getByRole("link", { name: "Sharpen the estimate" })).toHaveAttribute("href", "/mvp-cost-calculator");
  });

  test("a middling idea is wounded but standing", async ({ page }) => {
    await open(page);
    await toStep3(page, { alternatives: "Large platforms already in daily use", problem: "It irritates them every day" });
    await page.getByRole("button", { name: "Payments" }).click();
    await submit(page);
    await expect(page.getByRole("heading", { name: "Bruised, but still upright." })).toBeVisible({ timeout: 6000 });
    await expect(page.getByText("Keep an eye on this", { exact: true }).first()).toBeVisible();
    await expect(page.getByText(/payments adds noticeable cost and testing/)).toBeVisible();
  });

  test("Start again clears the answers and goes back to step one", async ({ page }) => {
    await open(page);
    await toStep3(page);
    await submit(page);
    await expect(page.getByRole("heading", { name: "Your idea held up." })).toBeVisible({ timeout: 6000 });
    await page.getByRole("button", { name: "Begin again" }).click();
    await expect(page.getByText("Step 1 of 3")).toBeVisible();
    await expect(page.locator("textarea")).toHaveValue("");
    await expect(next(page)).toBeDisabled();
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

test.describe("kill my idea on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen through the steps and the verdict", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await toStep3(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await submit(page);
    await expect(page.getByRole("heading", { name: "Your idea held up." })).toBeVisible({ timeout: 6000 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});

test("an idea passed in the URL is prefilled", async ({ page }) => {
  await page.goto("/kill-my-idea?idea=website%20for%20a%20bakery");
  await expect(page.locator("textarea").first()).toHaveValue("website for a bakery");
});
