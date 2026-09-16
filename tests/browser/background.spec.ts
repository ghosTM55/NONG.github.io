import { expect, test } from "@playwright/test";

test("the hero redraws its static frame after WebGL context restoration", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const background = page.locator("[data-site-background]");
  const before = await background.evaluate((element) => (element as HTMLCanvasElement).toDataURL());
  const recoverable = await background.evaluate((element) => new Promise<boolean>((resolve) => {
    const canvas = element as HTMLCanvasElement;
    const gl = canvas.getContext("webgl")!;
    const extension = gl.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("WebGL context-loss simulation is unavailable");
    canvas.addEventListener("webglcontextlost", (event) => {
      if (!event.defaultPrevented) return resolve(false);
      canvas.addEventListener("webglcontextrestored", () => resolve(true), { once: true });
      window.setTimeout(() => extension.restoreContext(), 0);
    }, { once: true });
    extension.loseContext();
  }));
  expect(recoverable, "context loss must be handled so the browser can restore it").toBe(true);
  await expect.poll(() => background.evaluate((element) => (element as HTMLCanvasElement).toDataURL())).toBe(before);
});
