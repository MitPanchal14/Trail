import { it, expect } from "vitest";
import { overviewTime } from "../lib/progress-display";

it("keeps overview time short without turning positive sub-minute time into zero", () => {
  expect([0, 1, 500, 1000, 12500, 59999, 60000, 90000, 3600000, 8130000].map(overviewTime))
    .toEqual(["0s", "<1s", "<1s", "1s", "12s", "59s", "1m", "1m", "1h", "2h 15m"]);
});
