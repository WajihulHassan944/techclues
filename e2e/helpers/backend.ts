import { execSync } from "node:child_process";
import path from "node:path";
import type { Page } from "@playwright/test";

const API_REPO = path.resolve(__dirname, "../../../techclues-api");

/**
 * Reseeds the dev database to the deterministic sample dataset. Needed because, unlike the old
 * localStorage-backed admin (fresh sample data on every test's isolated browser context), the
 * real backend persists mutations across tests. Call this in a beforeEach for any describe block
 * whose tests mutate data (delete, mark as spam, change status, etc).
 */
export function reseed() {
  execSync("npm run seed", { cwd: API_REPO, stdio: "pipe" });
}

/** Opens the inbox, finds the row containing `text`, clicks into it, and returns its real id. */
export async function openEnquiryByText(page: Page, text: string): Promise<string> {
  await page.goto("/admin/inbox");
  await page.locator("li.adm-row-item").filter({ hasText: text }).first().locator("a").click();
  const id = page.url().split("/").pop()!;
  return id;
}

/** Opens the blog list, finds the post whose title contains `text`, clicks into it, and returns its real id. */
export async function openPostByText(page: Page, text: string): Promise<string> {
  await page.goto("/admin/blog");
  await page.getByRole("link", { name: new RegExp(`Edit.*${text}`) }).first().click();
  const id = page.url().split("/").pop()!;
  return id;
}
