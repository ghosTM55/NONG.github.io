import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:4323",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run preview -- --host 127.0.0.1 --port 4323 --ignore-lock",
    url: "http://127.0.0.1:4323",
    // Keep Astro attached so the test runner owns and stops this server.
    env: { ASTRO_PREVIEW_BACKGROUND: "1" },
    reuseExistingServer: false,
  },
});
