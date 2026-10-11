import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { reseed } from "./helpers/backend";

test.describe.configure({ mode: "serial" });

async function signIn(page: Page, to = "/admin/newsletter") {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill(process.env.E2E_ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  if (to !== "/admin") await page.goto(to);
}
const rows = (p: Page) => p.locator("li.adm-sub");
const tab = (p: Page, name: string) => p.getByRole("tab", { name: new RegExp(`^${name}`) });
const tile = (p: Page, label: string) => p.locator(".adm-tile", { has: p.locator(".adm-tile-label", { hasText: label }) });
const tileValue = async (p: Page, label: string) => Number(await tile(p, label).locator(".adm-tile-value").textContent());

test.describe("admin newsletter", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
  });

  test("shows the list size, new sign-ups with a comparison, and who left", async ({ page }) => {
    await expect(page).toHaveTitle("Newsletter | TechClues admin");
    expect(await tileValue(page, "Active subscribers")).toBe(60);
    await expect(tile(page, "Active subscribers")).toContainText("of 65 people who ever signed up");
    expect(await tileValue(page, "Unsubscribed")).toBe(3);
    expect(await tileValue(page, "Bounced")).toBe(2);
    expect(await tileValue(page, "New in the last 30 days")).toBeGreaterThan(0);
    await expect(tile(page, "New in the last 30 days")).toContainText("vs the 30 days before");
  });

  test("the growth chart has hover detail, a 13-week view and a table with the same total", async ({ page }) => {
    const bars = page.locator(".adm-col");
    await expect(bars).toHaveCount(30);
    await bars.last().hover();
    await expect(page.locator(".adm-plot .adm-tip")).toContainText(/\d+ sign-ups?/);
    await page.mouse.move(5, 5);
    const card = page.getByRole("region", { name: "New subscribers" });
    const total = Number((await card.locator("p").first().textContent())!.match(/^(\d+) in the last/)![1]);
    await card.getByRole("button", { name: "View as table" }).click();
    const nums = await card.locator("tbody td").allTextContents();
    expect(nums).toHaveLength(30);
    expect(nums.reduce((s, n) => s + Number(n), 0)).toBe(total);
    await card.getByRole("button", { name: "Show chart" }).click();
    await page.getByRole("tab", { name: "13 weeks" }).click();
    await expect(bars).toHaveCount(13);
    await expect(card).toContainText("by week");
  });

  test("sign-ups by source list the website forms, the biggest first", async ({ page }) => {
    const list = page.getByRole("list", { name: "Sign-ups by source" });
    await expect(list.locator("li")).toHaveCount(4);
    await expect(list.locator("li").first()).toContainText("Site footer");
    const vals = (await list.locator(".adm-hval").allTextContents()).map(Number);
    expect([...vals].sort((a, b) => b - a)).toEqual(vals);
  });

  test("the list pages through all subscribers and filters by status, source and search", async ({ page }) => {
    await expect(rows(page)).toHaveCount(20);
    await expect(page.getByRole("navigation", { name: "Pages" })).toContainText("1–20 of 65");
    await page.getByRole("button", { name: "Next" }).click();
    await expect(page.getByRole("navigation", { name: "Pages" })).toContainText("21–40 of 65");
    await page.getByRole("button", { name: "Previous" }).click();
    await tab(page, "Unsubscribed").click();
    await expect(rows(page)).toHaveCount(3);
    await tab(page, "Bounced").click();
    await expect(rows(page)).toHaveCount(2);
    await tab(page, "All").click();
    await page.getByRole("combobox", { name: "Signed up from" }).selectOption("manual");
    expect(await rows(page).count()).toBeGreaterThan(0);
    for (const t of await rows(page).locator(".adm-sub-src").allTextContents()) expect(t).toBe("Added by hand");
    await page.getByRole("combobox", { name: "Signed up from" }).selectOption("");
    await page.getByRole("searchbox", { name: "Search subscribers" }).fill("maya.ellis@example.com");
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first()).toContainText("Maya");
    await page.getByRole("searchbox", { name: "Search subscribers" }).fill("zzzz");
    await expect(page.getByRole("heading", { name: "No subscribers match" })).toBeVisible();
  });

  test("a subscriber can be unsubscribed and resubscribed, and the tiles follow", async ({ page }) => {
    await page.getByRole("searchbox", { name: "Search subscribers" }).fill("maya.ellis@example.com");
    await page.getByRole("button", { name: "Unsubscribe maya.ellis@example.com" }).click();
    await expect(rows(page).first().locator(".adm-substatus")).toHaveText("Unsubscribed");
    expect(await tileValue(page, "Active subscribers")).toBe(59);
    expect(await tileValue(page, "Unsubscribed")).toBe(4);
    await page.getByRole("button", { name: "Resubscribe maya.ellis@example.com" }).click();
    await expect(rows(page).first().locator(".adm-substatus")).toHaveText("Subscribed");
    expect(await tileValue(page, "Active subscribers")).toBe(60);
  });

  test("bulk actions work on selected rows, with a confirmation before deleting", async ({ page }) => {
    await rows(page).nth(0).getByRole("checkbox").check();
    await rows(page).nth(1).getByRole("checkbox").check();
    await expect(page.getByText("2 selected")).toBeVisible();
    await page.getByRole("button", { name: "Unsubscribe", exact: true }).click();
    expect(await tileValue(page, "Active subscribers")).toBe(58);
    await rows(page).nth(0).getByRole("checkbox").check();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    const dlg = page.getByRole("dialog", { name: /Delete 1 subscriber\?/ });
    await dlg.getByRole("button", { name: "Keep them" }).click();
    await expect(page.getByText("1 selected")).toBeVisible();
    await page.getByRole("button", { name: "Delete", exact: true }).click();
    await page.getByRole("dialog", { name: /Delete 1 subscriber\?/ }).getByRole("button", { name: "Delete for good" }).click();
    await expect(tab(page, "All")).toContainText("64");
  });

  test("exports the shown subscribers as a CSV file", async ({ page }) => {
    await tab(page, "Bounced").click();
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /^Export CSV/ }).click()]);
    expect(download.suggestedFilename()).toMatch(/^techclues-subscribers-\d{4}-\d{2}-\d{2}\.csv$/);
    const text = readFileSync((await download.path())!, "utf8").trim().split(/\r?\n/);
    expect(text[0]).toBe("Email,Name,Source,Status,Subscribed on,Ended on");
    expect(text).toHaveLength(3);
    for (const line of text.slice(1)) expect(line).toContain("Bounced");
    await expect(page.getByRole("status").filter({ hasText: "Exported 2 subscribers" })).toBeVisible();
  });

  test("adding a subscriber needs consent and a new, valid address", async ({ page }) => {
    await page.getByRole("button", { name: "Add subscriber" }).first().click();
    const dlg = page.getByRole("dialog", { name: "Add a subscriber" });
    await expect(dlg.getByRole("button", { name: "Add subscriber" })).toBeDisabled();
    await dlg.getByLabel("Email address").fill("nope");
    await dlg.getByRole("checkbox").check();
    await dlg.getByRole("button", { name: "Add subscriber" }).click();
    await expect(dlg.getByText("Check the email address.")).toBeVisible();
    await dlg.getByLabel("Email address").fill("maya.ellis@example.com");
    await dlg.getByRole("button", { name: "Add subscriber" }).click();
    await expect(dlg.getByText("That address is already on the list.")).toBeVisible();
    await dlg.getByLabel("Email address").fill("new.person@example.com");
    await dlg.getByLabel("Name (optional)").fill("Nina");
    await dlg.getByRole("button", { name: "Add subscriber" }).click();
    await expect(dlg).toHaveCount(0);
    await expect(rows(page).first()).toContainText("new.person@example.com");
    await expect(rows(page).first()).toContainText("Added by hand");
    expect(await tileValue(page, "Active subscribers")).toBe(61);
  });

  test("importing a list skips duplicates and invalid addresses and reports the result", async ({ page }) => {
    await page.getByRole("button", { name: "Import", exact: true }).click();
    const dlg = page.getByRole("dialog", { name: "Import subscribers" });
    await dlg.getByLabel("Email addresses").fill("one@example.com\ntwo@example.com, maya.ellis@example.com\nnot-an-email");
    await expect(dlg.getByRole("button", { name: /^Import/ })).toBeDisabled();
    await dlg.getByRole("checkbox").check();
    await dlg.getByRole("button", { name: /^Import 4 addresses/ }).click();
    await expect(dlg.getByRole("status")).toHaveText("Added 2. 1 already on the list. 1 not valid.");
    await dlg.getByRole("button", { name: "Done" }).click();
    expect(await tileValue(page, "Active subscribers")).toBe(62);
  });
});

test.describe("admin newsletter on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("fits the screen", async ({ page }) => {
    reseed();
    await signIn(page);
    await expect(rows(page).first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
