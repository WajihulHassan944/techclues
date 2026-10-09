import { test, expect, type Page } from "@playwright/test";

const STACK = '[aria-label="Our tech stack"]';

async function open(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error" && !/_rsc|404|Failed to load resource/.test(m.text())) errors.push(m.text());
  });
  await page.goto("/");
  await page.waitForLoadState("load");
  // Wait for hydration: the cookie banner is rendered by a client component.
  await expect(page.locator("#cookie-title")).toBeVisible();
  return errors;
}

/** Reads the 3D stack's root transform and each layer's transform from the page. */
async function stackGeometry(page: Page) {
  return page.evaluate((sel) => {
    const persp = document.querySelector(sel + ' [style*="perspective"]') as HTMLElement;
    const root = persp.firstElementChild as HTMLElement;
    const layers = [...root.children].filter((c) => c.classList.contains("inset-0")).map((c) => (c.firstElementChild as HTMLElement).style.transform);
    const zs = layers.map((t) => parseFloat(/translateZ\(([-\d.]+)px/.exec(t)![1]));
    const liftT = layers.find((t) => t.includes("translateX"))!;
    const num = (re: RegExp) => parseFloat(re.exec(liftT)?.[1] ?? "1");
    return {
      root: root.style.transform,
      zs,
      lift: { x: num(/translateX\(([-\d.]+)px/), y: num(/translateY\(([-\d.]+)px/), z: num(/translateZ\(([-\d.]+)px/), scale: num(/scale\(([-\d.]+)\)/) },
    };
  }, STACK);
}

async function stackGeometryIdle(page: Page) {
  return page.evaluate((sel) => {
    const persp = document.querySelector(sel + ' [style*="perspective"]') as HTMLElement;
    const root = persp.firstElementChild as HTMLElement;
    const layers = [...root.children].filter((c) => c.classList.contains("inset-0")).map((c) => (c.firstElementChild as HTMLElement).style.transform);
    return { root: root.style.transform, zs: layers.map((t) => parseFloat(/translateZ\(([-\d.]+)px/.exec(t)![1])) };
  }, STACK);
}

async function dismissCookies(page: Page) {
  // The banner only goes away once React has hydrated, so retry the click until it does.
  await expect(async () => {
    const btn = page.getByRole("button", { name: "Accept all" });
    if (await btn.count()) await btn.click();
    await expect(page.locator("#cookie-title")).toHaveCount(0, { timeout: 1500 });
  }).toPass({ timeout: 20_000 });
}

test.describe("homepage", () => {
  test("renders the page with correct metadata, no console errors and no overflow", async ({ page }) => {
    const errors = await open(page);
    await expect(page).toHaveTitle(/Custom Software Development Company in Glasgow/);
    await expect(page.locator("h1")).toContainText("Launch-ready MVPs.");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(errors).toEqual([]);
  });

  test("all images load", async ({ page }) => {
    await open(page);
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 800) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(120);
    }
    const broken = await page.evaluate(() =>
      [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
    );
    expect(broken).toEqual([]);
  });

  test("hero word rotates through every phrase", async ({ page }) => {
    await open(page);
    const pill = page.locator("h1 span[aria-hidden='true'].absolute").last();
    const seen = new Set<string>();
    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline && seen.size < 5) {
      const txt = (await pill.locator("span.absolute").last().textContent()) ?? "";
      if (txt) seen.add(txt.trim());
      await page.waitForTimeout(200);
    }
    expect([...seen].sort()).toEqual(["UI/UX design", "idea validation", "mobile apps", "rapid MVPs", "scaling up"].sort());
  });

  test("hero WebGL canvas is drawn when WebGL is available", async ({ page }) => {
    await open(page);
    const canvas = page.locator(".hero-lift canvas");
    await expect(canvas).toHaveCount(1);
    const hasGl = await page.evaluate(() => !!document.createElement("canvas").getContext("webgl"));
    test.skip(!hasGl, "WebGL unavailable in this browser");
    await expect(canvas).toHaveCSS("opacity", "1");
  });

  test("header switches to its scrolled state and back", async ({ page }) => {
    await open(page);
    const nav = page.locator("header nav");
    const logo = page.locator("header a[aria-label='Vebryx home']");
    await expect(nav).not.toHaveClass(/bg-white\/95/);
    await page.evaluate(() => window.scrollTo(0, 1500));
    await expect(nav).toHaveClass(/bg-white\/95/);
    await expect(logo).toHaveClass(/opacity-0/);
    const floating = page.locator("a.fixed", { hasText: "Start your project" });
    await expect(floating).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, 0));
    await expect(nav).not.toHaveClass(/bg-white\/95/);
    await expect(logo).not.toHaveClass(/opacity-0/);
    await expect(floating).toHaveCount(0);
  });

  test("nav dropdowns open on hover and close with Escape", async ({ page }) => {
    await open(page);
    for (const [label, expected] of [
      ["Services", "All services"],
      ["Industries", "All industries"],
      ["Company", "Careers"],
    ] as const) {
      await page.locator("header nav button", { hasText: label }).hover();
      const panel = page.locator("[data-nav-panel]:not(.hidden)");
      await expect(panel).toHaveCount(1);
      await expect(panel).toContainText(expected);
      await page.keyboard.press("Escape");
      await expect(page.locator("[data-nav-panel]:not(.hidden)")).toHaveCount(0);
      await page.mouse.move(700, 800);
    }
  });

  test("stat counters count up to their final values", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    const nums = page.locator('section[aria-label="Vebryx in numbers"] p > span');
    await page.locator('section[aria-label="Vebryx in numbers"]').scrollIntoViewIfNeeded();
    await expect(nums).toHaveText(["4", "4.3", "23", "1,000", "12"], { timeout: 6_000 });
  });

  test("stack tabs lift a layer, dim the rest and reset", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    await page.locator(STACK).scrollIntoViewIfNeeded();
    const tabs = page.locator(`${STACK} ol button`);
    await expect(tabs).toHaveCount(6);
    await tabs.nth(2).click(); // Backend
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveAttribute("aria-label", "Backend tools");
    await expect(page.locator(`${STACK} .opacity-55`)).toHaveCount(5);
    await expect(tabs.nth(2).locator("span").first()).toHaveClass(/text-brand/);
    // The rest of the page is dimmed behind the lifted layer
    const overlay = page.locator("button.stack-overlay");
    await expect(overlay).toBeVisible();
    // Switch directly to another tab
    await tabs.nth(4).click();
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveAttribute("aria-label", "AI tools");
    // Clicking the active tab, or Escape, resets
    await tabs.nth(4).click();
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveCount(0);
    await expect(page.locator(`${STACK} .opacity-55`)).toHaveCount(0);
    await expect(overlay).toHaveCount(0);
    // Clicking the dimmed backdrop also resets
    await tabs.nth(3).click();
    await expect(overlay).toBeVisible();
    await overlay.click({ position: { x: 20, y: 400 } });
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveCount(0);
    await expect(overlay).toHaveCount(0);
    await tabs.nth(0).click();
    await page.keyboard.press("Escape");
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveCount(0);
    // The close button inside the lifted card also resets
    await tabs.nth(1).click();
    await page.locator(`${STACK} [role='dialog'] button[aria-label='Close']`).evaluate((el: HTMLElement) => el.click());
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveCount(0);
  });

  test("smooth scroll eases wheel movement instead of jumping", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    await expect(page.locator("html")).toHaveClass(/lenis/);
    await page.mouse.move(700, 450);
    await page.mouse.wheel(0, 800);
    await page.waitForTimeout(60);
    const early = await page.evaluate(() => window.scrollY);
    expect(early).toBeLessThan(800); // still easing
    await expect.poll(() => page.evaluate(() => Math.round(window.scrollY)), { timeout: 4000 }).toBeGreaterThanOrEqual(780);
  });

  test("stack lift geometry matches the original at 1440x900", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    await page.locator(STACK).scrollIntoViewIfNeeded();
    await page.locator(`${STACK} ol button`).nth(1).click();
    const g = await stackGeometry(page);
    expect(g.root).toContain("scale(0.78)");
    expect(g.zs.slice(0, 4).map(Math.round)).toEqual([-214, -129, -43, 43]); // 0.17 x 504px container
    expect(g.lift.x).toBeCloseTo(-390, 0);
    expect(g.lift.y).toBeCloseTo(433.1, 0);
    expect(g.lift.z).toBeCloseTo(364.2, 0);
    expect(g.lift.scale).toBeCloseTo(1.044, 2);
  });

  test("stack tab hover previews its layer and resets on leave", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    await page.locator(STACK).scrollIntoViewIfNeeded();
    const tabs = page.locator(`${STACK} ol button`);
    const root = page.locator(`${STACK} [style*="perspective"] > div`);
    await expect(root).not.toHaveAttribute("style", /scale\(0\.78\)/);
    await tabs.nth(3).hover(); // 04 Data
    await expect(root).toHaveAttribute("style", /scale\(0\.78\)/);
    // Previewed, not lifted: the layers spread evenly and nothing is dimmed
    const g = await stackGeometry(page);
    expect(g.zs.map(Math.round)).toEqual([-214, -129, -43, 43, 129, 214]);
    await expect(page.locator(`${STACK} .opacity-55`)).toHaveCount(0);
    await expect(page.locator(`${STACK} .border-brand\\/60`)).toHaveCount(1);
    await expect(tabs.nth(3).locator("span span").first()).toHaveClass(/text-ink(?!\/)/);
    await expect(page.locator(`${STACK} [role='dialog']`)).toHaveCount(0);
    await expect(page.locator("button.stack-overlay")).toHaveCount(0);
    const shifted = await page.evaluate((sel) => [...document.querySelectorAll(sel + " [style*='translateX(-56px)']")].length, STACK);
    expect(shifted).toBe(1);
    await page.mouse.move(700, 100);
    await expect(root).not.toHaveAttribute("style", /scale\(0\.78\)/);
    await expect(page.locator(`${STACK} .border-brand\\/60`)).toHaveCount(0);
  });

  test("AI section switches panels for each capability", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    const labels = await page.locator('input[name="ai-integration"] + label').allTextContents();
    expect(labels).toHaveLength(10);
    const seen = new Set<string>();
    for (const label of labels) {
      const name = label.replace(/^\d+/, "").trim();
      await page.locator("label", { hasText: name }).first().click();
      const panel = page.locator("#ai-panel");
      await expect(panel.locator("h3").first()).toHaveText(name);
      seen.add(await panel.innerText());
    }
    expect(seen.size).toBe(10); // every capability has its own content
  });

  test("phases line fills with scroll and lights up the steps", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    const ol = page.locator("ol", { hasText: "Ignition" });
    const line = ol.locator(":scope > span.bg-brand");
    const steps = ol.locator(":scope > li");
    await expect(steps).toHaveCount(8);
    await ol.scrollIntoViewIfNeeded();
    await page.evaluate(() => {
      const el = [...document.querySelectorAll("ol")].find((o) => o.textContent?.includes("Ignition"))!;
      window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.6 + 400);
    });
    await expect(line).toHaveAttribute("style", /scaleY\(0\.\d+\)/);
    await expect(steps.nth(0).locator(":scope > div")).toHaveClass(/opacity-100/);
    await expect(steps.nth(7).locator(":scope > div")).toHaveClass(/opacity-40/);
    await page.evaluate(() => {
      const el = [...document.querySelectorAll("ol")].find((o) => o.textContent?.includes("Ignition"))!;
      window.scrollTo(0, el.getBoundingClientRect().bottom + window.scrollY - window.innerHeight * 0.6 + 50);
    });
    await expect(steps.nth(7).locator(":scope > div")).toHaveClass(/opacity-100/);
    await expect(line).toHaveAttribute("style", /transform: none/);
  });

  test("testimonials rotate, pause on hover and can be driven by dots and arrows", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    const section = page.locator('section[aria-label="Testimonials"]');
    const quote = section.locator("blockquote");
    await section.scrollIntoViewIfNeeded();
    await expect(quote).toContainText("Great communication and clear project updates");
    await expect(section.getByRole("button", { name: /^Show review/ })).toHaveCount(10);
    await section.getByRole("button", { name: "Show review 3" }).click();
    await expect(quote).toContainText("first mobile prototype");
    await section.getByRole("button", { name: "Next review" }).click();
    await expect(quote).toContainText("Amazing, wonderful people");
    await section.getByRole("button", { name: "Previous review" }).click();
    await expect(quote).toContainText("first mobile prototype");
    await section.getByRole("button", { name: "Show review 10" }).click();
    await section.getByRole("button", { name: "Next review" }).click();
    await expect(quote).toContainText("Great communication"); // wraps around
    // Hovering the card pauses the progress bar
    await section.locator('[class*="rounded-[28px]"]').first().hover();
    await expect(section.locator(".testimonial-bar")).toHaveCSS("animation-play-state", "paused");
    await page.mouse.move(5, 5);
    await expect(section.locator(".testimonial-bar")).toHaveCSS("animation-play-state", "running");
  });

  test("testimonials advance on their own after seven seconds", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    const section = page.locator('section[aria-label="Testimonials"]');
    await section.scrollIntoViewIfNeeded();
    await page.mouse.move(5, 5);
    await section.getByRole("button", { name: "Show review 1", exact: true }).click();
    await expect(section.locator("blockquote")).toContainText("Great communication");
    await page.mouse.move(5, 5); // the click left the pointer over the card, which pauses rotation
    await expect(section.locator("blockquote")).toContainText("We appreciated their focus", { timeout: 12_000 });
  });

  test("FAQ accordion opens one answer at a time", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    const q1 = page.getByRole("button", { name: "What does Vebryx do?" });
    const q2 = page.getByRole("button", { name: "How much does an MVP cost?" });
    await q1.scrollIntoViewIfNeeded();
    await expect(q1).toHaveAttribute("aria-expanded", "true");
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "true");
    await expect(q1).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("A Validation MVP starts from")).toBeVisible();
    await q2.click();
    await expect(q2).toHaveAttribute("aria-expanded", "false");
  });

  test("cookie banner: manage preferences, toggle and save", async ({ page }) => {
    await open(page);
    await page.getByRole("button", { name: "Manage" }).click();
    await expect(page.locator("#cookie-title")).toHaveText("Cookie preferences");
    const analytics = page.getByRole("switch", { name: "Analytics" });
    await expect(analytics).toHaveAttribute("aria-checked", "false");
    await analytics.click();
    await expect(analytics).toHaveAttribute("aria-checked", "true");
    await page.getByRole("button", { name: "Save choices" }).click();
    await expect(page.locator("#cookie-title")).toHaveCount(0);
  });

  test("chat panel opens, takes input without submitting, and closes", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    await page.locator(".chat-launcher").click();
    const dialog = page.getByRole("dialog", { name: /enquiry/i });
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText("Tell us what you need");
    await dialog.getByRole("button", { name: "An existing product" }).click();
    await expect(dialog.getByRole("button", { name: "An existing product" })).toHaveAttribute("aria-pressed", "true");
    const before = page.url();
    await dialog.locator("input").first().fill("Test User");
    await dialog.locator("input").first().press("Enter");
    expect(page.url()).toBe(before);
    await dialog.getByRole("button", { name: "Close" }).click();
    await expect(dialog).toHaveCount(0);
    await expect(page.locator(".chat-launcher")).toContainText("Ask Vebryx");
  });

  test("contact dock expands on hover and uses placeholder links", async ({ page }) => {
    await open(page);
    const wa = page.locator("a.dock-link").first();
    const label = wa.locator(".dock-label");
    await expect(label).toHaveCSS("opacity", "0");
    await wa.hover();
    await expect(label).toHaveCSS("opacity", "1");
    for (const href of await page.locator("a.dock-link").evaluateAll((els) => els.map((e) => e.getAttribute("href")))) {
      expect(href).toBe("#");
    }
  });

  test("scroll reveal shows every visible section as you scroll", async ({ page }) => {
    await open(page);
    await expect(page.locator("html")).toHaveClass(/js-reveal/);
    // The page grows as lazily-rendered sections appear, so re-measure while scrolling.
    for (let y = 0; y < (await page.evaluate(() => document.documentElement.scrollHeight)); y += 500) {
      await page.evaluate((v) => window.scrollTo(0, v), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(400);
    // Anything with a rendered box must have been revealed (hidden-at-this-breakpoint blocks never intersect).
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

test.describe("homepage on mobile", () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

  test("stack graphic is pre-spread and lifts a card with the narrow-screen geometry", async ({ page }) => {
    await open(page);
    await dismissCookies(page);
    await page.locator(STACK).scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const idle = await stackGeometryIdle(page);
    expect(idle.root).toContain("scale(0.86)");
    expect(idle.zs.map(Math.round)).toEqual([-195, -117, -39, 39, 117, 195]);
    await page.locator(`${STACK} ol button`).nth(1).click();
    const g = await stackGeometry(page);
    expect(g.root).toContain("scale(0.86)");
    expect(g.zs.map(Math.round)).toEqual([-195, -117, -39, 39, 345, 195]); // only the lifted layer moves
    expect(g.lift.x).toBeCloseTo(-369.4, 0);
    expect(g.lift.y).toBeCloseTo(410.3, 0);
    expect(g.lift.z).toBeCloseTo(345, 0);
    expect(g.lift.scale).toBeCloseTo(350 / 328.05, 1); // container is 350px wide at 390px
  });

  test("no horizontal overflow and hamburger menu works", async ({ page }) => {
    await open(page);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await dismissCookies(page);
    const burger = page.getByRole("button", { name: "Open menu" });
    await burger.click();
    const menu = page.locator("nav[aria-label='Mobile']");
    await expect(menu).toBeVisible();
    await expect(page.getByRole("button", { name: "Close menu" })).toHaveAttribute("aria-expanded", "true");
    await menu.getByRole("button", { name: "Show services" }).click();
    await expect(menu.getByRole("link", { name: "MVPs & Custom Platforms" })).toBeVisible();
    await menu.getByRole("button", { name: "Hide services" }).click();
    await expect(menu.getByRole("link", { name: "MVPs & Custom Platforms" })).toHaveCount(0);
    await page.getByRole("button", { name: "Close menu" }).click();
    await expect(menu).toHaveCount(0);
  });
});
