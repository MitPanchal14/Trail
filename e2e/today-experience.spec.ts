import { test, expect, type Page } from "@playwright/test";
import { emptySnapshot, type Snapshot } from "../lib/domain";
import { transition } from "../lib/actions";
const KEY = "work-trail:snapshot:v1", now = Date.parse("2026-10-20T12:00:00Z");
function fixture(state: "ready" | "returning" | "completed") {
  let s = transition(emptySnapshot(now), { type: "create", title: "A small field guide", finishCondition: "Three illustrated entries, checked against the reference", action: "Sketch the fern outline", minutes: 15 }, now);
  s.calendarTimeZone = "UTC";
  const first = s.subtasks[0];
  first.nextAction = "Trace the outer shape from your reference. Leave the fine details for later.";
  for (const [title, instruction] of [["Label the three veins", "Add three labels to the drawing."], ["Check the finished drawing", "Compare the illustration with your reference."]])
    s.subtasks.push({ ...first, id: crypto.randomUUID(), title, nextAction: instruction, orderKey: s.subtasks.length, checkpointSlot: s.mountains[0].nextCheckpointSlot++ });
  if (state !== "ready") {
    s = transition(s, { type: "start", minutes: 15 }, now);
    s = transition(s, { type: "note", note: "The outer shape is on the page. The three branching veins still need drawing." }, now + 18000);
    s = transition(s, { type: "return-step", value: "Draw the three branching veins", }, now + 18000);
    s = transition(s, { type: state === "returning" ? "save" : "complete" }, now + 18000);
  }
  return s;
}
async function seed(page: Page, s: Snapshot) {
  await page.clock.setFixedTime(now + 30000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(({ key, raw }) => { if (localStorage.getItem(key) === null) localStorage.setItem(key, raw); }, { key: KEY, raw: JSON.stringify(s) });
  await page.goto("/"); await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
}
const stored = (page: Page) => page.evaluate(k => localStorage.getItem(k), KEY);
for (const state of ["ready", "returning", "completed"] as const) for (const width of [1440, 1024, 390, 320]) {
  test(`${state} at ${width}px keeps a visible primary, readable work and unchanged records`, async ({ page }, info) => {
    await page.setViewportSize({ width, height: width > 800 ? 1000 : 844 });
    const s = fixture(state); await seed(page, s);
    await expect(page.locator(".work-bento")).toHaveAttribute("data-today-state", state);
    const primary = page.locator(".real-action button.primary:visible");
    await expect(primary).toHaveCount(1); await expect(primary).toBeInViewport();
    await expect(primary).toHaveText(state === "completed" ? "Start this action" : state === "returning" ? "Resume" : "Start");
    if (state === "returning") {
      await expect(page.getByRole("heading", { name: "Draw the three branching veins", exact: true })).toBeVisible();
      await expect(page.locator(".context")).toContainText("The outer shape is on the page.");
      await expect(page.getByRole("button", { name: "Update progress", exact: true })).toBeVisible();
    } else if (state === "completed") {
      await expect(page.locator(".just-completed h2")).toHaveText("Sketch the fern outline");
      await expect(page.locator(".achievement-note")).toContainText("Checkpoint 1 earned");
      await expect(page.getByRole("heading", { name: "Label the three veins", exact: true })).toBeVisible();
      await expect(page.getByRole("button", { name: "Undo completion", exact: true }).first()).toBeVisible();
    } else {
      await expect(page.locator("#action-title")).toHaveText("Sketch the fern outline");
      await expect(page.getByText("Destination: checkpoint 1", { exact: true })).not.toBeVisible();
    }
    const layout = await page.evaluate(() => {
      const a = document.querySelector(".real-action")!.getBoundingClientRect(), w = document.querySelector(".world")!.getBoundingClientRect();
      const p = document.querySelector(".real-action button.primary")!.getBoundingClientRect();
      return { action: { x: a.x, y: a.y, right: a.right, bottom: a.bottom, width: a.width }, world: { x: w.x, y: w.y, bottom: w.bottom, width: w.width }, primaryBottom: p.bottom, overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
    });
    expect(layout.overflow).toBe(0);
    expect(layout.world.bottom).toBeLessThanOrEqual(layout.action.y);
    expect(Math.abs(layout.action.width - layout.world.width)).toBeLessThanOrEqual(1);
    if (width < 800) expect(layout.primaryBottom).toBeLessThanOrEqual(844);
    expect(await stored(page)).toBe(JSON.stringify(s));
    await page.screenshot({ path: info.outputPath(`${state}-${width}.png`), fullPage: true });
    await info.attach("layout", { body: JSON.stringify(layout), contentType: "application/json" });
  });
}
test("settings disclose with keyboard; update, return, explicit focus, next action and Undo retain data semantics", async ({ page }) => {
  const s = fixture("ready"); await seed(page, s);
  const settings = page.locator(".session-settings > summary").first();
  await settings.focus(); await page.keyboard.press("Enter");
  await page.getByLabel("Session length", { exact: true }).fill("3");
  expect((JSON.parse((await stored(page))!) as Snapshot).sessions).toEqual([]);
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  const editor = page.getByRole("dialog", { name: "Update progress", exact: true });
  await editor.getByLabel("Where I stopped / what changed").fill("Fictional reference chosen");
  await editor.getByLabel("Next time, start here").fill("Draw the first frond");
  await editor.getByRole("button", { name: "Save update", exact: true }).click();
  await page.reload(); await expect(page.getByRole("heading", { name: "Draw the first frond", exact: true })).toBeVisible();
  const updated = JSON.parse((await stored(page))!) as Snapshot;
  expect(updated.sessions).toEqual([]); expect(updated.completions).toEqual([]);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("timer")).toBeVisible();
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  await page.reload(); await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await expect(page.getByRole("timer")).toHaveCount(0);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  await page.getByText("Next session settings", { exact: true }).click();
  await page.getByLabel("Next session length", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Start this action", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("04:00");
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  const end = JSON.parse((await stored(page))!) as Snapshot;
  expect(end.completions.filter(c => !c.undoneAt)).toHaveLength(1);
  expect(end.subtasks.map(t => t.checkpointSlot)).toEqual(s.subtasks.map(t => t.checkpointSlot));
  expect(end.summitConfirmations).toEqual([]);
});

test("long saved context remains available without overflow or writes; work text meets contrast", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 844 });
  let s = fixture("ready");
  s = transition(s, { type: "update-progress", id: s.subtasks[0].id, expectedRevision: s.revision, note: "Fictional stopping context. ".repeat(60), returnStep: "Draw the next frond" }, now + 20000);
  await seed(page, s);
  await page.getByText("Read full stopping note", { exact: true }).click();
  await expect(page.locator(".context details p")).toHaveText(s.subtasks[0].returnContext!.note);
  const audit = await page.evaluate(() => {
    const lum = (color: string) => color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(v => v / 255).map(v => v <= .04045 ? v / 12.92 : ((v + .055) / 1.055) ** 2.4).reduce((n, v, i) => n + v * [.2126, .7152, .0722][i], 0);
    const ratios = ["#action-title", ".real-action .original-action", ".context strong", ".context p", ".real-action .primary", ".update-progress-entry"].map(selector => {
      const el = document.querySelector(selector)!;
      let parent: Element | null = el, background = "";
      while (parent) {
        background = getComputedStyle(parent).backgroundColor;
        if (background !== "rgba(0, 0, 0, 0)") break;
        parent = parent.parentElement;
      }
      const a = lum(getComputedStyle(el).color), b = lum(background);
      return { selector, contrast: (Math.max(a, b) + .05) / (Math.min(a, b) + .05) };
    });
    const buttonFill = lum(getComputedStyle(document.querySelector(".real-action .primary")!).backgroundColor);
    const workFill = lum(getComputedStyle(document.querySelector(".real-action")!).backgroundColor);
    return { ratios, primaryBoundary: (Math.max(buttonFill, workFill) + .05) / (Math.min(buttonFill, workFill) + .05), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth };
  });
  for (const ratio of audit.ratios) expect(ratio.contrast, ratio.selector).toBeGreaterThanOrEqual(4.5);
  expect(audit.primaryBoundary).toBeGreaterThanOrEqual(3);
  expect(audit.overflow).toBe(0); expect(await stored(page)).toBe(JSON.stringify(s));
});

test("invalid duration in closed settings is revealed instead of starting work", async ({ page }) => {
  await seed(page, fixture("ready"));
  const settings = page.locator(".session-settings");
  await settings.locator("summary").click();
  await page.getByLabel("Session length", { exact: true }).fill("0");
  await settings.locator("summary").click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveCount(0);
  await expect(page.getByLabel("Session length", { exact: true })).toBeVisible();
  expect((JSON.parse((await stored(page))!) as Snapshot).sessions).toEqual([]);
});
