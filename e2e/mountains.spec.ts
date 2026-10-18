import { test, expect } from "@playwright/test";
import { emptySnapshot } from "../lib/domain";
import { transition } from "../lib/actions";
const key = "work-trail:snapshot:v1";
function fixture() {
  const now = Date.now() - 100000;
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional woodland guide", finishCondition: "Reviewed leaf", action: "Draw leaf", minutes: 3 }, now);
  s = transition(s, { type: "complete" }, now + 1000);
  s = transition(s, { type: "create", title: "GardenChecklistWithUnbrokenIdentifierForWeekendPreparationAndNeighbourhoodVolunteerCoordination", finishCondition: "Reviewed planting list", action: "List seeds", minutes: 4 }, now + 2000);
  s = transition(s, { type: "start", minutes: 4 }, now + 2000);
  s = transition(s, { type: "note", note: "Keep the seed packets" }, now + 3000);
  s = transition(s, { type: "return-step", value: "Check the bean variety" }, now + 3000);
  return transition(s, { type: "save" }, now + 4000);
}
test("range browsing is independent; saved continuation, edit conflict and summit/Undo reuse", async ({ page }, info) => {
  const s = fixture();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  const read = () => page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
  await page.goto("/mountains");
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
  const before = await read();
  await page.getByRole("button", { name: `View ${s.mountains[1].title}`, exact: true }).click();
  await expect(page.locator("#mountain-detail-title")).toBeFocused();
  await expect(page.locator(".mountain-return")).toContainText("Check the bean variety");
  await expect(page.locator(".mountain-return")).toContainText("Keep the seed packets");
  expect(await read()).toEqual(before);
  await page.screenshot({ path: info.outputPath("range-saved.png"), fullPage: true });
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.screenshot({ path: info.outputPath("range-saved-320.png"), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
    await page.setViewportSize({ width: 390, height: 844 });
  }
  await page.reload();
  await expect(page.locator("#mountain-detail-title")).toHaveText(s.mountains[1].title);
  await page.getByRole("button", { name: "Continue on Today", exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#action-title")).toHaveText("Check the bean variety");
  await expect(page.getByRole("timer")).toHaveCount(0);
  expect((await read()).sessions).toEqual(before.sessions);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.goto("/mountains"); // A real reload recovers, never credits the closure gap.
  await expect(page.getByRole("button", { name: "＋ New task", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "View Fictional woodland guide", exact: true }).click();
  await expect(page.locator(".mountain-return")).toContainText("No saved unfinished session");
  await page.getByRole("button", { name: "Confirm goal complete", exact: true }).click();
  await page.getByRole("button", { name: "Yes, finish condition met", exact: true }).click();
  await expect(page.locator(".mountain-detail canvas")).toHaveAttribute("data-summit", "reached");
  await page.locator(".mountain-detail .checkpoint-journal summary").first().click();
  await page.locator(".mountain-detail").getByRole("button", { name: "Undo completion", exact: true }).click();
  await page.getByRole("button", { name: "Undo action, keep summit", exact: true }).click();
  await expect(page.getByRole("region", { name: "Undo recovery" })).toContainText("Draw leaf reopened");
  // Retaining a genuine summit keeps the goal confirmed until explicitly reopened.
  await expect(page.locator(".mountain-detail canvas")).toHaveAttribute("data-summit", "reached");
  await page.getByRole("button", { name: "Reopen goal", exact: true }).click();
  await expect(page.locator(".mountain-detail canvas")).toHaveAttribute("data-summit", "historical");
  await page.locator(".mountain-detail").getByText("Summit history and corrections", { exact: true }).click();
  page.once("dialog", d => d.accept());
  await page.getByRole("button", { name: "Correct mistaken goal completion", exact: true }).click();
  await expect(page.locator(".mountain-detail canvas")).toHaveAttribute("data-summit", "none");
  expect((await read()).summitConfirmations[0].revokedAt).not.toBeNull();
  await page.getByRole("button", { name: `View ${s.mountains[1].title}`, exact: true }).click();
  await expect(page.locator(".mountain-detail .correction-history")).toHaveCount(0);
  await page.getByRole("button", { name: "View Fictional woodland guide", exact: true }).click();
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByLabel("Describe the work").fill("Unrelated fictional draft");
  await page.getByRole("button", { name: "Close · keep draft", exact: true }).click();
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await expect(page.getByRole("button", { name: "Keep draft and cancel edit", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Keep draft and cancel edit", exact: true }).click();
  expect((await read()).creationDraft.description).toBe("Unrelated fictional draft");
  await page.screenshot({ path: info.outputPath("range-corrected.png"), fullPage: true });
  if (info.project.name === "mobile") {
    await page.setViewportSize({ width: 320, height: 844 });
    await page.screenshot({ path: info.outputPath("range-corrected-320.png"), fullPage: true });
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});
for (const kind of ["zero", "interrupted", "failure", "readonly"] as const) test(`mountain return boundary: ${kind}`, async ({ page, context }, info) => {
  let s = fixture();
  if (kind === "zero") s.sessions[0].remainingMs = 0;
  if (kind === "interrupted") {
    s.sessions[0].status = "running";
    s.sessions[0].runningDeadlineAt = new Date(Date.now() - 20000).toISOString();
  }
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto(`/mountains#${s.mountains[1].id}`);
  const button = page.getByRole("button", { name: "Continue on Today", exact: true });
  await expect(button).toBeEnabled();
  const before = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
  if (kind === "readonly") {
    const observer = await context.newPage();
    await observer.goto(`/mountains#${s.mountains[1].id}`);
    await expect(observer.getByText(/Read-only:/)).toBeVisible();
    await expect(observer.getByRole("button", { name: "Continue on Today", exact: true })).toBeDisabled();
    await observer.getByRole("button", { name: "View Fictional woodland guide", exact: true }).click();
    await expect(observer.getByRole("button", { name: "Confirm goal complete", exact: true })).toBeDisabled();
    await observer.close();
  } else if (kind === "failure") {
    await page.evaluate(() => { Storage.prototype.setItem = () => { throw Error("Fictional quota failure"); }; });
    await button.click();
    await expect(page.locator(".storage-warning")).toBeVisible();
    await expect(page).toHaveURL(/\/mountains#/);
    expect(await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).toEqual(before);
    await expect(page.getByRole("region", { name: "Undo recovery" })).toHaveCount(0);
  } else {
    if (kind === "interrupted") await expect(page.locator(".mountain-return")).toContainText("Interrupted at the last recorded place");
    await button.click();
    await expect(page.locator("#action-title")).toBeFocused();
    const expectedSessions = kind === "interrupted" ? before.sessions.map((x: typeof s.sessions[number]) => ({ ...x, status: "interrupted", runningDeadlineAt: null })) : before.sessions;
    expect((await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).sessions).toEqual(expectedSessions);
    await expect(page.getByRole("timer")).toHaveCount(0);
    if (kind === "zero") {
      await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeDisabled();
      await page.getByRole("button", { name: "Extend 5 min", exact: true }).click();
      await expect(page.getByRole("timer")).toBeVisible();
    } else await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  }
  if (info.project.name === "mobile" && kind === "failure") expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
});

test("mountain edits retain slots, archive/restore history and saved work on another goal", async ({ page }) => {
  const s = fixture();
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/mountains");
  await expect(page.getByRole("button", { name: "Edit breakdown", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await page.getByLabel("Action 1 title", { exact: true }).fill("Draw the oak leaf");
  await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
  await page.getByLabel("Action 2 title", { exact: true }).fill("Check veins");
  await page.getByLabel("Action 2 instruction", { exact: true }).fill("Compare the labelled veins with the reference");
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(page.locator(".mountain-actions")).toContainText("Check veins");
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await page.getByRole("button", { name: "Remove action 1", exact: true }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  await page.getByText("Archived actions", { exact: true }).click();
  await expect(page.locator(".mountain-detail")).toContainText("Draw the oak leaf · Archived");
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await page.getByText("Archived actions and saved context", { exact: true }).click();
  await page.getByRole("button", { name: /Restore Draw the oak leaf/ }).click();
  await page.getByRole("button", { name: "Save changes", exact: true }).click();
  const stored = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
  expect(stored.subtasks[0].id).toBe(s.subtasks[0].id);
  expect(stored.subtasks[0].checkpointSlot).toBe(s.subtasks[0].checkpointSlot);
  expect(stored.subtasks[0].archivedAt).toBeNull();
  expect(stored.completions).toEqual(s.completions);
  expect(stored.sessions).toEqual(s.sessions);
  expect(stored.mountains[1]).toEqual(s.mountains[1]);
  await page.reload();
  await expect(page.locator(".mountain-actions")).toContainText("Draw the oak leaf");
});

test("range bounds thumbnails for many goals and keyboard choice preserves records", async ({ page }) => {
  let s = emptySnapshot();
  for (let i = 1; i <= 8; i++) s = transition(s, { type: "create", title: `Fictional mountain ${i}`, finishCondition: "Reviewed", action: `Inspect ${i}`, minutes: 2 });
  await page.addInitScript(raw => { if (!localStorage.getItem("work-trail:snapshot:v1")) localStorage.setItem("work-trail:snapshot:v1", raw); }, JSON.stringify(s));
  await page.goto("/mountains");
  const before = await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key);
  await expect(page.locator(".mountain-range canvas")).toHaveCount(6);
  await page.getByRole("button", { name: "More goals", exact: true }).click();
  const last = page.getByRole("button", { name: "View Fictional mountain 8", exact: true });
  await last.focus();
  await last.press("Enter");
  await expect(page.locator("#mountain-detail-title")).toBeFocused();
  await expect(page.locator("#mountain-detail-title")).toHaveText("Fictional mountain 8");
  expect(await page.evaluate(k => JSON.parse(localStorage.getItem(k)!), key)).toEqual(before);
});
test("empty Mountains uses existing manual creation and same shared controller across navigation", async ({ page }) => {
  await page.goto("/mountains");
  await page.getByRole("button", { name: "Add your first goal", exact: true }).click();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await page.getByLabel("Mountain name", { exact: true }).fill("Fictional hill");
  await page.getByLabel("Finish condition", { exact: true }).fill("Reviewed");
  await page.getByLabel("Action 1 title", { exact: true }).fill("Draw ridge");
  await page.getByLabel("Action 1 instruction", { exact: true }).fill("Outline the ridge");
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  await page.getByRole("button", { name: "Continue on Today", exact: true }).click();
  await expect(page.getByRole("button", { name: "Start", exact: true })).toBeEnabled();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.evaluate(() => { (window as unknown as { trailMarker: boolean }).trailMarker = true; });
  await page.goBack();
  await expect(page.getByRole("timer")).toBeVisible();
  await expect(page.getByText(/Save your place before browsing Mountains/)).toBeVisible();
  expect(await page.evaluate(() => (window as unknown as { trailMarker: boolean }).trailMarker)).toBe(true);
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  await expect(page.getByRole("heading", { name: "Mountains", exact: true })).toBeVisible();
});
