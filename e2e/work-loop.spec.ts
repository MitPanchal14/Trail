import { test, expect, type Page } from "@playwright/test";
import type { Snapshot } from "../lib/domain";
const KEY = "work-trail:snapshot:v1";
const start = new Date("2026-10-15T12:00:00Z");
async function records(page: Page): Promise<Snapshot> {
  return page.evaluate((key) => JSON.parse(localStorage.getItem(key)!), KEY);
}
async function create(page: Page, name = "Field guide") {
  await expect(
    page.getByRole("button", { name: "＋ New task", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page
    .getByLabel("Describe the work")
    .fill("Make a fictional field guide.");
  await page
    .getByRole("button", { name: "Write manually", exact: true })
    .click();
  await page.getByLabel("Mountain name").fill(name);
  await page
    .getByLabel("Finish condition", { exact: true })
    .fill("A printable checked guide");
  await page.getByLabel("Action 1 title").fill("Sketch an oak leaf");
  await page.getByLabel("Action 1 instruction").fill("Sketch an oak leaf");
  await page.getByLabel("Action 1 session minutes").fill("1");
  await page
    .getByLabel("I reviewed the goal, finish condition and every action")
    .check();
  await page
    .getByRole("button", { name: "Accept breakdown", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Sketch an oak leaf", exact: true }),
  ).toBeVisible();
}
test("real save, close, return, explicit resume, background catch-up, checkpoint and Undo", async ({
  page,
  context,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.install({ time: start });
  await page.goto("/");
  await create(page);
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 1000),
  );
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("01:00");
  await page.clock.fastForward(10000);
  await page.getByText("Return note (optional)", { exact: true }).click();
  await page
    .getByLabel("Where did you stop?")
    .fill("Oak outline ready; add the veins next.");
  await page
    .getByRole("button", { name: "Save my place", exact: true })
    .click();
  let s = await records(page);
  expect(s.sessions[0]).toMatchObject({
    status: "saved",
    remainingMs: 50000,
    creditedMs: 10000,
  });
  await page.reload();
  await page.clock.runFor(1100);
  await expect(
    page.getByText("Oak outline ready; add the veins next.", { exact: true }),
  ).toBeVisible();
  expect((await records(page)).sessions[0].remainingMs).toBe(50000);
  await page.screenshot({
    path: info.outputPath("slice2-saved.png"),
    fullPage: true,
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.close();
  const returned = await context.newPage();
  returned.on("pageerror", (e) => errors.push(e.message));
  await returned.clock.install({ time: new Date(start.getTime() + 86400000) });
  await returned.goto("/");
  await returned.clock.runFor(1100);
  await expect(
    returned.getByRole("button", { name: "Resume", exact: true }),
  ).toBeEnabled();
  await returned.clock.pauseAt(
    new Date((await returned.evaluate(() => Date.now())) + 1000),
  );
  expect((await records(returned)).sessions[0]).toMatchObject({
    remainingMs: 50000,
    creditedMs: 10000,
    status: "saved",
  });
  await returned.getByRole("button", { name: "Resume", exact: true }).click();
  const other = await context.newPage();
  await other.goto("about:blank");
  await other.bringToFront();
  // A throttled interval fires once, but timestamp delta must catch up all 12s.
  await returned.clock.fastForward(12000);
  await returned.bringToFront();
  expect((await records(returned)).sessions[0]).toMatchObject({
    remainingMs: 38000,
    creditedMs: 22000,
    status: "running",
  });
  await returned.getByRole("button", { name: "Pause", exact: true }).click();
  await returned.clock.fastForward(10000);
  expect((await records(returned)).sessions[0].creditedMs).toBe(22000);
  await returned.screenshot({
    path: info.outputPath("slice2-focus.png"),
    fullPage: true,
  });
  expect(
    await returned.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await returned.getByRole("button", { name: "Continue", exact: true }).click();
  await returned.clock.fastForward(1000);
  await returned
    .getByRole("button", { name: "Complete action", exact: true })
    .click();
  await returned.reload();
  await returned.clock.runFor(1100);
  await expect(
    returned.getByText("✦ 1 earned checkpoint", { exact: true }),
  ).toBeVisible();
  s = await records(returned);
  expect(s.completions.filter((c) => !c.undoneAt)).toHaveLength(1);
  expect(s.sessions[0].creditedMs).toBe(23000);
  expect(s.mountains[0].status).toBe("active");
  await returned.locator(".checkpoints summary").click();
  await expect(
    returned.getByText("Oak outline ready; add the veins next.", {
      exact: true,
    }),
  ).toBeVisible();
  await returned.screenshot({
    path: info.outputPath("slice2-complete.png"),
    fullPage: true,
  });
  await returned
    .getByRole("button", { name: "Undo completion", exact: true })
    .first()
    .click();
  await returned.reload();
  await expect(
    returned.getByText("○ No checkpoints yet", { exact: true }),
  ).toBeVisible();
  s = await records(returned);
  expect(s.completions[0].undoneAt).not.toBeNull();
  expect(s.sessions[0].creditedMs).toBe(23000);
  expect(
    await returned.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("running heartbeat recovery, expiry and second-tab protection", async ({
  page,
  context,
}) => {
  await page.clock.install({ time: start });
  await page.goto("/");
  await create(page);
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 1000),
  );
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward(9000);
  // A second tab cannot create or time anything while the first owns the writer lock.
  const secondary = await context.newPage();
  await secondary.goto("/");
  await expect(secondary.getByText(/Read-only: another tab/)).toBeVisible();
  await expect(
    secondary.getByRole("button", { name: "＋ New task", exact: true }),
  ).toBeDisabled();
  expect((await records(secondary)).sessions[0].creditedMs).toBe(9000);
  await secondary.close();
  await page.clock.setSystemTime(new Date(start.getTime() + 86400000));
  await page.reload();
  await page.clock.runFor(1100);
  await expect(page.getByText("Interrupted · Resume when ready")).toBeVisible();
  expect((await records(page)).sessions[0].creditedMs).toBe(9000);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.clock.fastForward(60000);
  await expect(page.getByRole("timer")).toHaveText("00:00");
  expect((await records(page)).completions).toEqual([]);
  await page.getByRole("button", { name: "Extend 5 min", exact: true }).click();
  await page.clock.fastForward(1000);
  expect((await records(page)).sessions[0]).toMatchObject({
    remainingMs: 299000,
    creditedMs: 61000,
  });
  await page
    .getByRole("button", { name: "Save my place", exact: true })
    .click();
  await expect(page.getByText(/No note saved/)).toBeVisible();
});

test("corrupt storage is retained and recoverable work stays in memory", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    if (!localStorage.getItem(key))
      localStorage.setItem(key, "{broken original");
  }, KEY);
  await page.goto("/");
  await expect(page.locator(".storage-warning")).toContainText(
    "not been overwritten",
  );
  await create(page);
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
    "{broken original",
  );
  await expect(
    page.getByRole("button", { name: "Download original stored data" }),
  ).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await page
    .locator(".storage-warning")
    .getByRole("button", { name: "Download private recovery", exact: true })
    .click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toContain("private-recovery");
});

test("write failures are explicit, retain memory, and samples never become personal records", async ({
  page,
}) => {
  await page.addInitScript((key) => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = function (k, v) {
      if (k === key) throw new DOMException("Full", "QuotaExceededError");
      return original.call(this, k, v);
    };
  }, KEY);
  await page.goto("/");
  await create(page);
  await expect(page.locator(".storage-warning")).toContainText("Not saved");
  await page.getByRole("button", { name: "Explore sample previews" }).click();
  await page.getByLabel("Preview state").selectOption("rich");
  await page.getByRole("button", { name: "Return to my work" }).click();
  await expect(
    page.getByRole("heading", { name: "Sketch an oak leaf", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate((key) => localStorage.getItem(key), KEY),
  ).toBeNull();
});

test("storage read denied and fallback tab lease remain conservative", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "locks", { value: undefined });
  });
  await page.goto("/");
  await create(page);
  const second = await context.newPage();
  await second.addInitScript(() => {
    Object.defineProperty(navigator, "locks", { value: undefined });
  });
  await second.goto("/");
  await expect(
    second.getByRole("button", { name: "＋ New task", exact: true }),
  ).toBeDisabled();
  await second.close();
  await page.close();
  const denied = await context.newPage();
  await denied.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Denied", "SecurityError");
      },
    });
  });
  await denied.goto("/");
  await expect(denied.locator(".storage-warning")).toContainText(
    "cannot be read",
  );
  await create(denied, "In-memory task");
  await expect(
    denied.getByRole("heading", { name: "Sketch an oak leaf", exact: true }),
  ).toBeVisible();
});

test("closing a running tab preserves its heartbeat and never resumes automatically", async ({
  page,
  context,
}) => {
  await page.clock.install({ time: start });
  await page.goto("/");
  await create(page);
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 1000),
  );
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward(8000);
  const before = (await records(page)).sessions[0];
  await page.close();
  const returned = await context.newPage();
  await returned.clock.install({ time: new Date(start.getTime() + 172800000) });
  await returned.goto("/");
  await returned.clock.runFor(1100);
  await expect(
    returned.getByText("Interrupted · Resume when ready"),
  ).toBeVisible();
  await expect(
    returned.getByRole("button", { name: "Resume", exact: true }),
  ).toBeEnabled();
  expect((await records(returned)).sessions[0]).toMatchObject({
    remainingMs: before.remainingMs,
    creditedMs: before.creditedMs,
  });
  await returned.clock.fastForward(30000);
  expect((await records(returned)).sessions[0].creditedMs).toBe(
    before.creditedMs,
  );
});

test("duration validation and stored suggestions survive reload", async ({
  page,
}) => {
  await page.goto("/");
  await create(page);
  await page.reload();
  await expect(page.getByLabel("Session length")).toHaveValue("1");
  await page.getByLabel("Session length").fill("0");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveCount(0);
  expect((await records(page)).sessions).toHaveLength(0);
  await page.getByLabel("Session length").fill("2");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("timer")).toContainText("02:");
});

test("unexpected stored revision is not overwritten", async ({ page }) => {
  await page.goto("/");
  await create(page);
  const original = await page.evaluate((key) => localStorage.getItem(key), KEY);
  await page.evaluate(
    (key) => localStorage.setItem(key, "{external recovery needed"),
    KEY,
  );
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.locator(".storage-warning")).toContainText(
    "not overwritten",
  );
  expect(await page.evaluate((key) => localStorage.getItem(key), KEY)).toBe(
    "{external recovery needed",
  );
  expect(original).not.toBeNull();
});
