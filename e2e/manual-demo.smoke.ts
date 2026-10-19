import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { snapshotSchema, type Snapshot } from "../lib/domain";
const key = "work-trail:snapshot:v1";
const records = (page: import("@playwright/test").Page) => page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key) as Promise<Snapshot>;

test("real anonymous production AI stays unavailable and refuses generation", async ({ request, baseURL }) => {
  const availability = await request.get("/api/plan?availability=1");
  expect(availability.ok()).toBe(true);
  expect(await availability.json()).toMatchObject({ available: false, message: expect.stringContaining("Public AI is disabled") });
  expect(availability.headers()["cache-control"]).toContain("no-store");
  const response = await request.post("/api/plan", { headers: { origin: new URL(baseURL!).origin }, data: { kind: "breakdown", description: "Fictional public demo: draw a fern." } });
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(new URL(baseURL!).hostname);
  expect(response.status()).toBe(local ? 503 : 403);
  expect(await response.json()).toMatchObject({ error: { code: local ? "PUBLIC_AI_DISABLED" : "ORIGIN" } });
  expect(await response.text()).not.toMatch(/AIza[\w-]{20,}|GEMINI_API_KEY|stack|x-goog-api-key/);
});

test("unmocked public manual journey, private backup and restore with real browser storage", async ({ page, context }, info) => {
  const errors: string[] = [], providerCalls: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("request", req => { if (/generativelanguage\.googleapis\.com/.test(req.url())) providerCalls.push(req.url()); });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const path of ["/", "/mountains", "/progress"]) {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(k => localStorage.getItem(k), key)).toBeNull();
  }
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByLabel("Describe the work").fill("Make a fictional fern guide for the public manual rehearsal.");
  await expect(page.getByRole("button", { name: "Build with AI", exact: true })).toBeDisabled();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await page.getByLabel("Mountain name").fill("Fictional public fern guide");
  await page.getByLabel("Finish condition", { exact: true }).fill("Three fictional fern checks reviewed");
  for (let i = 1; i <= 3; i++) {
    if (i > 1) await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
    await page.getByLabel(`Action ${i} title`, { exact: true }).fill(`Fictional fern check ${i}`);
    await page.getByLabel(`Action ${i} instruction`, { exact: true }).fill(`Mark fictional fern reference ${i}`);
    await page.getByLabel(`Action ${i} session minutes`, { exact: true }).fill("2");
  }
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Fictional fern check 1", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  const candidates = page.locator(".candidate-card input[type=checkbox]");
  await expect(candidates).toHaveCount(3);
  for (let i = 0; i < 3; i++) await candidates.nth(i).check();
  await page.getByRole("button", { name: "Commit today’s plan", exact: true }).click();
  expect((await records(page)).dayPlans[0].commitments).toHaveLength(3);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  await page.getByRole("button", { name: "Start this action", exact: true }).click();
  await page.getByLabel("Where I stopped").fill("Fictional outline ready; this is not personal data.");
  await page.getByLabel("First thing when I return").fill("Open fictional fern reference 2");
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  const saved = await records(page);
  await page.screenshot({ path: info.outputPath("manual-saved.png"), fullPage: true });
  // Close the page, then return to the same origin using the isolated context.
  const origin = new URL(page.url()).origin;
  await page.close();
  const returned = await context.newPage();
  returned.on("pageerror", e => errors.push(e.message));
  returned.on("request", req => { if (/generativelanguage\.googleapis\.com/.test(req.url())) providerCalls.push(req.url()); });
  await returned.emulateMedia({ reducedMotion: "reduce" });
  await returned.goto(origin);
  await expect(returned.getByText("Open fictional fern reference 2", { exact: true }).first()).toBeVisible();
  await expect(returned.getByRole("timer")).toHaveCount(0);
  expect((await records(returned)).sessions).toEqual(saved.sessions);
  await returned.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(returned.getByLabel("Where I stopped")).toHaveValue(saved.sessions[1].note);
  await returned.getByRole("button", { name: "Complete action", exact: true }).click();
  await returned.getByRole("button", { name: "Undo completion", exact: true }).click();
  let s = await records(returned);
  expect(s.completions.filter(c => !c.undoneAt)).toHaveLength(1);
  expect(s.completions[0].undoneAt).toBeNull();
  await returned.getByRole("button", { name: "Resume", exact: true }).click();
  await returned.getByRole("button", { name: "Complete action", exact: true }).click();
  await returned.getByRole("button", { name: "Start this action", exact: true }).click();
  await returned.getByRole("button", { name: "Complete action", exact: true }).click();
  await returned.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await returned.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  s = await records(returned);
  expect(s.completions.filter(c => !c.undoneAt)).toHaveLength(3);
  expect(s.summitConfirmations.filter(c => !c.revokedAt)).toHaveLength(1);
  const download = returned.waitForEvent("download");
  await returned.getByRole("button", { name: "Download private recovery", exact: true }).click();
  const backup = await readFile((await (await download).path())!, "utf8");
  expect(snapshotSchema.parse(JSON.parse(backup))).toEqual(s);
  await returned.getByRole("button", { name: "Restore private backup", exact: true }).click();
  const dialog = returned.getByRole("dialog", { name: "Restore a private backup" });
  await dialog.locator('input[type=file]').setInputFiles({ name: "fictional-manual-demo.json", mimeType: "application/json", buffer: Buffer.from(backup) });
  await expect(dialog.getByRole("region", { name: "Backup preview" })).toBeVisible();
  await dialog.getByRole("button", { name: "Replace and restore", exact: true }).click();
  const restored = await records(returned);
  expect(restored).toMatchObject({ mountains: s.mountains, completions: s.completions, summitConfirmations: s.summitConfirmations, sessions: s.sessions });
  await returned.reload();
  await returned.getByRole("link", { name: "△ Mountains", exact: true }).click();
  await expect(returned.getByRole("heading", { name: "Fictional public fern guide", exact: true })).toBeVisible();
  await returned.getByRole("link", { name: "▦ Progress", exact: true }).click();
  await expect(returned.locator(".progress-overview dd").first()).toHaveText("3");
  await returned.screenshot({ path: info.outputPath("manual-progress.png"), fullPage: true });
  expect(await returned.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(await records(returned)).toEqual(restored);
  expect(providerCalls).toEqual([]); expect(errors).toEqual([]);
});

test("served client scripts and errors contain no provider credential markers", async ({ page, request }) => {
  const scripts = new Set<string>();
  page.on("request", req => { if (req.resourceType() === "script") scripts.add(req.url()); });
  for (const path of ["/", "/mountains", "/progress"]) {
    await page.goto(path); await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
  expect(scripts.size).toBeGreaterThan(0);
  for (const script of scripts) {
    const response = await request.get(script);
    expect(response.ok()).toBe(true);
    expect(await response.text()).not.toMatch(/GEMINI_API_KEY|GEMINI_MODEL|x-goog-api-key|generativelanguage\.googleapis\.com|AIza[\w-]{30,}/);
  }
});

test("storage write failure keeps fictional draft and recovery available without claiming save", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  const before = await page.evaluate(k => localStorage.getItem(k), key);
  await page.evaluate(() => {
    const set = Storage.prototype.setItem;
    Storage.prototype.setItem = function(k,v) { if (k === "work-trail:snapshot:v1") throw new DOMException("Test-only quota", "QuotaExceededError"); set.call(this,k,v); };
  });
  await page.getByLabel("Describe the work").fill("Fictional quota recovery rehearsal");
  await page.getByRole("button", { name: "Close · keep draft", exact: true }).click();
  await expect(page.locator(".storage-warning")).toBeVisible();
  expect(await page.evaluate(k => localStorage.getItem(k), key)).toBe(before);
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download private recovery", exact: true }).first().click();
  const memory = JSON.parse(await readFile((await (await download).path())!, "utf8"));
  expect(memory.creationDraft.description).toBe("Fictional quota recovery rehearsal");
});
