import { test, expect, type Page } from "@playwright/test";
const fixture = {
  kind: "breakdown",
  goal: "Fictional tree guide",
  finishCondition: "One checked guide page",
  steps: [
    {
      title: "Sketch oak leaf",
      nextAction: "Draw one oak leaf and label three veins.",
      suggestedMinutes: 15,
    },
    {
      title: "Review labels",
      nextAction: "Read the page and mark one unclear label.",
      suggestedMinutes: 10,
    },
  ],
};
async function open(page: Page) {
  await expect(
    page.getByRole("button", { name: "＋ New task", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
}
async function accept(page: Page) {
  await expect(page.getByRole("checkbox", { name: /I reviewed/ })).toHaveCount(0);
  await page
    .getByRole("button", { name: /^(Accept breakdown|Save changes)$/ })
    .click();
}
const records = (page: Page) =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!),
  );
test("accepted edits preserve IDs, archived history and another goal's saved place through completion and Undo", async ({ page }) => {
  await page.route("**/api/plan", (route) => route.fulfill({ json: fixture }));
  await page.goto("/");
  await open(page);
  await page.getByLabel("Describe the work").fill("Fictional guide A.");
  await page.getByRole("button", { name: "Build with AI", exact: true }).click();
  await expect(page.getByLabel("Mountain name", { exact: true })).toHaveValue(fixture.goal);
  await accept(page);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.getByLabel("Where I stopped").fill("Guide A: outline ready; next draw three veins.");
  await page.getByRole("button", { name: "Save my place", exact: true }).click();
  const original = await records(page);

  await open(page);
  await page.getByLabel("Describe the work").fill("Fictional guide B.");
  await page.getByRole("button", { name: "Build with AI", exact: true }).click();
  await expect(page.getByLabel("Mountain name", { exact: true })).toHaveValue(fixture.goal);
  await page.getByLabel("Mountain name", { exact: true }).fill("Other fictional goal");
  await page.getByLabel("Action 1 title", { exact: true }).fill("Draft other guide");
  await accept(page);
  const before = await records(page);
  const b = before.subtasks.filter((t: { mountainId: string }) => t.mountainId === before.mountains[1].id);
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await page.getByLabel("Action 1 instruction", { exact: true }).fill("Draw the other leaf outline and label its edge.");
  await page.getByLabel("Action 1 session minutes", { exact: true }).fill("7");
  await page.getByRole("button", { name: "Move action 1 down", exact: true }).click();
  await page.getByRole("button", { name: "Remove action 1", exact: true }).click();
  await accept(page);
  let edited = await records(page);
  expect(edited.subtasks.find((t: { id: string }) => t.id === b[0].id)).toMatchObject({
    checkpointSlot: b[0].checkpointSlot, suggestedMinutes: 7,
    nextAction: "Draw the other leaf outline and label its edge.",
  });
  expect(edited.subtasks.find((t: { id: string }) => t.id === b[1].id).archivedAt).not.toBeNull();
  expect(edited.sessions[0]).toEqual(original.sessions[0]);
  await page.getByRole("button", { name: "Edit breakdown", exact: true }).click();
  await page.getByText("Archived actions and saved context", { exact: true }).click();
  await page.getByRole("button", { name: "Restore Review labels", exact: true }).click();
  await accept(page);
  edited = await records(page);
  expect(edited.subtasks.find((t: { id: string }) => t.id === b[1].id)).toMatchObject({
    checkpointSlot: b[1].checkpointSlot, archivedAt: null,
  });
  await page.reload();
  await expect(page.getByText(original.sessions[0].note, { exact: true })).toBeVisible();
  expect((await records(page)).sessions[0]).toEqual(original.sessions[0]);
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await page.getByRole("button", { name: "Complete action", exact: true }).click();
  await expect(page.getByText("✦ 1 earned checkpoint", { exact: true })).toBeVisible();
  await page.locator(".checkpoint-journal summary").click();
  await expect(page.locator(".checkpoint-journal")).toContainText(original.sessions[0].note);
  await page.getByRole("button", { name: "Undo completion", exact: true }).first().click();
  const undone = await records(page);
  expect(undone.completions[0].undoneAt).not.toBeNull();
  expect(undone.sessions[0].note).toBe(original.sessions[0].note);
  expect(undone.subtasks.find((t: { id: string }) => t.id === b[0].id).checkpointSlot).toBe(b[0].checkpointSlot);
});

test("quota failure and explicit cancellation preserve editable drafts across reload", async ({ page }) => {
  let release: () => void = () => {};
  let calls = 0;
  await page.route("**/api/plan", async (route) => {
    if (++calls === 1) {
      await route.fulfill({ status: 429, json: { error: { code: "QUOTA", message: "Gemini quota reached; edit manually." } } });
      return;
    }
    await new Promise<void>((resolve) => { release = resolve; });
    await route.fulfill({ json: fixture });
  });
  await page.goto("/");
  await open(page);
  await page.getByLabel("Describe the work").fill("Fictional text retained after quota failure.");
  await page.getByRole("button", { name: "Build with AI", exact: true }).click();
  await expect(page.getByText("Gemini quota reached; edit manually.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Build with AI", exact: true }).click();
  await expect.poll(() => calls).toBe(2);
  await page.getByRole("button", { name: "Cancel request", exact: true }).click();
  const corrected = "Fictional corrected description after cancellation.";
  await page.getByLabel("Describe the work").fill(corrected);
  release();
  await page.getByRole("button", { name: "Write manually", exact: true }).click();
  await expect(page.getByLabel("Mountain name", { exact: true })).toHaveValue("");
  await page.reload();
  await page.getByRole("button", { name: "Continue creation draft", exact: true }).click();
  await expect(page.getByLabel("Describe the work")).toHaveValue(corrected);
  expect((await records(page)).mountains).toHaveLength(0);
});
test("missing-AI fallback, draft reload, full manual review and daily commitments", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // External dev servers may have paid AI enabled. Routine tests never call it.
  // The managed default server exercises the actual disabled-config endpoint.
  if (process.env.PW_BASE_URL)
    await page.route("**/api/plan", (route) => route.fulfill({ status: 503,
      json: { error: { code: "AI_UNAVAILABLE", message: "AI is unavailable. Use the manual editor." } },
    }));
  await page.addInitScript(() => {
    Object.defineProperty(window, "SpeechRecognition", { value: undefined });
    Object.defineProperty(window, "webkitSpeechRecognition", {
      value: undefined,
    });
  });
  await page.goto("/");
  await open(page);
  await page
    .getByLabel("Describe the work")
    .fill("Make a fictional tree guide. I have a photograph but no draft.");
  await page
    .getByRole("button", { name: "Use microphone", exact: true })
    .click();
  await expect(page.getByText(/Voice is unavailable/)).toBeVisible();
  await page
    .getByRole("button", { name: "Build with AI", exact: true })
    .click();
  await expect(
    page.getByText(/AI is unavailable|Public AI is disabled/),
  ).toBeVisible();
  await page.reload();
  await page
    .getByRole("button", { name: "Continue creation draft", exact: true })
    .click();
  await expect(page.getByLabel("Describe the work")).toHaveValue(
    "Make a fictional tree guide. I have a photograph but no draft.",
  );
  expect((await records(page)).mountains).toHaveLength(0);
  await page
    .getByRole("button", { name: "Write manually", exact: true })
    .click();
  await page
    .getByLabel("Mountain name", { exact: true })
    .fill("Fictional tree guide");
  await page
    .getByLabel("Finish condition", { exact: true })
    .fill("One printable checked guide page");
  await page
    .getByLabel("Action 1 title", { exact: true })
    .fill("Sketch oak leaf");
  await page
    .getByLabel("Action 1 instruction", { exact: true })
    .fill("Draw one oak leaf and label three veins.");
  await page.getByLabel("Action 1 session minutes", { exact: true }).fill("15");
  await page.getByRole("button", { name: "+ Add another action", exact: true }).click();
  await page
    .getByLabel("Action 2 title", { exact: true })
    .fill("Review labels");
  await page
    .getByLabel("Action 2 instruction", { exact: true })
    .fill("Read the page and mark one unclear label.");
  await page.getByLabel("Action 2 session minutes", { exact: true }).fill("10");
  await page.screenshot({
    path: info.outputPath("slice3-review.png"),
    fullPage: true,
  });
  await accept(page);
  expect((await records(page)).sessions).toHaveLength(0);
  await expect(page.locator(".next-instruction")).toHaveText(
    "Draw one oak leaf and label three veins.",
  );
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page
    .getByLabel("Time available today (optional)", { exact: true })
    .fill("20");
  await page.getByRole("checkbox", { name: /Sketch oak leaf —/ }).check();
  await page.getByRole("checkbox", { name: /Review labels —/ }).check();
  await expect(page.getByText(/This is more than your 20/)).toBeVisible();
  expect((await records(page)).dayPlans[0].commitments).toHaveLength(0);
  await page.getByRole("button", { name: "Move planned action 2 up" }).click();
  await page.screenshot({
    path: info.outputPath("slice3-plan.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "Commit today’s plan", exact: true })
    .click();
  const committed = await records(page);
  expect(committed.dayPlans[0].commitments).toHaveLength(2);
  await expect(
    page.getByRole("heading", { name: "Review labels", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".next-instruction")).toHaveText(
    "Read the page and mark one unclear label.",
  );
  await page
    .getByRole("button", { name: "Remove commitment Sketch oak leaf" })
    .click();
  await page
    .getByRole("button", { name: "Defer commitment Review labels" })
    .click();
  const removed = await records(page);
  expect(
    removed.dayPlans[0].commitments
      .map((c: { disposition: string }) => c.disposition)
      .sort(),
  ).toEqual(["deferred", "removed"]);
  expect(removed.completions).toHaveLength(0);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("mocked clarification retains context; reviewed AI plan is editable and preserves saved sessions", async ({
  page,
}, info) => {
  let count = 0;
  await page.route("**/api/plan", (route) =>
    route.fulfill({
      json:
        count++ === 0
          ? {
              kind: "clarification",
              question: "Which tree should the guide start with?",
            }
          : fixture,
    }),
  );
  await page.goto("/");
  await open(page);
  await page
    .getByLabel("Describe the work")
    .fill("Make a fictional tree guide.");
  await page.getByText("Optional context", { exact: true }).click();
  await page
    .getByLabel("What has already been done", { exact: true })
    .fill("One oak photograph collected.");
  await page
    .getByRole("button", { name: "Build with AI", exact: true })
    .click();
  await expect(page.getByText(/Which tree should/)).toBeVisible();
  await expect(
    page.getByLabel("What has already been done", { exact: true }),
  ).toHaveValue("One oak photograph collected.");
  await page
    .getByLabel("Describe the work")
    .fill("Make a fictional guide starting with oak.");
  await page
    .getByRole("button", { name: "Build with AI", exact: true })
    .click();
  await expect(
    page.getByLabel("Action 1 instruction", { exact: true }),
  ).toHaveValue(fixture.steps[0].nextAction);
  await page
    .getByLabel("Action 1 instruction", { exact: true })
    .fill("Draw an oak leaf and mark exactly three veins.");
  await accept(page);
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await expect(page.locator(".next-instruction")).toHaveText(
    "Draw an oak leaf and mark exactly three veins.",
  );
  await page
    .getByLabel("Where I stopped")
    .fill("My outline is ready; next add the veins.");
  await page
    .getByRole("button", { name: "Save my place", exact: true })
    .click();
  const before = (await records(page)).sessions[0];
  await open(page);
  await page
    .getByLabel("Describe the work")
    .fill("A separate fictional unfinished creation draft.");
  await page
    .getByRole("button", { name: "Close · keep draft", exact: true })
    .click();
  await page.reload();
  await expect(page.getByText(before.note, { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Sketch oak leaf", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "One action at a time." }),
  ).toBeFocused();
  await page.screenshot({
    path: info.outputPath("slice3-focus.png"),
    fullPage: true,
  });
  const after = await records(page);
  expect(after.sessions[0].note).toBe(before.note);
  expect(after.creationDraft.description).toContain("separate fictional");
  expect(after.mountains).toHaveLength(1);
  expect(after.sessions[0].remainingMs).toBeLessThanOrEqual(before.remainingMs);
});

test("denied voice falls back to typing and stops on leaving; stale AI replies do not overwrite edits", async ({
  page,
}) => {
  await page.addInitScript(() => {
    class DeniedRecognition {
      onerror: ((e: { error: string }) => void) | null = null;
      onend: (() => void) | null = null;
      start() {
        queueMicrotask(() => {
          this.onerror?.({ error: "not-allowed" });
          this.onend?.();
        });
      }
      stop() {
        this.onend?.();
      }
      abort() {
        this.onend?.();
      }
    }
    Object.defineProperty(window, "SpeechRecognition", {
      value: DeniedRecognition,
    });
  });
  let release: () => void = () => {};
  let calls = 0;
  await page.route("**/api/plan", async (route) => {
    const current = calls++;
    if (current === 0)
      await new Promise<void>((resolve) => {
        release = resolve;
      });
    await route.fulfill({
      json: { ...fixture, goal: current === 0 ? "Stale goal" : "Latest goal" },
    });
  });
  await page.goto("/");
  await open(page);
  await page
    .getByLabel("Describe the work")
    .fill("A fictional first description");
  await page
    .getByRole("button", { name: "Use microphone", exact: true })
    .click();
  await expect(
    page.getByText(/Microphone permission was denied/),
  ).toBeVisible();
  await expect(page.getByLabel("Describe the work")).toHaveValue(
    "A fictional first description",
  );
  await page
    .getByRole("button", { name: "Build with AI", exact: true })
    .click();
  await expect.poll(() => calls).toBe(1);
  await page
    .getByLabel("Describe the work")
    .fill("A fictional updated description");
  await page
    .getByRole("button", { name: "Build with AI", exact: true })
    .click();
  await expect(page.getByLabel("Mountain name", { exact: true })).toHaveValue(
    "Latest goal",
  );
  release();
  await expect(page.getByLabel("Mountain name", { exact: true })).toHaveValue(
    "Latest goal",
  );
  await page
    .getByRole("button", { name: "Close · keep draft", exact: true })
    .click();
  expect((await records(page)).mountains).toHaveLength(0);
});

test("mocked daily AI rejects unknown candidates and never commits its valid suggestion", async ({
  page,
}) => {
  await page.route("**/api/plan", (route) => route.fulfill({ json: fixture }));
  await page.goto("/");
  await open(page);
  await page.getByLabel("Describe the work").fill("A fictional tree guide.");
  await page
    .getByRole("button", { name: "Build with AI", exact: true })
    .click();
  await expect(page.getByLabel("Mountain name", { exact: true })).toHaveValue(
    fixture.goal,
  );
  await accept(page);
  await page.getByRole("button", { name: "Plan today", exact: true }).click();
  await page.getByRole("checkbox", { name: /Sketch oak leaf —/ }).check();
  const before = await records(page);
  await page.unroute("**/api/plan");
  await page.route("**/api/plan", (route) =>
    route.fulfill({
      json: {
        kind: "day",
        orderedSubtaskIds: ["11111111-1111-4111-8111-111111111111"],
        reason: "Unknown candidate test",
      },
    }),
  );
  await page
    .getByRole("button", { name: "Suggest a plan with AI", exact: true })
    .click();
  await expect(
    page.getByText("Invalid candidate IDs", { exact: true }),
  ).toBeVisible();
  expect((await records(page)).dayPlans[0].draftSubtaskIds).toEqual(
    before.dayPlans[0].draftSubtaskIds,
  );
  await page.unroute("**/api/plan");
  await page.route("**/api/plan", (route) =>
    route.fulfill({
      json: {
        kind: "day",
        orderedSubtaskIds: [before.subtasks[1].id],
        reason: "One short review session.",
      },
    }),
  );
  await page
    .getByRole("button", { name: "Suggest a plan with AI", exact: true })
    .click();
  await expect(
    page.getByText(/AI draft, not committed: One short/),
  ).toBeVisible();
  expect((await records(page)).dayPlans[0].commitments).toHaveLength(0);
  await page
    .getByRole("button", { name: "Commit today’s plan", exact: true })
    .click();
  expect((await records(page)).dayPlans[0].commitments[0].subtaskId).toBe(
    before.subtasks[1].id,
  );
});
