import { test, expect, type Page } from "@playwright/test";
import type { Snapshot } from "../lib/domain";
const read = (page: Page): Promise<Snapshot> =>
  page.evaluate(() =>
    JSON.parse(localStorage.getItem("work-trail:snapshot:v1")!),
  );
async function create(page: Page, name: string) {
  await page.getByRole("button", { name: "＋ New task", exact: true }).click();
  await page
    .getByLabel("Describe the work")
    .fill(`Prepare fictional task ${name}.`);
  await page
    .getByRole("button", { name: "Write manually", exact: true })
    .click();
  await page.getByLabel("Mountain name").fill(`Mountain ${name}`);
  await page
    .getByLabel("Finish condition", { exact: true })
    .fill(`Finish ${name}`);
  await page.getByLabel("Action 1 title").fill(`Action ${name}`);
  await page.getByLabel("Action 1 instruction").fill(`Action ${name}`);
  await page.getByLabel("Action 1 session minutes").fill("2");
  await page
    .getByLabel("I reviewed the goal, finish condition and every action")
    .check();
  await page
    .getByRole("button", { name: "Accept breakdown", exact: true })
    .click();
}
async function save(page: Page, note: string) {
  if (!(await page.getByLabel("Where did you stop?").isVisible()))
    await page.getByText("Return note (optional)", { exact: true }).click();
  await page.getByLabel("Where did you stop?").fill(note);
  await page
    .getByRole("button", { name: "Save my place", exact: true })
    .click();
}
test("two-task focus layout and reload retain task-specific context", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.clock.install({ time: new Date("2026-10-15T12:00:00Z") });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "＋ New task", exact: true }),
  ).toBeEnabled();
  await create(page, "A");
  await page.clock.pauseAt(
    new Date((await page.evaluate(() => Date.now())) + 1000),
  );
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward(10000);
  await save(page, "Return note A");
  const a = (await read(page)).sessions[0];
  await create(page, "B");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.clock.fastForward(20000);
  await save(page, "Return note B");
  const b = (await read(page)).sessions[1];
  expect(b.note).toBe("Return note B");
  expect(b.remainingMs).toBe(100000);
  expect(a.note).toBe("Return note A");
  expect(a.remainingMs).toBe(110000);
  await page.getByText("Choose other work", { exact: true }).click();
  await page.getByRole("button", { name: /Action A.*Mountain A/ }).click();
  await expect(page.getByText("Return note A", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "One action at a time." }),
  ).toBeFocused();
  await expect(page.getByLabel("Where did you stop?")).not.toBeVisible();
  await page.screenshot({
    path: `devpost/evidence/focus-repair-${info.project.name}.png`,
    fullPage: true,
  });
  const layout = await page.locator(".shell.is-focusing").evaluate((el) => {
    const main = el.querySelector("main")!,
      world = el.querySelector(".world")!,
      panel = el.querySelector(".action")!;
    const box = (e: Element) => {
      const r = e.getBoundingClientRect();
      return {
        x: r.x,
        y: r.y,
        width: r.width,
        height: r.height,
        right: r.right,
        bottom: r.bottom,
      };
    };
    return {
      columns: getComputedStyle(el).gridTemplateColumns.split(" ").length,
      shell: box(el),
      main: box(main),
      world: box(world),
      panel: box(panel),
      viewport: innerWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
    };
  });
  console.log(info.project.name, "focus computed layout", layout);
  expect(layout.columns).toBe(1);
  expect(layout.main.width).toBeCloseTo(layout.shell.width, 0);
  expect(layout.overflow).toBe(false);
  expect(layout.shell.width).toBeLessThanOrEqual(1250);
  expect(layout.main.width).toBeGreaterThan(
    Math.min(layout.viewport - 40, 1000),
  );
  if (layout.viewport > 800) {
    expect(layout.world.right).toBeLessThanOrEqual(layout.panel.x);
    expect(Math.abs(layout.world.y - layout.panel.y)).toBeLessThan(2);
  } else {
    expect(layout.world.y).toBeGreaterThan(layout.panel.y);
    expect(layout.world.y).toBeLessThan(800);
  }
  await expect(
    page.getByRole("heading", { name: "Action A", exact: true }),
  ).toBeVisible();
  await expect(
    page
      .locator("#world-title")
      .locator("..")
      .getByText("Mountain A", { exact: true }),
  ).toBeVisible();
  const resumed = await read(page);
  expect(resumed.sessions[0]).toMatchObject({
    note: "Return note A",
    remainingMs: a.remainingMs,
    creditedMs: a.creditedMs,
  });
  expect(resumed.sessions[1]).toEqual(b);
  await page
    .getByRole("button", { name: "Save my place", exact: true })
    .click();
  await page.reload();
  await page.clock.runFor(1100);
  await expect(page.getByText("Return note A", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Resume", exact: true }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Resume", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Action A", exact: true }),
  ).toBeVisible();
  expect((await read(page)).sessions[1]).toEqual(b);
  expect(errors).toEqual([]);
  await expect(
    page.getByRole("heading", { name: "One action at a time." }),
  ).toBeFocused();
  expect(
    await page
      .locator(".shell.is-focusing > main")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeCloseTo(layout.main.width, 0);
  expect((await read(page)).sessions[0]).toMatchObject({
    note: "Return note A",
    remainingMs: a.remainingMs,
    creditedMs: a.creditedMs,
  });
});
