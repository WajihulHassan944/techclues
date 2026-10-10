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
  await page.goto("/careers");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const SKILLS = ["UI/UX design", "Front-end development", "Full-stack development", "Mobile apps", "AI & automation", "Low-code", "Brand design", "Performance marketing", "Other"];

test.describe("careers page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("Careers at Vebryx | Product Studio in Glasgow & Karachi");
    await expect(page.locator("h1")).toContainText("Build products");
    await expect(page.locator("h1")).toContainText("people actually use.");
    await expect(page.getByText("Vebryx is a product studio in Glasgow, with a production studio in Karachi, PK.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has the intro, work, open roles and apply sections", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual(["What the work is like", "Open roles", "Apply"]);
    const work = page.locator('section[aria-label="What the work is like"]');
    for (const t of ["Real products, quickly", "Validation first", "Something new every few weeks", "Two locations, one team"]) await expect(work).toContainText(t);
    const roles = page.locator('section[aria-label="Open roles"]');
    await expect(roles).toContainText("We're not advertising any roles right now");
    for (const s of SKILLS.slice(0, -1)) await expect(roles.getByRole("listitem").filter({ hasText: s }).first()).toBeVisible();
  });

  test("the hero button jumps to the application form", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "Send us your details" }).click();
    await expect.poll(() => page.evaluate(() => document.querySelector("#apply")!.getBoundingClientRect().top), { timeout: 5000 }).toBeLessThan(200);
  });

  test("skill chips toggle on and off", async ({ page }) => {
    await open(page);
    const form = page.locator("form[data-form=careers]");
    await form.scrollIntoViewIfNeeded();
    const chip = form.getByRole("button", { name: "Mobile apps" });
    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "true");
    await expect(chip).toHaveClass(/bg-brand/);
    await expect(chip.locator("svg")).toHaveCount(1);
    await form.getByRole("button", { name: "Low-code" }).click();
    await expect(form.locator("button[aria-pressed=true]")).toHaveCount(2); // several can be picked
    await chip.click();
    await expect(chip).toHaveAttribute("aria-pressed", "false");
    await expect(chip.locator("svg")).toHaveCount(0);
  });

  test("choosing Other reveals a focused extra field, and unchoosing removes it", async ({ page }) => {
    await open(page);
    const form = page.locator("form[data-form=careers]");
    await form.scrollIntoViewIfNeeded();
    await expect(form.locator("input[name=other]")).toHaveCount(0);
    await form.getByRole("button", { name: "Other" }).click();
    const other = form.locator("input[name=other]");
    await expect(other).toBeFocused();
    await expect(form.getByText("What else do you do?")).toBeVisible();
    await form.getByRole("button", { name: "Other" }).click();
    await expect(other).toHaveCount(0);
  });

  test("required fields are checked and the form does not leave the page", async ({ page }) => {
    await open(page);
    const form = page.locator("form[data-form=careers]");
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("button", { name: "Send application" }).click();
    await expect(page).toHaveURL(/\/careers$/);
    expect(await form.locator("input[name=name]").evaluate((e) => (e as HTMLInputElement).validity.valueMissing)).toBe(true);
    await form.locator("input[name=name]").fill("Sam Example");
    await form.locator("input[name=email]").fill("not-an-email");
    expect(await form.locator("input[name=email]").evaluate((e) => (e as HTMLInputElement).validity.typeMismatch)).toBe(true);
    await form.locator("input[name=email]").fill("sam@example.com");
    await form.locator("input[name=link]").fill("https://example.com");
    await form.locator("textarea[name=message]").fill("I design products.");
    await form.locator("input[name=consent]").check();
    expect(await form.evaluate((f) => (f as HTMLFormElement).checkValidity())).toBe(true);
    await form.getByRole("button", { name: "Send application" }).click();
    await expect(page).toHaveURL(/\/careers$/);
    await expect(form.locator("input[name=name]")).toHaveValue("Sam Example"); // untouched: not wired up
    await expect(form.getByRole("link", { name: "privacy policy" })).toHaveAttribute("href", "/privacy-policy");
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

test.describe("careers page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    await page.locator("#apply").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
