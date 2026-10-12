import { test, expect, type Page } from "@playwright/test";

const errorsOf = (page: Page) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  return errors;
};

const TEST_ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "";

async function signIn(page: Page) {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill(TEST_ADMIN_PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("navigation", { name: "Main" })).toBeVisible();
}

test.describe("admin: sign in", () => {
  test("sign-in page renders without the public site's header, footer or cookie banner", async ({ page }) => {
    const errors = errorsOf(page);
    await page.goto("/admin/login");
    await expect(page).toHaveTitle("Admin sign in | TechClues");
    await expect(page.getByRole("heading", { name: "Admin sign in" })).toBeVisible();
    await expect(page.locator("#adm-email")).toHaveValue("techcluesltd@gmail.com");
    await expect(page.locator("header, footer")).toHaveCount(0);
    await expect(page.locator("#cookie-title")).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("checks the fields before signing in", async ({ page }) => {
    await page.goto("/admin/login");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Enter your password.")).toBeVisible();
    await page.locator("#adm-email").fill("nope");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page.getByText("Check your email address.")).toBeVisible();
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("password can be shown and hidden, and the forgot-password note opens", async ({ page }) => {
    await page.goto("/admin/login");
    const pw = page.locator("#adm-password");
    await expect(pw).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Show password" }).click();
    await expect(pw).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "Hide password" }).click();
    await expect(pw).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "Forgot password?" }).click();
    await expect(page.getByRole("status")).toContainText("isn't wired up yet");
  });

  test("signing in opens the dashboard, and the panel stays closed without signing in", async ({ page }) => {
    await page.goto("/admin/inbox");
    await expect(page).toHaveURL(/\/admin\/login$/);
    await signIn(page);
    await expect(page.getByRole("heading", { name: /^Good (morning|afternoon|evening).$/ })).toBeVisible();
    await page.goto("/admin/login");
    await expect(page).toHaveURL(/\/admin$/); // already signed in
  });
});

test.describe("admin: shell", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("sidebar lists every section and marks the current page", async ({ page }) => {
    const nav = page.getByRole("navigation", { name: "Main" });
    for (const l of ["Dashboard", "Inbox", "Spam & trash", "Bookings", "Blog", "Newsletter", "Settings"]) await expect(nav.getByRole("link", { name: new RegExp(l) })).toBeVisible();
    await expect(nav.getByRole("link", { name: /Dashboard/ })).toHaveAttribute("aria-current", "page");
    await expect(page.locator("header.adm-top")).toHaveCount(1); // the admin top bar only
    await expect(page.locator('a[aria-label="TechClues home"]')).toHaveCount(0); // not the public site header
    await expect(page.getByRole("link", { name: "TechClues admin home" })).toBeVisible();
  });

  const SECTIONS: [string, string, string][] = [
    ["Inbox", "/admin/inbox", "Inbox"],
    ["Spam & trash", "/admin/inbox/spam", "Spam & trash"],
    ["Bookings", "/admin/bookings", "Bookings"],
    ["Blog", "/admin/blog", "Blog"],
    ["Newsletter", "/admin/newsletter", "Newsletter"],
    ["Settings", "/admin/settings", "Settings"],
  ];
  for (const [label, url, title] of SECTIONS) {
    test(`${label} opens without reloading and highlights its link`, async ({ page }) => {
      await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 5));
      await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: new RegExp(label) }).click();
      await expect(page).toHaveURL(new RegExp(url.replace(/\//g, "\\/") + "$"));
      await expect(page.locator("header h1")).toHaveText(title);
      await expect(page.getByRole("navigation", { name: "Main" }).locator('a[aria-current="page"]')).toHaveCount(1);
      await expect(page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: new RegExp(label) })).toHaveAttribute("aria-current", "page");
      expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(5);
    });
  }

  test("notifications and account menus open, close with Escape, and log out returns to sign in", async ({ page }) => {
    await page.getByRole("button", { name: "Notifications" }).click();
    await expect(page.getByRole("dialog", { name: "Notifications" })).toContainText("Notifications");
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Notifications" })).toHaveCount(0);
    await page.getByRole("button", { name: "Account menu" }).click();
    await expect(page.getByRole("menu", { name: "Account" })).toContainText("techcluesltd@gmail.com");
    await page.getByRole("menuitem", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });

  test("View site opens the public website, which still has its own header and footer", async ({ page, context }) => {
    const [site] = await Promise.all([context.waitForEvent("page"), page.getByRole("link", { name: "View site" }).click()]);
    await site.waitForLoadState();
    await expect(site).toHaveURL(/\/$/);
    await expect(site.locator("header").first()).toBeVisible();
    await expect(site.locator("footer")).toHaveCount(1);
  });
});

test.describe("admin on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("menu opens as a drawer, navigates and closes", async ({ page }) => {
    await signIn(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    const side = page.getByRole("complementary", { name: "Admin navigation" });
    await expect(side).toHaveAttribute("data-open", "false");
    await page.getByRole("button", { name: "Open menu" }).click();
    await expect(side).toHaveAttribute("data-open", "true");
    await side.getByRole("link", { name: /Bookings/ }).click();
    await expect(page).toHaveURL(/\/admin\/bookings$/);
    await expect(side).toHaveAttribute("data-open", "false");
  });
});
