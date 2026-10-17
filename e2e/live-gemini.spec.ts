import { test, expect, type Page, type TestInfo } from "@playwright/test";
import { parsePlanResponse, planRequestSchema } from "../lib/planning";
import type { Snapshot } from "../lib/domain";
import { writeFile } from "node:fs/promises";

// Explicit opt-in only. One desktop run, at most three paid generation requests,
// no retries; a provider failure stops the test rather than substituting a mock.
const records = (page: Page): Promise<Snapshot> => page.evaluate(() =>
  JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!),
);
async function requestDraft(page: Page, button: string, info: TestInfo, label: string) {
  const reply = page.waitForResponse((r) => new URL(r.url()).pathname === "/api/plan" && r.request().method() === "POST");
  await page.getByRole("button", { name: button, exact: true }).click();
  const response = await reply;
  const body = await response.json();
  const evidencePath = info.outputPath(`${label}-actual-provider-result.json`);
  await writeFile(evidencePath, JSON.stringify({ status: response.status(), body }, null, 2));
  await info.attach(`${label}-actual-provider-result`, {
    path: evidencePath,
    contentType: "application/json",
  });
  expect(response.ok(), `Live request failed: ${JSON.stringify(body)}`).toBe(true);
  return parsePlanResponse(body, planRequestSchema.parse(response.request().postDataJSON()));
}
test("live Gemini: clear breakdown, budgeted day, clarification and complete return journey", async ({ page, context }, info) => {
  test.skip(process.env.PW_LIVE_GEMINI !== "1" || info.project.name !== "desktop", "Explicit desktop live opt-in required");
  test.setTimeout(180_000);
  let calls = 0;
  await context.route("**/api/plan", async (route) => {
    calls++;
    if (calls > 3) {
      await route.abort();
      throw Error("Live smoke request cap exceeded");
    }
    await route.continue();
  });
  await page.goto("/");
  await expect(page).toHaveTitle("Trail. — Today");
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  const description = "Create a one-page printable oak-leaf observation guide for a fictional school nature club. Finish when the page has a drawing, three observation prompts and a checked printable layout. Suggest a few small actions I can begin immediately.";
  await page.getByLabel("Describe the work").fill(description);
  await page.getByText("Optional context", { exact: true }).click();
  await page.getByLabel("What has already been done", { exact: true }).fill("In this fictional scenario I already have one oak-leaf photograph.");
  const breakdown = await requestDraft(page, "Build with AI", info, "A-clear-breakdown");
  expect(breakdown.kind).toBe("breakdown");
  if (breakdown.kind !== "breakdown") throw Error("Clear goal unnecessarily asked for clarification");
  expect(breakdown.steps.length).toBeLessThanOrEqual(5);
  expect((await records(page)).mountains).toHaveLength(0);
  expect((await records(page)).sessions).toHaveLength(0);
  await expect(page.getByLabel("Describe the work")).toHaveValue(description);
  await expect(page.getByLabel("Action 1 instruction", { exact: true })).toHaveValue(breakdown.steps[0].nextAction);
  // Review/edit before acceptance; the actual returned draft is attached above
  // for a separate qualitative assessment, not judged by a mock or regex score.
  await page.getByLabel("Action 1 instruction", { exact: true }).fill("Draw the leaf outline from the supplied photograph, then mark three visible veins.");
  for (let i = 0; i < breakdown.steps.length; i++)
    await page.getByLabel(`Action ${i + 1} session minutes`, { exact: true }).fill("5");
  await page.getByLabel("I reviewed the goal, finish condition and every action", { exact: true }).check();
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page.getByLabel("Time available today (optional)", { exact: true }).fill("10");
  await page.getByText("What’s your day like?", { exact: false }).click();
  await page.getByLabel("What’s your day like?", { exact: true }).fill("Only ten minutes for this fictional guide. Prefer a small useful first result.");
  const day = await requestDraft(page, "Suggest a plan with AI", info, "C-budgeted-day");
  expect(day.kind).toBe("day");
  let snapshot = await records(page);
  expect(snapshot.dayPlans[0].commitments).toHaveLength(0);
  expect(snapshot.sessions).toHaveLength(0);
  // A valid empty suggestion is allowed. Deliberately select a manageable subset.
  const boxes = page.locator(".daily-editor fieldset input[type=checkbox]");
  for (let i = 0; i < await boxes.count(); i++) await boxes.nth(i).uncheck();
  await boxes.nth(0).check();
  if (await boxes.count() > 1) {
    await boxes.nth(1).check();
    await page.getByRole("button", { name: "Move planned action 2 up" }).click();
  }
  await page.getByRole("button", { name: "Commit today’s plan", exact: true }).click();
  await page.getByLabel("Session length", { exact: true }).fill("1");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.getByRole("timer")).toBeVisible();
  await page.getByText("Return note (optional)", { exact: true }).click();
  const note = "Fictional outline saved. Next mark the three veins from the photograph.";
  await page.getByLabel("Where I stopped").fill(note);
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  snapshot = await records(page);
  const saved = snapshot.sessions[0];
  await page.close();
  const returned = await context.newPage();
  await returned.goto("/");
  await expect(returned.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await expect(returned.getByText(note, { exact: true })).toBeVisible();
  expect((await records(returned)).sessions[0].remainingMs).toBe(saved.remainingMs);
  await returned.getByRole("button", { name: "Resume", exact: true }).click();
  await returned.getByRole("button", { name: "Complete action", exact: true }).click();
  await expect(returned.getByText("✦ 1 earned checkpoint", { exact: true })).toBeVisible();
  await returned.locator(".checkpoint-journal summary").click();
  await expect(returned.locator(".checkpoint-journal")).toContainText(note);
  await returned.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  expect((await records(returned)).completions.filter((c) => !c.undoneAt)).toHaveLength(0);
  await returned.getByRole("button", { name: "＋ New task", exact: true }).click();
  const vague = "I need to work on it. I haven't identified the subject or what a finished result would be.";
  await returned.getByLabel("Describe the work").fill(vague);
  const clarification = await requestDraft(returned, "Build with AI", info, "B-vague-clarification");
  expect(clarification.kind).toBe("clarification");
  await expect(returned.getByLabel("Describe the work")).toHaveValue(vague);
  expect((await records(returned)).mountains).toHaveLength(1);
  expect((await records(returned)).sessions[0].note).toBe(note);
  expect(calls).toBe(3);
});
