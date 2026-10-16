import { test, expect } from "@playwright/test";

test.describe("idea stress-test invitation", () => {
  test("appears on the homepage after the cookie choice, and starts the stress test with the idea", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __forceInvite: boolean }).__forceInvite = true;
      localStorage.setItem("tc-cookie-consent", "rejected");
    });
    await page.goto("/");
    const dialog = page.getByRole("dialog", { name: "Think your idea is brilliant?" });
    await expect(dialog).toBeVisible({ timeout: 15_000 });
    await expect(dialog).toContainText("Free idea stress test");
    await dialog.getByLabel("Your idea").fill("An app that splits bills");
    await dialog.getByRole("button", { name: "Try to kill it" }).click();
    await expect(page).toHaveURL(/\/kill-my-idea\?idea=An%20app%20that%20splits%20bills/);
  });

  test("waits for the cookie choice, can be dismissed and does not return in the same visit", async ({ page }) => {
    await page.addInitScript(() => ((window as unknown as { __forceInvite: boolean }).__forceInvite = true));
    await page.goto("/");
    await expect(page.locator("#cookie-title")).toBeVisible();
    await page.waitForTimeout(5000);
    await expect(page.getByRole("dialog", { name: "Think your idea is brilliant?" })).toHaveCount(0);
    await page.getByRole("button", { name: "Reject all" }).click();
    const dialog = page.getByRole("dialog", { name: "Think your idea is brilliant?" });
    await expect(dialog).toBeVisible({ timeout: 10_000 });
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await page.reload();
    await page.waitForTimeout(9500);
    await expect(dialog).toHaveCount(0);
  });

  test("is not shown on other pages", async ({ page }) => {
    await page.addInitScript(() => {
      (window as unknown as { __forceInvite: boolean }).__forceInvite = true;
      localStorage.setItem("tc-cookie-consent", "rejected");
    });
    await page.goto("/contact");
    await page.waitForTimeout(9500);
    await expect(page.getByRole("dialog", { name: "Think your idea is brilliant?" })).toHaveCount(0);
  });
});
