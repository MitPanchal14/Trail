import { test, expect } from "@playwright/test";
import { emptySnapshot } from "../lib/domain";
import { transition } from "../lib/actions";

test("three manual steps require persisted finish-condition confirmation, with reopen and linked corrections", async ({ page }, info) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await page.getByLabel("Mountain name", { exact: true }).fill("Fictional woodland guide");
  await page.getByLabel("Finish condition", { exact: true }).fill("Three illustrations checked against the reference");
  for (let i = 1; i <= 3; i++) {
    if (i > 1) await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
    await page.getByLabel(`Action ${i} title`, { exact: true }).fill(`Illustrate specimen ${i}`);
    await page.getByLabel(`Action ${i} instruction`, { exact: true }).fill(`Draw the outline of specimen ${i}`);
    await page.getByLabel(`Action ${i} session minutes`, { exact: true }).fill(String(i * 4));
  }
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  const canvas = page.locator("canvas");
  const read = () => page.evaluate(() => JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!));
  expect((await read()).completions).toHaveLength(0);
  await page.locator(".action-details > summary").click();
  await expect(page.getByText("0 / 3 accepted actions completed", { exact: true })).toBeVisible();
  await page.locator(".action-details > summary").click();
  const slots = (await read()).subtasks.map((t: { checkpointSlot: number }) => t.checkpointSlot);
  await canvas.screenshot({ path: info.outputPath("zero.png") });
  for (let i = 1; i <= 3; i++) {
    await page.getByRole("button", { name: i === 1 ? "Start" : "Start this action", exact: true }).click();
    await page.getByRole("button", { name: "Complete action", exact: true }).click();
    if (i < 3) await expect(page.getByText(`${i} / 3 accepted actions completed`, { exact: true })).toBeVisible();
    else await expect(page.getByRole("heading", { name: "All planned steps complete", exact: true })).toBeVisible();
    expect((await read()).summitConfirmations).toHaveLength(0);
    await canvas.screenshot({ path: info.outputPath(`checkpoint-${i}.png`) });
  }
  const pendingPosition = await canvas.getAttribute("data-position");
  await expect(canvas).toHaveAttribute("data-summit", "pending");
  await page.screenshot({ path: info.outputPath("summit-pending.png"), fullPage: true });
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Not yet", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-position", pendingPosition!);
  await page.getByRole("button", { name: "Add another step", exact: true }).click();
  await page.getByRole("button", { name: "Move action 3 up", exact: true }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  expect((await read()).subtasks.map((t: { checkpointSlot: number }) => t.checkpointSlot)).toEqual(slots);
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Summit reached", exact: true })).toBeVisible();
  await expect(canvas).toHaveAttribute("data-summit", "reached");
  await expect(canvas).not.toHaveAttribute("data-position", pendingPosition!);
  await canvas.screenshot({ path: info.outputPath("confirmed-summit.png") });
  await page.screenshot({ path: info.outputPath("summit-reached.png"), fullPage: true });
  const final = await canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.reload();
  await expect.poll(() => canvas.evaluate((c: HTMLCanvasElement) => c.toDataURL()).then(s => s === final)).toBe(true);
  expect((await read()).summitConfirmations).toHaveLength(1);
  await page.getByRole("button", { name: "Reopen goal", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-summit", "pending");
  expect((await read()).summitConfirmations[0].revokedAt).toBeNull();
  await expect(page.getByText("Historical summit retained. New work is not marked complete.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  await page.getByRole("button", { name: "Cancel Undo", exact: true }).click();
  expect((await read()).completions.filter((c: { undoneAt: string | null }) => !c.undoneAt)).toHaveLength(3);
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  await page.getByRole("button", { name: "Undo action, keep summit", exact: true }).click();
  expect((await read()).summitConfirmations[0].revokedAt).toBeNull();
  await expect(canvas).toHaveAttribute("data-summit", "historical");
  await page.getByText("Summit history and corrections", { exact: true }).click();
  page.once("dialog", d => d.accept());
  await page.getByRole("button", { name: "Correct mistaken goal completion", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-summit", "none");
  expect((await read()).summitConfirmations[0].revokedAt).not.toBeNull();
  expect((await read()).completions.filter((c: { undoneAt: string | null }) => !c.undoneAt)).toHaveLength(2);
  await page.getByRole("button", { name: "Add another step", exact: true }).click();
  await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
  await page.getByLabel("Action 4 title", { exact: true }).fill("Check caption");
  await page.getByLabel("Action 4 instruction", { exact: true }).fill("Compare the caption with the reference");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  expect((await read()).subtasks.slice(0, 3).map((t: { checkpointSlot: number }) => t.checkpointSlot)).toEqual(slots);
  expect((await read()).subtasks[3].checkpointSlot).toBe(3);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("short plan uses the same summit anchor with bounded normal motion and no replay or cross-mountain light", async ({ page }, info) => {
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional one-step guide", finishCondition: "One checked page", action: "Review page", minutes: 1 });
  s = transition(s, { type: "start", minutes: 1 });
  s = transition(s, { type: "complete" });
  const first = s.subtasks[0].id;
  s = transition(s, { type: "create", title: "Fictional second mountain", finishCondition: "Checked", action: "Draw bark", minutes: 2 });
  s = transition(s, { type: "select", id: first });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/");
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-summit", "reached");
  await page.waitForTimeout(950); // Only the bounded visual reveal, not timer accounting.
  const final = await page.locator("canvas").evaluate((c: HTMLCanvasElement) => c.toDataURL());
  await page.locator("canvas").screenshot({ path: info.outputPath("one-step-summit.png") });
  await page.reload();
  await expect.poll(() => page.locator("canvas").evaluate((c: HTMLCanvasElement) => c.toDataURL()).then(s => s === final)).toBe(true);
  await page.getByText("Switch work", { exact: true }).click();
  await page.getByRole("button", { name: /^Draw bark Fictional second mountain/ }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-summit", "none");
  await expect(page.getByText("○ No checkpoints yet", { exact: true })).toBeVisible();
});

test("fourteen checkpoints share stable segments; failed summit persistence never shows success", async ({ page }, info) => {
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional long guide", finishCondition: "Fourteen checked drawings", action: "Draw 1", minutes: 1 });
  for (let i = 1; i < 14; i++) s.subtasks.push({ ...s.subtasks[0], id: crypto.randomUUID(), title: `Draw ${i + 1}`, orderKey: i, checkpointSlot: i });
  s.mountains[0].nextCheckpointSlot = 14;
  for (const t of s.subtasks) {
    s = transition(s, { type: "start-next", id: t.id, minutes: 1 });
    s = transition(s, { type: "complete" });
  }
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-segment", "1");
  await expect(page.locator(".checkpoint-journal li")).toHaveCount(14);
  await expect(page.getByRole("button", { name: "Confirm goal complete", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional failure"); }; });
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-summit", "pending");
  await expect(page.getByRole("heading", { name: "Summit reached", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Not yet", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-summit", "reached");
  await canvas.screenshot({ path: info.outputPath("fourteen-slot-summit.png") });
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  await page.getByRole("button", { name: "Undo action and correct summit", exact: true }).click();
  await expect(canvas).toHaveAttribute("data-summit", "none");
  await expect(page.locator(".checkpoint-journal li")).toHaveCount(13);
});
