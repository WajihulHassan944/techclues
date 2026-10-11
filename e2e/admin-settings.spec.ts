import { test, expect, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";

async function signIn(page: Page, to = "/admin/settings") {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill("x");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  if (to !== "/admin") await page.goto(to);
}
const tab = (p: Page, name: string) => p.getByRole("tab", { name });
const toast = (p: Page, text: string | RegExp) => p.getByRole("status").filter({ hasText: text });

test.describe("admin settings: notifications", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
  });

  test("starts with info@techclues.co.uk and sensible alerts", async ({ page }) => {
    await expect(page).toHaveTitle("Settings | TechClues admin");
    const list = page.getByRole("list", { name: "Notification recipients" });
    await expect(list).toContainText("info@techclues.co.uk");
    await expect(list.getByRole("button", { name: "Remove info@techclues.co.uk" })).toBeDisabled();
    await expect(page.getByRole("switch", { name: "A new enquiry arrives" })).toBeChecked();
    await expect(page.getByRole("switch", { name: "Someone subscribes to the newsletter" })).not.toBeChecked();
    await expect(page.getByLabel("From address")).toHaveValue("info@techclues.co.uk");
    await expect(page.getByRole("region", { name: "Save changes" })).toContainText("All changes saved.");
  });

  test("recipients are validated, changes are flagged, saved and kept after a reload", async ({ page }) => {
    await page.getByLabel("Add an email address").fill("nope");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText("Check the email address.")).toBeVisible();
    await page.getByLabel("Add an email address").fill("info@techclues.co.uk");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await expect(page.getByText("That address is already on the list.")).toBeVisible();
    await page.getByLabel("Add an email address").fill("sales@techclues.co.uk");
    await page.getByRole("button", { name: "Add", exact: true }).click();
    await page.getByRole("switch", { name: "Someone subscribes to the newsletter" }).check();
    await expect(page.getByRole("region", { name: "Save changes" })).toContainText("You have unsaved changes.");
    await page.getByRole("button", { name: "Save changes" }).click();
    await expect(toast(page, "Notification settings saved")).toBeVisible();
    await page.reload();
    await expect(page.getByRole("list", { name: "Notification recipients" })).toContainText("sales@techclues.co.uk");
    await expect(page.getByRole("switch", { name: "Someone subscribes to the newsletter" })).toBeChecked();
  });

  test("discard undoes edits, the summary time only shows when the summary is on, and a test email can be sent", async ({ page }) => {
    await page.getByRole("switch", { name: "A call is booked" }).uncheck();
    await page.getByRole("button", { name: "Discard" }).click();
    await expect(page.getByRole("switch", { name: "A call is booked" })).toBeChecked();
    await expect(page.getByLabel("Send the summary at")).toHaveValue("08:00");
    await page.getByRole("switch", { name: "A daily summary" }).uncheck();
    await expect(page.getByLabel("Send the summary at")).toHaveCount(0);
    await page.getByRole("button", { name: "Discard" }).click();
    await page.getByRole("button", { name: "Send a test email" }).click();
    await expect(toast(page, "Test email sent to info@techclues.co.uk")).toBeVisible();
  });
});

test.describe("admin settings: reply templates", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await tab(page, "Reply templates").click();
  });

  test("lists the saved replies and who each is offered for", async ({ page }) => {
    const list = page.locator(".adm-tpls li");
    await expect(list).toHaveCount(8);
    await expect(list.filter({ hasText: "Estimate follow-up" })).toContainText("Cost calculator");
    await expect(list.filter({ hasText: "Thanks, we'll be in touch" })).toContainText("Every enquiry");
  });

  test("a template can be added for chosen forms, edited and deleted, and shows up in the reply box", async ({ page }) => {
    await page.getByRole("button", { name: "New template" }).click();
    const dlg = page.getByRole("dialog", { name: "New template" });
    await expect(dlg.getByRole("button", { name: "Save template" })).toBeDisabled();
    await dlg.getByLabel("Name").fill("Fixed price quote");
    await dlg.getByLabel("Message").fill("Hi {first},\n\nHere is the fixed price we discussed.");
    await dlg.getByRole("checkbox", { name: "Every enquiry" }).uncheck();
    await dlg.getByRole("checkbox", { name: "Contact form" }).check();
    await dlg.getByRole("button", { name: "Save template" }).click();
    await expect(page.locator(".adm-tpls li")).toHaveCount(9);
    await expect(page.locator(".adm-tpls li").filter({ hasText: "Fixed price quote" })).toContainText("Contact form");
    await page.goto("/admin/inbox/enq-1001"); // a contact-form enquiry
    await page.getByRole("combobox", { name: "Insert a saved reply" }).selectOption({ label: "Fixed price quote" });
    await expect(page.getByRole("textbox", { name: "Your reply" })).toHaveValue("Hi Sarah,\n\nHere is the fixed price we discussed.");
    await page.goto("/admin/inbox/enq-1002"); // a calculator enquiry: not offered
    await expect(page.getByRole("combobox", { name: "Insert a saved reply" }).locator("option", { hasText: "Fixed price quote" })).toHaveCount(0);
    await page.goto("/admin/settings");
    await tab(page, "Reply templates").click();
    await page.getByRole("button", { name: "Edit Fixed price quote" }).click();
    await page.getByRole("dialog", { name: "Edit template" }).getByLabel("Name").fill("Fixed price offer");
    await page.getByRole("dialog", { name: "Edit template" }).getByRole("button", { name: "Save template" }).click();
    await expect(page.locator(".adm-tpls li").filter({ hasText: "Fixed price offer" })).toBeVisible();
    await page.getByRole("button", { name: "Delete Fixed price offer" }).click();
    await page.getByRole("dialog", { name: "Delete this template?" }).getByRole("button", { name: "Delete template" }).click();
    await expect(page.locator(".adm-tpls li")).toHaveCount(8);
  });

  test("the defaults can be restored", async ({ page }) => {
    await page.getByRole("button", { name: "Delete Not a fit right now" }).click();
    await page.getByRole("dialog", { name: "Delete this template?" }).getByRole("button", { name: "Delete template" }).click();
    await expect(page.locator(".adm-tpls li")).toHaveCount(7);
    await page.getByRole("button", { name: "Restore the default templates" }).click();
    await expect(page.locator(".adm-tpls li")).toHaveCount(8);
  });

  test("the signature is saved and added to replies", async ({ page }) => {
    await page.locator("#st-sig").fill("Kind regards,\nKhashir\nTechClues");
    await page.getByRole("button", { name: "Save signature" }).click();
    await expect(toast(page, "Signature saved")).toBeVisible();
    await page.goto("/admin/inbox/enq-1001");
    await expect(page.getByLabel("Signature added to your reply")).toContainText("Khashir");
    await page.getByRole("textbox", { name: "Your reply" }).fill("Thanks!");
    await page.getByRole("button", { name: /Send reply/ }).click();
    await expect(page.locator(".adm-msg-us")).toContainText("Kind regards,");
  });
});

test.describe("admin settings: password and security", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await tab(page, "Password & security").click();
  });

  test("password changes are checked, rated and recorded", async ({ page }) => {
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page.getByText("Enter your current password.")).toBeVisible();
    await expect(page.getByText("Use at least 12 characters.")).toBeVisible();
    await page.getByLabel("Current password").fill("old-password");
    await page.getByLabel("New password", { exact: true }).fill("short");
    await expect(page.getByRole("img", { name: "Password strength: Too short" })).toBeVisible();
    await page.getByLabel("New password", { exact: true }).fill("Correct-Horse-Battery-9!");
    await expect(page.getByRole("img", { name: /Password strength: (Strong|Very strong)/ })).toBeVisible();
    await page.getByLabel("Confirm new password").fill("different");
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(page.getByText("The two passwords don't match.")).toBeVisible();
    await page.getByLabel("Confirm new password").fill("Correct-Horse-Battery-9!");
    await page.getByRole("button", { name: "Change password" }).click();
    await expect(toast(page, "Password changed")).toBeVisible();
    await expect(page.getByText(/Last changed/)).toBeVisible();
    await expect(page.getByLabel("Current password")).toHaveValue("");
  });

  test("show passwords reveals the fields, and signed-in devices are listed", async ({ page }) => {
    await page.getByRole("checkbox", { name: "Show passwords" }).check();
    await expect(page.getByLabel("New password", { exact: true })).toHaveAttribute("type", "text");
    const devices = page.getByRole("list", { name: "Signed-in devices" });
    await expect(devices.locator("li")).toHaveCount(3);
    await expect(devices).toContainText("This device");
    await expect(page.getByRole("switch", { name: "Two-step sign-in" })).toBeDisabled();
  });

  test("signing out of every device returns to the sign-in screen", async ({ page }) => {
    await page.getByRole("button", { name: "Sign out of every device" }).click();
    await expect(page).toHaveURL(/\/admin\/login$/);
    await page.goto("/admin/settings");
    await expect(page).toHaveURL(/\/admin\/login$/);
  });
});

test.describe("admin settings: privacy and data", () => {
  test.beforeEach(async ({ page }) => {
    await signIn(page);
    await tab(page, "Privacy & data").click();
  });

  test("finds everything held about a person, exports it and deletes it after confirming", async ({ page }) => {
    await page.getByLabel("Email address to look up").fill("james@northernfreight.co.uk");
    await page.getByRole("button", { name: "Look up" }).click();
    const found = page.getByRole("region", { name: "Data held about james@northernfreight.co.uk" });
    await expect(found).toContainText("1 enquiry");
    await expect(found).toContainText("Shipment tracking platform for hauliers");
    await expect(found).toContainText("1 call");
    await expect(found).toContainText("0 newsletter records");
    const [download] = await Promise.all([page.waitForEvent("download"), found.getByRole("button", { name: "Export their data" }).click()]);
    expect(download.suggestedFilename()).toMatch(/^data-james-northernfreight-co-uk-\d{4}-\d{2}-\d{2}\.json$/);
    const json = JSON.parse(readFileSync((await download.path())!, "utf8"));
    expect(json.email).toBe("james@northernfreight.co.uk");
    expect(json.enquiries).toHaveLength(1);
    expect(json.bookings).toHaveLength(1);
    await found.getByRole("button", { name: "Delete everything" }).click();
    const dlg = page.getByRole("dialog", { name: /Delete everything about/ });
    await dlg.getByRole("button", { name: "Keep it" }).click();
    await found.getByRole("button", { name: "Delete everything" }).click();
    await page.getByRole("dialog", { name: /Delete everything about/ }).getByRole("button", { name: "Delete for good" }).click();
    await page.goto("/admin/inbox");
    await expect(page.locator("li.adm-row-item", { hasText: "James Carter" })).toHaveCount(0);
    await page.goto("/admin/bookings");
    await expect(page.locator("button.adm-call", { hasText: "James Carter" })).toHaveCount(0);
  });

  test("says when nothing is held, and keeps the retention settings", async ({ page }) => {
    await page.getByLabel("Email address to look up").fill("nobody@example.com");
    await page.getByRole("button", { name: "Look up" }).click();
    await expect(page.getByText("Nothing is held about nobody@example.com.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save", exact: true })).toBeDisabled();
    await page.getByLabel("Delete spam after").selectOption("14");
    await page.getByLabel("Delete old enquiries after").selectOption("24");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(toast(page, "Retention settings saved")).toBeVisible();
    await page.reload();
    await tab(page, "Privacy & data").click();
    await expect(page.getByLabel("Delete spam after")).toHaveValue("14");
    await expect(page.getByLabel("Delete old enquiries after")).toHaveValue("24");
  });
});

test.describe("admin settings: activity log", () => {
  test("records what is done in the panel, filters, exports and clears", async ({ page }) => {
    await signIn(page);
    await page.goto("/admin/inbox/enq-1001");
    await page.getByRole("textbox", { name: "Your reply" }).fill("Thanks Sarah.");
    await page.getByRole("button", { name: /Send reply/ }).click();
    await expect(toast(page, "Reply sent")).toBeVisible();
    await page.goto("/admin/settings");
    await tab(page, "Activity log").click();
    const log = page.getByRole("list", { name: "Activity" });
    await expect(log.locator("li").first()).toContainText("Replied to Sarah Whitfield (Tutoring marketplace: MVP and web app)");
    await expect(log).toContainText("Signed in from this device");
    await expect(log).toContainText("Published “How much does an MVP cost in the UK?”");
    await page.getByRole("button", { name: "Inbox", exact: true }).click();
    for (const t of await log.locator("li small").allTextContents()) expect(t).toMatch(/^Inbox/);
    await page.getByRole("button", { name: "Everything" }).click();
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Export CSV" }).click()]);
    expect(readFileSync((await download.path())!, "utf8")).toContain("When,Area,What");
    await page.getByRole("button", { name: "Clear log" }).click();
    await page.getByRole("dialog", { name: "Clear the activity log?" }).getByRole("button", { name: "Keep it" }).click();
    await expect(log.locator("li").first()).toBeVisible();
    await page.getByRole("button", { name: "Clear log" }).click();
    await page.getByRole("dialog", { name: "Clear the activity log?" }).getByRole("button", { name: "Clear log" }).click();
    await expect(page.getByText("Nothing logged yet.")).toBeVisible();
  });
});

test.describe("admin settings on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test("every section fits the screen", async ({ page }) => {
    await signIn(page);
    const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    for (const t of ["Notifications", "Reply templates", "Password & security", "Privacy & data", "Activity log"]) {
      await tab(page, t).click();
      expect(await fits()).toBe(true);
    }
  });
});
