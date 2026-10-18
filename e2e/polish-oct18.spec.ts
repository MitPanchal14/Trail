import { test, expect } from "@playwright/test";
import { emptySnapshot, dateKey } from "../lib/domain";
import { transition } from "../lib/actions";
const long = "GardenChecklistWithUnbrokenIdentifierForWeekendPreparationAndNeighbourhoodVolunteerCoordination";
test.beforeEach(async ({ page }, info) => {
  if (info.project.name === "desktop") await page.setViewportSize({ width: 1280, height: 720 });
});
function fixture(done = false) {
  let s = transition(emptySnapshot(), { type: "create", title: long, finishCondition: "Two reviewed photos", action: "Review photo", minutes: 2 });
  const t = { ...s.subtasks[0], id: crypto.randomUUID(), title: "Check caption", orderKey: 1, checkpointSlot: 1 };
  s.subtasks.push(t); s.mountains[0].nextCheckpointSlot = 2;
  s = transition(s, { type: "start", minutes: 2 });
  s = transition(s, { type: "complete" });
  if (done) { s = transition(s, { type: "start-next", id: t.id, minutes: 2 }); s = transition(s, { type: "complete" }); }
  return s;
}
test("unbroken names wrap, continuation stays compact and plan ownership stays visible", async ({ page }, info) => {
  const s = fixture();
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Start next action", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width);
  const boxes = await page.evaluate(() => ({ text: document.querySelector(".heading > div")!.getBoundingClientRect().toJSON(), button: document.querySelector(".heading > button")!.getBoundingClientRect().toJSON() }));
  expect(boxes.text.right <= boxes.button.x || boxes.text.y >= boxes.button.bottom || boxes.text.bottom <= boxes.button.y).toBe(true);
  await page.screenshot({ path: info.outputPath("long-title-continuation.png"), fullPage: true });
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Review the entire breakdown", exact: true })).toBeFocused();
  await page.getByLabel("Mountain name", { exact: true }).fill("Separate photo guide");
  await page.getByLabel("Finish condition", { exact: true }).fill("Reviewed");
  await page.getByLabel("Action 1 title", { exact: true }).fill("Review draft");
  await page.getByLabel("Action 1 instruction", { exact: true }).fill("Check the reference");
  const label = page.getByLabel("I reviewed the goal, finish condition and every action");
  await label.scrollIntoViewIfNeeded();
  const aligned = await label.evaluate(input => {
    const a = input.getBoundingClientRect(), b = input.parentElement!.querySelector("span")!.getBoundingClientRect();
    return b.x > a.right && Math.abs(a.y - b.y) < 12;
  });
  expect(aligned).toBe(true);
  await label.check();
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page.getByRole("checkbox", { name: /Check caption/ }).check();
  await expect(page.locator(".selected-plan .project-context")).toHaveText(long);
  await page.getByRole("button", { name: "Commit today’s plan", exact: true }).click();
  await expect(page.locator(".plan-row .project-context")).toHaveText(long);
  await page.screenshot({ path: info.outputPath("two-project-plan.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await page.evaluate(() => JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!))).dayPlans[0].dateKey).toBe(dateKey(Date.now(), s.calendarTimeZone));
});

for (const motion of ["reduce", "no-preference"] as const) test(`decision dialogs and summit reward: ${motion}`, async ({ page }, info) => {
  const s = fixture(true);
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.emulateMedia({ reducedMotion: motion });
  await page.goto("/");
  const viewport = page.viewportSize()!;
  await page.setViewportSize({ width: 390, height: 480 });
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await expect(page.getByRole("button", { name: "Not yet", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).focus();
  await expect(page.getByRole("button", { name: "Yes, finish condition met", exact: true })).toBeInViewport();
  await page.screenshot({ path: info.outputPath("short-confirm-dialog.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Confirm goal complete", exact: true })).toBeFocused();
  await page.setViewportSize(viewport);
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  if (motion === "no-preference") await page.waitForTimeout(950); // bounded visual reveal only
  if (info.project.name === "mobile") {
    await expect(page.locator("canvas")).toBeInViewport({ ratio: 0.8 });
    const placement = await page.evaluate(() => ({ world: document.querySelector(".world")!.getBoundingClientRect().toJSON(), task: document.querySelector(".real-action")!.getBoundingClientRect().toJSON() }));
    expect(placement.world.bottom).toBeLessThanOrEqual(placement.task.y);
    expect(placement.world.top).toBeGreaterThanOrEqual(0);
  }
  await page.screenshot({ path: info.outputPath(`summit-${motion}.png`) });
  await page.setViewportSize({ width: 390, height: 480 });
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  const dialog = page.getByRole("dialog", { name: "Was the summit confirmation also mistaken?" });
  await expect(page.getByRole("button", { name: "Cancel Undo", exact: true })).toBeFocused();
  const gaps = await dialog.locator("button").evaluateAll(buttons => buttons.slice(1).map((b, i) => b.getBoundingClientRect().top - buttons[i].getBoundingClientRect().bottom));
  for (const gap of gaps) expect(gap).toBeGreaterThanOrEqual(8);
  const correct = page.getByRole("button", { name: "Undo action and correct summit", exact: true });
  await correct.focus(); await expect(correct).toBeInViewport();
  await page.screenshot({ path: info.outputPath("short-undo-dialog.png") });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Undo completion", exact: true }).first()).toBeFocused();
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByLabel("Describe the work").fill(long);
  await page.getByRole("button", { name: "Close · keep draft", exact: true }).click();
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await expect(page.getByRole("button", { name: "Keep draft and cancel edit", exact: true })).toBeFocused();
  const discard = page.getByRole("button", { name: "Discard draft and edit this mountain", exact: true });
  await discard.focus(); await expect(discard).toBeInViewport();
  await page.screenshot({ path: info.outputPath("short-conflict-dialog.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Edit breakdown", exact: true })).toBeFocused();
});
