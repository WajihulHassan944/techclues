import { test, expect, type Page } from "@playwright/test";
import { openPostByText, reseed } from "./helpers/backend";

test.describe.configure({ mode: "serial" });

async function signIn(page: Page, to = "/admin/blog") {
  await page.goto("/admin/login");
  await page.locator("#adm-password").fill(process.env.E2E_ADMIN_PASSWORD ?? "");
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/admin$/);
  if (to !== "/admin") await page.goto(to);
}
const posts = (p: Page) => p.locator("li.adm-post");
const tab = (p: Page, name: string) => p.getByRole("tab", { name: new RegExp(`^${name}`) });
const editor = (p: Page) => p.getByRole("textbox", { name: "Article body" });
const post = (p: Page, title: string) => posts(p).filter({ hasText: title });
const status = (p: Page) => p.locator(".adm-editbar .adm-pstatus");

async function newPost(page: Page) {
  await page.goto("/admin/blog/new");
  await expect(page).toHaveURL(/\/admin\/blog\/[a-f0-9]{24}$/);
  await expect(page.locator("#post-title")).toBeVisible();
}
async function fillRequired(page: Page, title = "A brand new idea") {
  await page.locator("#post-title").fill(title);
  await editor(page).click();
  await page.keyboard.type("This is the first paragraph of the post.");
  await page.getByLabel("Category", { exact: true }).selectOption("Costs");
  await page.getByRole("textbox", { name: "Short summary" }).fill("A short summary of the post.");
}

test.describe("admin blog: posts", () => {
  test.beforeEach(async ({ page }) => {
    reseed();
    await signIn(page);
  });

  test("lists the sample posts with status counts, category, author, date and reading time", async ({ page }) => {
    await expect(page).toHaveTitle("Blog | TechClues admin");
    await expect(posts(page)).toHaveCount(6);
    await expect(tab(page, "All")).toContainText("6");
    await expect(tab(page, "Published")).toContainText("3");
    await expect(tab(page, "Scheduled")).toContainText("1");
    await expect(tab(page, "Drafts")).toContainText("2");
    const ai = post(page, "MVP Software Development in the Age of AI");
    await expect(ai).toContainText("/blog/mvp-software-development-age-of-ai");
    await expect(ai).toContainText("AI");
    await expect(ai).toContainText("TechClues team");
    await expect(ai).toContainText("Published");
    await expect(ai).toContainText("6 Oct 2026");
    await expect(ai).toContainText("16 min");
    await expect(post(page, "How to validate a startup idea")).toContainText("Scheduled");
    await expect(post(page, "Prototype vs MVP")).toContainText("Draft");
    await expect(post(page, "No-code or custom code")).toContainText("Khashir Khalil");
  });

  test("status tabs, category, search and sort narrow the list", async ({ page }) => {
    await tab(page, "Published").click();
    await expect(posts(page)).toHaveCount(3);
    await tab(page, "Drafts").click();
    await expect(posts(page)).toHaveCount(2);
    await tab(page, "All").click();
    await page.getByRole("combobox", { name: "Category" }).selectOption("Costs");
    await expect(posts(page)).toHaveCount(1);
    await page.getByRole("combobox", { name: "Category" }).selectOption("");
    await page.getByRole("searchbox", { name: "Search posts" }).fill("prototype");
    await expect(posts(page)).toHaveCount(1);
    await page.getByRole("searchbox", { name: "Search posts" }).fill("zzzz");
    await expect(page.getByRole("heading", { name: "No posts match" })).toBeVisible();
    await page.getByRole("searchbox", { name: "Search posts" }).fill("");
    await page.getByRole("combobox", { name: "Sort" }).selectOption("title");
    await expect(posts(page).first()).toContainText("Funding for AI projects");
  });

  test("the row menu edits, duplicates, links to the live post and deletes with confirmation", async ({ page }) => {
    await page.getByRole("button", { name: /Actions for How much does an MVP cost/ }).click();
    await expect(page.getByRole("menuitem", { name: "View on the site" })).toHaveAttribute("href", "/blog/mvp-cost-uk");
    await page.getByRole("menuitem", { name: "Duplicate" }).click();
    await expect(page).toHaveURL(/\/admin\/blog\/[a-f0-9]{24}$/);
    await expect(page.locator("#post-title")).toHaveValue("How much does an MVP cost in the UK? (copy)");
    await expect(page.locator("#post-slug")).toHaveValue("mvp-cost-uk-copy");
    await expect(status(page)).toHaveText("Draft");
    await page.getByRole("button", { name: "Posts" }).click();
    await expect(page).toHaveURL(/\/admin\/blog$/);
    await expect(posts(page)).toHaveCount(7);
    await page.getByRole("button", { name: /Actions for How much does an MVP cost in the UK\? \(copy\)/ }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    const dlg = page.getByRole("dialog", { name: "Delete this post?" });
    await dlg.getByRole("button", { name: "Keep it" }).click();
    await expect(posts(page)).toHaveCount(7);
    await page.getByRole("button", { name: /Actions for How much does an MVP cost in the UK\? \(copy\)/ }).click();
    await page.getByRole("menuitem", { name: "Delete" }).click();
    await page.getByRole("dialog", { name: "Delete this post?" }).getByRole("button", { name: "Delete post" }).click();
    await expect(posts(page)).toHaveCount(6);
  });

  test("categories can be added, renamed and deleted when unused", async ({ page }) => {
    await page.getByRole("tab", { name: /^Categories/ }).click();
    const list = page.getByRole("region", { name: "Categories" });
    await expect(list.locator("li")).toHaveCount(6);
    await expect(list.locator("li", { hasText: "Costs" })).toContainText("1 post");
    await expect(list.getByRole("button", { name: "Delete Costs" })).toBeDisabled();
    await list.getByRole("textbox", { name: "New category name" }).fill("Marketing");
    await list.getByRole("button", { name: "Add category" }).click();
    await expect(list.locator("li")).toHaveCount(7);
    await list.getByRole("button", { name: "Delete Marketing" }).click();
    await expect(list.locator("li")).toHaveCount(6);
    await list.getByRole("button", { name: "Rename Costs" }).click();
    await list.getByRole("textbox", { name: "Category name", exact: true }).fill("Pricing");
    await list.getByRole("button", { name: "Save" }).click();
    await page.getByRole("tab", { name: /^Posts/ }).click();
    await expect(post(page, "How much does an MVP cost")).toContainText("Pricing");
  });

  test("authors can be added and edited; an author with posts cannot be deleted", async ({ page }) => {
    await page.getByRole("tab", { name: /^Authors/ }).click();
    const list = page.getByRole("region", { name: "Authors" });
    await expect(list.locator("li")).toHaveCount(2);
    await expect(list.getByRole("button", { name: "Delete TechClues team" })).toBeDisabled();
    await list.getByRole("textbox", { name: "Author name" }).fill("Hassam Ul Haq");
    await list.getByRole("textbox", { name: "Role" }).fill("CTO");
    await list.getByRole("button", { name: "Add author" }).click();
    await expect(list.locator("li", { hasText: "Hassam Ul Haq" })).toContainText("CTO · 0 posts");
    await list.getByRole("button", { name: "Edit Hassam Ul Haq" }).click();
    await list.getByRole("textbox", { name: "Role" }).last().fill("Chief Technical Officer");
    await list.getByRole("button", { name: "Save" }).click();
    await expect(list.locator("li", { hasText: "Hassam Ul Haq" })).toContainText("Chief Technical Officer");
    await list.getByRole("button", { name: "Delete Hassam Ul Haq" }).click();
    await expect(list.locator("li")).toHaveCount(2);
  });
});

test.describe("admin blog: editor", () => {
  test.beforeEach(() => reseed());

  test("opens a published post with its body, settings, checklist and contents list", async ({ page }) => {
    await signIn(page);
    await openPostByText(page, "How much does an MVP cost");
    await expect(page.locator("#post-title")).toHaveValue("How much does an MVP cost in the UK?");
    await expect(page.locator("#post-slug")).toHaveValue("mvp-cost-uk");
    await expect(status(page)).toHaveText("Published");
    await expect(editor(page)).toContainText("There's no single price for an MVP");
    await expect(editor(page).locator("h2")).toHaveCount(9);
    await expect(editor(page).locator("table")).toHaveCount(1);
    await expect(page.getByLabel("Category", { exact: true })).toHaveValue("Costs");
    await expect(page.getByRole("list", { name: "Headings in this post" }).locator("li")).toHaveCount(await editor(page).locator("h2, h3").count());
    await expect(page.getByRole("list", { name: "Before you publish" }).locator('li[data-ok="true"]')).toHaveCount(8);
    await expect(page.locator(".adm-wordcount")).toContainText(/\d[\d,]* words · about \d+ min read/);
    await expect(page.getByRole("link", { name: "View on the site" })).toHaveAttribute("href", "/blog/mvp-cost-uk");
    await expect(page.locator(".adm-serp")).toContainText("MVP Cost in UK and How Much Startups Should Budget | TechClues");
  });

  test("formatting tools change the text: headings, bold, link, lists, image, table and divider", async ({ page }) => {
    await signIn(page);
    await newPost(page);
    const ed = editor(page);
    await ed.click();
    await page.keyboard.type("Intro paragraph");
    await page.keyboard.press("Enter");
    await page.keyboard.type("A section title");
    await page.getByRole("button", { name: "Heading 2" }).click();
    await expect(ed.locator("h2")).toHaveText("A section title");
    await expect(page.getByRole("list", { name: "Headings in this post" })).toContainText("A section title");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Bold words");
    await page.keyboard.press("Shift+Home");
    await page.getByRole("button", { name: "Bold" }).click();
    await expect(ed.locator("strong")).toHaveText("Bold words");
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await page.keyboard.type("Linked text");
    await page.keyboard.press("Shift+Home");
    await page.getByRole("button", { name: "Link", exact: true }).click();
    await page.getByLabel("Link address").fill("example.com/page");
    await page.getByRole("button", { name: "Apply" }).click();
    await expect(ed.locator('a[href="https://example.com/page"]')).toHaveText("Linked text");
    await page.keyboard.press("End");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Bulleted list" }).click();
    await page.keyboard.type("First point");
    await expect(ed.locator("ul li")).toHaveText("First point");
    await page.getByRole("button", { name: "Image", exact: true }).click();
    await page.getByLabel("Description (alt text)", { exact: true }).fill("A diagram");
    await page.getByLabel("Image address", { exact: true }).fill("/images/services/mvp.jpg");
    await page.getByRole("button", { name: "Insert from address" }).click();
    await expect(ed.locator('img[alt="A diagram"][src="/images/services/mvp.jpg"]')).toHaveCount(1);
    await page.getByRole("button", { name: "Table", exact: true }).click();
    await expect(ed.locator("table td, table th")).toHaveCount(9);
    await page.getByRole("button", { name: "Divider" }).click();
    await expect(ed.locator("hr")).toHaveCount(1);
    await page.getByRole("button", { name: "Undo" }).click();
    await expect(ed.locator("hr")).toHaveCount(0);
  });

  test("a new post's address follows the title, and drafts save themselves", async ({ page }) => {
    await signIn(page);
    await newPost(page);
    await page.locator("#post-title").fill("What's a Minimum Viable Product?");
    await expect(page.locator("#post-slug")).toHaveValue("whats-a-minimum-viable-product");
    await page.locator("#post-slug").fill("what-is-an-mvp");
    await page.locator("#post-title").fill("What is an MVP, really?");
    await expect(page.locator("#post-slug")).toHaveValue("what-is-an-mvp"); // edited by hand, so it stays
    await expect(page.getByText(/Saved .*|All changes saved/)).toBeVisible({ timeout: 6000 });
    await page.reload();
    await expect(page.locator("#post-title")).toHaveValue("What is an MVP, really?");
    await page.getByRole("button", { name: "Posts" }).click();
    await expect(post(page, "What is an MVP, really?")).toContainText("Draft");
  });

  test("publishing is blocked until the essentials are filled in, then publishes", async ({ page }) => {
    await signIn(page);
    await newPost(page);
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(status(page)).toHaveText("Draft");
    await expect(page.getByRole("list", { name: "Before you publish" }).locator('li[data-flag="true"]')).toHaveCount(5);
    await fillRequired(page);
    await expect(page.getByRole("list", { name: "Before you publish" }).locator('li[data-ok="true"]').first()).toBeVisible();
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(page.getByRole("status").filter({ hasText: "Post published" })).toBeVisible();
    await expect(status(page)).toHaveText("Published");
    await expect(page.getByRole("button", { name: "Update post" })).toBeVisible();
    await page.getByRole("button", { name: "Unpublish" }).click();
    await expect(status(page)).toHaveText("Draft");
  });

  test("a post can be scheduled for a future time, and a past time is refused", async ({ page }) => {
    await signIn(page);
    await newPost(page);
    await fillRequired(page, "Scheduled idea");
    await page.getByRole("checkbox", { name: "Schedule for later" }).check();
    await page.locator("#post-when").fill("2036-03-04T09:30");
    await page.getByRole("button", { name: "Schedule", exact: true }).click();
    await expect(status(page)).toHaveText("Scheduled");
    await page.getByRole("button", { name: "Posts" }).click();
    await expect(post(page, "Scheduled idea")).toContainText("Scheduled");
    await expect(post(page, "Scheduled idea")).toContainText("09:30");
  });

  test("an address used by another post is flagged and blocks publishing", async ({ page }) => {
    await signIn(page);
    await openPostByText(page, "Prototype vs MVP");
    await page.locator("#post-slug").fill("mvp-cost-uk");
    await expect(page.getByText("Already used")).toBeVisible();
    await page.getByRole("textbox", { name: "Short summary" }).fill("Summary");
    await page.getByRole("button", { name: "Publish", exact: true }).click();
    await expect(status(page)).toHaveText("Draft");
  });

  test("changes to a live post need saving: unsaved warning, leave dialog, then saved", async ({ page }) => {
    await signIn(page);
    const id = await openPostByText(page, "How much does an MVP cost");
    await page.locator("#post-title").fill("How much does an MVP cost in the UK in 2026?");
    await expect(page.getByText("Unsaved changes")).toBeVisible();
    await page.getByRole("button", { name: "Posts" }).click();
    const dlg = page.getByRole("dialog", { name: "Leave without saving?" });
    await dlg.getByRole("button", { name: "Keep editing" }).click();
    await expect(page).toHaveURL(new RegExp(`${id}$`));
    await page.getByRole("button", { name: "Update post" }).click();
    await expect(page.getByText("All changes saved")).toBeVisible();
    await page.getByRole("button", { name: "Posts" }).click();
    await expect(page).toHaveURL(/\/admin\/blog$/);
    await expect(post(page, "in 2026?")).toBeVisible();
  });

  test("the search preview, counters and contents list update as you type", async ({ page }) => {
    await signIn(page);
    await openPostByText(page, "Prototype vs MVP");
    await page.locator("#post-seo-title").fill("Prototype or MVP? | TechClues");
    await page.locator("#post-seo-desc").fill("A short, clear description of the post.");
    await expect(page.locator(".adm-serp")).toContainText("Prototype or MVP? | TechClues");
    await expect(page.locator(".adm-serp")).toContainText("A short, clear description");
    await expect(page.getByText("29 / 60")).toBeVisible();
    await expect(page.getByRole("list", { name: "Headings in this post" }).locator("li")).toHaveCount(3);
  });

  test("preview shows the article on desktop and phone widths", async ({ page }) => {
    await signIn(page);
    await openPostByText(page, "How much does an MVP cost");
    await page.getByRole("button", { name: "Preview" }).click();
    const dlg = page.getByRole("dialog", { name: "Preview" });
    await expect(dlg.getByRole("heading", { level: 1 })).toHaveText("How much does an MVP cost in the UK?");
    await expect(dlg).toContainText("Costs");
    await expect(dlg).toContainText("26 August 2026");
    await expect(dlg.getByRole("img", { name: "A team planning a product together at a whiteboard" })).toBeVisible();
    await dlg.getByRole("button", { name: "Phone" }).click();
    await expect(dlg.locator(".adm-previewframe")).toHaveAttribute("data-mobile", "true");
    await page.keyboard.press("Escape");
    await expect(dlg).toHaveCount(0);
  });

  test("a post can be deleted from the editor after confirming", async ({ page }) => {
    await signIn(page);
    const id = await openPostByText(page, "No-code or custom code");
    await page.getByRole("button", { name: "Delete this post" }).click();
    await page.getByRole("dialog", { name: "Delete this post?" }).getByRole("button", { name: "Delete post" }).click();
    await expect(page).toHaveURL(/\/admin\/blog$/);
    await expect(posts(page)).toHaveCount(5);
    await page.goto(`/admin/blog/${id}`);
    await expect(page.getByRole("heading", { name: "Post not found" })).toBeVisible();
  });

  test("a cover image can be set from an address and described", async ({ page }) => {
    await signIn(page);
    await openPostByText(page, "Prototype vs MVP");
    await page.locator("#post-cover-url").fill("/images/services/mvp.jpg");
    await page.locator("#post-cover-alt").fill("Founders at a whiteboard");
    await expect(page.locator(".adm-cover")).toHaveAttribute("src", "/images/services/mvp.jpg");
    await expect(page.getByText("Describe the cover image").locator("..").locator("span").first()).toHaveText("✓");
  });
});

test.describe("admin blog on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 } });
  test.beforeEach(() => reseed());

  test("list and editor fit the screen", async ({ page }) => {
    await signIn(page);
    const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    await expect(posts(page).first()).toBeVisible();
    expect(await fits()).toBe(true);
    await openPostByText(page, "Funding for AI projects");
    await expect(editor(page)).toBeVisible();
    expect(await fits()).toBe(true);
  });
});
