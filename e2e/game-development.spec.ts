import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, path = "/services/game-development") {
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

test.describe("game development page", () => {
  test("renders the hero, every section and metadata with no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("UK Game Development Services for Studios | TechClues");
    await expect(page.locator("h1")).toContainText("Game builds that launch and scale well.");
    for (const s of ["In numbers", "Overview", "The difference", "Under the hood", "Engagement models", "Process", "Industries", "Tools and technologies", "Questions", "Get started"]) {
      await expect(page.locator(`section[aria-label="${s}"]`)).toHaveCount(1);
    }
    await expect(page.locator('section[aria-label="The difference"] h3')).toHaveCount(3);
    await expect(page.locator('section[aria-label="Engagement models"] h3')).toHaveText(["Dedicated Team Extension", "Full Studio Build"]);
    await expect(page.locator('section[aria-label="Process"] ol li')).toHaveCount(5);
    await expect(page.locator('section[aria-label="Industries"] h3')).toHaveCount(6);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("hero buttons jump to the form and the engagement models", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "Find out how we collaborate" }).click();
    await expect(page).toHaveURL(/#engagement$/);
    await page.getByRole("link", { name: /Talk through your game idea/ }).click();
    await expect(page).toHaveURL(/#get-started$/);
  });

  test("discipline tabs switch the panel", async ({ page }) => {
    await open(page);
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(6);
    await expect(page.getByRole("tabpanel")).toContainText("Full Cycle Development");
    for (const [name, heading, metric] of [["Art & Assets", "Game Art and Asset Creation", "42K"], ["AR / VR / XR", "AR, VR and XR Development", "90 FPS"], ["Multiplayer", "Multiplayer and Networked Games", "42ms"], ["Web3 & Metaverse", "Web3 and Metaverse", "-30%"], ["UEFN & Verse", "UEFN and Verse", "Published to Discover"]]) {
      await page.getByRole("tab", { name, exact: true }).click();
      await expect(page.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("tabpanel")).toContainText(heading);
      await expect(page.getByRole("tabpanel")).toContainText(metric);
    }
  });

  test("engagement mode select and industry cards work", async ({ page }) => {
    await open(page);
    const modes = page.getByRole("radio");
    await expect(modes).toHaveCount(2);
    await expect(modes.first()).toHaveAttribute("aria-checked", "true");
    await modes.nth(1).click();
    await expect(modes.nth(1)).toHaveAttribute("aria-checked", "true");
    await expect(modes.first()).toHaveAttribute("aria-checked", "false");
    await expect(page.locator('section[aria-label="Industries"] article')).toHaveCount(6);
  });

  test("FAQ shows one answer at a time", async ({ page }) => {
    await open(page);
    const faq = page.locator('section[aria-label="Questions"]');
    const buttons = faq.getByRole("button");
    await expect(buttons).toHaveCount(6);
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
    await expect(faq).toContainText("As a dedicated extension of your team");
  });

  test("the project form validates, then shows the thank-you", async ({ page }) => {
    await open(page);
    let body: Record<string, unknown> = {};
    let fail = true;
    await page.route("**/api/public/game-development", async (route) => {
      body = route.request().postDataJSON();
      if (fail) return route.fulfill({ status: 500, json: { message: "Server down" } });
      return route.fulfill({ status: 201, json: { id: "abc" } });
    });
    const form = page.locator('form[data-form="game-development"]');
    await expect(form.getByLabel("Studio / Company")).toBeVisible();
    await expect(form.getByLabel("Company size")).toHaveCount(0);
    await form.getByRole("button", { name: /Get in touch/ }).click();
    for (const t of ["Enter your first name.", "Enter your last name.", "Choose what brings you here.", "Please check your work email.", "We need your consent in order to reply."]) await expect(form).toContainText(t);
    await form.getByLabel("First name").fill("Sam");
    await form.getByLabel("Last name").fill("Taylor");
    await form.getByLabel("What brings you here today?").selectOption("Just a concept");
    await form.getByLabel("Work email").fill("sam@example.com");
    await form.getByRole("checkbox").first().check();
    await form.getByRole("button", { name: /Get in touch/ }).click();
    await expect(form.getByRole("alert")).toBeVisible();
    await expect(page.getByText("Thank you, we have received it.")).toHaveCount(0);
    fail = false;
    await form.getByRole("button", { name: /Get in touch/ }).click();
    await expect(page.getByText("Thank you, we have received it.")).toBeVisible();
    expect(body).toMatchObject({ firstName: "Sam", lastName: "Taylor", email: "sam@example.com", need: "Just a concept", consent: true });
  });

  test("reached from the site footer without a reload", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 7));
    await page.locator('footer a[href="/services/game-development"]').click();
    await expect(page).toHaveURL(/\/services\/game-development$/);
    await expect(page.locator("h1")).toContainText("Game builds");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(7);
  });
});

test.describe("game development on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("fits the screen", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "UEFN & Verse", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
