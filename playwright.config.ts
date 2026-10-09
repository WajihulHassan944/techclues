import { defineConfig, devices } from "@playwright/test";
import fs from "node:fs";

const PORT = Number(process.env.E2E_PORT ?? 3999);
const baseURL = process.env.E2E_BASE_URL ?? `http://127.0.0.1:${PORT}`;
// Use a pre-installed Chromium when one is available (e.g. in CI sandboxes).
const executablePath = [process.env.PLAYWRIGHT_CHROMIUM_PATH, "/opt/pw-browsers/chromium"].find(
  (p) => p && fs.existsSync(p),
);

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: { timeout: 8_000 },
  fullyParallel: true,
  retries: 0,
  reporter: [["list"]],
  use: {
    baseURL,
    launchOptions: { executablePath, args: ["--no-proxy-server", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"] },
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 }, launchOptions: { executablePath, args: ["--no-proxy-server", "--use-gl=swiftshader", "--enable-unsafe-swiftshader"] } } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run build && npx next start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: true,
        timeout: 240_000,
      },
});
