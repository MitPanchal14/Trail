import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { correctionFixture, correctionKey, correctionNow, correctionStep, type CorrectionState } from "./correction-fixtures";
import type { Snapshot } from "../lib/domain";
const before = process.env.PW_CORRECTION_BEFORE === "1";
async function seed(page: Page, snapshot: Snapshot) {
  await page.clock.setFixedTime(correctionNow + 40000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(({ raw, key }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, raw); }, { raw: JSON.stringify(snapshot), key: correctionKey });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
}
const stored = (page: Page): Promise<Snapshot> => page.evaluate(key => JSON.parse(localStorage.getItem(key)!), correctionKey);
async function measure(page: Page) {
  return page.evaluate(() => {
    const rect = (selector: string) => { const r = document.querySelector(selector)!.getBoundingClientRect(); return { top: r.top, bottom: r.bottom, left: r.left, right: r.right, width: r.width, height: r.height }; };
    return { viewport: { width: innerWidth, height: innerHeight }, scrollY, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, primary: rect(".real-action .primary"), work: rect(".real-action"), world: rect(".world"), material: getComputedStyle(document.querySelector(".real-action")!).backgroundColor };
  });
}
test("production work-loop visual matrix at scroll zero", async ({ browser }, info) => {
  const width = info.project.name === "desktop" ? 1280 : info.project.name === "mobile" ? 390 : 1024;
  const height = width > 800 ? 720 : 844;
  const measurements: Record<string, unknown> = {};
  for (const state of ["ready", "returning", "update", "focus", "middle", "final"] as CorrectionState[]) {
    const context = await browser.newContext({ viewport: { width, height }, timezoneId: "UTC" });
    const page = await context.newPage();
    const s = correctionFixture(state); await seed(page, s);
    if (state === "focus") await page.getByRole("button", { name: "Start", exact: true }).click();
    if (state === "update") await page.getByRole("button", { name: "Update progress", exact: true }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    const layout = await measure(page); measurements[state] = layout;
    await info.attach(`${state}-layout`, { body: JSON.stringify(layout), contentType: "application/json" });
    if (!before) {
      expect(layout.scrollY).toBe(0); expect(layout.overflow).toBe(0);
      expect(layout.world.bottom).toBeLessThanOrEqual(layout.work.top);
      expect(Math.abs(layout.world.left - layout.work.left)).toBeLessThanOrEqual(1);
      if (state === "returning") {
        await expect(page.getByText(correctionStep, { exact: true })).toBeVisible();
        expect(layout.primary.bottom).toBeLessThanOrEqual(height);
        expect(layout.primary.top).toBeGreaterThanOrEqual(0);
        await expect(page.getByRole("button", { name: "Start", exact: true })).toBeEnabled();
        expect((await stored(page)).sessions).toEqual([]);
      }
      if (state === "middle") expect(layout.primary.bottom).toBeLessThanOrEqual(height);
      if (state !== "focus") expect(await stored(page)).toEqual(s);
      if (state === "focus") await expect(page.getByRole("button", { name: "Complete action", exact: true })).toHaveClass(/primary/);
      if (state === "focus" || state === "update") {
        const contrast = await page.evaluate((modal) => {
          const lum = (v: string) => v.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(x => x / 255).map(x => x <= .04045 ? x / 12.92 : ((x + .055) / 1.055) ** 2.4).reduce((n, x, i) => n + x * [.2126, .7152, .0722][i], 0);
          const ratio = (a: string, b: string) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
          const root = document.querySelector(modal ? ".progress-update-dialog" : ".real-action")!, field = root.querySelector("textarea")!, primary = root.querySelector(".primary")!;
          const fs = getComputedStyle(field), ps = getComputedStyle(primary), bg = getComputedStyle(root).backgroundColor;
          return { text: ratio(fs.color, fs.backgroundColor), field: ratio(fs.borderColor, bg), button: ratio(ps.color, ps.backgroundColor), focus: modal ? ratio(fs.outlineColor, bg) : null };
        }, state === "update");
        expect(contrast.text).toBeGreaterThanOrEqual(4.5); expect(contrast.button).toBeGreaterThanOrEqual(4.5); expect(contrast.field).toBeGreaterThanOrEqual(3); if (contrast.focus !== null) expect(contrast.focus).toBeGreaterThanOrEqual(3);
      }
      if (state === "final") {
        await expect(page.locator(".real-action").getByText(/3 \/ 3|3 of 3/)).toHaveCount(0);
        await expect(page.getByRole("button", { name: "Confirm goal complete", exact: true })).toBeVisible();
        expect((await stored(page)).summitConfirmations).toEqual([]);
      }
    }
    await page.screenshot({ path: info.outputPath(`${state}-${width}.png`), fullPage: false });
    if (["returning", "focus", "final"].includes(state)) await page.screenshot({ path: info.outputPath(`${state}-${width}-full.png`), fullPage: true });
    await context.close();
  }
  writeFileSync(info.outputPath("measurements.json"), JSON.stringify(measurements, null, 2));
});

test("320px exact return and real Resume stay above supporting context; maximum text remains intact", async ({ page }, info) => {
  test.skip(before, "before matrix records the defect without accepting it");
  await page.setViewportSize({ width: 320, height: 844 });
  const s = correctionFixture("returning"); await seed(page, s);
  let layout = await measure(page); expect(layout.scrollY).toBe(0); expect(layout.primary.bottom).toBeLessThanOrEqual(844);
  writeFileSync(info.outputPath("start-320-measurements.json"), JSON.stringify(layout, null, 2));
  await page.screenshot({ path: info.outputPath("start-320.png") });
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  await page.reload(); await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  const resumes = [];
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 }); await page.evaluate(() => window.scrollTo(0, 0)); layout = await measure(page);
    expect(layout.primary.bottom).toBeLessThanOrEqual(844); resumes.push(layout);
    await page.screenshot({ path: info.outputPath(`resume-${width}.png`) });
  }
  writeFileSync(info.outputPath("resume-measurements.json"), JSON.stringify(resumes, null, 2));
  await page.setViewportSize({ width: 320, height: 844 });
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Update progress", exact: true });
  const note = "N".repeat(2000), step = "S".repeat(500);
  await dialog.getByLabel("Where I stopped / what changed").fill(note);
  await dialog.getByLabel("Next time, start here").fill(step);
  await dialog.getByRole("button", { name: "Save update", exact: true }).click();
  await page.reload(); await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  const raw = await stored(page);
  const fullStep = page.getByText("Read full next step", { exact: true }); await fullStep.focus(); await fullStep.press("Enter");
  await expect(page.getByText(step, { exact: true })).toBeVisible();
  await page.getByText("Read full stopping note", { exact: true }).click();
  await expect(page.getByText(note, { exact: true })).toBeVisible();
  expect(await stored(page)).toEqual(raw);
  expect((await measure(page)).overflow).toBe(0);
});

test("three real manual actions retain continuity, explicit return and factual Undo", async ({ page }, info) => {
  test.skip(before, "after-only interaction gate");
  await page.clock.install({ time: correctionNow });
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await page.getByLabel("Mountain name", { exact: true }).fill("Fictional community garden");
  await page.getByLabel("Finish condition", { exact: true }).fill("Three planting notes checked");
  for (let i = 1; i <= 3; i++) {
    if (i > 1) await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
    await page.getByLabel(`Action ${i} title`, { exact: true }).fill(`Check planting note ${i}`);
    await page.getByLabel(`Action ${i} instruction`, { exact: true }).fill(`Compare note ${i} with the seed packet.`);
    await page.getByLabel(`Action ${i} session minutes`, { exact: true }).fill("2");
  }
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  const ready = await measure(page), original = await stored(page);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  const focus = await measure(page);
  expect(focus.material).toBe(ready.material); expect(focus.work.left).toBe(ready.work.left); expect(focus.world.left).toBe(ready.world.left);
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveCount(0);
  await page.getByRole("button", { name: "Start this action", exact: true }).click();
  await page.clock.fastForward(10000);
  const editor = page.locator(".return-note");
  const beforeToggle = await stored(page); await editor.locator("summary").click(); await editor.locator("summary").click();
  expect((await stored(page)).sessions).toEqual(beforeToggle.sessions);
  await page.getByLabel("Where I stopped", { exact: false }).fill("The first note is checked; the second needs its depth label.");
  await page.getByLabel("First thing when I return", { exact: false }).fill("Check the depth label against the packet.");
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  const saved = await stored(page); await page.reload();
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await page.clock.fastForward(30000);
  expect((await stored(page)).sessions).toEqual(saved.sessions);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  await expect(page.getByRole("button", { name: "Continue", exact: true })).toBeEnabled();
  await page.screenshot({ path: info.outputPath("ordinary-project-paused.png"), fullPage: true });
  await page.getByRole("button", { name: "Continue", exact: true }).click();
  await page.clock.fastForward(120000);
  await expect(page.getByRole("timer")).toHaveText("00:00");
  expect((await stored(page)).completions.filter(c => !c.undoneAt)).toHaveLength(1);
  await page.screenshot({ path: info.outputPath("ordinary-project-expired.png"), fullPage: true });
  await page.getByRole("button", { name: "Extend 5 min", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("05:00");
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  expect((await stored(page)).completions.filter(c => !c.undoneAt)).toHaveLength(2);
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  const end = await stored(page);
  expect(end.completions.filter(c => !c.undoneAt).map(c => c.subtaskId)).toEqual([original.subtasks[0].id]);
  expect(end.subtasks.map(t => [t.id, t.checkpointSlot])).toEqual(original.subtasks.map(t => [t.id, t.checkpointSlot]));
  expect(end.summitConfirmations).toEqual([]);
});

test("long identities, short-height dialog, reflow, warnings and separate summit decisions remain accessible", async ({ page }, info) => {
  test.skip(before, "after-only boundary gate");
  await page.setViewportSize({ width: 320, height: 480 });
  const s = correctionFixture("returning");
  s.mountains[0].title = "Project".repeat(60); s.subtasks[0].title = "Action".repeat(80);
  await seed(page, s);
  await page.getByText("Read full project name", { exact: true }).click();
  await expect(page.getByText(s.mountains[0].title, { exact: true })).toBeVisible();
  await page.getByText("Read full action title", { exact: true }).click();
  await expect(page.locator(".real-action").getByText(s.subtasks[0].title, { exact: true })).toBeVisible();
  expect((await measure(page)).overflow).toBe(0);
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  const dialog = page.getByRole("dialog", { name: "Update progress", exact: true });
  await dialog.getByRole("button", { name: "Save update", exact: true }).focus();
  await expect(dialog.getByRole("button", { name: "Save update", exact: true })).toBeInViewport();
  await page.screenshot({ path: info.outputPath("dialog-short-height.png") });
  const prior = await stored(page); await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Update progress", exact: true })).toBeFocused(); expect(await stored(page)).toEqual(prior);
  // 640 CSS px is the reflow width of a 1280px browser at 200% zoom.
  await page.setViewportSize({ width: 640, height: 360 });
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  await dialog.getByRole("button", { name: "Cancel", exact: true }).focus(); await expect(dialog.getByRole("button", { name: "Cancel", exact: true })).toBeInViewport();
  expect((await measure(page)).overflow).toBe(0); await page.keyboard.press("Escape");
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional quota failure"); }; });
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  await dialog.getByLabel("Next time, start here").fill("Keep this unsaved draft");
  await dialog.getByRole("button", { name: "Save update", exact: true }).click();
  await expect(dialog.getByRole("alert")).toBeVisible(); await expect(dialog.getByRole("button", { name: "Download update draft", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("visible-write-failure.png") });
  expect(await stored(page)).toEqual(prior);
});

test("final checkpoint never awards summit without confirmation and reopening retains history", async ({ page }, info) => {
  test.skip(before, "after-only state gate");
  await seed(page, correctionFixture("final"));
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Not yet", exact: true }).click();
  expect((await stored(page)).summitConfirmations).toEqual([]);
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  await expect(page.getByRole("button", { name: "Reopen goal", exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("confirmed-goal.png"), fullPage: true });
  await page.getByRole("button", { name: "Reopen goal", exact: true }).click();
  await expect(page.getByText("Historical summit retained. New work is not marked complete.", { exact: true })).toBeVisible();
  await page.screenshot({ path: info.outputPath("reopened-goal.png"), fullPage: true });
  const reopened = await stored(page); expect(reopened.summitConfirmations).toHaveLength(1); expect(reopened.summitConfirmations[0].revokedAt).toBeNull();
});
