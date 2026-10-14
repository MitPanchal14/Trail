import { test, expect } from "@playwright/test";
test("Today visual states, keyboard, dialog, and isolated samples", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Explore sample previews" }).click();
  await expect(
    page.getByRole("heading", { name: "Every path starts here." }),
  ).toBeVisible();
  await expect(
    page.getByText("No checkpoints yet", { exact: false }),
  ).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to Today" })).toBeFocused();
  await expect(page.getByRole("link", { name: "Skip to Today" })).toHaveCSS(
    "outline-style",
    "solid",
  );
  await page.getByRole("link", { name: "Skip to Today" }).press("Enter");
  await page.locator("h1").click();
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
  await page.screenshot({
    path: `devpost/evidence/${testInfo.project.name}-empty.png`,
    fullPage: true,
  });
  for (const state of ["one", "saved", "rich"]) {
    await page.getByLabel("Preview state").selectOption(state);
    await expect(page.locator(".sample-notice")).toContainText("fictional");
    // Wait for the bounded 420ms canvas spread before capturing its retained state.
    await page.waitForTimeout(500);
    if (state === "saved")
      await expect(
        page.getByText("Where you left off", { exact: true }),
      ).toBeVisible();
    await expect(page.locator("details")).toHaveCount(state === "rich" ? 6 : 1);
    await page.locator("summary").first().click();
    await expect(
      page.getByText("Fictional checkpoint 1", { exact: false }),
    ).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: `devpost/evidence/${testInfo.project.name}-${state}.png`,
      fullPage: true,
    });
    await page.locator("summary").first().click();
  }
  await page.getByRole("button", { name: "Preview Start" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(
    await page.evaluate(
      () => matchMedia("(prefers-reduced-motion: reduce)").matches,
    ),
  ).toBe(true);
  await page.reload();
  await page.getByRole("button", { name: "Explore sample previews" }).click();
  await expect(page.getByLabel("Preview state")).toHaveValue("empty");
  expect(
    await page.evaluate(() => localStorage.getItem("work-trail:snapshot:v1")),
  ).toBeNull();
  expect(errors).toEqual([]);
});

test("Dusk contrast and localized earned light", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Explore sample previews" }).click();
  const contrast = await page.evaluate(() => {
    const rgb = (s: string) =>
      s
        .match(/[\d.]+/g)!
        .slice(0, 3)
        .map(Number)
        .map((v) => {
          v /= 255;
          return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
        });
    const lum = (s: string) => {
      const r = rgb(s);
      return r[0] * 0.2126 + r[1] * 0.7152 + r[2] * 0.0722;
    };
    return [
      "body",
      ".primary",
      ".heading > div > p:last-child",
      ".world-heading",
      ".world-heading .eyebrow",
      ".action-foot",
    ].map((selector) => {
      const el = document.querySelector(selector)!;
      let parent: Element | null = el;
      let bg = "";
      while (parent) {
        bg = getComputedStyle(parent).backgroundColor;
        if (bg !== "rgba(0, 0, 0, 0)") break;
        parent = parent.parentElement;
      }
      const a = lum(getComputedStyle(el).color),
        b = lum(bg);
      return {
        selector,
        ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05),
      };
    });
  });
  console.log("Measured Dusk contrast", contrast);
  for (const { ratio } of contrast) expect(ratio).toBeGreaterThanOrEqual(4.5);
  const warmPixels = () =>
    page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
      const data = canvas.getContext("2d")!.getImageData(0, 0, 700, 430).data;
      let warm = 0;
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] === 222 && data[i + 1] === 196 && data[i + 2] === 127)
          warm++;
      }
      return warm;
    });
  await page.getByLabel("Preview state").selectOption("one");
  await page.waitForTimeout(50);
  const one = await warmPixels();
  await page.getByLabel("Preview state").selectOption("saved");
  await page.waitForTimeout(50);
  expect(await warmPixels()).toBe(one);
  await expect(page.locator("canvas")).toHaveAttribute(
    "aria-label",
    /saving earns no light/,
  );
  await page.getByLabel("Preview state").selectOption("rich");
  await page.waitForTimeout(50);
  expect(await warmPixels()).toBeGreaterThan(one * 2);
  await page.getByLabel("Preview state").selectOption("empty");
  await page.waitForTimeout(50);
  expect(await warmPixels()).toBe(0);
});
