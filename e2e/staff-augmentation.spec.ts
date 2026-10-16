import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, path = "/services/staff-augmentation") {
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

test.describe("staff augmentation page", () => {
  test("renders the hero, every section and metadata with no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("UK Staff Augmentation Services for Your Team | TechClues");
    await expect(page.locator("h1")).toContainText("Our engineers and AI team, inside yours.");
    for (const s of ["In numbers", "Key challenges", "Our approach", "Capabilities", "Engagement models", "Process", "Industries we serve", "Case studies", "Questions", "Get started"]) {
      await expect(page.locator(`section[aria-label="${s}"]`)).toHaveCount(1);
    }
    await expect(page.locator("main")).toContainText("Where recruitment holds back delivery.");
    await expect(page.locator('section[aria-label="Key challenges"] h3')).toHaveCount(4);
    await expect(page.locator('section[aria-label="Engagement models"] h3')).toHaveText(["Nearshore Delivery", "Onshore Delivery", "Offshore Delivery"]);
    await expect(page.locator('section[aria-label="Process"] ol li')).toHaveCount(4);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("hero buttons jump to the form and the engagement models", async ({ page }) => {
    await open(page);
    await page.getByRole("link", { name: "Explore engagement models" }).click();
    await expect(page).toHaveURL(/#engagement$/);
    await page.getByRole("link", { name: /Define your team/ }).click();
    await expect(page).toHaveURL(/#get-started$/);
  });

  test("role tabs switch the panel", async ({ page }) => {
    await open(page);
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(6);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tabpanel")).toContainText("AI Engineers and ML Specialists");
    for (const [name, heading] of [["Full Stack", "Full Stack Coverage"], ["Data", "Data Scientists and Data Engineers"], ["Onboarding", "Rapid Onboarding"], ["Integration", "Direct Team Integration"], ["Scaling", "Flexible Scaling"]]) {
      await page.getByRole("tab", { name, exact: true }).click();
      await expect(page.getByRole("tab", { name, exact: true })).toHaveAttribute("aria-selected", "true");
      await expect(page.getByRole("tabpanel")).toContainText(heading);
    }
  });

  test("FAQ opens one answer", async ({ page }) => {
    await open(page);
    const faq = page.locator('section[aria-label="Questions"]');
    const buttons = faq.getByRole("button");
    await expect(buttons).toHaveCount(7);
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
    await expect(faq).toContainText("roadmap and management");
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
    await expect(faq).toContainText("a few weeks");
  });

  test("the seat form validates, then shows the thank-you", async ({ page }) => {
    await open(page);
    let body: Record<string, unknown> = {};
    let fail = true;
    await page.route("**/api/public/staff-augmentation", async (route) => {
      body = route.request().postDataJSON();
      if (fail) return route.fulfill({ status: 500, json: { message: "Server down" } });
      return route.fulfill({ status: 201, json: { id: "abc" } });
    });
    const form = page.locator('form[data-form="staff-augmentation"]');
    await form.getByRole("button", { name: /Get in touch/ }).click();
    for (const t of ["Enter your first name.", "Enter your last name.", "Select what you are looking for.", "Please check your work email.", "We need your consent in order to reply."]) await expect(form).toContainText(t);
    await form.getByLabel("First name").fill("Sam");
    await form.getByLabel("Last name").fill("Taylor");
    await form.getByLabel("What are you looking for?").selectOption("A full team");
    await form.getByLabel("Work email").fill("sam@example.com");
    await form.getByRole("checkbox").first().check();
    await form.getByRole("button", { name: /Get in touch/ }).click();
    await expect(form.getByRole("alert")).toBeVisible();
    await expect(page.getByText("Thank you, we have received it.")).toHaveCount(0);
    fail = false;
    await form.getByRole("button", { name: /Get in touch/ }).click();
    await expect(page.getByText("Thank you, we have received it.")).toBeVisible();
    expect(body).toMatchObject({ firstName: "Sam", lastName: "Taylor", email: "sam@example.com", need: "A full team", consent: true });
  });

  test("reached from the site footer without a reload", async ({ page }) => {
    await open(page, "/");
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 7));
    await page.locator('footer a[href="/services/staff-augmentation"]').click();
    await expect(page).toHaveURL(/\/services\/staff-augmentation$/);
    await expect(page.locator("h1")).toContainText("inside");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(7);
  });
});

test.describe("staff augmentation on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("fits the screen", async ({ page }) => {
    await open(page);
    await page.getByRole("tab", { name: "Scaling", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
