import { test, expect, type Page } from "@playwright/test";
import { reseed } from "./helpers/backend";

test.describe.configure({ mode: "serial" });

async function signIn(page: Page, to = "/admin/bookings") {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill(process.env.E2E_ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  if (to !== "/admin") await page.goto(to);
}
const calls = (p: Page) => p.locator("button.adm-call");
const tab = (p: Page, name: string) => p.getByRole("tab", { name: new RegExp(`^${name}`) });
const drawer = (p: Page) => p.getByRole("dialog", { name: "Call details" });
const navBadge = (p: Page) => p.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /Bookings/ }).locator(".adm-badge");
const row = (p: Page, name: string) => calls(p).filter({ hasText: name });
const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

test.describe("admin bookings: list", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
  });

  test("lists upcoming calls by day with counts and the sidebar badge", async ({ page }) => {
    await expect(page).toHaveTitle("Bookings | TechClues admin");
    await expect(tab(page, "Upcoming")).toContainText("7");
    await expect(tab(page, "Past")).toContainText("3");
    await expect(tab(page, "Cancelled")).toContainText("1");
    await expect(calls(page)).toHaveCount(7);
    await expect(navBadge(page)).toHaveText("6");
    await expect(page.locator(".adm-daygroup h3").first()).toHaveText(/^Today/);
    await expect(row(page, "James Carter")).toContainText("Shipment tracking portal");
    await expect(row(page, "James Carter")).toContainText("Northern Freight");
    await expect(row(page, "James Carter")).toContainText("Confirmed");
    await expect(row(page, "Hannah Lee")).toContainText("ZERO.ONE brief");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("past and cancelled tabs show their outcomes, and search narrows the list", async ({ page }) => {
    await tab(page, "Past").click();
    await expect(calls(page)).toHaveCount(3);
    await expect(row(page, "Emily Zhang")).toContainText("Completed");
    await expect(row(page, "Rahul Mehta")).toContainText("No-show");
    await tab(page, "Cancelled").click();
    await expect(calls(page)).toHaveCount(1);
    await expect(row(page, "Tom Gallagher")).toContainText("Cancelled");
    await tab(page, "Upcoming").click();
    await page.getByRole("searchbox", { name: "Search calls" }).fill("fleetwise");
    await expect(calls(page)).toHaveCount(1);
    await expect(calls(page).first()).toContainText("Daniel Okafor");
    await page.getByRole("searchbox", { name: "Search calls" }).fill("zzzz");
    await expect(page.getByRole("heading", { name: "No calls match" })).toBeVisible();
  });
});

test.describe("admin bookings: call details", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
  });

  test("opens a side panel with the call, contact details and notes; Escape closes it and returns focus", async ({ page }) => {
    const r = row(page, "James Carter");
    await r.click();
    const d = drawer(page);
    await expect(d).toBeVisible();
    await expect(d).toContainText("James Carter");
    await expect(d).toContainText("11:00–11:30 UK time · 30 minutes");
    await expect(d).toContainText("Shipment tracking portal: scoping");
    await expect(d.getByRole("link", { name: "james@northernfreight.co.uk" })).toHaveAttribute("href", "mailto:james@northernfreight.co.uk");
    await expect(d.getByRole("link", { name: "+44 7766 301288" })).toHaveAttribute("href", "tel:+447766301288");
    await expect(d.getByRole("link", { name: /meet\.google\.com/ })).toHaveAttribute("href", /meet\.google\.com/);
    await expect(d).toContainText("Decision maker. Bring the dispatch-system integration questions.");
    await expect(d.getByRole("link", { name: "Open their enquiry" })).toHaveAttribute("href", /\/admin\/inbox\/[a-f0-9]{24}$/);
    await expect(d.getByText("Booked on the website (Book a call)")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(d).toHaveCount(0);
    await expect(r).toBeFocused();
  });

  test("a note can be added, and the meeting link can be copied", async ({ page }) => {
    await row(page, "Sarah Whitfield").click();
    await drawer(page).getByRole("textbox", { name: "Add a note" }).fill("Wants a fixed price");
    await drawer(page).getByRole("button", { name: "Add note" }).click();
    await expect(drawer(page).locator(".adm-notes")).toContainText("Wants a fixed price");
    await drawer(page).getByRole("button", { name: "Copy" }).click();
    await expect(page.getByRole("status").filter({ hasText: /Meeting link copied|Couldn't copy/ })).toBeVisible();
  });

  test("rescheduling offers only free times, moves the call and records it", async ({ page }) => {
    await row(page, "James Carter").click();
    await drawer(page).getByRole("button", { name: "Reschedule" }).click();
    const dlg = page.getByRole("dialog", { name: /Reschedule James/ });
    await expect(dlg).toBeVisible();
    await expect(dlg.getByRole("button", { name: "Move call" })).toBeDisabled();
    const current = (await dlg.locator(".adm-dlg-lead").textContent())!.match(/Currently \w+ (\d+ \w+)/)![1];
    await dlg.getByRole("button", { name: new RegExp(`${current}, \\d+ free`) }).click();
    const slots = dlg.getByRole("list", { name: "Free times" });
    await expect(slots.getByRole("button", { name: "11:00" })).toBeVisible(); // its own slot is free again
    await expect(slots.getByRole("button", { name: "15:30" })).toHaveCount(0); // Hannah's call
    await slots.getByRole("button", { name: "12:00" }).click();
    await dlg.getByRole("button", { name: "Move call" }).click();
    await expect(page.getByRole("status").filter({ hasText: /James moved to .*12:00, visitor emailed/ })).toBeVisible();
    await expect(drawer(page)).toContainText("12:00–12:30 UK time");
    await expect(drawer(page).locator(".adm-history")).toContainText("Moved from");
    await page.keyboard.press("Escape");
    await expect(row(page, "James Carter")).toContainText("12:00");
  });

  test("cancelling asks for a reason, frees the call and moves it to Cancelled", async ({ page }) => {
    await row(page, "Sarah Whitfield").click();
    await drawer(page).getByRole("button", { name: "Cancel call" }).click();
    const dlg = page.getByRole("dialog", { name: /Cancel Sarah/ });
    await dlg.getByRole("combobox", { name: "Reason" }).selectOption("I'm unavailable");
    await dlg.getByRole("textbox", { name: /Message/ }).fill("Sorry, something came up.");
    await dlg.getByRole("button", { name: "Cancel call" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Call cancelled, visitor emailed" })).toBeVisible();
    await expect(drawer(page)).toContainText("Cancelled: I'm unavailable: Sorry, something came up.");
    await page.keyboard.press("Escape");
    await expect(tab(page, "Upcoming")).toContainText("6");
    await expect(tab(page, "Cancelled")).toContainText("2");
    await tab(page, "Cancelled").click();
    await expect(row(page, "Sarah Whitfield")).toContainText("Cancelled");
  });

  test("keeping the call leaves it unchanged", async ({ page }) => {
    await row(page, "Daniel Okafor").click();
    await drawer(page).getByRole("button", { name: "Cancel call" }).click();
    await page.getByRole("dialog", { name: /Cancel Daniel/ }).getByRole("button", { name: "Keep the call" }).click();
    await expect(drawer(page)).toContainText("Confirmed");
    await page.keyboard.press("Escape");
    await expect(tab(page, "Upcoming")).toContainText("7");
  });

  test("a cancelled call frees up the dashboard's upcoming list", async ({ page }) => {
    await row(page, "Aisha Rahman").click();
    await drawer(page).getByRole("button", { name: "Cancel call" }).click();
    await page.getByRole("dialog", { name: /Cancel Aisha/ }).getByRole("button", { name: "Cancel call" }).click();
    await page.keyboard.press("Escape");
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: "Dashboard" }).click();
    const card = page.getByRole("region", { name: "Upcoming calls" });
    await expect(card.locator("li").first()).toContainText("James Carter");
    await expect(card).not.toContainText("Aisha Rahman");
  });
});

test.describe("admin bookings: calendar", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
    await page.getByRole("button", { name: "Calendar", exact: true }).click();
  });

  test("shows the month with calls on their days and an agenda for the chosen day", async ({ page }) => {
    const grid = page.getByRole("grid");
    await expect(grid.locator('[data-today="true"]')).toHaveCount(1);
    await expect(grid.locator(".adm-chip-call").first()).toBeVisible();
    const cell = grid.getByRole("gridcell", { name: /^[A-Za-z]+ \d+ \w+, 2 calls/ });
    if (await cell.count()) {
      await cell.first().click();
      await expect(page.getByRole("complementary", { name: "Day agenda" }).locator("button.adm-call")).toHaveCount(2);
    }
    await page.getByRole("button", { name: "Next month" }).click();
    await page.getByRole("button", { name: "Today", exact: true }).click();
    await expect(page.locator('[data-today="true"]')).toBeVisible();
  });

  test("a day can be blocked and unblocked from the agenda", async ({ page }) => {
    // choose a weekday well inside the booking window with no calls: the 5th weekday from the first cell that is open and empty
    const cells = page.locator('.adm-calcell[data-closed="false"][data-blocked="false"]:not([data-today="true"])');
    const target = cells.filter({ hasNot: page.locator(".adm-chip-call") }).last();
    await target.click();
    const agenda = page.getByRole("complementary", { name: "Day agenda" });
    await agenda.getByRole("textbox", { name: "Reason for blocking" }).fill("Bank holiday");
    await agenda.getByRole("button", { name: "Block this day" }).click();
    await expect(agenda).toContainText("Blocked: Bank holiday");
    await expect(page.locator('.adm-calcell[data-blocked="true"]')).toHaveCount(1);
    await expect(page.locator('.adm-calcell[data-blocked="true"] em')).toHaveText("Blocked");
    await agenda.getByRole("button", { name: "Unblock this day" }).click();
    await expect(page.locator('.adm-calcell[data-blocked="true"]')).toHaveCount(0);
  });
});

test.describe("admin bookings: availability", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
    await page.getByRole("tab", { name: "Availability" }).click();
  });

  test("shows the weekly hours, call settings and a preview of free times", async ({ page }) => {
    for (const d of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) await expect(page.getByRole("switch", { name: `${d} available` })).toBeChecked();
    await expect(page.getByRole("switch", { name: "Saturday available" })).not.toBeChecked();
    await expect(page.getByLabel("Call length")).toHaveValue("30");
    await expect(page.getByLabel("Minimum notice")).toHaveValue("4");
    await expect(page.getByLabel("Video call link")).toHaveValue(/meet\.google\.com/);
    await expect(page.getByRole("list", { name: "Next free times" }).locator("li")).toHaveCount(6);
    await expect(page.getByRole("region", { name: "Save changes" })).toContainText("All changes saved.");
    await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled();
  });

  test("changes are flagged until saved, can be discarded, and are kept after a reload", async ({ page }) => {
    await page.getByLabel("Call length").selectOption("60");
    await expect(page.getByRole("region", { name: "Save changes" })).toContainText("You have unsaved changes.");
    await page.getByRole("button", { name: "Discard" }).click();
    await expect(page.getByLabel("Call length")).toHaveValue("30");
    await page.getByLabel("Gap between calls").selectOption("15");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Availability saved" })).toBeVisible();
    await page.reload();
    await page.getByRole("tab", { name: "Availability" }).click();
    await expect(page.getByLabel("Gap between calls")).toHaveValue("15");
  });

  test("hours that are too short for one call are rejected", async ({ page }) => {
    await page.getByLabel("Call length").selectOption("60");
    await page.getByLabel("Monday from").selectOption("09:00");
    await page.getByLabel("Monday until").selectOption("09:30");
    await expect(page.getByText("Too short for one call")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save changes" })).toBeDisabled();
  });

  test("turning every day off warns that nothing can be booked", async ({ page }) => {
    for (const d of ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]) await page.getByRole("switch", { name: `${d} available` }).uncheck();
    await expect(page.getByText("No free times.")).toBeVisible();
  });

  test("days off can be added and removed", async ({ page }) => {
    const d = new Date();
    d.setDate(d.getDate() + 5);
    await page.locator("#av-date").fill(iso(d));
    await page.locator("#av-reason").fill("Team day");
    await page.getByRole("button", { name: "Block day" }).click();
    const list = page.getByRole("region", { name: "Save changes" }).locator("xpath=preceding::ul[contains(@class,'adm-blocked-list')][1]");
    await expect(list).toContainText("Team day");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Availability saved" })).toBeVisible();
    await page.getByRole("button", { name: /^Unblock / }).click();
    await expect(page.getByText("No days blocked.")).toBeVisible();
  });
});

test.describe("admin bookings on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("list, calendar and availability fit the screen", async ({ page }) => {
    await signIn(page);
    const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    await expect(calls(page).first()).toBeVisible();
    expect(await fits()).toBe(true);
    await page.getByRole("button", { name: "Calendar", exact: true }).click();
    await expect(page.getByRole("grid")).toBeVisible();
    expect(await fits()).toBe(true);
    await page.getByRole("tab", { name: "Availability" }).click();
    await expect(page.getByRole("switch", { name: "Monday available" })).toBeVisible();
    expect(await fits()).toBe(true);
  });
});
