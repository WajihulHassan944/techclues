import { test, expect, type Page } from "@playwright/test";

async function rejectCookies(page: Page) {
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Reject all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

async function open(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto("/about");
  await expect(page.locator("#cookie-title")).toBeVisible();
  await rejectCookies(page);
  return errors;
}

const STORY = 'section[aria-label="Our story"]';
const scrollTo = (page: Page, sel: string, viewportFraction: number) =>
  page.evaluate(
    ([s, f]) => {
      const el = document.querySelector(s as string)!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * (f as number));
    },
    [sel, viewportFraction] as const,
  );

test.describe("about page", () => {
  test("renders with metadata, hero, stats and no errors", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle("About TechClues | West Midlands MVP Development Studio");
    await expect(page.locator("h1")).toContainText("Ideas begin with us.");
    await expect(page.getByText("An MVP studio in West Midlands. Founders come to us to try ideas on real users, then we build the survivors.")).toBeVisible();
    await expect(page.getByText("Make less. Learn quicker. Ship what people want.")).toBeVisible();
    const glance = page.locator('section[aria-label="TechClues at a glance"]');
    for (const t of ["200+", "Products shipped", "4.3", "Trustpilot score", "2–4 weeks", "West Midlands"]) await expect(glance).toContainText(t);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("has every section in order", async ({ page }) => {
    await open(page);
    const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
    expect(labels).toEqual(["TechClues at a glance", "Our story", "Building together", "Our promises", "Our team", "Our global presence", "Start your project"]);
  });

  test("hero entrance animation settles into the visible state", async ({ page }) => {
    await open(page);
    await page.waitForTimeout(2000);
    await expect(page.locator("main section").first().locator("p.svc-in").first()).toHaveCSS("opacity", "1");
    await expect(page.locator("main .ab-panel")).toHaveCSS("opacity", "1");
    const box = await page.locator("h1 .svc-rise").evaluate((el) => el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top);
    expect(box).toBeLessThan(2);
  });

  test("hero gradient canvas starts drawing", async ({ page }) => {
    await open(page);
    await expect(page.locator("main canvas")).toHaveCSS("opacity", "1", { timeout: 8000 });
  });

  test("story chapters fade in as you reach them", async ({ page }) => {
    await open(page);
    const chapters = page.locator(`${STORY} .ab-in`);
    await expect(chapters).toHaveCount(4);
    await expect(chapters.nth(3)).not.toHaveClass(/is-in/);
    await scrollTo(page, `${STORY} ol.space-y-\\[clamp\\(72px\\,12vh\\,140px\\)\\]`, 0.4);
    await expect(chapters.nth(0)).toHaveClass(/is-in/);
    await expect(chapters.nth(0)).toHaveCSS("opacity", "1");
    await expect(chapters.nth(3)).not.toHaveClass(/is-in/);
  });

  test("story progress line and active chapter follow the scroll", async ({ page }) => {
    await open(page);
    const items = page.locator(`${STORY} ol.relative > li`);
    const line = page.locator(`${STORY} [data-ab-line]`);
    const chapters = `${STORY} > div > ol`;
    const scale = async () => Number((await line.evaluate((e) => (e as HTMLElement).style.transform)).replace(/[^0-9.]/g, ""));
    await scrollTo(page, chapters, 0.5);
    await expect.poll(scale).toBeLessThan(0.05);
    await expect(items.nth(0)).toHaveClass(/text-ink/);
    await page.evaluate((s) => {
      const el = document.querySelector(s)!;
      const r = el.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - window.innerHeight * 0.5 + r.height * 0.6);
    }, chapters);
    await expect.poll(scale).toBeGreaterThan(0.55);
    await expect(items.nth(2)).toHaveClass(/text-ink/);
    await expect(items.nth(0)).toHaveClass(/text-muted/);
    await page.evaluate((s) => {
      const el = document.querySelector(s)!;
      const r = el.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - window.innerHeight * 0.5 + r.height);
    }, chapters);
    await expect(items.nth(3)).toHaveClass(/text-ink/);
    await expect.poll(scale).toBeGreaterThan(0.98);
  });

  test("team banner grows from an inset card to full width and its photo drifts", async ({ page }) => {
    await open(page);
    const banner = page.locator("[data-ab-banner]");
    const pad = banner.locator("> div");
    const card = pad.locator("> div");
    const photo = card.locator("> div").first();
    await page.evaluate(() => {
      const el = document.querySelector("[data-ab-banner]")!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight + 40);
    });
    await expect.poll(() => card.evaluate((e) => parseFloat(getComputedStyle(e).borderRadius))).toBeGreaterThan(25);
    const y1 = await photo.evaluate((e) => (e as HTMLElement).style.transform);
    await page.evaluate(() => {
      const el = document.querySelector("[data-ab-banner]")!;
      const r = el.getBoundingClientRect();
      window.scrollTo(0, r.top + window.scrollY - window.innerHeight * 0.1);
    });
    await expect.poll(() => card.evaluate((e) => parseFloat(getComputedStyle(e).borderRadius))).toBe(0);
    await expect.poll(() => pad.evaluate((e) => parseFloat(getComputedStyle(e).paddingLeft))).toBe(0);
    const y2 = await photo.evaluate((e) => (e as HTMLElement).style.transform);
    expect(y2).not.toBe(y1);
    await expect(banner.getByText("Working shoulder to shoulder with founders.")).toBeVisible();
  });

  test("promises, community and call-to-action content is there", async ({ page }) => {
    await open(page);
    const promises = page.locator('section[aria-label="Our promises"]');
    for (const t of ["You'll never be left guessing", "We'll say what you shouldn't build", "A usable first version, quickly", "We stay on until it genuinely works", "Daniel Hughes", "Sarah Mitchell", "Tom Fletcher", "Jennifer Walsh"])
      await expect(promises).toContainText(t);
    await expect(promises.getByRole("link", { name: /Browse all reviews/ })).toHaveAttribute("href", "https://uk.trustpilot.com/review/techclues.co.uk");
    const community = page.locator('section[aria-label="Our global presence"]');
    for (const t of ["Rooted in the UK, serving the world.", "West Midlands, UK", "Islamabad, PK"]) await expect(community).toContainText(t);
    await expect(page.locator('section[aria-label="Start your project"]')).toHaveCount(1);
  });

  test("scroll reveal shows every visible section", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 400) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(500);
    const stuck = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]:not([data-shown]), .ab-in:not(.is-in)")]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .map((el) => el.className || el.outerHTML.slice(0, 80)),
    );
    expect(stuck).toEqual([]);
  });

  test("images load", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 700) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(100);
    }
    const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
    expect(broken).toEqual([]);
  });

  test("Company menu links here without a reload", async ({ page }) => {
    await page.goto("/");
    await rejectCookies(page);
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 5));
    await page.locator("header nav").getByRole("button", { name: "Company" }).hover();
    await page.locator("header [data-nav-panel]:not(.hidden)").getByRole("link", { name: /About/ }).first().click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.locator("h1")).toContainText("Ideas begin with us.");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(5);
  });
});

test.describe("about page on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test("fits the screen", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await expect(page.locator("h1")).toBeVisible();
  });
});
