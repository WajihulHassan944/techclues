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
  await page.goto("/faq");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

// [section id, label, number of questions, first question, second question]
const CATEGORIES: [string, string, number, string, string][] = [
  ["getting-started", "Getting started", 8, "What does Vebryx do?", "How do I start a project with you?"],
  ["pricing", "Pricing & payments", 9, "How much does an MVP cost?", "How accurate is the cost calculator?"],
  ["process", "Timelines & process", 9, "How quickly can you launch?", "What are the stages of a project?"],
  ["mvp", "MVPs & validation", 7, "What exactly is an MVP?", ""],
  ["design", "Design & brand", 7, "", ""],
  ["technology", "Development & technology", 9, "", ""],
  ["ai", "AI", 7, "", ""],
  ["launch", "Launch, support & handover", 7, "", ""],
  ["working-together", "Working together", 8, "", ""],
  ["fit", "Industries & fit", 7, "", ""],
];

test.describe("faq page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("FAQ | Costs, Timelines & How We Build | Vebryx");
    await expect(page.locator("h1")).toContainText("Questions,");
    await expect(page.locator("h1")).toContainText("answered straight.");
    await expect(page.getByText("Costs, timelines, ownership and what happens after launch. If yours isn't here, ask us on the call.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has the ten categories in order and a chip for each", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual([...CATEGORIES.map((c) => c[1]), "Start your project"]);
    const chips = page.locator("main ul").first().getByRole("link");
    await expect(chips).toHaveCount(10);
    for (const [id, label] of CATEGORIES) await expect(page.locator("main ul").first().getByRole("link", { name: label, exact: true })).toHaveAttribute("href", `#${id}`);
  });

  test("78 questions in total, each category with its own count", async ({ page }) => {
    await open(page);
    let total = 0;
    for (const [id, , n] of CATEGORIES) {
      await expect(page.locator(`#${id}`).getByRole("button")).toHaveCount(n);
      total += n;
    }
    expect(total).toBe(78);
  });

  test("the first question in every category starts open", async ({ page }) => {
    await open(page);
    for (const [id] of CATEGORIES) await expect(page.locator(`#${id} button[aria-expanded=true]`)).toHaveCount(1);
    await expect(page.locator("#getting-started").getByText("We design and build digital products: MVPs, custom platforms")).toBeVisible();
    await expect(page.locator("#pricing").getByText("It depends on the features, the platforms and the pace.")).toBeVisible();
    await expect(page.locator("#process").getByText("A validation MVP takes 2–4 weeks.")).toBeVisible();
  });

  test("opening a question closes the other in its category only", async ({ page }) => {
    await open(page);
    const gs = page.locator("#getting-started");
    await gs.scrollIntoViewIfNeeded();
    await gs.getByRole("button", { name: "What happens on the first call?" }).click();
    await expect(gs.getByRole("button", { name: "What happens on the first call?" })).toHaveAttribute("aria-expanded", "true");
    await expect(gs.getByRole("button", { name: "What does Vebryx do?" })).toHaveAttribute("aria-expanded", "false");
    await expect(gs.locator("button[aria-expanded=true]")).toHaveCount(1);
    // other categories are untouched
    await expect(page.locator("#pricing button[aria-expanded=true]")).toHaveCount(1);
    await expect(page.locator("#pricing").getByRole("button", { name: "How much does an MVP cost?" })).toHaveAttribute("aria-expanded", "true");
    // clicking the open one closes it
    await gs.getByRole("button", { name: "What happens on the first call?" }).click();
    await expect(gs.locator("button[aria-expanded=true]")).toHaveCount(0);
  });

  test("a category chip scrolls to its section", async ({ page }) => {
    await open(page);
    await page.locator("main ul").first().getByRole("link", { name: "Launch, support & handover", exact: true }).click();
    await expect.poll(() => page.evaluate(() => document.querySelector("#launch")!.getBoundingClientRect().top), { timeout: 6000 }).toBeLessThan(260);
    await expect(page).toHaveURL(/\/faq(#launch)?$/);
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

test.describe("faq page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    for (const id of ["getting-started", "pricing", "fit"]) {
      await page.locator(`#${id}`).scrollIntoViewIfNeeded();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    }
  });
});
