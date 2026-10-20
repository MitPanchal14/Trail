import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { currentSession, emptySnapshot, type Snapshot } from "../lib/domain";
import { transition } from "../lib/actions";
const KEY = "work-trail:snapshot:v1", now = Date.parse("2026-10-20T12:00:00Z");
const stored = (page: Page) => page.evaluate(k => localStorage.getItem(k), KEY);
const records = async (page: Page): Promise<Snapshot> => JSON.parse((await stored(page))!);
const dialog = (page: Page) => page.getByRole("dialog", { name: "Update progress", exact: true });
const entry = (page: Page) => page.getByRole("button", { name: "Update progress", exact: true });
function fixture(saved = false) {
  let s = transition(emptySnapshot(now), { type: "create", title: "Fictional garden", finishCondition: "Checked guide", action: "Draw a fern", minutes: 2 }, now);
  if (saved) {
    s = transition(s, { type: "start", minutes: 2 }, now);
    s = transition(s, { type: "note", note: "Old stopping note" }, now + 10000);
    s = transition(s, { type: "return-step", value: "Old next step" }, now + 10000);
    s = transition(s, { type: "save" }, now + 10000);
  }
  return s;
}
async function seed(page: Page, s = fixture()) {
  await page.clock.setFixedTime(now + 20000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(({ key, raw }) => { if (localStorage.getItem(key) === null) localStorage.setItem(key, raw); }, { key: KEY, raw: JSON.stringify(s) });
  await page.goto("/"); await expect(entry(page)).toBeEnabled();
}
async function fill(page: Page, note = "Outline ready; veins remain", step = "Open fictional fern reference") {
  await dialog(page).getByLabel("Where I stopped / what changed").fill(note);
  await dialog(page).getByLabel("Next time, start here").fill(step);
}
test("save/reload/return keeps original action and no time/reward/session; Start is explicit; backup round trip", async ({ page, context }, info) => {
  const before = fixture(); await seed(page, before);
  await entry(page).click(); await fill(page);
  await dialog(page).screenshot({ path: info.outputPath("update-editor.png") });
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await expect(dialog(page)).not.toBeVisible();
  await expect(page.getByRole("heading", { name: "Open fictional fern reference", exact: true })).toBeVisible();
  await expect(page.locator(".original-action")).toHaveText("Action: Draw a fern");
  await expect(page.locator(".context")).toContainText("Outline ready; veins remain");
  const saved = await records(page);
  expect(saved.sessions).toEqual(before.sessions); expect(saved.completions).toEqual(before.completions);
  expect(saved.dayPlans).toEqual(before.dayPlans); expect(saved.summitConfirmations).toEqual(before.summitConfirmations);
  expect(saved.subtasks[0]).toMatchObject({ id: before.subtasks[0].id, title: "Draw a fern", checkpointSlot: 0 });
  await page.reload(); await expect(entry(page)).toBeEnabled();
  expect(await records(page)).toEqual(saved); await expect(page.getByRole("timer")).toHaveCount(0);
  await page.close(); const returned = await context.newPage(); await returned.goto("/");
  await expect(entry(returned)).toBeEnabled();
  await expect(returned.getByRole("heading", { name: "Open fictional fern reference", exact: true })).toBeVisible();
  await expect(returned.getByRole("timer")).toHaveCount(0);
  await returned.screenshot({ path: info.outputPath("updated-return.png"), fullPage: true });
  expect(await returned.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  const download = returned.waitForEvent("download"); await returned.getByRole("button", { name: "Download private recovery", exact: true }).click();
  const backup = await readFile((await (await download).path())!, "utf8");
  expect(JSON.parse(backup)).toEqual(saved);
  await returned.getByRole("button", { name: "Restore private backup", exact: true }).click();
  const restore = returned.getByRole("dialog", { name: "Restore a private backup" });
  await restore.locator("input[type=file]").setInputFiles({ name: "fictional-context.json", mimeType: "application/json", buffer: Buffer.from(backup) });
  await restore.getByRole("button", { name: "Replace and restore", exact: true }).click();
  await expect(returned.getByRole("heading", { name: "Open fictional fern reference", exact: true })).toBeVisible();
  await returned.getByRole("button", { name: "Start", exact: true }).click();
  await expect(returned.getByRole("timer")).toBeVisible();
  await expect(returned.getByLabel("Where I stopped", { exact: false })).toHaveValue("Outline ready; veins remain");
  await expect(returned.getByLabel("First thing when I return")).toHaveValue("Open fictional fern reference");
});
test("existing context is prefilled, Cancel/Escape preserve it, keyboard focus stays bounded and returns", async ({ page }) => {
  await seed(page, fixture(true)); const before = await stored(page);
  await entry(page).focus(); await page.keyboard.press("Enter");
  const note = dialog(page).getByLabel("Where I stopped / what changed"), step = dialog(page).getByLabel("Next time, start here");
  await expect(note).toHaveValue("Old stopping note"); await expect(step).toHaveValue("Old next step"); await expect(note).toBeFocused();
  await note.fill("Cancelled edit"); await page.keyboard.press("Shift+Tab");
  await expect(dialog(page).getByRole("button", { name: "Save update", exact: true })).toBeFocused();
  await page.keyboard.press("Tab"); await expect(note).toBeFocused();
  await page.keyboard.press("Escape"); await expect(dialog(page)).not.toBeVisible(); await expect(entry(page)).toBeFocused();
  expect(await stored(page)).toBe(before);
  await entry(page).click(); await expect(note).toHaveValue("Old stopping note"); await fill(page);
  await dialog(page).getByRole("button", { name: "Cancel", exact: true }).click(); expect(await stored(page)).toBe(before);
});
test("saved session update preserves remaining/focus/history; re-edit and explicit Resume use latest context", async ({ page }) => {
  await seed(page, fixture(true)); const before = await records(page);
  await entry(page).click(); await fill(page); await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await entry(page).click(); await expect(dialog(page).getByLabel("Next time, start here")).toHaveValue("Open fictional fern reference");
  await fill(page, "Updated again", "Compare the next fictional vein"); await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  expect((await records(page)).sessions).toEqual(before.sessions);
  await page.reload(); await expect(page.getByRole("heading", { name: "Compare the next fictional vein", exact: true })).toBeVisible();
  await expect(page.getByRole("timer")).toHaveCount(0); await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  expect((await records(page)).sessions).toEqual(before.sessions);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(page.getByRole("timer")).toHaveText("01:50"); await expect(page.getByLabel("Where I stopped")).toHaveValue("Updated again");
  expect(currentSession(await records(page))?.creditedMs).toBe(10000);
});
test("updates only the selected action when switching work and does not alter original instructions", async ({ page }) => {
  let s = fixture(true); const first = s.subtasks[0];
  s = transition(s, { type: "create", title: "Other fictional goal", finishCondition: "Reviewed", action: "Draw oak", minutes: 3 }, now + 11000);
  // Recovery prioritizes the earlier saved fern; select oak deliberately using existing navigation.
  await seed(page, s); await page.getByRole("link", { name: "△ Mountains", exact: true }).click();
  await page.getByRole("button", { name: "View Other fictional goal", exact: true }).click();
  await page.getByRole("button", { name: "Choose Draw oak on Today", exact: true }).click();
  await entry(page).click(); await expect(dialog(page)).toContainText("Draw oak");
  await fill(page, "Oak context", "Open oak reference"); await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  const after = await records(page); expect(after.subtasks[0]).toEqual(first); expect(after.sessions).toEqual(s.sessions);
  expect(after.subtasks[1]).toMatchObject({ title: "Draw oak", nextAction: "Draw oak", returnContext: { note: "Oak context", returnStep: "Open oak reference" } });
  await page.reload(); await expect(page.getByRole("heading", { name: "Open oak reference", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "△ Mountains", exact: true }).click();
  await page.getByRole("button", { name: "View Other fictional goal", exact: true }).click();
  await expect(page.locator(".mountain-return")).toContainText("First thing when I return: Open oak reference");
  await expect(page.locator(".mountain-return")).toContainText("Context saved · no focus session started");
});
for (const failure of ["quota", "changed-raw"]) test(`failed ${failure} save preserves context and offers unsaved draft recovery`, async ({ page }) => {
  await seed(page, fixture(true)); await entry(page).click(); await fill(page);
  const original = await stored(page);
  await page.evaluate(({ key, failure }) => {
    if (failure === "changed-raw") { const s = JSON.parse(localStorage.getItem(key)!); s.revision += 5; localStorage.setItem(key, JSON.stringify(s)); }
    else { const set = Storage.prototype.setItem; Storage.prototype.setItem = function(k,v) { if (k === key) throw new DOMException("Test-only quota", "QuotaExceededError"); set.call(this,k,v); }; }
  }, { key: KEY, failure });
  const before = await stored(page); await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await expect(dialog(page).getByRole("alert")).toContainText("not saved");
  await expect(dialog(page).getByLabel("Next time, start here")).toHaveValue("Open fictional fern reference");
  expect(await stored(page)).toBe(before); if (failure === "quota") expect(before).toBe(original);
  const download = page.waitForEvent("download"); await dialog(page).getByRole("button", { name: "Download update draft", exact: true }).click();
  expect(JSON.parse(await readFile((await (await download).path())!, "utf8"))).toMatchObject({ note: "Outline ready; veins remain", returnStep: "Open fictional fern reference" });
  await page.keyboard.press("Escape"); await expect(page.getByRole("heading", { name: "Old next step", exact: true })).toBeVisible();
});
test("read-only tab cannot open editor; lease lost in Save handler cannot write", async ({ page, context }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  await seed(page, fixture(true)); const other = await context.newPage();
  await other.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  await other.goto("/"); await expect(other.locator(".ownership")).toBeVisible(); await expect(entry(other)).toBeDisabled(); await other.close();
  await entry(page).click(); await fill(page); const before = await stored(page);
  // No storage event: ownership must be checked synchronously, not just through disabled rendering.
  await page.evaluate(() => localStorage.setItem("work-trail:writer:lease", JSON.stringify({ token: "fictional-other", expires: Date.now() + 60000 })));
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await expect(dialog(page).getByRole("alert")).toContainText("not saved"); expect(await stored(page)).toBe(before);
});
test("320px editor and long context stay bounded with reachable controls", async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 640 }); await seed(page); await entry(page).click();
  await fill(page, "n".repeat(2000), "s".repeat(500));
  await expect(dialog(page).getByLabel("Where I stopped / what changed")).toHaveAttribute("maxlength", "2000");
  expect(await dialog(page).evaluate(el => el.scrollWidth > el.clientWidth)).toBe(false);
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).scrollIntoViewIfNeeded();
  await dialog(page).screenshot({ path: info.outputPath("update-editor-320.png") });
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
});
test("clearing both fields explicitly does not resurrect legacy session context", async ({ page }) => {
  await seed(page, fixture(true)); const before = await records(page);
  await entry(page).click(); await fill(page, "", ""); await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await page.reload(); await expect(entry(page)).toBeEnabled();
  await expect(page.getByRole("heading", { name: "Draw a fern", exact: true })).toBeVisible();
  await expect(page.locator(".context")).toHaveCount(0);
  expect((await records(page)).sessions).toEqual(before.sessions);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(page.getByLabel("Where I stopped")).toHaveValue("");
  await expect(page.getByLabel("First thing when I return")).toHaveValue("");
});
test("ownership loss and newer saved context invalidate the open draft even after ownership returns", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  await seed(page); await entry(page).click(); await fill(page);
  await page.evaluate(key => {
    localStorage.setItem("work-trail:writer:lease", JSON.stringify({ token: "fictional-other", expires: Date.now() + 60000 }));
    window.dispatchEvent(new StorageEvent("storage", { key: "work-trail:writer:lease" }));
    const s = JSON.parse(localStorage.getItem(key)!); s.revision += 10;
    s.subtasks[0].returnContext = { note: "Newer external context", returnStep: "Newer external next step" };
    localStorage.setItem(key, JSON.stringify(s));
    window.dispatchEvent(new StorageEvent("storage", { key }));
    localStorage.removeItem("work-trail:writer:lease");
  }, KEY);
  await expect(page.locator(".ownership")).toHaveCount(0);
  await expect(entry(page)).toBeEnabled();
  await expect(dialog(page).getByRole("button", { name: "Save update", exact: true })).toBeDisabled();
  await expect(dialog(page).getByRole("alert")).toContainText("not saved");
  await expect(dialog(page).getByLabel("Next time, start here")).toHaveValue("Open fictional fern reference");
  const raw = await stored(page); await page.keyboard.press("Escape"); expect(await stored(page)).toBe(raw);
  await entry(page).click(); await expect(dialog(page).getByLabel("Next time, start here")).toHaveValue("Newer external next step");
});
