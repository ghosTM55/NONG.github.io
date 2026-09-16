import { expect, test } from "@playwright/test";

test("Index contains keyboard focus including its close control and returns it on escape", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const explore = page.getByRole("button", { name: "Explore our world", exact: true });
  await explore.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Index", exact: true });
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(dialog.getByRole("button", { name: "Close index", exact: true })).toBeFocused();
  await page.getByRole("link", { name: "Contact", exact: true }).focus();
  await page.keyboard.press("Tab");
  await expect(dialog.getByRole("link", { name: "NONG Studio home", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(dialog.getByRole("link", { name: "Contact", exact: true })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(explore).toBeFocused();
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

for (const target of [
  { path: "/", button: "Copy email address", success: "EMAIL ADDRESS COPIED", failure: "COPY FAILED" },
  { path: "/contact/", button: "Copy contact email address", success: "Email address copied", failure: "Please select and copy the address above" },
]) {
  for (const fails of [false, true]) {
    test(`${target.path} email copying announces ${fails ? "failure" : "success"} outside the button`, async ({ page }) => {
      await page.addInitScript((fails) => {
        Object.defineProperty(navigator, "clipboard", { value: {
          writeText: async (value: string) => {
            if (fails || value !== "contact@nong.studio") throw new Error("Clipboard unavailable");
          },
        } });
      }, fails);
      await page.goto(target.path);
      const button = page.getByRole("button", { name: target.button, exact: true });
      await button.click();
      const status = button.locator("..").locator("[data-copy-email-status]");
      await expect(status).toHaveText(fails ? target.failure : target.success);
      expect(await status.evaluate((element) => element.closest("button"))).toBeNull();
    });
  }
}
