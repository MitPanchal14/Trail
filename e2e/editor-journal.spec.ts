import { test, expect } from "@playwright/test";

test("editable cards retain temporary minutes, add focus and direct existing edits", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await page.getByLabel("Mountain name", { exact: true }).fill("Fictional garden guide");
  await page.getByLabel("Finish condition", { exact: true }).fill("Three reviewed illustrations");
  await page.getByLabel("Action 1 title", { exact: true }).fill("Draw stem");
  await page.getByLabel("Action 1 instruction", { exact: true }).fill("Sketch the reference stem");
  const minutes = page.getByLabel("Action 1 session minutes", { exact: true });
  await minutes.fill("");
  await expect(minutes).toHaveValue("");
  await page.getByRole("button", { name: "Close · keep draft", exact: true }).click();
  await page.reload();
  await page.getByRole("button", { name: "Continue creation draft", exact: true }).click();
  await expect(minutes).toHaveValue("");
  await page.getByLabel("I reviewed the goal, finish condition and every action").check();
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!).subtasks.length)).toBe(0);
  await minutes.fill("12");
  await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
  await expect(page.getByLabel("Action 2 title", { exact: true })).toBeFocused();
  await expect(page.getByLabel("Action 2 title", { exact: true })).toBeInViewport();
  await page.getByLabel("Action 2 title", { exact: true }).fill("Draw leaf");
  await page.getByLabel("Action 2 instruction", { exact: true }).fill("Outline the reference leaf");
  await page.getByLabel("Action 2 title", { exact: true }).focus();
  const contrast = await page.evaluate(() => {
    const lum = (v: string) => v.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((a, c, i) => a + c * [.2126, .7152, .0722][i], 0);
    const ratio = (a: string, b: string) => (Math.max(lum(a), lum(b)) + .05) / (Math.min(lum(a), lum(b)) + .05);
    return [...document.querySelectorAll(".step-editor")].map(card => {
      const c = getComputedStyle(card), input = getComputedStyle(card.querySelector("input")!);
      return { text: ratio(c.color, c.backgroundColor), inputText: ratio(input.color, input.backgroundColor), inputBoundary: ratio(input.borderColor, input.backgroundColor), cardBoundary: ratio(c.borderColor, c.backgroundColor), focusRing: ratio(input.outlineColor, c.backgroundColor) };
    });
  });
  console.log("Rendered editor contrast", contrast);
  await info.attach("editor-contrast", { body: JSON.stringify(contrast), contentType: "application/json" });
  for (const sample of contrast) {
    expect(sample.text).toBeGreaterThanOrEqual(4.5);
    expect(sample.inputText).toBeGreaterThanOrEqual(4.5);
    expect(sample.inputBoundary).toBeGreaterThanOrEqual(3);
    expect(sample.cardBoundary).toBeGreaterThanOrEqual(3);
  }
  expect(contrast[1].focusRing).toBeGreaterThanOrEqual(3);
  await page.screenshot({ path: info.outputPath("action-editor.png") });
  await page.getByLabel("I reviewed the goal, finish condition and every action").check();
  await page.getByRole("button", { name: "Accept breakdown", exact: true }).click();
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await expect(page.getByLabel("Describe the work")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Build with AI", exact: true })).toHaveCount(0);
  await expect(minutes).toHaveValue("12");
  await page.screenshot({ path: info.outputPath("existing-editor.png") });
  await page.getByRole("button", { name: "Close · keep draft", exact: true }).click();
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  const journal = page.getByRole("region", { name: "Recorded checkpoint details" });
  await expect(journal.getByRole("heading", { name: "Draw stem", exact: true })).toBeVisible();
  await expect(journal.getByText("Latest", { exact: true })).toBeVisible();
  await expect(journal.getByText(/No context/)).toHaveCount(0);
  await journal.getByText("Context and options", { exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(journal.getByRole("button", { name: "Undo completion", exact: true })).toBeVisible();
  await journal.screenshot({ path: info.outputPath("checkpoint-journal.png") });
});
