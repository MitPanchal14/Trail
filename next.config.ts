import type { NextConfig } from "next";
const config: NextConfig = {
  devIndicators: false,
  // A managed browser-test server must not share the user's dev compiler/lock.
  distDir: process.env.WORK_TRAIL_E2E === "1" ? ".next-e2e" : ".next",
};
export default config;
