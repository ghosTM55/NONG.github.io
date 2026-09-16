import { expect, test } from "@playwright/test";

test("homepage practice controls retain their selection and work after repeated cache restores", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const digitalization = page.getByRole("button", { name: "DIGITALIZATION", exact: true });
  const activation = page.getByRole("button", { name: "ACTIVATION", exact: true });
  await digitalization.click();
  await expect(digitalization).toHaveAttribute("aria-pressed", "true");

  for (const [selected, next] of [[digitalization, activation], [activation, digitalization]]) {
    // Drive the BFCache lifecycle without relying on the browser choosing to cache a page.
    await page.evaluate(() => {
      window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true }));
      window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true }));
    });
    await expect(selected).toHaveAttribute("aria-pressed", "true");
    await next.click();
    await expect(next).toHaveAttribute("aria-pressed", "true");
  }
  await expect(page.locator('[data-hero-context-item][data-active="true"]')).toContainText("Transforming heritage");
});

test("homepage animation pauses behind Index and resumes when it closes", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const indicator = page.locator("[data-hero-indicator]");
  const frame = () => indicator.evaluate((canvas) => (canvas as HTMLCanvasElement).toDataURL());
  const initial = await frame();
  await expect.poll(frame).not.toBe(initial);

  await page.getByRole("button", { name: "Open index", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/is-index-open/);
  const paused = await frame();
  await page.waitForTimeout(350);
  expect(await frame() === paused, "the obscured indicator must retain the same frame").toBe(true);

  await page.keyboard.press("Escape");
  await expect.poll(frame).not.toBe(paused);
});

test("phone-width mouse preview autoplays every video without hover", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 664 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open index", exact: true }).click();
  const active = page.locator('[data-index-video][data-active="true"]');
  await expect(active).toHaveCount(5);
  await page.mouse.move(200, 450);
  await expect(active).toHaveCount(5);
  await page.mouse.wheel(0, 600);
  await expect(active).toHaveCount(5);
  await expect.poll(() => active.evaluateAll((videos) =>
    videos.every((video) => !(video as HTMLVideoElement).paused && (video as HTMLVideoElement).loop),
  )).toBe(true);
});

test.describe("touch Index", () => {
  test.use({ viewport: { width: 390, height: 664 }, isMobile: true, hasTouch: true });

  test("landscape chapter labels remain fully inside their rows", async ({ page }) => {
    await page.setViewportSize({ width: 844, height: 390 });
    await page.goto("/");
    await page.getByRole("button", { name: "Open index", exact: true }).tap();
    const originals = page.locator(".index-list__item").filter({ hasText: "In Development" });
    await originals.scrollIntoViewIfNeeded();
    const labelFits = await originals.evaluate((row) => {
      const bounds = row.getBoundingClientRect();
      const label = row.querySelector(".index-list__label")!.getBoundingClientRect();
      return label.top >= bounds.top - 0.5 && label.bottom <= bounds.bottom + 0.5;
    });
    expect(labelFits, "the chapter title and status must not be clipped by their row").toBe(true);
  });

  test("autoplay leaves titles white and only the current page is gold", async ({ page }) => {
    for (const path of ["/", "/curation/"]) {
      await page.goto(path);
      await page.getByRole("button", { name: "Open index", exact: true }).tap();
      await expect(page.locator('[data-index-video][data-active="true"]')).toHaveCount(5);
      await expect(page.locator('[data-index-link][aria-current="page"]')).toHaveCount(path === "/" ? 0 : 1);
      for (const entry of await page.locator("[data-index-link]").all()) {
        const current = await entry.getAttribute("aria-current") === "page";
        await expect(entry.locator(".index-list__label")).toHaveCSS("color",
          current ? "rgb(194, 162, 68)" : "rgb(241, 240, 232)");
      }
    }
    const intro = page.getByRole("link", { name: "INTRO", exact: true });
    await intro.focus();
    await expect(intro.locator(".index-list__label")).toHaveCSS("color", "rgb(241, 240, 232)");
  });

  test("all videos autoplay, closing stops playback, and one tap navigates", async ({ page }) => {
    await page.goto("/");
    const playing = () => page.locator("[data-index-video]").evaluateAll((videos) =>
      videos.filter((video) => !(video as HTMLVideoElement).paused).length,
    );
    await expect(page.locator("[data-index-video][src]")).toHaveCount(0);
    await page.getByRole("button", { name: "Explore our world", exact: true }).tap();
    const active = page.locator('[data-index-video][data-active="true"]');
    await expect(active).toHaveCount(5);
    await expect.poll(playing).toBe(5);

    await page.locator(".index-panel__content").evaluate((element) => {
      element.scrollTop = element.scrollHeight;
    });
    await expect(active).toHaveCount(5);
    await expect.poll(playing).toBe(5);

    await page.getByRole("banner").getByRole("button", { name: "Close index", exact: true }).tap();
    await expect(active).toHaveCount(0);
    await expect.poll(playing).toBe(0);
    await page.getByRole("button", { name: "Explore our world", exact: true }).tap();
    await expect(active).toHaveCount(5);
    await page.getByRole("link", { name: "Contact", exact: true }).tap();
    await expect(page).toHaveURL(/\/contact\/$/);
  });

  test("reduced motion keeps posters static and preference changes stop playback", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.getByRole("button", { name: "Explore our world", exact: true }).tap();
    await page.getByRole("link", { name: "Contact", exact: true }).scrollIntoViewIfNeeded();
    await expect(page.locator("[data-index-video][src]")).toHaveCount(0);

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator('[data-index-video][data-active="true"]')).toHaveCount(5);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator('[data-index-video][data-active="true"]')).toHaveCount(0);
    await expect.poll(() => page.locator("[data-index-video]").evaluateAll((videos) =>
      videos.every((video) => (video as HTMLVideoElement).paused),
    )).toBe(true);
  });
});
