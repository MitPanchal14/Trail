import { defineConfig } from "@playwright/test";
const baseURL = process.env.PW_DEMO_URL ?? "http://127.0.0.1:3001";
const url = new URL(baseURL);
const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
const full = process.env.PW_FULL_REGRESSION === "1";
if (url.username || url.password || url.search || url.hash || url.pathname !== "/") throw Error("Use a bare demo origin without credentials, path or query.");
if ((!local && (process.env.PW_PUBLIC_DEMO !== "1" || url.protocol !== "https:")) || (local && !["http:", "https:"].includes(url.protocol)))
  throw Error("Public smoke requires explicit PW_PUBLIC_DEMO=1 and the approved HTTPS origin.");
if (process.env.PW_LIVE_GEMINI === "1") throw Error("Live Gemini is not permitted in manual demo checks.");
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/check-manual-demo.ts",
  testMatch: full ? "**/*.spec.ts" : "manual-demo.smoke.ts",
  testIgnore: ["**/live-gemini.spec.ts"],
  retries: 0,
  use: { baseURL, timezoneId: "UTC" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    ...(full ? [{ name: "tablet", use: { viewport: { width: 1024, height: 900 } } }] : []),
    { name: "mobile", use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
});
