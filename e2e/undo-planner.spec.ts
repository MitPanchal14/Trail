import { test, expect } from "@playwright/test";
import { emptySnapshot, dateKey } from "../lib/domain";
import { transition } from "../lib/actions";
import type { Page } from "@playwright/test";
const key = "work-trail:snapshot:v1";
const read = (page: Page) => page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
for (const kind of ["zero", "no-session", "failure"] as const) test(`Undo recovery boundary: ${kind}`, async ({ page }) => {
  const now = Date.now() - 100000;
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional guide", finishCondition: "Reviewed", action: "Draw specimen", minutes: 1 }, now);
  if (kind !== "no-session") s = transition(s, { type: "start", minutes: 1 }, now);
  s = transition(s, { type: "complete" }, now + 60000);
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Undo completion", exact: true }).first()).toBeEnabled();
  if (kind === "failure") await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional quota failure"); }; });
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  if (kind === "failure") {
    await expect(page.getByRole("region", { name: "Undo recovery" })).toHaveCount(0);
    expect((await read(page)).completions[0].undoneAt).toBeNull();
    return;
  }
  await page.getByRole("region", { name: "Undo recovery" }).getByRole("button", { name: "Return to Draw specimen", exact: true }).click();
  await expect(page.locator("#action-title")).toBeFocused();
  await expect(page.getByRole("timer")).toHaveCount(0);
  if (kind === "zero") {
    await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeDisabled();
    expect((await read(page)).sessions[0].creditedMs).toBe(s.sessions[0].creditedMs);
    await page.getByRole("button", { name: "Extend 5 min", exact: true }).click();
    await expect(page.getByRole("timer")).toHaveText(/0[45]:/);
  } else await expect(page.getByRole("button", { name: "Start", exact: true })).toBeEnabled();
});

test("untouched completed commitments are not unsaved drafts; failed commit stays editable", async ({ page }) => {
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional archived day", finishCondition: "Reviewed", action: "Prior specimen", minutes: 2 });
  const date = dateKey(Date.now(), s.calendarTimeZone);
  s = transition(s, { type: "day-draft", date, ids: [s.subtasks[0].id], availability: "", minutes: null });
  s = transition(s, { type: "day-commit", date });
  s = transition(s, { type: "complete" });
  s = transition(s, { type: "create", title: "Another fictional goal", finishCondition: "Reviewed", action: "New specimen", minutes: 2 });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/");
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await expect(page.getByText(/Unsaved plan changes/)).toHaveCount(0);
  const checkbox = page.getByRole("checkbox", { name: /New specimen/ });
  await expect(checkbox).toBeEnabled();
  await checkbox.focus();
  await checkbox.press("Space");
  await expect(checkbox).toBeChecked();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional quota failure"); }; });
  await page.getByRole("button", { name: "Save plan changes", exact: true }).click();
  await expect(page.locator(".daily-editor")).toBeVisible();
  await expect(page.getByText(/Today’s plan committed/)).toHaveCount(0);
  expect((await read(page)).dayPlans[0].commitments).toHaveLength(1);
});

test("planner stages, changed order, dispositions and grouped switch work", async ({ page }, info) => {
  let s = emptySnapshot();
  for (let i = 1; i <= 5; i++) {
    if (i === 1 || i === 4) s = transition(s, { type: "create", title: i < 4 ? "Fictional woodland guide" : "GardenChecklistWithUnbrokenIdentifierForWeekendPreparationAndNeighbourhoodVolunteerCoordination", finishCondition: "Reviewed", action: `Specimen ${i}`, minutes: i * 15 });
    else {
      const prior = s.subtasks.at(-1)!;
      const mountain = s.mountains.at(-1)!;
      const task = { ...prior, id: crypto.randomUUID(), title: `Specimen ${i}`, suggestedMinutes: i * 15, orderKey: prior.orderKey + 1, checkpointSlot: mountain.nextCheckpointSlot++ };
      s.subtasks.push(task);
      s = transition(s, { type: "select", id: task.id });
    }
  }
  s = transition(s, { type: "complete" });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  const width = info.project.name === "desktop" ? 1440 : info.project.name === "tablet" ? 1024 : 390;
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page.getByLabel("Time available today (optional)").fill("30");
  await page.getByRole("checkbox", { name: /Specimen 1/ }).check();
  await page.getByRole("checkbox", { name: /Specimen 2/ }).check();
  await page.getByRole("checkbox", { name: /Specimen 4/ }).check();
  await expect(page.getByText(/3 actions · 1h 45m planned/)).toBeVisible();
  await expect(page.getByText(/more than your 30 available minutes/)).toBeVisible();
  await page.getByRole("button", { name: "Move planned action 3 up", exact: true }).click();
  await expect(page.getByRole("heading", { name: "3 · Confirm today’s plan", exact: true })).toHaveCount(1);
  const columns = await page.locator(".planner-columns").evaluate(el => getComputedStyle(el).gridTemplateColumns.split(" ").length);
  expect(columns).toBe(info.project.name === "mobile" ? 1 : 2);
  await page.screenshot({ path: info.outputPath("planner-stages.png"), fullPage: true });
  await page.getByRole("button", { name: "Commit today’s plan", exact: true }).click();
  await expect(page.locator(".daily-editor")).toHaveCount(0);
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await expect(page.getByText("Unsaved plan changes", { exact: false })).toHaveCount(0);
  await expect(page.getByText(/Today’s plan committed/)).toHaveCount(0);
  await page.getByRole("button", { name: "Move planned action 1 down", exact: true }).click();
  await expect(page.getByText(/Unsaved plan changes/)).toBeVisible();
  await page.getByRole("button", { name: "Save plan changes", exact: true }).click();
  await page.getByRole("button", { name: "Defer commitment Specimen 1", exact: true }).click();
  await page.getByRole("button", { name: "Remove commitment Specimen 2", exact: true }).click();
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await expect(page.getByText(/Unsaved plan changes/)).toHaveCount(0);
  await page.getByRole("checkbox", { name: /Specimen 4/ }).uncheck();
  await page.getByRole("button", { name: "Save plan changes", exact: true }).click();
  expect((await read(page)).dayPlans[0].commitments).toHaveLength(3);
  await page.locator(".other-work > summary").click();
  await expect(page.locator(".other-work .work-group").getByText("Specimen 5", { exact: true })).not.toBeVisible();
  await page.locator(".completed-work > summary").click();
  await expect(page.locator(".completed-work")).toContainText("Specimen 5");
  await page.screenshot({ path: info.outputPath("grouped-work.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.getByRole("button", { name: "Plan today", exact: true }).click();
    await page.screenshot({ path: info.outputPath("planner-320.png"), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
  }
});

for (const fail of [false, true]) test(`reopened discovery respects latest saved work and guarded selection: ${fail}`, async ({ page, context }) => {
  const now = Date.now() - 100000;
  let s = transition(emptySnapshot(), { type: "create", title: "First fictional goal", finishCondition: "Checked", action: "First specimen", minutes: 3 }, now);
  const first = s.subtasks[0].id;
  s = transition(s, { type: "start", minutes: 3 }, now);
  s = transition(s, { type: "note", note: "Keep first reference" }, now + 1000);
  s = transition(s, { type: "return-step", value: "Check first edge" }, now + 1000);
  s = transition(s, { type: "complete" }, now + 2000);
  s = transition(s, { type: "create", title: "Second fictional goal", finishCondition: "Checked", action: "Second specimen", minutes: 4 }, now + 3000);
  s = transition(s, { type: "start", minutes: 4 }, now + 3000);
  s = transition(s, { type: "note", note: "Keep second reference" }, now + 4000);
  s = transition(s, { type: "return-step", value: "Check second edge" }, now + 4000);
  s = transition(s, { type: "save" }, now + 5000);
  s = transition(s, { type: "undo", id: s.completions[0].id }, now + 6000);
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await expect(page.locator("#action-title")).toHaveText("Check second edge");
  await page.locator(".correction-history summary").click();
  const choice = page.locator(".correction-history").getByRole("button", { name: "Return to First specimen", exact: true });
  if (fail) {
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional write failure"); }; });
    await choice.click();
    await expect(page.locator("#action-title")).toHaveText("Check second edge");
    expect((await read(page)).selection.selectedSubtaskId).toBe(s.selection.selectedSubtaskId);
  } else {
    const observer = await context.newPage();
    await observer.goto("/");
    await observer.locator(".correction-history summary").click();
    await expect(observer.locator(".correction-history").getByRole("button", { name: "Return to First specimen", exact: true })).toBeDisabled();
    await observer.close();
    await choice.click();
    await expect(page.locator("#action-title")).toHaveText("Check first edge");
    expect((await read(page)).selection.selectedSubtaskId).toBe(first);
    expect((await read(page)).sessions).toEqual(s.sessions);
    await expect(page.getByRole("timer")).toHaveCount(0);
  }
});
