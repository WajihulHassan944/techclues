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

const GRID = 'section[aria-label="All case studies"]';

test.describe("case studies page", () => {
  test("renders with metadata, hero and no errors", async ({ page }) => {
    const errors = await open(page, "/case-studies");
    await expect(page).toHaveTitle("Case Studies | MVPs & Products Built by Vebryx");
    await expect(page.locator("h1")).toContainText("Ideas we turned");
    await expect(page.locator("h1")).toContainText("into products.");
    await expect(page.getByText("A look at how we've helped founders validate, design and launch real products.")).toBeVisible();
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

  test("shows the two case studies, their tags and links", async ({ page }) => {
    await open(page, "/case-studies");
    await expect(page.locator(`${GRID} a[href^="/case-studies/"]`)).toHaveCount(2);
    const irl = page.locator(`${GRID} a[href="/case-studies/infinite-running-league"]`);
    await expect(irl).toContainText("Infinite Running League");
    await expect(irl).toContainText("The first relay running league platform");
    await expect(irl).toContainText("1,000+ sign-ups before a line of code.");
    for (const t of ["Sports & fitness", "Website", "Web app"]) await expect(irl).toContainText(t);
    const odo = page.locator(`${GRID} a[href="/case-studies/odogwu"]`);
    await expect(odo).toContainText("A custom online grocery store for African and Afro-Caribbean food");
    await expect(odo).toContainText("Built for UK shoppers, with smart delivery rules.");
    await expect(page.locator(GRID)).toContainText("2 projects");
    await expect(page.locator(GRID)).toContainText("Some of this work was built under an NDA");
  });

  test("sector filter narrows the list and Clear brings it back", async ({ page }) => {
    await open(page, "/case-studies");
    const grid = page.locator(GRID);
    await grid.scrollIntoViewIfNeeded();
    await grid.getByRole("button", { name: "Sector" }).click();
    const list = grid.getByRole("listbox", { name: "Sector" });
    await expect(list.getByRole("option")).toHaveText(["All sectors", "Sports & fitness", "Retail & e-commerce"]);
    await list.getByRole("option", { name: "Retail & e-commerce" }).click();
    await expect(grid.getByRole("button", { name: "Sector" })).toContainText("Retail & e-commerce");
    await expect(grid.locator('a[href^="/case-studies/"]')).toHaveCount(1);
    await expect(grid.locator('a[href="/case-studies/odogwu"]')).toHaveCount(1);
    await expect(grid).toContainText("1 project");
    await expect(grid).not.toContainText("1 projects");
    await grid.getByRole("button", { name: "Clear" }).click();
    await expect(grid.locator('a[href^="/case-studies/"]')).toHaveCount(2);
    await expect(grid.getByRole("button", { name: "Clear" })).toHaveCount(0);
  });

  test("service filter lists the services that have work and filters by them", async ({ page }) => {
    await open(page, "/case-studies");
    const grid = page.locator(GRID);
    await grid.scrollIntoViewIfNeeded();
    await grid.getByRole("button", { name: "Service" }).click();
    const list = grid.getByRole("listbox", { name: "Service" });
    await expect(list.getByRole("option")).toHaveText(["All services", "MVPs & Custom Platforms", "UI/UX & Prototyping", "E-commerce & Marketplaces", "Performance Marketing", "Strategy & Brand Identity"]);
    await list.getByRole("option", { name: "Performance Marketing" }).click();
    await expect(grid.locator('a[href^="/case-studies/"]')).toHaveCount(1);
    await expect(grid.locator('a[href="/case-studies/infinite-running-league"]')).toHaveCount(1);
    // both filters together
    await grid.getByRole("button", { name: "Sector" }).click();
    await grid.getByRole("listbox", { name: "Sector" }).getByRole("option", { name: "Retail & e-commerce" }).click();
    await expect(grid.locator('a[href^="/case-studies/"]')).toHaveCount(0);
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
    for (const t of ["23+", "1,000+", "60%", "4.3"]) await expect(r).toContainText(t);
    await expect(page.locator('section[aria-label="Start your project"]')).toHaveCount(1);
  });

  test("a card opens the case study without reloading the site", async ({ page }) => {
    await open(page, "/case-studies");
    await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 4));
    await page.locator(`${GRID} a[href="/case-studies/odogwu"]`).click();
    await expect(page).toHaveURL(/\/case-studies\/odogwu$/);
    await expect(page.locator("h1")).toContainText("A custom online grocery store");
    expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(4);
  });
});

type Study = { slug: string; title: string; heading: string; client: string; sector: string; website: string; sections: string[]; texts: string[]; next: [string, string] };
const STUDIES: Study[] = [
  {
    slug: "infinite-running-league",
    title: "Infinite Running League Case Study | Vebryx",
    heading: "The first relay running league platform",
    client: "Infinite Running League",
    sector: "Sports & fitness",
    website: "infiniterunningleague.com",
    sections: ["Challenge and approach", "Results", "What we built", "Inside the product", "Client feedback", "Next project", "Start your project"],
    texts: ["Relay running leagues had no dedicated platform.", "1,000+", "45%", "6 weeks", "Team creation and roster management", "Figma", "PostgreSQL", "Jason Lynch"],
    next: ["Odogwu Foods", "/case-studies/odogwu"],
  },
  {
    slug: "odogwu",
    title: "Odogwu Foods Case Study | Vebryx",
    heading: "A custom online grocery store for African and Afro-Caribbean food",
    client: "Odogwu Foods",
    sector: "Retail & e-commerce",
    website: "odogwufoods.co.uk",
    sections: ["The project", "The challenges", "Our solution", "Inside the product", "Implementation", "Results", "Next project", "Start your project"],
    texts: ["Business rules still taking shape", "A catalogue that needed restructuring", "Custom e-commerce development", "Next.js", "Payload CMS", "314", "78", "73", "33"],
    next: ["Infinite Running League", "/case-studies/infinite-running-league"],
  },
];

for (const c of STUDIES) {
  test.describe(`case study: ${c.slug}`, () => {
    const url = `/case-studies/${c.slug}`;

    test("renders with metadata, hero details and no errors", async ({ page }) => {
      const errors = await open(page, url);
      await expect(page).toHaveTitle(c.title);
      await expect(page.locator("h1")).toContainText(c.heading);
      const crumbs = page.getByRole("navigation", { name: "Breadcrumb" });
      await expect(crumbs.getByRole("link", { name: "Case studies" })).toHaveAttribute("href", "/case-studies");
      await expect(crumbs).toContainText(c.client);
      const dl = page.locator("main dl").first();
      for (const t of [c.client, c.sector, c.website]) await expect(dl).toContainText(t);
      await expect(dl.getByRole("link", { name: c.website })).toHaveAttribute("target", "_blank");
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
      expect(errors).toEqual([]);
    });

    test("hero entrance animation settles into the visible state", async ({ page }) => {
      await open(page, url);
      await page.waitForTimeout(2200);
      await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toHaveCSS("opacity", "1");
      await expect(page.locator("main dl").first()).toHaveCSS("opacity", "1");
      await expect(page.locator("[data-hero-img]")).toHaveCSS("opacity", "1");
      const top = await page.locator("h1 .svc-rise").evaluate((el) => el.getBoundingClientRect().top - el.parentElement!.getBoundingClientRect().top);
      expect(top).toBeLessThan(2);
    });

    test("has every section in order with its content", async ({ page }) => {
      await open(page, url);
      const labels = await page.locator("main section[aria-label]").evaluateAll((els) => els.map((e) => e.getAttribute("aria-label")));
      expect(labels).toEqual(c.sections);
      for (const t of c.texts) await expect(page.locator("main")).toContainText(t);
    });

    test("hero photo parallax follows the scroll", async ({ page }) => {
      await open(page, url);
      const frame = page.locator('main div[class*="-inset-y-["]').first();
      await frame.scrollIntoViewIfNeeded();
      const a = await frame.evaluate((e) => (e as HTMLElement).style.transform);
      await page.evaluate(() => window.scrollBy(0, 300));
      await page.waitForTimeout(400);
      const b = await frame.evaluate((e) => (e as HTMLElement).style.transform);
      expect(a).toMatch(/translateY/);
      expect(b).not.toBe(a);
    });

    test("next project links onward without a reload", async ({ page }) => {
      await open(page, url);
      await page.evaluate(() => ((window as unknown as { __kept: number }).__kept = 8));
      const next = page.locator('section[aria-label="Next project"] a');
      await expect(next).toContainText(c.next[0]);
      await expect(next).toHaveAttribute("href", c.next[1]);
      await next.click();
      await expect(page).toHaveURL(new RegExp(`${c.next[1]}$`));
      expect(await page.evaluate(() => (window as unknown as { __kept?: number }).__kept)).toBe(8);
    });

    test("images load, including lazy ones", async ({ page }) => {
      await open(page, url);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 700) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(100);
      }
      const broken = await page.evaluate(() => [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src));
      expect(broken).toEqual([]);
    });

    test("scroll reveal shows every visible section", async ({ page }) => {
      await open(page, url);
      for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 400) {
        await page.evaluate((v) => window.scrollTo(0, v), y);
        await page.waitForTimeout(80);
      }
      await page.waitForTimeout(500);
      const stuck = await page.evaluate(() =>
        [...document.querySelectorAll("[data-reveal]:not([data-shown])")]
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          })
          .map((el) => el.className || el.outerHTML.slice(0, 80)),
      );
      expect(stuck).toEqual([]);
    });
  });
}

test.describe("case studies on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  for (const path of ["/case-studies", "/case-studies/odogwu", "/case-studies/infinite-running-league"]) {
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
