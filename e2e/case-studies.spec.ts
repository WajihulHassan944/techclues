import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page, path: string) {
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

const PROJECTS = [
  { slug: "zamulk", name: "Zamulk", sector: "Real estate", url: "https://zamulk.com", line: "A real estate portal for property listings, sales and rentals, built for the Pakistani market." },
  { slug: "picktiles", name: "Picktiles", sector: "Retail & e-commerce", url: "https://picktiles.com", line: "An online store for tiles, ceramics, sanitary fittings, laminates and installation materials." },
  { slug: "oradent", name: "Oradent Dental Clinic", sector: "Healthcare", url: "https://oradentdentalclinic.com", line: "A dental clinic website with its services, two locations and online appointment booking." },
  { slug: "latache", name: "Latache", sector: "Home services", url: "https://xn--latche-yta.com", line: "A home services marketplace connecting homeowners with vetted local professionals for cleaning, repairs and moving help." },
  { slug: "rytr", name: "Rytr", sector: "AI & SaaS", url: "https://rytr.me", line: "A cloud-based AI writing platform with 40+ content templates, autocomplete and team collaboration tools." },
  { slug: "copy-ai", name: "Copy.ai", sector: "AI & SaaS", url: "https://copy.ai", line: "An AI-powered copywriting and content generation platform with branded AI agents and automated workflows." },
];

const GRID = 'section[aria-label="All case studies"]';

test.describe("case studies page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page, "/case-studies");
    await expect(page).toHaveTitle("Case Studies | MVPs & Products TechClues Has Built");
    await expect(page.locator("h1")).toContainText("Concepts we have");
    await expect(page.locator("h1")).toContainText("made into products.");
    await expect(page.getByText("See how we've supported founders in testing, designing and launching genuine products.")).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("hero entrance animation settles into the visible state", async ({ page }) => {
    await open(page, "/case-studies");
    await page.waitForTimeout(2000);
    await expect(page.locator("main p.svc-in").first()).toHaveCSS("opacity", "1");
    const lines = page.locator("h1 .svc-rise");
    await expect(lines).toHaveCount(2);
    for (const i of [0, 1]) {
      const top = await lines.nth(i).evaluate((el) => el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top);
      expect(top).toBeLessThan(2);
    }
  });

  test("shows the six projects with their sectors and one-liners", async ({ page }) => {
    await open(page, "/case-studies");
    await expect(page.locator(`${GRID} a[target="_blank"]`)).toHaveCount(6);
    for (const p of PROJECTS) {
      const card = page.locator(`${GRID} a[href="${p.url}"]`);
      await expect(card).toHaveCount(1);
      await expect(card).toContainText(p.name);
      await expect(card).toContainText(p.sector);
      await expect(card).toContainText(p.line);
      await expect(card).toContainText("Visit site");
    }
    await expect(page.locator(GRID)).toContainText("6 projects");
    await expect(page.locator(GRID)).toContainText("Every project here is live");
  });

  test("cards link out to the live sites in a new tab", async ({ page }) => {
    await open(page, "/case-studies");
    for (const p of PROJECTS) {
      const card = page.locator(`${GRID} a[href="${p.url}"]`);
      await expect(card).toHaveAttribute("target", "_blank");
      await expect(card).toHaveAttribute("rel", /noopener/);
      await expect(card.locator("img")).toHaveAttribute("src", `/images/case-studies/${p.slug}.jpg`);
    }
  });

  test("sector filter narrows the list and Reset brings it back", async ({ page }) => {
    await open(page, "/case-studies");
    const grid = page.locator(GRID);
    await grid.scrollIntoViewIfNeeded();
    await grid.getByRole("button", { name: "Sector" }).click();
    const list = grid.getByRole("listbox", { name: "Sector" });
    await expect(list.getByRole("option")).toHaveText(["All sectors", "Real estate", "Retail & e-commerce", "Healthcare", "AI & SaaS", "Home services"]);
    await list.getByRole("option", { name: "Healthcare" }).click();
    await expect(grid.getByRole("button", { name: "Sector" })).toContainText("Healthcare");
    await expect(grid.locator('a[target="_blank"]')).toHaveCount(1);
    await expect(grid.locator('a[href="https://oradentdentalclinic.com"]')).toHaveCount(1);
    await expect(grid).toContainText("1 project");
    await expect(grid).not.toContainText("1 projects");
    await grid.getByRole("button", { name: "Reset" }).click();
    await expect(grid.locator('a[target="_blank"]')).toHaveCount(6);
    await expect(grid.getByRole("button", { name: "Reset" })).toHaveCount(0);
  });

  test("service filter lists the services that have work and filters by them", async ({ page }) => {
    await open(page, "/case-studies");
    const grid = page.locator(GRID);
    await grid.scrollIntoViewIfNeeded();
    await grid.getByRole("button", { name: "Service" }).click();
    const list = grid.getByRole("listbox", { name: "Service" });
    await expect(list.getByRole("option")).toHaveText(["All services", "MVPs & Custom Platforms", "AI Integration & Automation", "Web & Mobile Apps", "UI/UX & Prototyping", "E-commerce & Marketplaces"]);
    await list.getByRole("option", { name: "UI/UX & Prototyping" }).click();
    await expect(grid.locator('a[target="_blank"]')).toHaveCount(1);
    await expect(grid.locator('a[href="https://oradentdentalclinic.com"]')).toHaveCount(1);
    // both filters together
    await grid.getByRole("button", { name: "Sector" }).click();
    await grid.getByRole("listbox", { name: "Sector" }).getByRole("option", { name: "Retail & e-commerce" }).click();
    await expect(grid.locator('a[target="_blank"]')).toHaveCount(0);
    await expect(grid).toContainText("0 projects");
  });

  test("the dropdown closes on Escape and when clicking elsewhere", async ({ page }) => {
    await open(page, "/case-studies");
    const grid = page.locator(GRID);
    await grid.scrollIntoViewIfNeeded();
    const btn = grid.getByRole("button", { name: "Sector" });
    await btn.click();
    await expect(btn).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(btn).toHaveAttribute("aria-expanded", "false");
    await btn.click();
    await page.mouse.click(700, 60);
    await expect(btn).toHaveAttribute("aria-expanded", "false");
  });

  test("results strip and call to action are present", async ({ page }) => {
    await open(page, "/case-studies");
    const r = page.locator('section[aria-label="Results"]');
    for (const t of ["200+", "Live projects shown on this page", "4.3"]) await expect(r).toContainText(t);
    await expect(page.locator('section[aria-label="Start your project"]')).toHaveCount(1);
  });

  test("images load and keep the card aspect ratio", async ({ page }) => {
    await open(page, "/case-studies");
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(100);
    }
    const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
    expect(broken).toEqual([]);
    for (const p of PROJECTS) {
      const img = page.locator(`${GRID} a[href="${p.url}"] img`);
      await expect(img).toHaveAttribute("alt", new RegExp(p.name));
      const ratio = await img.evaluate((e) => e.parentElement!.getBoundingClientRect().width / e.parentElement!.getBoundingClientRect().height);
      expect(Math.abs(ratio - 16 / 11)).toBeLessThan(0.05);
    }
  });

  test("the removed detail pages no longer exist", async ({ page }) => {
    for (const slug of ["infinite-running-league", "odogwu"]) {
      const res = await page.goto(`/case-studies/${slug}`);
      expect(res?.status()).toBe(404);
    }
  });
});

test.describe("case studies on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  for (const path of ["/case-studies"]) {
    test(`${path} fits the screen`, async ({ page }) => {
      await open(page, path);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 900) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(60);
      }
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    });
  }
});
