import { test, expect, type Page } from "@playwright/test";
import { emptySnapshot, snapshotSchema } from "../lib/domain";
import { transition } from "../lib/actions";
const key = "work-trail:snapshot:v1";
const now = Date.parse("2026-10-18T12:00:00Z");
const goal = "FictionalWoodlandGuideWithAnUnbrokenLongNameForCommunityGardenReference";
const records = (page: Page) => page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
function fixture() {
  let s = emptySnapshot(Date.parse("2024-01-01T00:00:00Z"));
  s.calendarTimeZone = "UTC";
  s = transition(s, { type: "create", title: "Fictional leap-year guide", finishCondition: "Checked", action: "Sketch fern", minutes: 2 }, Date.parse("2024-02-29T10:00:00Z"));
  s = transition(s, { type: "day-draft", date: "2024-02-29", ids: [s.subtasks[0].id], availability: "", minutes: null }, Date.parse("2024-02-29T10:00:00Z"));
  s = transition(s, { type: "day-commit", date: "2024-02-29" }, Date.parse("2024-02-29T10:00:00Z"));
  s = transition(s, { type: "complete" }, Date.parse("2024-02-29T10:01:00Z"));
  s.subtasks[0].archivedAt = "2024-03-01T00:00:00Z";
  s = transition(s, { type: "create", title: goal, finishCondition: "Reviewed", action: "Label leaf", minutes: 5 }, Date.parse("2026-10-14T12:00:00Z"));
  const first = s.subtasks[1];
  for (const title of ["Check veins", "List seeds"]) s.subtasks.push({ ...first, id: crypto.randomUUID(), title, orderKey: s.subtasks.length, checkpointSlot: s.mountains[1].nextCheckpointSlot++ });
  s = transition(s, { type: "start", minutes: 5 }, Date.parse("2026-10-14T23:59:30Z"));
  s = transition(s, { type: "save" }, Date.parse("2026-10-15T00:00:30Z"));
  s = transition(s, { type: "day-draft", date: "2026-10-15", ids: s.subtasks.slice(1).map(t => t.id), availability: "", minutes: null }, Date.parse("2026-10-15T10:00:00Z"));
  s = transition(s, { type: "day-commit", date: "2026-10-15" }, Date.parse("2026-10-15T10:00:00Z"));
  s = transition(s, { type: "complete" }, Date.parse("2026-10-15T10:01:00Z"));
  s.subtasks[1].title = "Label the oak leaf (edited)";
  for (let i = 1; i <= 2; i++) s = transition(s, { type: "disposition", date: "2026-10-15", id: s.dayPlans[1].commitments[i].id, disposition: i === 1 ? "removed" : "deferred" }, Date.parse("2026-10-15T11:00:00Z"));
  s = transition(s, { type: "select", id: s.subtasks[2].id }, Date.parse("2026-10-15T12:00:00Z"));
  s = transition(s, { type: "start", minutes: 5 }, Date.parse("2026-10-15T23:59:30Z"));
  s = transition(s, { type: "return-step", value: "Compare the reference" }, Date.parse("2026-10-16T00:00:00Z"));
  s = transition(s, { type: "note", note: "Latest seed packet note" }, Date.parse("2026-10-16T00:00:00Z"));
  s = transition(s, { type: "save" }, Date.parse("2026-10-16T00:01:00Z"));
  s = transition(s, { type: "complete" }, Date.parse("2026-10-16T10:00:00Z"));
  s = transition(s, { type: "create", title: "Fictional garden guide", finishCondition: "Checked", action: "Check plot", minutes: 5 }, Date.parse("2026-10-15T12:00:00Z"));
  s = transition(s, { type: "complete" }, Date.parse("2026-10-15T12:00:07Z"));
  return snapshotSchema.parse(s);
}
async function seed(page: Page, s = fixture()) {
  await page.clock.setFixedTime(now);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
}
async function fullYear(page: Page) {
  const disclosure = page.locator(".progress-full-year");
  if (!(await disclosure.evaluate(el => el.hasAttribute("open"))))
    await disclosure.locator(":scope > summary").click();
}
async function dayDetails(page: Page, name: string) {
  const outer = page.locator(".progress-day-disclosure");
  if (!(await outer.evaluate(el => el.hasAttribute("open")))) await outer.locator(":scope > summary").click();
  const summary = page.locator(".progress-records > details > summary").filter({ hasText: new RegExp(`^${name}`) });
  if (!(await summary.evaluate(el => el.parentElement!.hasAttribute("open")))) await summary.click();
}

test("empty Progress shows a real neutral year and accessible dates without writing", async ({ page }) => {
  const s = emptySnapshot(now); s.calendarTimeZone = "UTC";
  await seed(page, s);
  await page.goto("/progress");
  await expect(page.getByRole("heading", { name: "Progress", exact: true })).toBeFocused();
  await expect(page.locator('.trail-navigation [aria-current="page"]')).toHaveText("▦ Progress");
  await expect(page.locator(".progress-month:visible")).toHaveCount(1);
  await expect(page.getByText("Your first checkpoint starts with one action.", { exact: true })).toBeVisible();
  await fullYear(page);
  await expect(page.locator("[data-date]")).toHaveCount(365);
  const before = await records(page);
  await page.locator('[data-date="2026-10-19"]').click();
  await expect(page.locator("#progress-day-title")).toBeFocused();
  await expect(page.locator(".progress-day")).toContainText("Future date — not a missing day of work");
  await page.getByRole("combobox", { name: "Month", exact: true }).selectOption("0");
  await page.locator('[data-date="2026-01-01"]').focus();
  await page.locator('[data-date="2026-01-01"]').press("Enter");
  await expect(page.locator(".progress-day")).toContainText("Before first use");
  await expect(page.getByText(/Insufficient history for two complete/)).not.toBeVisible();
  await page.locator(".progress-comparison > summary").click();
  await expect(page.getByText(/Insufficient history for two complete/)).toBeVisible();
  expect(await records(page)).toEqual(before);
});

test("mixed history has exact dates, time, title snapshots, saved-context limits and equivalent reports", async ({ page }, info) => {
  await seed(page);
  await page.goto("/progress#2026-10-15");
  await expect(page.locator("#progress-day-title")).toHaveText("October 15, 2026");
  const before = await records(page);
  await expect(page.locator('[data-date="2026-10-15"]')).toHaveAttribute("data-band", "2");
  await expect(page.locator('[data-date="2026-10-15"]')).toHaveAccessibleName(/2 completed actions; not all commitments completed that day/);
  await expect(page.locator(".progress-plan-status")).toContainText("1 of 3 planned actions completed");
  await dayDetails(page, "Plan history");
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).toContainText("Label leaf");
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).toContainText("Removed");
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).toContainText("Deferred");
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).toContainText("October 16, 2026 on another date");
  await dayDetails(page, "Completed actions");
  await expect(page.getByRole("region", { name: "Completed actions on selected date" })).toContainText("Label the oak leaf (edited)");
  await expect(page.getByRole("region", { name: "Completed actions on selected date" })).toContainText("Not committed for this date");
  await expect(page.locator(".progress-day-measures")).toContainText("1m");
  await dayDetails(page, "Recorded time");
  await expect(page.getByRole("region", { name: "Recorded session time", exact: true })).toContainText("1m 0s (60 seconds)");
  await dayDetails(page, "Saved places");
  await expect(page.getByRole("region", { name: "Latest recorded saves" })).toContainText("No latest saved place");
  await page.locator(".progress-comparison > summary").click();
  await expect(page.locator(".progress-comparison")).toContainText("October 11, 2026 – October 17, 2026");
  await expect(page.locator(".progress-comparison")).toContainText("October 4, 2026 – October 10, 2026");
  await page.locator('[aria-label="October 2026"]').screenshot({ path: info.outputPath("october-grid.png") });
  await page.locator(".progress-day").screenshot({ path: info.outputPath("mixed-day.png") });
  if (info.project.name === "desktop") await page.screenshot({ path: info.outputPath("year-and-records.png"), fullPage: true });
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.locator(".progress-day").screenshot({ path: info.outputPath("mixed-day-320.png") });
    await page.locator('[aria-label="October 2026"]').screenshot({ path: info.outputPath("october-grid-320.png") });
    const target = await page.locator('[data-date="2026-10-15"]').boundingBox();
    expect(target!.width).toBeGreaterThanOrEqual(24);
    expect(target!.height).toBeGreaterThanOrEqual(40);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  }
  await page.locator('[data-date="2026-10-16"]').click();
  await expect(page.locator(".progress-day-disclosure")).not.toHaveAttribute("open");
  await dayDetails(page, "Saved places");
  await expect(page.getByRole("region", { name: "Latest recorded saves" })).toContainText("Latest seed packet note");
  await expect(page.getByRole("region", { name: "Latest recorded saves" })).toContainText("not a historical copy");
  await page.getByLabel("Calendar year", { exact: true }).selectOption("2024");
  await fullYear(page);
  await expect(page.locator("[data-date]")).toHaveCount(366);
  await page.locator('[data-date="2024-02-29"]').click();
  await expect(page.getByRole("combobox", { name: "Month", exact: true })).toHaveValue("1");
  await expect(page.locator(".progress-month:visible")).toHaveCount(1);
  await dayDetails(page, "Completed actions");
  await expect(page.locator(".progress-day")).toContainText("Archived action");
  await expect(page.locator('[data-date="2024-02-29"]')).toHaveAccessibleName(/1 completed actions; all commitments completed that day/);
  await page.reload();
  await expect(page.locator("#progress-day-title")).toHaveText("February 29, 2024");
  expect(await records(page)).toEqual(before);
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test("Undo in existing Mountains updates the historical grid without erasing time or other goals", async ({ page }) => {
  await seed(page);
  await page.goto("/progress#2024-02-29");
  const before = await records(page);
  await page.getByRole("link", { name: "△ Mountains", exact: true }).click();
  await page.locator(".mountain-detail .checkpoint-journal summary").first().click();
  await page.locator(".mountain-detail").getByRole("button", { name: "Undo completion", exact: true }).click();
  await page.getByRole("link", { name: "▦ Progress", exact: true }).click();
  await page.getByLabel("Calendar year", { exact: true }).selectOption("2024");
  await page.getByRole("combobox", { name: "Month", exact: true }).selectOption("1");
  await page.locator('[data-date="2024-02-29"]').click();
  await expect(page.locator('[data-date="2024-02-29"]')).toHaveAccessibleName(/0 completed actions; not all commitments completed that day/);
  await expect(page.locator(".progress-plan-status")).toContainText("0 of 1 planned actions completed");
  const after = await records(page);
  expect(after.sessions).toEqual(before.sessions);
  expect(after.completions.slice(1)).toEqual(before.completions.slice(1));
  await page.reload();
  await expect(page.locator('[data-date="2024-02-29"]')).toHaveAttribute("data-band", "0");
});

test("readonly and storage-warning Progress remains browseable without snapshot writes", async ({ page, context }) => {
  await seed(page);
  await page.goto("/");
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
  const observer = await context.newPage();
  await observer.clock.setFixedTime(now);
  await observer.goto("/progress");
  await expect(observer.getByText(/Read-only:/)).toBeVisible();
  const before = await records(observer);
  await observer.locator('[data-date="2026-10-15"]').click();
  await expect(observer.locator("#progress-day-title")).toBeFocused();
  expect(await records(observer)).toEqual(before);
  await observer.close();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional storage full"); }; });
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("link", { name: "▦ Progress", exact: true }).click();
  await expect(page.locator(".storage-warning")).toBeVisible();
  await page.locator('[data-date="2026-10-15"]').click();
  await expect(page.locator(".progress-plan-status")).toContainText("1 of 3");
  expect(await records(page)).toEqual(before);
});

test("Progress back navigation keeps one live focus session accessible", async ({ page }) => {
  const s = transition(emptySnapshot(now), { type: "create", title: "Fictional guide", finishCondition: "Reviewed", action: "Draw leaf", minutes: 3 }, now);
  await seed(page, s);
  await page.goto("/progress");
  await page.getByRole("link", { name: "◉ Today", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const before = await records(page);
  await page.goBack();
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.getByText(/Save your place before browsing Progress/)).toBeVisible();
  expect((await records(page)).selection.sessionId).toBe(before.selection.sessionId);
  expect((await records(page)).sessions[0].status).toBe("running");
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Progress", exact: true })).toBeVisible();
  expect((await records(page)).completions).toHaveLength(0);
});

test("persisted Tokyo calendar wins over browser timezone at local midnight", async ({ page }) => {
  let s = emptySnapshot(Date.parse("2026-10-17T12:00:00Z")); s.calendarTimeZone = "Asia/Tokyo";
  s = transition(s, { type: "create", title: "Fictional Tokyo guide", finishCondition: "Reviewed", action: "Draw leaf", minutes: 3 }, Date.parse("2026-10-18T14:50:00Z"));
  s = transition(s, { type: "complete" }, Date.parse("2026-10-18T15:01:00Z"));
  await seed(page, s);
  await page.clock.setFixedTime(Date.parse("2026-10-18T15:30:00Z"));
  await page.goto("/progress");
  await expect(page.locator("#progress-day-title")).toHaveText("October 19, 2026");
  await expect(page.locator('[data-date="2026-10-19"]')).toHaveAttribute("aria-current", "date");
  await expect(page.locator('[data-date="2026-10-19"]')).toHaveAccessibleName(/1 completed actions/);
  await page.locator('[data-date="2026-10-18"]').click();
  await expect(page.locator(".progress-day")).toContainText("No recorded completions on this date");
});

test("metrics lead the first screen; year, full-year date and hash keep period/month in sync", async ({ page }) => {
  await seed(page);
  await page.goto("/progress#2026-10-15");
  await expect(page.locator("#progress-period-title")).toHaveText("2026 so far");
  await expect(page.locator(".progress-overview dt")).toHaveText(["Actions completed", "Days with completions", "Recorded time"]);
  await expect(page.locator(".progress-overview dd")).toHaveText(["3", "2", "2m"]);
  await expect(page.locator(".progress-day dt")).toHaveText(["Actions completed", "Recorded time"]);
  await expect(page.locator(".progress-month:visible")).toHaveCount(1);
  await expect(page.locator("[data-date]")).toHaveCount(31);
  const metrics = await page.locator(".progress-overview .progress-measures").boundingBox();
  const calendar = await page.locator(".progress-current-month").boundingBox();
  expect(metrics!.y + metrics!.height).toBeLessThan(calendar!.y);
  expect(metrics!.y + metrics!.height).toBeLessThan(page.viewportSize()!.height);
  await expect(page.getByRole("link", { name: "Continue your work", exact: true })).toHaveAttribute("href", "/");
  for (const css of [".progress-full-year", ".progress-day-disclosure", ".progress-comparison", ".progress-about"])
    await expect(page.locator(css)).not.toHaveAttribute("open");
  await page.getByLabel("Calendar year", { exact: true }).selectOption("2024");
  await expect(page.locator("#progress-period-title")).toHaveText("2024");
  await expect(page.locator(".progress-overview dd")).toHaveText(["1", "1", "0s"]);
  await page.locator(".progress-about > summary").click();
  await expect(page.locator(".progress-about")).toContainText("January 1, 2024 – December 31, 2024");
  await page.getByLabel("Calendar year", { exact: true }).selectOption("2026");
  await expect(page.locator(".progress-overview dd")).toHaveText(["3", "2", "2m"]);
  await expect(page.locator(".progress-about")).toContainText("150 seconds");
  await fullYear(page);
  await expect(page.locator("[data-date]")).toHaveCount(365);
  await page.locator('[data-date="2026-05-02"]').click();
  await expect(page.locator(".progress-full-year")).not.toHaveAttribute("open");
  await expect(page.getByRole("combobox", { name: "Month", exact: true })).toHaveValue("4");
  await expect(page.locator(".progress-current-month h3")).toHaveText("May 2026");
  await expect(page.locator("#progress-day-title")).toBeFocused();
  await page.reload();
  await expect(page.locator(".progress-current-month h3")).toHaveText("May 2026");
  await expect(page.locator('[data-date="2026-05-02"]')).toHaveAttribute("aria-pressed", "true");
  await page.goto("/progress#2024-02-29");
  await expect(page.locator(".progress-current-month h3")).toHaveText("February 2024");
  await expect(page.locator("[data-date]")).toHaveCount(29);
  const beforeContinue = await records(page);
  await page.getByRole("link", { name: "Continue your work", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("timer")).toHaveCount(0);
  expect(await records(page)).toEqual(beforeContinue);
});

test("day records open independently, close on another date, and leave hidden content out of tab order", async ({ page }) => {
  await seed(page);
  await page.goto("/progress#2026-10-15");
  const before = await records(page);
  await dayDetails(page, "Plan history");
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).toBeVisible();
  await expect(page.getByRole("region", { name: "Completed actions on selected date" })).not.toBeVisible();
  await expect(page.getByRole("region", { name: "Recorded session time", exact: true })).not.toBeVisible();
  await expect(page.getByRole("region", { name: "Latest recorded saves" })).not.toBeVisible();
  await dayDetails(page, "Completed actions");
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).toBeVisible();
  await page.locator(".progress-records > details > summary").filter({ hasText: /^Plan history/ }).click();
  await expect(page.getByRole("region", { name: "Commitment history", exact: true })).not.toBeVisible();
  await page.locator('[data-date="2026-10-16"]').click();
  await expect(page.locator(".progress-day-disclosure")).not.toHaveAttribute("open");
  await expect(page.locator(".progress-records > details[open]")).toHaveCount(0);
  await dayDetails(page, "Saved places");
  await expect(page.getByRole("link", { name: "Inspect this mountain", exact: true })).toBeVisible();
  const summary = page.locator(".progress-day-disclosure > summary");
  await summary.click();
  await expect(page.getByRole("link", { name: "Inspect this mountain", exact: true })).not.toBeVisible();
  await summary.focus();
  await page.keyboard.press("Tab");
  await expect(page.locator(".progress-comparison > summary")).toBeFocused();
  expect(await records(page)).toEqual(before);
});

for (const kind of ["empty", "ordinary", "long-name"] as const) test(`compact Progress render: ${kind}`, async ({ page }, info) => {
  const s = kind === "empty" ? emptySnapshot(now) : fixture();
  s.calendarTimeZone = "UTC";
  if (kind === "ordinary") s.mountains.forEach((m, i) => { m.title = `Fictional guide ${i + 1}`; });
  await seed(page, s);
  await page.goto(kind === "empty" ? "/progress" : "/progress#2026-10-15");
  await expect(page.getByRole("link", { name: "Continue your work", exact: true })).toBeVisible();
  await expect(page.locator(".ownership")).toHaveCount(0);
  await expect(page.locator(".progress-month:visible")).toHaveCount(1);
  await page.screenshot({ path: info.outputPath("compact-default.png"), fullPage: true });
  if (kind !== "empty") {
    await dayDetails(page, "Completed actions");
    await page.locator(".progress-day").screenshot({ path: info.outputPath("completed-actions-open.png") });
  }
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 844 });
    if (kind !== "empty") await page.locator(".progress-day-disclosure > summary").click();
    await page.screenshot({ path: info.outputPath("compact-default-320.png"), fullPage: true });
    const metrics = await page.locator(".progress-overview .progress-measures").boundingBox();
    const month = await page.locator(".progress-current-month").boundingBox();
    expect(metrics!.y + metrics!.height).toBeLessThan(month!.y);
    expect(metrics!.y + metrics!.height).toBeLessThan(844);
    const cell = await page.locator("[data-date]").first().boundingBox();
    expect(cell!.width).toBeGreaterThanOrEqual(24);
    expect(cell!.height).toBeGreaterThanOrEqual(40);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});
