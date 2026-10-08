import { expect, test } from "@playwright/test";

test("the animated background stays near 60fps across display refresh rates without slowing time", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 240 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    let id = 0;
    const pending = new Map<number, FrameRequestCallback>();
    const times: number[] = [];
    let draws = 0;
    window.requestAnimationFrame = (callback) => { pending.set(++id, callback); return id; };
    window.cancelAnimationFrame = (handle) => { pending.delete(handle); };
    const uniform = WebGLRenderingContext.prototype.uniform1f;
    WebGLRenderingContext.prototype.uniform1f = function (location, value) {
      if ((this.canvas as HTMLCanvasElement).matches("[data-site-background]")) times.push(value);
      uniform.call(this, location, value);
    };
    const draw = WebGLRenderingContext.prototype.drawArrays;
    WebGLRenderingContext.prototype.drawArrays = function (...args) {
      // Count actual draw submissions without depending on the test machine's GPU speed.
      if ((this.canvas as HTMLCanvasElement).matches("[data-site-background]")) draws++;
      else draw.apply(this, args);
    };
    (window as any).renderProbe = (hz: number) => {
      for (let frame = 0; frame < hz * 3; frame++) {
        const callbacks = [...pending.values()];
        pending.clear();
        callbacks.forEach((callback) => callback(frame * 1000 / hz));
      }
      return { draws, lastTime: times.at(-1) };
    };
  });
  for (const hz of [60, 75, 90, 120, 144]) {
    await page.goto("/");
    const result = await page.evaluate((rate) => (window as any).renderProbe(rate), hz);
    expect(result.draws, `${hz}Hz display over three seconds`).toBeGreaterThanOrEqual(179);
    expect(result.draws, `${hz}Hz display over three seconds`).toBeLessThanOrEqual(181);
    expect(result.lastTime).toBeGreaterThan(2.95);
    expect(result.lastTime).toBeLessThan(3);
  }
});

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
