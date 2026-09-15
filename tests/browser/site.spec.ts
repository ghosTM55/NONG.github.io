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
