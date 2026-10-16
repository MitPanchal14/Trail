"use client";
import { useEffect, useRef, useMemo } from "react";
import { drawTerrain, drawClimber } from "@/lib/terrain";
export default function MountainWorld({
  count,
  saved,
  slots,
  currentSlot,
  seed,
  running = false,
  celebration = false,
  completed = count > 0,
}: {
  count: number;
  saved: boolean;
  slots?: number[];
  currentSlot?: number;
  seed?: string;
  running?: boolean;
  celebration?: boolean;
  completed?: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const slotKey = slots?.join(",");
  const stableSlots = useMemo(
    () =>
      slotKey === undefined
        ? undefined
        : slotKey === ""
          ? []
          : slotKey.split(",").map(Number),
    [slotKey],
  );
  const previousCount = useRef(count);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let lastDraw = -Infinity;
    const backdrop = document.createElement("canvas");
    backdrop.width = 700;
    backdrop.height = 430;
    const base = backdrop.getContext("2d")!;
    drawTerrain(base, count, false, 1, stableSlots, currentSlot, seed, 0, true);
    const start = performance.now();
    const earnedNewLight = celebration && count > previousCount.current;
    previousCount.current = count;
    const render = (now: number) => {
      const progress =
        preference.matches || !earnedNewLight
          ? 1
          : Math.min(1, (now - start) / 850);
      if (now - lastDraw >= 100 || (progress === 1 && !running)) {
        lastDraw = now;
        if (progress < 1)
          drawTerrain(ctx, count, false, progress, stableSlots, currentSlot, seed, 0, true, currentSlot);
        else ctx.drawImage(backdrop, 0, 0);
        drawClimber(
          ctx, currentSlot ?? count, saved && !running,
          running && !preference.matches ? (Math.floor(now / 250) % 2 ? 1 : -1) : 0,
          progress,
        );
      }
      if (progress < 1 || (running && !preference.matches))
        frame = requestAnimationFrame(render);
    };
    const finish = () => {
      cancelAnimationFrame(frame);
      ctx.drawImage(backdrop, 0, 0);
      drawClimber(ctx, currentSlot ?? count, saved && !running);
    };
    preference.addEventListener("change", finish);
    render(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", finish);
    };
  }, [count, saved, stableSlots, currentSlot, seed, running, celebration]);
  return (
    <canvas
      ref={canvas}
      width={700}
      height={430}
      role="img"
      data-state={running ? "working" : saved ? "saved" : completed ? "completed" : "ready"}
      aria-label={`Dusk pixel mountain. ${count} ${slots ? "recorded" : "sample"} completed checkpoints have warm local light. ${running ? "Working: climber walking in place; activity earns no light." : saved ? "Saved: climber resting beside a campsite; saving earns no light." : "Climber at the current trail checkpoint."}`}
    />
  );
}
