"use client";
import { useEffect, useRef } from "react";
import { drawTerrain } from "@/lib/terrain";
export default function MountainWorld({
  count,
  saved,
}: {
  count: number;
  saved: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const ctx = canvas.current?.getContext("2d");
    if (!ctx) return;
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const start = performance.now();
    const render = (now: number) => {
      const progress = preference.matches
        ? 1
        : Math.min(1, (now - start) / 420);
      drawTerrain(ctx, count, saved, progress);
      if (progress < 1) frame = requestAnimationFrame(render);
    };
    const finish = () => {
      cancelAnimationFrame(frame);
      drawTerrain(ctx, count, saved);
    };
    preference.addEventListener("change", finish);
    frame = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(frame);
      preference.removeEventListener("change", finish);
    };
  }, [count, saved]);
  return (
    <canvas
      ref={canvas}
      width={700}
      height={430}
      role="img"
      aria-label={`Dusk pixel mountain with pine trees, a future switchback path, lake and waterfall. ${count} sample completed checkpoints have warm local light.${saved ? " A coral-coated climber waits inside the pale blue saved-position marker; saving earns no light." : count ? " The coral-coated climber marks the current position beyond the completed path." : " No completed work."}`}
    />
  );
}
