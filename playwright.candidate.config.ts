import { defineConfig } from "@playwright/test";
import base from "./playwright.config";

// Explicit local candidate only. The reviewer starts and verifies this server.
export default defineConfig({
  ...base,
  webServer: undefined,
  use: { ...base.use, baseURL: "http://127.0.0.1:3102" },
});
