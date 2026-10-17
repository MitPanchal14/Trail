"use client";
import { useEffect, useRef, useMemo } from "react";
import { drawTerrain, drawClimber, climberPosition, drawSummit } from "@/lib/terrain";
export default function MountainWorld({
  count,
  saved,
  slots,
  currentSlot,
  seed,
  running = false,
  celebration = false,
  completed = count > 0,
  positionSlot,
  summit = false,
  historicalSummit = false,
  summitPending = false,
}: {
  count: number;
  saved: boolean;
  slots?: number[];
  currentSlot?: number;
  seed?: string;
  running?: boolean;
  celebration?: boolean;
  completed?: boolean;
  positionSlot?: number | null;
  summit?: boolean;
  historicalSummit?: boolean;
  summitPending?: boolean;
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
  const earnedSlot = positionSlot === undefined ? (currentSlot ?? count) : positionSlot;
  const actorSlot = summit ? "summit" : earnedSlot;
  const previousPosition = useRef<{ seed: string | undefined; slot: number | null | "summit" }>({ seed, slot: actorSlot });
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
    const sceneSlot = earnedSlot ?? 0;
    drawTerrain(base, count, false, 1, stableSlots, sceneSlot, seed, 0, true);
    drawSummit(base, historicalSummit, summitPending, earnedSlot);
    const start = performance.now();
    const from = previousPosition.current;
    const earnedNewLight = seed === from.seed && ((celebration && count > previousCount.current) || (summit && from.slot !== "summit"));
    previousPosition.current = { seed, slot: actorSlot };
    previousCount.current = count;
    const render = (now: number) => {
      const progress =
        preference.matches || !earnedNewLight
          ? 1
          : Math.min(1, (now - start) / 850);
      if (now - lastDraw >= 100 || (progress === 1 && !running)) {
        lastDraw = now;
        if (progress < 1 && !summit) {
          drawTerrain(ctx, count, false, progress, stableSlots, sceneSlot, seed, 0, true, sceneSlot);
          drawSummit(ctx, historicalSummit, summitPending, earnedSlot);
        } else ctx.drawImage(backdrop, 0, 0);
        drawClimber(
          ctx, actorSlot, saved && !running,
          running && !preference.matches ? (Math.floor(now / 250) % 2 ? 1 : -1) : 0,
          progress,
          from.slot,
        );
      }
      if (progress < 1 || (running && !preference.matches))
        frame = requestAnimationFrame(render);
    };
    const finish = () => {
      cancelAnimationFrame(frame);
      ctx.drawImage(backdrop, 0, 0);
      drawClimber(ctx, actorSlot, saved && !running);
    };
    preference.addEventListener("change", finish);
    render(performance.now());
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", finish);
    };
  }, [count, saved, stableSlots, currentSlot, seed, running, celebration, actorSlot, earnedSlot, summit, historicalSummit, summitPending]);
  return (
    <canvas
      ref={canvas}
      width={700}
      height={430}
      role="img"
      data-position={climberPosition(actorSlot).join(",")}
      data-segment={Math.floor((earnedSlot ?? 0) / 11)}
      data-summit={summit ? "reached" : summitPending ? "pending" : historicalSummit ? "historical" : "none"}
      data-state={running ? "working" : saved ? "saved" : completed ? "completed" : "ready"}
      aria-label={`Dusk pixel mountain. ${count} ${slots ? "recorded" : "sample"} completed checkpoints have warm local light. ${summit ? "Summit reached after goal confirmation." : summitPending ? "All planned steps complete; summit awaits finish-condition confirmation." : historicalSummit ? "Reopened goal; summit flag records a previous achievement." : running ? "Working: climber walking in place; activity earns no light." : saved ? "Saved: climber resting beside a campsite; saving earns no light." : "Climber at the current trail checkpoint."}`}
    />
  );
}
