import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { emptySnapshot, snapshotSchema, type Snapshot } from "../lib/domain";
import { transition } from "../lib/actions";
import { newDraft } from "../lib/planning";
import { MAX_BACKUP_BYTES } from "../lib/backup";
const KEY = "work-trail:snapshot:v1", now = Date.parse("2026-10-19T12:00:00Z");
const stored = (page: Page) => page.evaluate(k => localStorage.getItem(k), KEY);
const records = async (page: Page): Promise<Snapshot> => JSON.parse((await stored(page))!);
const restoreDialog = (page: Page) => page.getByRole("dialog", { name: "Restore a private backup" });
const replace = (page: Page) => restoreDialog(page).getByRole("button", { name: "Replace and restore", exact: true });
function fixture() {
  let s = emptySnapshot(now - 2 * 86400000); s.calendarTimeZone = "UTC";
  s = transition(s, { type: "create", title: "Fictional summit", finishCondition: "Reviewed", action: "Check seed list", minutes: 2 }, now - 86400000);
  s = transition(s, { type: "complete" }, now - 86400000);
  s = transition(s, { type: "confirm-summit", mountainId: s.mountains[0].id }, now - 86400000);
  s = transition(s, { type: "create", title: "Fictional saved garden", finishCondition: "Checked", action: "Draw fern", minutes: 2 }, now - 100000);
  const t = s.subtasks[1];
  for (const title of ["Deferred fern", "Removed fern"]) s.subtasks.push({ ...t, id: crypto.randomUUID(), title, checkpointSlot: s.mountains[1].nextCheckpointSlot++, orderKey: s.subtasks.length });
  s = transition(s, { type: "day-draft", date: "2026-10-19", ids: s.subtasks.slice(1).map(t => t.id), availability: "Fictional garden reference", minutes: 10 }, now - 90000);
  s = transition(s, { type: "day-commit", date: "2026-10-19" }, now - 90000);
  for (let i = 1; i <= 2; i++) s = transition(s, { type: "disposition", date: "2026-10-19", id: s.dayPlans[0].commitments[i].id, disposition: i === 1 ? "deferred" : "removed" }, now - 80000);
  s = transition(s, { type: "start", minutes: 2 }, now - 70000);
  s = transition(s, { type: "note", note: "Fictional stopping note <img src=x onerror=alert(1)>" }, now - 58000);
  s = transition(s, { type: "return-step", value: "Open the fictional fern reference" }, now - 58000);
  s = transition(s, { type: "complete" }, now - 57000);
  s = transition(s, { type: "undo", id: s.completions[1].id }, now - 56000);
  s = transition(s, { type: "save" }, now - 55000);
  s.creationDraft = { ...newDraft(), description: "Fictional future project" };
  return snapshotSchema.parse(s);
}
async function seed(page: Page, raw = JSON.stringify(emptySnapshot(now))) {
  await page.clock.setFixedTime(now);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(({ key, raw }) => { if (localStorage.getItem(key) === null) localStorage.setItem(key, raw); }, { key: KEY, raw });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
  await expect(page.locator(".ownership")).toHaveCount(0);
}
async function open(page: Page) {
  await page.getByRole("button", { name: "Restore private backup", exact: true }).first().click();
  await expect(restoreDialog(page)).toBeVisible();
}
async function upload(page: Page, value: Snapshot | string = fixture()) {
  await restoreDialog(page).locator('input[type="file"]').setInputFiles({ name: "fictional-private.json", mimeType: "application/json", buffer: Buffer.from(typeof value === "string" ? value : JSON.stringify(value, null, 2)) });
}

test("existing export round trip keeps saved context and history across Today, Mountains, Progress and reload", async ({ page }, info) => {
  const s = fixture(); await seed(page, JSON.stringify(s));
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download private recovery", exact: true }).click();
  const text = await readFile((await (await downloaded).path())!, "utf8");
  expect(JSON.parse(text)).toEqual(s);
  // An isolated fictional browser, not the user's records.
  await page.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: JSON.stringify(emptySnapshot(now)) });
  await page.reload(); await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled(); await expect(page.locator(".ownership")).toHaveCount(0);
  const before = await stored(page);
  await open(page); await expect(restoreDialog(page).getByRole("button", { name: "Cancel", exact: true })).toBeFocused();
  await upload(page, text);
  await expect(restoreDialog(page).getByRole("region", { name: "Backup preview" })).toContainText("UTC");
  await expect(restoreDialog(page).locator("dd")).toHaveText(["2", "4", "1", "1", "Present", "UTC"]);
  expect(await stored(page)).toBe(before);
  await page.screenshot({ path: info.outputPath("restore-preview.png"), fullPage: true });
  expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await replace(page).click();
  await expect(restoreDialog(page)).not.toBeVisible();
  await expect(page.getByText(/Private backup restored to this browser/)).toBeVisible();
  const restored = await records(page);
  expect(restored).toEqual({ ...s, revision: s.revision + 1 });
  await expect(page.getByText("Open the fictional fern reference", { exact: true }).first()).toBeVisible();
  await expect(page.getByText(s.sessions[0].note, { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("timer")).toHaveCount(0);
  await expect(page.locator('img[src="x"]')).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await page.getByRole("link", { name: "△ Mountains", exact: true }).click();
  await page.getByRole("button", { name: "View Fictional saved garden", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Fictional saved garden", exact: true })).toBeVisible();
  await expect(page.getByText(`First thing when I return: ${s.sessions[0].returnStep}`, { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "▦ Progress", exact: true }).click();
  await expect(page.locator(".progress-overview dd")).toHaveText(["1", "1", "13s"]);
  expect(await records(page)).toEqual(restored);
  await page.getByRole("link", { name: "◉ Today", exact: true }).click();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.getByLabel("First thing when I return")).toHaveValue(s.sessions[0].returnStep);
  await expect(page.getByLabel("Where I stopped")).toHaveValue(s.sessions[0].note);
});

test("selection, invalid input, cancellation and keyboard close never replace records", async ({ page }) => {
  await seed(page, JSON.stringify(fixture())); const before = await stored(page);
  await open(page);
  for (const text of ["not-json", '{"schemaVersion":2}', JSON.stringify({ ...fixture(), selection: { selectedMountainId: crypto.randomUUID(), selectedSubtaskId: null, sessionId: null } })]) {
    await upload(page, text); await expect(restoreDialog(page).getByRole("alert")).toBeVisible(); await expect(replace(page)).toBeDisabled();
    expect(await stored(page)).toBe(before);
  }
  await upload(page); await expect(replace(page)).toBeEnabled();
  await restoreDialog(page).getByRole("button", { name: "Cancel", exact: true }).focus();
  await page.keyboard.press("Tab"); await expect(replace(page)).toBeFocused();
  await page.keyboard.press("Tab"); await expect(restoreDialog(page).getByRole("button", { name: "Download current private data", exact: true })).toBeFocused();
  await page.keyboard.press("Shift+Tab"); await expect(replace(page)).toBeFocused();
  await page.keyboard.press("Escape"); await expect(restoreDialog(page)).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Restore private backup", exact: true })).toBeFocused();
  expect(await stored(page)).toBe(before);
  await open(page); await expect(restoreDialog(page).getByRole("region", { name: "Backup preview" })).toHaveCount(0);
  await restoreDialog(page).getByRole("button", { name: "Cancel", exact: true }).click();
  expect(await stored(page)).toBe(before);
});

test("exact 2 MiB file is previewed; oversized file is rejected before reading", async ({ page }) => {
  await seed(page); await open(page); const before = await stored(page);
  const text = JSON.stringify(emptySnapshot(now));
  await upload(page, text + " ".repeat(MAX_BACKUP_BYTES - text.length));
  await expect(replace(page)).toBeEnabled();
  await page.evaluate(() => { File.prototype.text = async () => { throw Error("Reader must not run"); }; });
  await upload(page, text + " ".repeat(MAX_BACKUP_BYTES + 1 - text.length));
  await expect(restoreDialog(page).getByRole("alert")).toContainText("2 MiB");
  await expect(replace(page)).toBeDisabled(); expect(await stored(page)).toBe(before);
});

test("imported running work is interrupted at its heartbeat with explicit Resume and no absence credit", async ({ page }) => {
  const s = transition(fixture(), { type: "resume" }, now - 10000);
  await seed(page); await open(page); await upload(page, s); await replace(page).click();
  const after = await records(page);
  expect(after.sessions[0]).toEqual({ ...s.sessions[0], status: "interrupted", runningDeadlineAt: null });
  await expect(page.getByRole("timer")).toHaveCount(0);
  await page.reload(); await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  expect((await records(page)).sessions).toEqual(after.sessions);
  expect(after.completions).toEqual(s.completions); expect(after.summitConfirmations).toEqual(s.summitConfirmations);
});

test("local running and paused focus require Save my place before restore", async ({ page }) => {
  await seed(page, JSON.stringify(fixture()));
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  for (const pause of [false, true]) {
    if (pause) await page.getByRole("button", { name: "Pause", exact: true }).click();
    await open(page); const before = await stored(page);
    await upload(page); await expect(replace(page)).toBeDisabled();
    await expect(restoreDialog(page).getByText(/Save my place first/)).toBeVisible();
    expect(await stored(page)).toBe(before);
    await restoreDialog(page).getByRole("button", { name: "Cancel", exact: true }).click();
  }
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  await open(page); await upload(page); await expect(replace(page)).toBeEnabled();
});

for (const failure of ["quota", "write", "read"] as const) test(`confirmation ${failure} failure preserves memory, storage and recovery downloads`, async ({ page }) => {
  const s = fixture(); await seed(page, JSON.stringify(s)); await open(page); await upload(page, emptySnapshot(now));
  const before = await stored(page);
  await page.evaluate(({ key, failure }) => {
    const get = Storage.prototype.getItem, set = Storage.prototype.setItem;
    Storage.prototype.getItem = function(k) { if (failure === "read" && k === key) throw Error("Blocked"); return get.call(this, k); };
    Storage.prototype.setItem = function(k,v) { if (failure !== "read" && k === key) throw new DOMException("Blocked", failure === "quota" ? "QuotaExceededError" : "SecurityError"); set.call(this,k,v); };
    Object.assign(window, { restoreStorage: () => { Storage.prototype.getItem = get; Storage.prototype.setItem = set; } });
  }, { key: KEY, failure });
  await replace(page).click(); await expect(restoreDialog(page).getByRole("alert")).toContainText(/saved|storage/i);
  const download = page.waitForEvent("download");
  await restoreDialog(page).getByRole("button", { name: "Download current private data", exact: true }).click();
  expect(JSON.parse(await readFile((await (await download).path())!, "utf8"))).toEqual(s);
  await page.evaluate(() => (window as unknown as { restoreStorage: () => void }).restoreStorage());
  expect(await stored(page)).toBe(before);
  await restoreDialog(page).getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByText(s.sessions[0].returnStep, { exact: true }).first()).toBeVisible();
  await expect(page.getByText(/Private backup restored/)).toHaveCount(0);
});

test("explicit recovery replaces corrupt raw only after preview; original download survives", async ({ page }) => {
  const corrupt = '{"private":"fictional damaged original"', imported = fixture();
  await seed(page, corrupt); await open(page); await upload(page, imported);
  expect(await stored(page)).toBe(corrupt);
  const download = page.waitForEvent("download");
  await restoreDialog(page).getByRole("button", { name: "Download original stored data", exact: true }).click();
  expect(await readFile((await (await download).path())!, "utf8")).toBe(corrupt);
  await replace(page).click(); await expect(page.locator(".storage-warning")).toHaveCount(0);
  expect((await records(page)).mountains).toEqual(imported.mountains);
});

test("another tab's raw change blocks confirmation without overwriting either history", async ({ page, context }) => {
  const s = fixture(); await seed(page, JSON.stringify(s)); await open(page); await upload(page, emptySnapshot(now));
  const other = await context.newPage(); await other.goto("/");
  const changed = JSON.stringify({ ...s, revision: s.revision + 20 });
  await other.evaluate(({ key, raw }) => localStorage.setItem(key, raw), { key: KEY, raw: changed });
  await replace(page).click(); await expect(restoreDialog(page).getByRole("alert")).toContainText("Stored data changed");
  expect(await stored(page)).toBe(changed);
  const download = page.waitForEvent("download"); await restoreDialog(page).getByRole("button", { name: "Download current private data", exact: true }).click();
  expect(JSON.parse(await readFile((await (await download).path())!, "utf8"))).toEqual(s);
});

test("read-only tab can validate but cannot restore", async ({ page, context }) => {
  await seed(page, JSON.stringify(fixture())); const before = await stored(page);
  const other = await context.newPage(); await other.goto("/");
  await expect(other.locator(".ownership")).toBeVisible();
  await open(other); await upload(other); await expect(replace(other)).toBeDisabled();
  await expect(restoreDialog(other).getByText(/Editing ownership is required/)).toBeVisible();
  expect(await stored(page)).toBe(before);
});

test("superseded file reads and closed dialogs cannot publish stale previews", async ({ page }) => {
  await seed(page); await open(page);
  await page.evaluate(() => {
    const read = File.prototype.text; let first = true;
    File.prototype.text = function() { if (!first) return read.call(this); first = false; return new Promise(resolve => Object.assign(window, { finishOldRead: () => resolve('{"schemaVersion":2}') })); };
  });
  await upload(page); await expect(restoreDialog(page).getByRole("status")).toContainText("Reading");
  await upload(page, emptySnapshot(now)); await expect(replace(page)).toBeEnabled();
  await page.evaluate(() => (window as unknown as { finishOldRead: () => void }).finishOldRead());
  await expect(restoreDialog(page).getByRole("alert")).toHaveCount(0);
  await expect(restoreDialog(page).locator("dd").first()).toHaveText("0");
  await page.keyboard.press("Escape"); await open(page);
  await expect(replace(page)).toBeDisabled();
});

test("pending daily AI reply is cancelled and cannot overwrite restored records", async ({ page }) => {
  let release!: () => void;
  const held = new Promise<void>(resolve => { release = resolve; });
  await page.route("**/api/plan**", async route => {
    if (route.request().method() === "GET") return route.fulfill({ json: { available: true, message: "Test-only mocked configuration" } });
    await held;
    await route.fulfill({ json: { kind: "day", orderedSubtaskIds: [], reason: "Stale fictional response" } }).catch(() => {});
  });
  await seed(page, JSON.stringify(fixture())); await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page.getByRole("button", { name: "Suggest a plan with AI", exact: true }).click();
  await expect(page.getByRole("button", { name: "Suggesting…", exact: true })).toBeVisible();
  await open(page); await upload(page, emptySnapshot(now)); await replace(page).click();
  const restored = await stored(page); release();
  await expect(page.getByRole("heading", { name: "Every path starts here.", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await expect(page.getByText("No unfinished actions. Create work or undo a mistaken completion.")).toBeVisible();
  expect(await stored(page)).toBe(restored);
});

test("unreadable storage at load cannot be replaced even if it becomes readable later", async ({ page }) => {
  const original = JSON.stringify(fixture());
  await page.addInitScript(({ key, original }) => {
    localStorage.setItem(key, original);
    const read = Storage.prototype.getItem;
    Storage.prototype.getItem = function(k) { if (k === key) throw Error("Blocked"); return read.call(this, k); };
    Object.assign(window, { enableReads: () => { Storage.prototype.getItem = read; } });
  }, { key: KEY, original });
  await page.goto("/");
  await expect(page.locator(".storage-warning")).toContainText("cannot be read");
  await expect(page.locator(".ownership")).toHaveCount(0);
  await open(page); await upload(page); await expect(replace(page)).toBeEnabled();
  await page.evaluate(() => (window as unknown as { enableReads: () => void }).enableReads());
  await replace(page).click();
  await expect(restoreDialog(page).getByRole("alert")).toContainText("storage cannot be read");
  expect(await stored(page)).toBe(original);
  await expect(restoreDialog(page).getByRole("button", { name: "Download current private data", exact: true })).toBeEnabled();
});

test("file read failure and a read finishing after Cancel preserve records", async ({ page }) => {
  await seed(page); const before = await stored(page); await open(page);
  await page.evaluate(() => { File.prototype.text = async () => { throw Error("unreadable fixture"); }; });
  await upload(page); await expect(restoreDialog(page).getByRole("alert")).toContainText("file could not be read");
  await page.evaluate(() => { File.prototype.text = () => new Promise(resolve => Object.assign(window, { finishClosedRead: () => resolve('{"schemaVersion":2}') })); });
  await upload(page); await expect(restoreDialog(page).getByRole("status")).toContainText("Reading");
  await page.keyboard.press("Escape"); await open(page);
  await page.evaluate(() => (window as unknown as { finishClosedRead: () => void }).finishClosedRead());
  await expect(restoreDialog(page).getByRole("alert")).toHaveCount(0);
  await expect(restoreDialog(page).getByRole("region", { name: "Backup preview" })).toHaveCount(0);
  expect(await stored(page)).toBe(before);
});

test("fallback ownership lost during file read invalidates it; old preview never replaces newer trail", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  await seed(page, JSON.stringify(fixture())); const before = await stored(page); await open(page);
  await page.evaluate(() => {
    const read = File.prototype.text;
    File.prototype.text = function() { const file = this; return new Promise(resolve => Object.assign(window, { finishStaleRead: async () => resolve(await read.call(file)) })); };
  });
  await upload(page);
  await page.evaluate(() => {
    localStorage.setItem("work-trail:writer:lease", JSON.stringify({ token: "fictional-other-tab", expires: Date.now() + 60000 }));
    window.dispatchEvent(new StorageEvent("storage", { key: "work-trail:writer:lease" }));
  });
  await expect(restoreDialog(page).getByText(/Editing ownership is required/)).toBeVisible();
  await page.evaluate(() => (window as unknown as { finishStaleRead: () => Promise<void> }).finishStaleRead());
  await expect(restoreDialog(page).getByText(/Select the backup again for a fresh preview/)).toBeVisible();
  await expect(replace(page)).toBeDisabled();
  expect(await stored(page)).toBe(before);
});

test("320px dialog stays within viewport and a failed write can be retried with a fresh preview", async ({ page }, info) => {
  await seed(page); await page.setViewportSize({ width: 320, height: 844 }); await open(page); await upload(page);
  await expect(replace(page)).toBeEnabled();
  await restoreDialog(page).screenshot({ path: info.outputPath("restore-preview-320.png") });
  const box = await restoreDialog(page).boundingBox(); expect(box!.width).toBeLessThanOrEqual(320);
  expect(await restoreDialog(page).evaluate(el => el.scrollWidth > el.clientWidth)).toBe(false);
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k,v) { if (k === "work-trail:snapshot:v1") throw Error("full"); set.call(this,k,v); };
    Object.assign(window, { retryWrites: () => { Storage.prototype.setItem = set; } });
  });
  await replace(page).click(); await expect(restoreDialog(page).getByRole("alert")).toContainText("Not saved");
  await expect(replace(page)).toBeDisabled();
  await page.evaluate(() => (window as unknown as { retryWrites: () => void }).retryWrites());
  const imported = fixture(); await upload(page, imported); await replace(page).click();
  expect((await records(page)).sessions).toEqual(imported.sessions);
});

test("confirmation rechecks fallback ownership even before its change notification renders", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "locks", { value: undefined, configurable: true }));
  await seed(page, JSON.stringify(fixture())); const before = await stored(page);
  await open(page); await upload(page, emptySnapshot(now)); await expect(replace(page)).toBeEnabled();
  await page.evaluate(() => {
    localStorage.setItem("work-trail:writer:lease", JSON.stringify({ token: "fictional-new-owner", expires: Date.now() + 60000 }));
    // Same event turn, before the lease watcher/React can disable the button.
    const confirm = [...document.querySelectorAll<HTMLButtonElement>(".backup-dialog button")].find(b => b.textContent === "Replace and restore")!;
    confirm.click();
  });
  await expect(restoreDialog(page).getByRole("alert").filter({ hasText: /Editing ownership is required/ }).first()).toBeVisible();
  expect(await stored(page)).toBe(before);
});

test("failed replacement retains newer unsaved in-memory draft as well as older stored data", async ({ page }) => {
  await seed(page);
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  const before = await stored(page);
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k,v) { if (k === "work-trail:snapshot:v1") throw Error("full"); set.call(this,k,v); };
  });
  await page.getByLabel("Describe the work").fill("Fictional unsaved description to retain");
  await page.getByRole("button", { name: "Close · keep draft", exact: true }).click();
  await expect(page.locator(".storage-warning")).toBeVisible();
  await open(page); await upload(page); await replace(page).click();
  await expect(restoreDialog(page).getByRole("alert")).toContainText("Not saved");
  const download = page.waitForEvent("download");
  await restoreDialog(page).getByRole("button", { name: "Download current private data", exact: true }).click();
  const memory = JSON.parse(await readFile((await (await download).path())!, "utf8"));
  expect(memory.creationDraft.description).toBe("Fictional unsaved description to retain");
  expect(await stored(page)).toBe(before);
  await restoreDialog(page).getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Continue creation draft", exact: true }).click();
  await expect(page.getByLabel("Describe the work")).toHaveValue(memory.creationDraft.description);
});

test("restore from a recovery warning in sample previews returns to real records, never importing sample state", async ({ page }) => {
  const corrupt = "fictional damaged original";
  await seed(page, corrupt);
  await page.getByRole("button", { name: "Explore sample previews", exact: true }).click();
  await open(page);
  await expect(replace(page)).toBeDisabled();
  await expect(restoreDialog(page).locator("dd")).toHaveCount(0);
  expect(await stored(page)).toBe(corrupt);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
  expect(await stored(page)).toBe(corrupt);
});
