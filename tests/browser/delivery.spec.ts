import { expect, test } from "@playwright/test";

test("unknown paths offer working navigation without being indexed", async ({ page }) => {
  const response = await page.goto("/no-such-page/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("NOT FOUND");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  await expect(page.locator('link[rel="canonical"], link[rel="alternate"]')).toHaveCount(0);
  await page.locator("[data-index-nav-trigger]").click();
  await expect(page.locator("#index-panel")).toHaveAttribute("aria-hidden", "false");
  await page.keyboard.press("Escape");
  await page.locator('main a[href="/intro/"]').click();
  await expect(page).toHaveURL(/\/intro\/$/);
});

test("Save-Data avoids speculative Index posters but keyboard intent loads them", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "connection", { value: { saveData: true } });
  });
  const posters: string[] = [];
  page.on("request", (request) => {
    if (/\/assets\/index\/.*\.webp$/.test(request.url())) posters.push(request.url());
  });
  await page.goto("/contact/");
  expect(posters).toEqual([]);
  await page.locator("[data-index-nav-trigger]").focus();
  await expect.poll(() => posters.length).toBe(5);
  await page.locator("[data-index-nav-trigger]").press("Enter");
  await expect(page.locator("#index-panel")).toHaveAttribute("aria-hidden", "false");
  await expect.poll(() => page.locator(".index-list__media img").evaluateAll((images) =>
    images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
  )).toBe(true);
});

test("speculative Index poster requests start after page load", async ({ page }) => {
  await page.goto("/contact/");
  const timing = () => page.evaluate(() => ({
    load: (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming).loadEventStart,
    posters: performance.getEntriesByType("resource")
      .filter((entry) => /\/assets\/index\/.*\.webp$/.test(entry.name))
      .map((entry) => entry.startTime),
  }));
  await expect.poll(async () => (await timing()).posters.length).toBe(5);
  const result = await timing();
  for (const start of result.posters) expect(start).toBeGreaterThanOrEqual(result.load);
});

for (const intent of ["hover", "click"] as const) {
  test(`Index ${intent} loads posters even while the page is still loading`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    let release!: () => void;
    const pending = new Promise<void>((resolve) => { release = resolve; });
    await page.route("**/tanbo-concept*.webp", async (route) => {
      await pending;
      await route.continue();
    });
    try {
      await page.goto("/curation/", { waitUntil: "domcontentloaded" });
      expect(await page.evaluate(() => document.readyState)).not.toBe("complete");
      await expect(page.locator(".index-list__media img[src]")).toHaveCount(0);
      const trigger = page.locator("[data-index-nav-trigger]");
      if (intent === "hover") await trigger.hover();
      else await trigger.dispatchEvent("click"); // Exercise click without a preceding focus/hover.
      await expect.poll(() => page.locator(".index-list__media img").evaluateAll((images) =>
        images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
      )).toBe(true);
      if (intent === "click") await expect(page.locator("#index-panel")).toHaveAttribute("aria-hidden", "false");
    } finally {
      release();
      await page.waitForLoadState("load");
    }
  });
}

for (const scheduler of ["idle", "timer"] as const) {
  test(`poster ${scheduler} work is cancelled on pagehide and restored once`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.clock.install();
    await page.clock.pauseAt(new Date());
    await page.addInitScript((mode) => {
      const pending = new Map<number, IdleRequestCallback>();
      let next = 0;
      (window as any).posterIdle = {
        count: () => pending.size,
        run: () => {
          const callbacks = [...pending.values()];
          pending.clear();
          callbacks.forEach((callback) => callback({ didTimeout: false, timeRemaining: () => 50 }));
        },
      };
      if (mode === "idle") {
        window.requestIdleCallback = (callback) => { pending.set(++next, callback); return next; };
        window.cancelIdleCallback = (handle) => { pending.delete(handle); };
      } else {
        Object.defineProperty(window, "requestIdleCallback", { value: undefined });
      }
    }, scheduler);
    await page.goto("/contact/");
    await expect(page.locator(".index-list__media img[src]")).toHaveCount(0);
    if (scheduler === "idle") expect(await page.evaluate(() => (window as any).posterIdle.count())).toBe(1);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    if (scheduler === "idle") expect(await page.evaluate(() => (window as any).posterIdle.count())).toBe(0);
    await page.clock.fastForward(1600);
    await expect(page.locator(".index-list__media img[src]")).toHaveCount(0);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    if (scheduler === "idle") await page.evaluate(() => (window as any).posterIdle.run());
    else await page.clock.fastForward(1600);
    await expect.poll(() => page.locator(".index-list__media img").evaluateAll((images) =>
      images.every((image) => (image as HTMLImageElement).naturalWidth > 0),
    )).toBe(true);
    await page.evaluate(() => {
      window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
      window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
    });
    expect(await page.evaluate(() => (window as any).posterIdle.count())).toBe(0);
  });
}
