import { test, expect } from "@playwright/test";
import { emptySnapshot } from "../lib/domain";
import { transition } from "../lib/actions";

for (const failure of ["invalid", "quota"] as const) test(`breakdown ${failure} retains description, accepted work and editable fallback`, async ({ page }) => {
  const s = transition(emptySnapshot(), { type: "create", title: "Accepted fictional guide", finishCondition: "Checked", action: "Review reference", minutes: 5 });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.route("**/api/plan?availability=1", route => route.fulfill({ json: { available: true, message: "AI configured (mock), not health-checked." } }));
  await page.route("**/api/plan", route => failure === "quota" ? route.fulfill({ status: 429, json: { error: { code: "QUOTA", message: "Fictional quota reached; input retained. Use manual editing." } } }) : route.fulfill({ json: { kind: "breakdown", steps: [] } }));
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByLabel("Describe the work").fill("Fictional garden guide needing an outline");
  await page.getByRole("button", { name: "Build with AI", exact: true }).click();
  await expect(page.getByText(failure === "quota" ? /Fictional quota reached/ : /AI returned an unusable draft/)).toBeVisible();
  await expect(page.getByLabel("Describe the work")).toHaveValue("Fictional garden guide needing an outline");
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await expect(page.getByLabel("Action 1 title", { exact: true })).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!));
  expect(stored.mountains).toEqual(s.mountains);
  expect(stored.subtasks).toEqual(s.subtasks);
  expect(stored.sessions).toEqual([]);
  expect(stored.completions).toEqual([]);
});

test("unavailable AI is clear before generation and never sends input; manual draft survives reload", async ({ page }, info) => {
  let calls = 0;
  await page.route("**/api/plan", route => { calls++; return route.abort(); });
  await page.route("**/api/plan?availability=1", route => route.fulfill({ json: { available: false, message: "AI is unavailable. Your input is retained; use manual editing." } }));
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByLabel("Describe the work").fill("Fictional leaf guide with one checked illustration");
  await expect(page.getByText(/AI is unavailable/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Build with AI", exact: true })).toBeDisabled();
  await page.screenshot({ path: info.outputPath("unavailable.png"), fullPage: true });
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await page.getByLabel("Mountain name", { exact: true }).fill("Fictional guide");
  await page.reload();
  await page.getByRole("button", { name: "Continue creation draft", exact: true }).click();
  await expect(page.getByLabel("Describe the work")).toHaveValue("Fictional leaf guide with one checked illustration");
  expect(calls).toBe(0);
});

test("invalid and cancelled daily replies preserve accepted records and draft; status failure stays manual", async ({ page }) => {
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional guide", finishCondition: "Reviewed drawing", action: "Draw veins", minutes: 5 });
  s = transition(s, { type: "start", minutes: 5 });
  s = transition(s, { type: "save" });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.route("**/api/plan?availability=1", route => route.fulfill({ json: { available: true, message: "AI configured (mock), not health-checked." } }));
  let release: () => void = () => {};
  let calls = 0;
  await page.route("**/api/plan", async route => {
    if (++calls === 1) return route.fulfill({ json: { kind: "day", orderedSubtaskIds: ["invalid-id"], reason: "Invalid" } });
    await new Promise<void>(resolve => { release = resolve; });
    await route.fulfill({ json: { kind: "day", orderedSubtaskIds: [], reason: "Late response" } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page.getByRole("checkbox", { name: /Draw veins/ }).check();
  await page.getByRole("button", { name: "Suggest a plan with AI", exact: true }).click();
  await expect(page.getByRole("button", { name: "Suggest a plan with AI", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Suggest a plan with AI", exact: true }).click();
  await expect.poll(() => calls).toBe(2);
  await page.getByRole("button", { name: "Cancel suggestion", exact: true }).click();
  release();
  await page.route("**/api/plan?availability=1", route => route.fulfill({ json: { bad: "status" } }));
  await page.getByRole("button", { name: "Recheck AI availability", exact: true }).click();
  await expect(page.getByText(/Could not check AI availability/)).toBeVisible();
  await expect(page.getByRole("button", { name: "Suggest a plan with AI", exact: true })).toBeDisabled();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!));
  expect(stored.mountains).toEqual(s.mountains);
  expect(stored.sessions).toEqual(s.sessions);
  expect(stored.completions).toEqual([]);
  expect(stored.dayPlans[0].draftSubtaskIds).toEqual([s.subtasks[0].id]);
  expect(stored.dayPlans[0].committedAt).toBeNull();
  await expect(page.getByRole("checkbox", { name: /Draw veins/ })).toBeChecked();
});
