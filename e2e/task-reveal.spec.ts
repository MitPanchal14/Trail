import { test, expect } from "@playwright/test";
import { emptySnapshot } from "../lib/domain";
import { transition } from "../lib/actions";

test("choosing work reveals the saved action without starting it; narrow labels stay together", async ({ page }, info) => {
  if (info.project.name === "mobile") await page.setViewportSize({ width: 320, height: 740 });
  let s = transition(emptySnapshot(), { type: "create", title: "Fictional field guide", finishCondition: "Two checked entries", action: "Review the saved specimen", minutes: 3 });
  const first = s.subtasks[0].id;
  s = transition(s, { type: "start", minutes: 3 });
  s = transition(s, { type: "note", note: "The oak entry is checked." });
  s = transition(s, { type: "return-step", value: "Compare the remaining leaf outline." });
  s = transition(s, { type: "save" });
  s = transition(s, { type: "create", title: "GardenChecklistWithUnbrokenIdentifierForWeekendPreparationAndNeighbourhoodVolunteerCoordination", finishCondition: "All supplies listed", action: "Inventory the supplies available before buying anything for the garden", minutes: 1 });
  await page.addInitScript(raw => localStorage.setItem("work-trail:snapshot:v1", raw), JSON.stringify(s));
  await page.goto("/");
  // Recovery deliberately prioritizes saved work over a fresh selection.
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await page.locator(".other-work summary").click();
  const other = page.locator(".other-work button").last();
  const labels = await other.evaluate(button => {
    const title = button.querySelector("span")!.getBoundingClientRect();
    const project = button.querySelector("small")!.getBoundingClientRect();
    return { titleBottom: title.bottom, projectTop: project.top };
  });
  expect(labels.projectTop).toBeGreaterThanOrEqual(labels.titleBottom);
  await other.click();
  await expect(page.getByRole("button", { name: "Start", exact: true })).toBeEnabled();
  await expect(page.locator("#action-title")).toBeFocused();
  await expect(page.locator("#action-title")).toBeInViewport();
  await page.locator(".other-work button").first().click();
  const title = page.getByRole("heading", { name: "Compare the remaining leaf outline.", exact: true });
  await expect(title).toBeFocused();
  await expect(title).toBeInViewport();
  await expect(page.getByRole("button", { name: "Resume", exact: true })).toBeEnabled();
  await expect(page.getByText("The oak entry is checked.", { exact: true })).toBeVisible();
  const stored = await page.evaluate(() => JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!));
  expect(stored.selection.selectedSubtaskId).toBe(first);
  expect(stored.sessions[0].status).toBe("saved");
  // Fixture construction may account for a millisecond between start and save.
  // Selection must preserve the entire saved record, not an assumed duration.
  expect(stored.sessions[0]).toEqual(s.sessions[0]);
  expect(stored.completions).toHaveLength(0);
  // Selecting the already-selected action must still bring its controls back.
  await page.locator(".other-work button").first().click();
  await expect(title).toBeFocused();
  await expect(title).toBeInViewport();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  if (info.project.name === "mobile") {
    const header = await page.evaluate(() => ({ h: document.querySelector(".heading h1")!.getBoundingClientRect().toJSON(), b: document.querySelector(".heading > button")!.getBoundingClientRect().toJSON(), p: document.querySelector(".heading > div > p")!.getBoundingClientRect().toJSON() }));
    expect(header.h.right).toBeLessThanOrEqual(header.b.left);
    expect(header.p.top).toBeGreaterThanOrEqual(Math.max(header.h.bottom, header.b.bottom));
  }
  await page.screenshot({ path: info.outputPath("selected-saved-action.png"), fullPage: true });
});
