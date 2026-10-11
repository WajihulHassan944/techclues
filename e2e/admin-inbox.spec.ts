import { test, expect, type Page } from "@playwright/test";

async function signIn(page: Page, to = "/admin/inbox") {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill("x");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  if (to !== "/admin") await page.goto(to);
}
const rows = (p: Page) => p.locator("li.adm-row-item");
const tab = (p: Page, name: string) => p.getByRole("tab", { name: new RegExp(`^${name}`) });
const navBadge = (p: Page) => p.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /Inbox/ }).locator(".adm-badge");

test.describe("admin inbox: list", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("shows the sample enquiries with live counts and the unread badge", async ({ page }) => {
    await expect(page).toHaveTitle("Inbox | TechClues admin");
    await expect(rows(page)).toHaveCount(14);
    await expect(tab(page, "All")).toContainText("14");
    await expect(tab(page, "Unread")).toContainText("5");
    await expect(tab(page, "Needs reply")).toContainText("8");
    await expect(tab(page, "Starred")).toContainText("2");
    await expect(tab(page, "Replied")).toContainText("3");
    await expect(navBadge(page)).toHaveText("5");
    const first = rows(page).first();
    await expect(first).toContainText("Sarah Whitfield");
    await expect(first).toContainText("Contact form");
    await expect(first).toContainText("Tutoring marketplace");
    await expect(first).toContainText("New");
  });

  test("every website form appears as a source", async ({ page }) => {
    const chips = page.getByRole("group", { name: "Filter by source" });
    for (const s of ["Contact form", "Cost calculator", "Kill my idea", "Grant support", "Partner: referral", "Partner: application", "ZERO.ONE brief", "Careers"]) await expect(chips).toContainText(s);
  });

  test("search narrows the list and the empty state offers to clear filters", async ({ page }) => {
    await page.getByRole("searchbox", { name: "Search enquiries" }).fill("northern");
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first()).toContainText("James Carter");
    await page.getByRole("searchbox", { name: "Search enquiries" }).fill("zzzz-nothing");
    await expect(page.getByRole("heading", { name: "No enquiries match" })).toBeVisible();
    await page.getByRole("button", { name: "Clear filters" }).click();
    await expect(rows(page)).toHaveCount(14);
  });

  test("status tabs and source chips filter the rows", async ({ page }) => {
    await tab(page, "Needs reply").click();
    await expect(rows(page)).toHaveCount(8);
    await tab(page, "Unread").click();
    await expect(rows(page)).toHaveCount(5);
    await tab(page, "All").click();
    await page.getByRole("group", { name: "Filter by source" }).getByRole("button", { name: /Cost calculator/ }).click();
    await expect(rows(page)).toHaveCount(2);
    await page.getByRole("button", { name: "All sources" }).click();
    await expect(rows(page)).toHaveCount(14);
  });

  test("sorting puts the oldest enquiry first", async ({ page }) => {
    await page.getByRole("combobox", { name: "Sort" }).selectOption("oldest");
    await expect(rows(page).first()).toContainText("Ben Taylor");
  });

  test("starring is remembered after a reload", async ({ page }) => {
    const star = page.getByRole("button", { name: "Star Sarah Whitfield" });
    await star.click();
    await expect(page.getByRole("button", { name: "Unstar Sarah Whitfield" })).toHaveAttribute("aria-pressed", "true");
    await page.reload();
    await expect(page.getByRole("button", { name: "Unstar Sarah Whitfield" })).toBeVisible();
    await expect(tab(page, "Starred")).toContainText("3");
  });

  test("selecting rows shows bulk actions: mark read, set status, spam and delete", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Select Sarah Whitfield" }).check();
    await page.getByRole("checkbox", { name: "Select Daniel Okafor" }).check();
    await expect(page.getByText("2 selected")).toBeVisible();
    await page.getByRole("button", { name: "Mark read" }).click();
    await expect(navBadge(page)).toHaveText("3");
    await page.getByRole("checkbox", { name: "Select Priya Nair" }).check();
    await page.getByRole("combobox", { name: "Set status" }).selectOption("qualified");
    await expect(page.getByRole("status")).toContainText("Marked as qualified");
    await expect(tab(page, "Qualified")).toContainText("2");
    await page.getByRole("checkbox", { name: "Select Marcus Doyle" }).check();
    await page.getByRole("button", { name: "Spam", exact: true }).click();
    await expect(rows(page)).toHaveCount(13);
    await page.getByRole("checkbox", { name: "Select Hannah Lee" }).check();
    await page.getByRole("button", { name: "Delete" }).click();
    await expect(rows(page)).toHaveCount(12);
  });

  test("select all picks every shown row and Clear drops the selection", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Select all shown" }).check();
    await expect(page.getByText("14 selected")).toBeVisible();
    await page.getByRole("button", { name: "Clear" }).click();
    await expect(page.getByText("14 enquiries")).toBeVisible();
  });
});

test.describe("admin inbox: enquiry", () => {
  test("opening an enquiry shows the submission, details and marks it read", async ({ page }) => {
    await signIn(page);
    await expect(navBadge(page)).toHaveText("5");
    await rows(page).filter({ hasText: "Daniel Okafor" }).locator("a").click();
    await expect(page).toHaveURL(/\/admin\/inbox\/enq-1002$/);
    await expect(page.getByRole("heading", { level: 2, name: /Estimate: fleet maintenance/ })).toBeVisible();
    const sub = page.getByRole("article", { name: "Original submission" });
    await expect(sub).toContainText("daniel@fleetwise.io");
    await expect(sub).toContainText("Sign-up and login, Dashboard, Notifications, Payments");
    await expect(sub).toContainText("£18,400 – £24,600");
    await expect(navBadge(page)).toHaveText("4");
    await expect(page.getByRole("link", { name: "daniel@fleetwise.io" })).toHaveAttribute("href", "mailto:daniel@fleetwise.io");
    await expect(page.getByRole("link", { name: "+44 7700 900412" })).toHaveAttribute("href", "tel:+447700900412");
  });

  test("shows attachments for applications and the verdict for idea tests", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1008");
    await expect(page.getByRole("list", { name: "Attachments" })).toContainText("Luca-Moretti-CV.pdf");
    await page.goto("/admin/inbox/enq-1003");
    await expect(page.getByText("Verdict shown to the visitor")).toBeVisible();
    await expect(page.getByText("Weak point: Rover and Facebook groups are free and familiar")).toBeVisible();
  });

  test("a saved reply is inserted and sent: message, status, toast and draft clean-up", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1002");
    const select = page.getByRole("combobox", { name: "Insert a saved reply" });
    await expect(select.locator("option", { hasText: "Estimate follow-up" })).toHaveCount(1);
    await expect(select.locator("option", { hasText: "Careers acknowledgement" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: /Send reply/ })).toBeDisabled();
    await select.selectOption({ label: "Estimate follow-up" });
    const box = page.getByRole("textbox", { name: "Your reply" });
    await expect(box).toHaveValue(/^Hi Daniel,/);
    await page.getByRole("button", { name: /Send reply/ }).click();
    await expect(page.getByRole("status").filter({ hasText: "Reply sent from info@techclues.co.uk" })).toBeVisible();
    await expect(box).toHaveValue("");
    const sent = page.locator(".adm-msg-us");
    await expect(sent).toHaveCount(1);
    await expect(sent).toContainText("Thanks for using our cost calculator");
    await expect(sent).toContainText("TechClues team");
    await expect(page.locator(".adm-statusrow .adm-status")).toHaveText("Replied");
    await page.reload();
    await expect(page.locator(".adm-msg-us")).toHaveCount(1); // kept in this browser
  });

  test("an unsent draft is kept when leaving and coming back", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1001");
    await page.getByRole("textbox", { name: "Your reply" }).fill("Half-written reply");
    await expect(page.getByText("Draft saved")).toBeVisible();
    await page.getByRole("link", { name: "Inbox", exact: true }).first().click();
    await rows(page).filter({ hasText: "Sarah Whitfield" }).locator("a").click();
    await expect(page.getByRole("textbox", { name: "Your reply" })).toHaveValue("Half-written reply");
  });

  test("status can be changed and private notes added", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1001");
    await page.getByRole("combobox", { name: "Change status" }).selectOption("qualified");
    await expect(page.locator(".adm-statusrow .adm-status")).toHaveText("Qualified");
    await page.getByRole("textbox", { name: "Add a note" }).fill("Call on Friday");
    await page.getByRole("button", { name: "Add note" }).click();
    await expect(page.locator(".adm-notes")).toContainText("Call on Friday");
    await expect(page.getByRole("textbox", { name: "Add a note" })).toHaveValue("");
  });

  test("an existing conversation and note are shown, and other enquiries from the same person are linked", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1009");
    await expect(page.locator(".adm-msg-us")).toHaveCount(2);
    await expect(page.getByText("Thanks. We use Mandata.")).toBeVisible();
    await expect(page.locator(".adm-notes")).toContainText("Decision maker is James");
  });

  test("previous and next move through the list, and an unknown id shows a not-found message", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1002");
    await expect(page.getByRole("link", { name: "Newer enquiry" })).toHaveAttribute("href", "/admin/inbox/enq-1001");
    await expect(page.getByRole("link", { name: "Older enquiry" })).toHaveAttribute("href", "/admin/inbox/enq-1003");
    await page.getByRole("link", { name: "Older enquiry" }).click();
    await expect(page).toHaveURL(/enq-1003$/);
    await page.goto("/admin/inbox/enq-9999");
    await expect(page.getByRole("heading", { name: "Enquiry not found" })).toBeVisible();
  });

  test("marking as spam goes back to the inbox, and the enquiry is in spam with a banner and no reply box", async ({ page }) => {
    await signIn(page, "/admin/inbox/enq-1001");
    await page.getByRole("button", { name: "Mark as spam" }).click();
    await expect(page).toHaveURL(/\/admin\/inbox$/);
    await expect(rows(page)).toHaveCount(13);
    await page.goto("/admin/inbox/enq-1001");
    await expect(page.getByRole("status").filter({ hasText: "This enquiry is in spam." })).toBeVisible();
    await expect(page.getByRole("region", { name: "Reply" })).toHaveCount(0);
    await page.getByRole("button", { name: "Not spam" }).click();
    await expect(page.getByRole("region", { name: "Reply" })).toBeVisible();
  });
});

test.describe("admin inbox: spam and trash", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page, "/admin/inbox/spam");
  });

  test("lists spam and trash with counts, blocked senders and the sample reset", async ({ page }) => {
    await expect(page).toHaveTitle("Spam & trash | TechClues admin");
    await expect(page.getByRole("tab", { name: /^Spam/ })).toContainText("2");
    await expect(page.getByRole("tab", { name: /^Trash/ })).toContainText("1");
    await expect(rows(page)).toHaveCount(2);
    await expect(page.getByRole("region", { name: "Blocked senders" })).toContainText("promo@cheap-backlinks.biz");
    await page.getByRole("tab", { name: /^Trash/ }).click();
    await expect(rows(page)).toHaveCount(1);
    await expect(rows(page).first()).toContainText("Dev Patel");
  });

  test("not spam returns an enquiry to the inbox", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Select Mark Johnson" }).check();
    await page.getByRole("button", { name: "Not spam" }).click();
    await expect(rows(page)).toHaveCount(1);
    await expect(navBadge(page)).toHaveText("6");
  });

  test("emptying needs confirmation, and deleting is permanent", async ({ page }) => {
    await page.getByRole("button", { name: "Empty spam" }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Delete 2 for good?" })).toBeVisible();
    await page.getByRole("button", { name: "Cancel" }).click();
    await expect(rows(page)).toHaveCount(2);
    await page.getByRole("button", { name: "Empty spam" }).click();
    await page.getByRole("button", { name: "Yes, delete" }).click();
    await expect(page.getByRole("heading", { name: "Nothing in spam" })).toBeVisible();
    await page.getByRole("button", { name: "Restore the sample enquiries" }).click();
    await expect(rows(page)).toHaveCount(2);
  });

  test("blocking a sender from an enquiry lists them, and they can be unblocked", async ({ page }) => {
    await page.goto("/admin/inbox/enq-1001");
    await page.getByRole("button", { name: "Block this sender" }).click();
    await expect(page.getByRole("button", { name: "Sender blocked" })).toBeDisabled();
    await page.goto("/admin/inbox/spam");
    const blocked = page.getByRole("region", { name: "Blocked senders" });
    await expect(blocked).toContainText("sarah@brightpathtutoring.co.uk");
    await blocked.locator("li", { hasText: "sarah@brightpathtutoring.co.uk" }).getByRole("button", { name: "Unblock" }).click();
    await expect(blocked).not.toContainText("sarah@brightpathtutoring.co.uk");
  });
});

test.describe("admin inbox on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("list and enquiry fit the screen and rows still show who wrote", async ({ page }) => {
    await signIn(page);
    await expect(rows(page).first().getByText("Sarah Whitfield")).toBeVisible();
    await expect(page.getByRole("searchbox", { name: "Search enquiries" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.goto("/admin/inbox/enq-1009");
    await expect(page.getByRole("heading", { level: 2, name: /Shipment tracking/ })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
});
