"use client";
import { useEffect, useRef, useMemo } from "react";
import { drawTerrain } from "@/lib/terrain";
export default function MountainWorld({
  count,
  saved,
  slots,
  currentSlot,
  seed,
  running = false,
}: {
  count: number;
  saved: boolean;
  slots?: number[];
  currentSlot?: number;
  seed?: string;
  running?: boolean;
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
    const start = performance.now();
    const earnedNewLight = count > previousCount.current;
    previousCount.current = count;
    const render = (now: number) => {
      const progress =
        preference.matches || !earnedNewLight
          ? 1
          : Math.min(1, (now - start) / 420);
      drawTerrain(
        ctx,
        count,
        saved || running,
        progress,
        stableSlots,
        currentSlot,
        seed,
        running && !preference.matches ? Math.round(Math.sin(now / 450)) : 0,
      );
      if (progress < 1 || (running && !preference.matches))
        frame = requestAnimationFrame(render);
    };
    const finish = () => {
      cancelAnimationFrame(frame);
      drawTerrain(
        ctx,
        count,
        saved || running,
        1,
        stableSlots,
        currentSlot,
        seed,
      );
    };
    preference.addEventListener("change", finish);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", finish);
    };
  }, [count, saved, stableSlots, currentSlot, seed, running]);
  return (
    <canvas
      ref={canvas}
      width={700}
      height={430}
      role="img"
      aria-label={`Dusk pixel mountain with pine trees, a future switchback path, lake and waterfall. ${count} ${slots ? "recorded" : "sample"} completed checkpoints have warm local light.${saved ? " A coral-coated climber waits inside the pale blue saved-position marker; saving earns no light." : count || running ? " The coral-coated climber marks the current position beyond the completed path." : " No completed work."}`}
    />
  );
}
