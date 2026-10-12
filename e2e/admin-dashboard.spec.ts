import { test, expect, type Page } from "@playwright/test";
import { openEnquiryByText, reseed } from "./helpers/backend";

test.describe.configure({ mode: "serial" });

async function signIn(page: Page, to = "/admin") {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill(process.env.E2E_ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  if (to !== "/admin") await page.goto(to);
}
const tile = (p: Page, label: RegExp | string) => p.locator(".adm-tile", { has: p.locator(".adm-tile-label", { hasText: label }) });
const value = async (p: Page, label: RegExp | string) => Number(await tile(p, label).locator(".adm-tile-value").textContent());

test.describe("admin dashboard", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
  });

  test("greets you and summarises the day", async ({ page }) => {
    await expect(page).toHaveTitle("Dashboard | TechClues admin");
    await expect(page.getByRole("heading", { level: 2 })).toHaveText(/^Good (morning|afternoon|evening)\.$/);
    await expect(page.locator(".adm-lead")).toContainText("8 enquiries are waiting for a reply");
    await expect(page.getByRole("link", { name: "Open inbox" }).first()).toHaveAttribute("href", "/admin/inbox");
  });

  test("stat tiles reflect the inbox and link to it", async ({ page }) => {
    expect(await value(page, "Unread")).toBe(5);
    expect(await value(page, "Needs a reply")).toBe(8);
    await expect(tile(page, "Needs a reply")).toContainText("Oldest waiting 5 days");
    expect(await value(page, "Calls coming up")).toBeGreaterThanOrEqual(3);
    await expect(tile(page, "Calls coming up")).toContainText("Next:");
    await expect(tile(page, "Unread")).toHaveAttribute("href", "/admin/inbox");
    await expect(tile(page, "Calls coming up")).toHaveAttribute("href", "/admin/bookings");
    // The seed data's oldest enquiry is under 2 weeks old, so the previous-30-days window is
    // genuinely empty — "No earlier period to compare" is the correct state, not a fake delta.
    await expect(tile(page, /^Enquiries, last/)).toContainText("No earlier period to compare");
    await expect(tile(page, /^Enquiries, last/).getByRole("img", { name: /^Trend:/ })).toBeVisible();
  });

  test("tiles update when enquiries are read or answered", async ({ page }) => {
    await openEnquiryByText(page, "Sarah Whitfield");
    await page.getByRole("textbox", { name: "Your reply" }).fill("Thanks Sarah, we'll call you tomorrow.");
    await page.getByRole("button", { name: /Send reply/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "Reply sent" })).toBeVisible();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Dashboard" }).click();
    expect(await value(page, "Unread")).toBe(4);
    expect(await value(page, "Needs a reply")).toBe(7);
    await expect(page.locator(".adm-lead")).toContainText("7 enquiries are waiting");
  });

  test("the needs-a-reply list shows the oldest first and opens an enquiry", async ({ page }) => {
    const card = page.getByRole("region", { name: "Needs a reply" });
    const items = card.locator("li");
    await expect(items).toHaveCount(5);
    await expect(items.first()).toContainText("Olivia Brennan");
    await expect(items.first()).toContainText("Grant support");
    await expect(items.first()).toContainText("5 days");
    await expect(card).toContainText("and 3 more in the inbox");
    await items.first().getByRole("link").click();
    await expect(page).toHaveURL(/\/admin\/inbox\/[a-f0-9]{24}$/);
    await expect(page.getByRole("heading", { level: 2, name: /Grant support/ })).toBeVisible();
  });

  test("upcoming calls lists the next bookings", async ({ page }) => {
    const card = page.getByRole("region", { name: "Upcoming calls" });
    await expect(card.locator("li")).toHaveCount(4);
    await expect(card.locator("li").first()).toContainText("Aisha Rahman");
    await expect(card.locator("li").first()).toContainText("Today");
    await expect(card).toContainText("Tomorrow");
    await expect(card).toContainText("and 3 more booked");
    await card.getByRole("link", { name: "All bookings" }).click();
    await expect(page).toHaveURL(/\/admin\/bookings$/);
  });

  test("the period filter rescopes the tile, the chart and the source bars together", async ({ page }) => {
    const bars = page.locator(".adm-col");
    await expect(bars).toHaveCount(30);
    const total30 = await value(page, /^Enquiries, last/);
    await expect(page.getByRole("region", { name: "Enquiries over time" })).toContainText(`${total30} in the last 30 days`);
    await page.getByRole("tab", { name: "7 days" }).click();
    await expect(bars).toHaveCount(7);
    await expect(tile(page, /^Enquiries, last/)).toContainText("Enquiries, last 7 days");
    const total7 = await value(page, /^Enquiries, last/);
    expect(total7).toBeLessThanOrEqual(total30);
    await expect(page.getByRole("region", { name: "Where enquiries come from" })).toContainText("Last 7 days");
    await page.getByRole("tab", { name: "13 weeks" }).click();
    await expect(bars).toHaveCount(13);
    // Real data only now (no fake historical padding beyond ~2 weeks), and the seed data's oldest
    // enquiry is under 2 weeks old, so the 91-day total is simply equal to the 30-day total.
    expect(await value(page, /^Enquiries, last/)).toBeGreaterThanOrEqual(total30);
    await expect(page.getByRole("region", { name: "Enquiries over time" })).toContainText("by week");
  });

  test("hovering or focusing a bar shows the day's total and where it came from", async ({ page }) => {
    const bars = page.locator(".adm-col");
    await bars.last().hover();
    const tip = page.locator(".adm-plot .adm-tip");
    await expect(tip).toBeVisible();
    await expect(tip).toContainText(/\d+ enquir(y|ies)/);
    await expect(tip.locator("li").first()).toBeVisible();
    await page.mouse.move(5, 5);
    await expect(tip).toHaveCount(0);
    await bars.nth(10).focus();
    await expect(tip).toBeVisible();
  });

  test("every chart has a table view with the same numbers", async ({ page }) => {
    const total = await value(page, /^Enquiries, last/);
    const card = page.getByRole("region", { name: "Enquiries over time" });
    await card.getByRole("button", { name: "View as table" }).click();
    const rows = card.locator("tbody tr");
    await expect(rows).toHaveCount(30);
    const nums = await rows.locator("td").allTextContents();
    expect(nums.reduce((s, n) => s + Number(n), 0)).toBe(total);
    await card.getByRole("button", { name: "Show chart" }).click();
    await expect(page.locator(".adm-col")).toHaveCount(30);

    const src = page.getByRole("region", { name: "Where enquiries come from" });
    await src.getByRole("button", { name: "View as table" }).click();
    const srows = src.locator("tbody tr");
    await expect(srows).toHaveCount(8);
    const counts = await srows.locator("td:nth-child(2)").allTextContents();
    expect(counts.reduce((s, n) => s + Number(n), 0)).toBe(total);
    await expect(src.getByRole("columnheader", { name: "Share" })).toBeVisible();
  });

  test("source bars list all eight forms, biggest first", async ({ page }) => {
    const rows = page.getByRole("list", { name: "Enquiries by source" }).locator("li");
    await expect(rows).toHaveCount(8);
    const vals = (await rows.locator(".adm-hval").allTextContents()).map(Number);
    expect([...vals].sort((a, b) => b - a)).toEqual(vals);
    await rows.first().focus();
    await expect(rows.first().locator(".adm-tip")).toBeVisible();
    await expect(rows.first().locator(".adm-tip")).toContainText("% of the total");
  });
});

test.describe("admin dashboard on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.beforeEach(() => reseed());

  test("fits the screen", async ({ page }) => {
    await signIn(page);
    await expect(page.getByRole("heading", { level: 2 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator(".adm-col").first()).toBeVisible();
  });
});
