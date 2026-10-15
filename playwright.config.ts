import { defineConfig } from "@playwright/test";
const external = process.env.PW_BASE_URL;
const baseURL = external ?? "http://127.0.0.1:3100";
const live = process.env.PW_LIVE_GEMINI === "1";
if (live && !external)
  throw new Error("Live smoke requires an explicitly configured local dev server in PW_BASE_URL.");
if (live && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseURL).hostname))
  throw new Error("Live smoke is restricted to the local app.");
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/check-server.ts",
  testMatch: live ? "**/live-gemini.spec.ts" : "**/*.spec.ts",
  testIgnore: live ? [] : ["**/live-gemini.spec.ts"],
  retries: 0,
  webServer: external ? undefined : {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: baseURL,
    timeout: 120_000,
    // Refuse an occupied test port instead of trusting an unrelated/stale app.
    reuseExistingServer: false,
    env: { WORK_TRAIL_E2E: "1", ENABLE_AI_PLANNING: "false", GEMINI_API_KEY: "", GEMINI_MODEL: "" },
  },
  use: {
    baseURL,
    timezoneId: "UTC",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "tablet", use: { viewport: { width: 1024, height: 900 } } },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
});
