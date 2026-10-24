import { test, expect, type Page } from "@playwright/test";
import { correctionFixture, correctionKey, correctionNow } from "./correction-fixtures";

const dialog = (page: Page) => page.getByRole("dialog", { name: "Update progress", exact: true });
const stored = (page: Page) => page.evaluate(key => localStorage.getItem(key), correctionKey);
const suggestion = { kind: "progress-update", note: "Example read; the first practice question remains.", returnStep: "Attempt the first practice question without the worked example." };
async function seed(page: Page) {
  await page.route("**/api/plan?availability=1", route => route.fulfill({ json: { available: true, message: "Fictional test configuration; provider requests mocked." } }));
  await page.clock.setFixedTime(correctionNow + 40000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(({ key, raw }) => { if (!localStorage.getItem(key)) localStorage.setItem(key, raw); }, { key: correctionKey, raw: JSON.stringify(correctionFixture("returning")) });
  await page.goto("/");
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  await dialog(page).getByLabel("Where I stopped / what changed").fill("I read the example. The first practice question is left.");
  await expect(dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true })).toBeEnabled();
}
async function installVoice(page: Page) {
  await page.addInitScript(() => {
    type Result = { results: ArrayLike<ArrayLike<{ transcript: string }>> };
    let latest: MockSpeech;
    class MockSpeech {
      onresult: ((e: Result) => void) | null = null; onerror: (() => void) | null = null; onend: (() => void) | null = null;
      continuous = false; interimResults = false;
      constructor() { latest = this; }
      start() {} stop() {} abort() {}
    }
    Object.defineProperty(window, "SpeechRecognition", { configurable: true, value: MockSpeech });
    Object.assign(window, { __trailSpeech: {
      deliver: (text: string) => latest.onresult?.({ results: [[{ transcript: text }]] }),
      fail: () => latest.onerror?.(),
    } });
  });
}
async function voice(page: Page, operation: "deliver" | "fail", value = "") {
  await page.evaluate(({ operation, value }) => {
    const w = window as unknown as { __trailSpeech: { deliver: (text: string) => void; fail: () => void } };
    if (operation === "deliver") w.__trailSpeech.deliver(value); else w.__trailSpeech.fail();
  }, { operation, value });
}

test("AI drafts require editable review and explicit save; reload preserves context without earning progress", async ({ page }) => {
  let sent: Record<string, unknown> | null = null;
  await page.route("**/api/plan", route => { sent = route.request().postDataJSON(); return route.fulfill({ json: suggestion }); });
  await seed(page); const before = JSON.parse((await stored(page))!);
  await dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true }).click();
  await expect(dialog(page).getByText(/Suggested update ready/)).toBeVisible();
  await expect(dialog(page).getByLabel("Next time, start here")).toHaveValue(suggestion.returnStep);
  expect(sent).toMatchObject({ kind: "progress-update", update: "I read the example. The first practice question is left." });
  expect(JSON.parse((await stored(page))!)).toEqual(before);
  await dialog(page).getByLabel("Next time, start here").fill("Open the first practice question.");
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await page.reload(); await expect(page.getByRole("heading", { name: "Open the first practice question.", exact: true })).toBeVisible();
  const after = JSON.parse((await stored(page))!);
  for (const field of ["sessions", "completions", "dayPlans", "summitConfirmations"]) expect(after[field]).toEqual(before[field]);
  expect(after.subtasks[0]).toMatchObject({ id: before.subtasks[0].id, checkpointSlot: before.subtasks[0].checkpointSlot, nextAction: before.subtasks[0].nextAction });
  await expect(page.getByRole("button", { name: "Start", exact: true })).toBeEnabled();
  await expect(page.getByRole("timer")).toHaveCount(0);
});

test("unavailable AI explains the disabled control and manual saving remains available", async ({ page }) => {
  await seed(page);
  await page.route("**/api/plan?availability=1", route => route.fulfill({ json: { available: false, message: "Fictional test: AI unavailable." } }));
  await dialog(page).getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  await expect(dialog(page).getByText("AI is unavailable here. You can edit and save manually.", { exact: true })).toBeVisible();
  await expect(dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true })).toBeDisabled();
  await dialog(page).getByLabel("Next time, start here").fill("Read one paragraph aloud.");
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Read one paragraph aloud.", exact: true })).toBeVisible();
});

test("late AI results after editing cannot overwrite text or records", async ({ page }) => {
  let release: (() => void) | null = null;
  await page.route("**/api/plan", async route => { await new Promise<void>(resolve => { release = resolve; }); await route.fulfill({ json: suggestion }).catch(() => {}); });
  await seed(page); const before = await stored(page);
  await dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true }).click();
  await expect.poll(() => !!release).toBe(true);
  await dialog(page).getByLabel("Where I stopped / what changed").fill("Corrected update stays here.");
  release!();
  await expect(dialog(page).getByLabel("Where I stopped / what changed")).toHaveValue("Corrected update stays here.");
  await expect(dialog(page).getByText(/Suggested update ready/)).toHaveCount(0);
  await dialog(page).getByRole("button", { name: "Cancel", exact: true }).click();
  expect(await stored(page)).toEqual(before);
});

for (const exit of ["Cancel request", "Cancel", "Escape"]) test(`pending AI results after ${exit} cannot change the reopened draft or records`, async ({ page }) => {
  let release: (() => void) | null = null;
  await page.route("**/api/plan", async route => { await new Promise<void>(resolve => { release = resolve; }); await route.fulfill({ json: suggestion }).catch(() => {}); });
  await seed(page); const before = await stored(page);
  const raw = await dialog(page).getByLabel("Where I stopped / what changed").inputValue();
  await dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true }).click();
  await expect.poll(() => !!release).toBe(true);
  const finished = page.waitForEvent("requestfailed", request => request.url().endsWith("/api/plan"));
  if (exit === "Escape") await page.keyboard.press("Escape");
  else await dialog(page).getByRole("button", { name: exit, exact: true }).click();
  await finished; release!();
  if (exit !== "Cancel request") {
    await page.getByRole("button", { name: "Update progress", exact: true }).click();
    await expect(dialog(page).getByLabel("Where I stopped / what changed")).not.toHaveValue(suggestion.note);
  } else {
    await expect(dialog(page).getByLabel("Where I stopped / what changed")).toHaveValue(raw);
    await expect(dialog(page).getByRole("button", { name: "Save update", exact: true })).toBeEnabled();
  }
  await expect(dialog(page).getByText(/Suggested update ready/)).toHaveCount(0);
  expect(await stored(page)).toEqual(before);
});

test("invalid responses and clarification retain editable input; original text can be recovered from a valid suggestion", async ({ page }) => {
  let calls = 0;
  await page.route("**/api/plan", route => route.fulfill({ json: ++calls === 1 ? { ...suggestion, completed: true } : calls === 2 ? { kind: "clarification", question: "Which practice question remains?" } : suggestion }));
  await seed(page); const input = await dialog(page).getByLabel("Where I stopped / what changed").inputValue();
  await dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true }).click();
  await expect(dialog(page).getByRole("alert")).toContainText("unusable update");
  await expect(dialog(page).getByLabel("Where I stopped / what changed")).toHaveValue(input);
  await dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true }).click();
  await expect(dialog(page).getByRole("alert")).toContainText("Which practice question remains?");
  await dialog(page).getByRole("button", { name: "Prepare next step with AI", exact: true }).click();
  await expect(dialog(page).getByText(/Suggested update ready/)).toBeVisible();
  await dialog(page).getByRole("button", { name: "Use my original update", exact: true }).click();
  await expect(dialog(page).getByLabel("Where I stopped / what changed")).toHaveValue(input);
});

test("dictation appends once, accepts a final result after Stop, and never sends AI or saves automatically", async ({ page }) => {
  await installVoice(page); let requests = 0;
  await page.route("**/api/plan", route => { requests++; return route.fulfill({ json: suggestion }); });
  await seed(page); const before = await stored(page);
  await dialog(page).getByLabel("Where I stopped / what changed").fill("Typed context.");
  await dialog(page).getByRole("button", { name: "Dictate update", exact: true }).click();
  await expect(dialog(page).getByRole("button", { name: "Stop dictation", exact: true })).toBeVisible();
  await dialog(page).getByRole("button", { name: "Stop dictation", exact: true }).click();
  await voice(page, "deliver", "One question remains."); await voice(page, "deliver", "One question remains.");
  await expect(dialog(page).getByLabel("Where I stopped / what changed")).toHaveValue("Typed context.\nOne question remains.");
  expect(requests).toBe(0); expect(await stored(page)).toEqual(before);
});

test("denied/unsupported dictation and late events after closing preserve manual updates", async ({ page }) => {
  await installVoice(page); await seed(page); const before = await stored(page);
  await dialog(page).getByRole("button", { name: "Dictate update", exact: true }).click(); await voice(page, "fail");
  await expect(dialog(page).getByText(/Microphone access was denied/)).toBeVisible();
  await dialog(page).getByRole("button", { name: "Dictate update", exact: true }).click();
  await page.keyboard.press("Escape"); await voice(page, "deliver", "A late result must be ignored.");
  expect(await stored(page)).toEqual(before);
  await page.evaluate(() => { Object.defineProperty(window, "SpeechRecognition", { value: undefined }); Object.defineProperty(window, "webkitSpeechRecognition", { value: undefined }); });
  await page.getByRole("button", { name: "Update progress", exact: true }).click();
  await dialog(page).getByRole("button", { name: "Dictate update", exact: true }).click();
  await expect(dialog(page).getByText(/Dictation is unavailable/)).toBeVisible();
  await dialog(page).getByLabel("Where I stopped / what changed").fill("Manual update still works.");
  await dialog(page).getByRole("button", { name: "Save update", exact: true }).click();
  await expect(dialog(page)).not.toBeVisible();
});
