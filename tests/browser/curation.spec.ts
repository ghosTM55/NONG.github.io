import { expect, test } from "@playwright/test";

test("failed object images can be retried without leaving a transparent object", async ({ page }) => {
  await page.route("**/pali-manuscript-india.webp", (route) => route.abort());
  await page.goto("/demo/objects/");
  await page.locator('[data-rail-item="1"]').click();
  await expect(page.locator("[data-image-error]")).toBeVisible();
  await expect(page.locator("[data-object-title]")).toHaveText("Pali Manuscript");
  await page.unroute("**/pali-manuscript-india.webp");
  await page.getByRole("button", { name: "Retry image", exact: true }).click();
  const image = page.locator("[data-artifact-image]");
  await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  await expect(image).toHaveCSS("opacity", "1");
  await expect(page.locator("[data-image-error]")).not.toBeVisible();
});

test("a late image failure cannot hide a newer object selection", async ({ page }) => {
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/pali-manuscript-india.webp", async (route) => {
    await pending;
    await route.abort();
  });
  try {
    await page.goto("/demo/objects/", { waitUntil: "domcontentloaded" });
    await page.locator('[data-rail-item="1"]').click();
    const image = page.locator("[data-artifact-image]");
    await expect(image).toHaveAttribute("src", "/assets/curation/pali-manuscript-india.webp");
    await page.locator('[data-rail-item="2"]').click();
    await expect(image).toHaveAttribute("src", "/assets/curation/pali-manuscript-south-india.webp");
    release();
    await page.waitForLoadState("load");
    await expect(image).toHaveCSS("opacity", "1");
    await expect.poll(() => image.evaluate((element) => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    await expect(page.locator("[data-image-error]")).not.toBeVisible();
  } finally {
    release();
  }
});

test("a failed pavilion material exposes a retry instead of an incomplete scene", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 480 });
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.route("**/materials/plaster-diffuse.*", (route) => route.abort());
  await page.goto("/demo/space/");
  await page.clock.fastForward(1000);
  await expect(page.locator("[data-space-root]")).toHaveAttribute("data-state", "unavailable");
  await expect(page.locator("[data-space-loader]")).not.toBeVisible();
  await expect(page.locator("[data-space-retry]")).toBeVisible();
  await expect(page.locator("[data-enter-space]")).toBeDisabled();
});

test("a stalled pavilion asset exposes a fallback and recovers when loading finishes", async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 480 });
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  let release!: () => void;
  const pending = new Promise<void>((resolve) => { release = resolve; });
  await page.route("**/materials/plaster-diffuse.*", async (route) => {
    await pending;
    await route.continue();
  });
  const request = page.waitForRequest("**/materials/plaster-diffuse.*");
  await page.goto("/demo/space/", { waitUntil: "domcontentloaded" });
  await request;
  try {
    await page.clock.fastForward(16000);
    await expect(page.locator("[data-space-loader]")).not.toBeVisible();
    await expect(page.locator("[data-enter-space]")).toBeDisabled();
    await expect(page.locator("[data-space-retry]")).toBeVisible();
  } finally {
    release();
  }
  await page.waitForLoadState("load");
  await page.clock.fastForward(300);
  await expect(page.locator("[data-enter-space]")).toBeEnabled();
  await expect(page.locator("[data-space-fallback]")).not.toBeVisible();
});

test("an unavailable WebGL context leaves no dead pavilion entry", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, ...args: unknown[]) {
      if (this.matches("[data-space-canvas]")) return null;
      return Reflect.apply(getContext, this, args);
    } as typeof getContext;
  });
  const poster = page.waitForResponse("**/pavilion-fallback.jpg");
  await page.goto("/demo/space/");
  expect((await poster).ok()).toBe(true);
  await expect(page.locator("[data-space-root]")).toHaveAttribute("data-webgl", "unavailable");
  await expect(page.locator("[data-enter-space]")).toBeDisabled();
  await expect(page.locator("[data-space-loader]")).not.toBeVisible();
});

test("pavilion overlays keep arrow keys available for scrolling", async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 700 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  // Freeze scene animation so software GPU speed cannot obscure input regressions.
  await page.clock.install();
  await page.clock.pauseAt(new Date());
  await page.goto("/demo/space/");
  await page.clock.fastForward(1000);
  await expect(page.locator("[data-space-root]")).toHaveAttribute("data-state", "ready", { timeout: 15000 });
  await page.locator("[data-enter-space]").press("Enter");
  await expect(page.locator("[data-space-root]")).toHaveAttribute("data-state", "exploring");
  await page.clock.fastForward(500);
  await expect(page.locator("[data-index-toggle]")).toBeVisible();
  await page.locator("[data-index-toggle]").focus();
  await expect(page.locator("[data-index-toggle]")).toBeFocused();
  await page.locator("[data-index-toggle]").press("Enter");
  await expect(page.locator("[data-index-toggle]")).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("[data-index-list]")).toBeVisible();
  const firstObject = page.locator('[data-index-object="0"]');
  const arrowIsAllowed = (selector: string) => page.locator(selector).evaluate((element) =>
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown", code: "ArrowDown", bubbles: true, cancelable: true })),
  );
  await expect.poll(() => arrowIsAllowed('[data-index-object="0"]')).toBe(true);
  await firstObject.press("Enter");
  await expect(page.locator("[data-space-detail]")).toHaveAttribute("aria-hidden", "false");
  await expect.poll(() => arrowIsAllowed("[data-detail-close]")).toBe(true);
  await page.clock.fastForward(300);
  await page.locator("[data-detail-source]").focus();
  await page.locator(".space-detail__body").evaluate((element) => { element.scrollTop = 0; });
  await page.keyboard.press("ArrowDown");
  await expect.poll(() => page.locator(".space-detail__body").evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
});
