// Original deterministic scenery; samples alone supply checkpoint illumination.
const trail = [
  [18, 43],
  [20, 40],
  [22, 37],
  [20, 34],
  [23, 31],
  [26, 29],
  [24, 26],
  [27, 23],
  [29, 20],
  [27, 17],
  [28, 14],
];
export function checkpointPosition(slot: number) {
  return [...trail[slot % trail.length]];
}
function height(u: number, v: number) {
  return (
    Math.floor(
      (Math.exp(-((u - 28) ** 2 / 100 + (v - 20) ** 2 / 120)) * 115 +
        Math.exp(-((u - 16) ** 2 / 65 + (v - 29) ** 2 / 90)) * 46 +
        Math.exp(-((u - 37) ** 2 / 60 + (v - 32) ** 2 / 50)) * 44) /
        4,
    ) *
      4 +
    6
  );
}
function pos(u: number, v: number) {
  return [350 + (u - v) * 6, 45 + (u + v) * 3 - height(u, v)];
}
function noise(u: number, v: number) {
  const n = Math.sin(u * 127.1 + v * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
export function drawTerrain(
  ctx: CanvasRenderingContext2D,
  count: number,
  saved: boolean,
  light = 1,
  slots = Array.from({ length: count }, (_, i) => i),
  currentSlot = count,
  seed = "",
  bob = 0,
  hideActor = false,
  revealSlot?: number,
) {
  const segment = Math.floor(currentSlot / trail.length);
  const earned = slots
    .filter((slot) => Math.floor(slot / trail.length) === segment)
    .map(checkpointPosition);
  const seedOffset =
    Array.from(seed).reduce((sum, c) => sum + c.charCodeAt(0), 0) % 101;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#829b9e";
  ctx.fillRect(0, 0, 700, 430);
  ctx.fillStyle = "#dfd5a8";
  ctx.fillRect(558, 35, 30, 30);
  ctx.fillRect(552, 41, 42, 18);
  ctx.fillStyle = "#adc2b2";
  [
    [65, 67],
    [430, 57],
    [595, 120],
  ].forEach(([x, y]) => {
    ctx.fillRect(x, y, 54, 6);
    ctx.fillRect(x + 12, y - 6, 28, 6);
  });
  ctx.fillStyle = "#748f87";
  ctx.beginPath();
  ctx.moveTo(0, 270);
  [
    [0, 227],
    [70, 173],
    [118, 205],
    [178, 142],
    [260, 228],
    [450, 199],
    [540, 156],
    [700, 219],
    [700, 430],
    [0, 430],
  ].forEach(([x, y]) => ctx.lineTo(x, y));
  ctx.fill();
  ctx.fillStyle = "#50868e";
  ctx.fillRect(0, 270, 700, 160);
  for (let i = 0; i < 80; i++) {
    ctx.fillStyle = i % 2 ? "#77999a" : "#4c838b";
    ctx.fillRect((i * 97) % 700, 278 + ((i * 37) % 150), 12 + (i % 4) * 9, 2);
  }
  ctx.fillStyle = "#426e72";
  ctx.beginPath();
  ctx.ellipse(350, 315, 210, 38, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let sum = 0; sum < 103; sum++)
    for (let u = 0; u < 52; u++) {
      const v = sum - u;
      if (v < 0 || v >= 52 || (u - 26) ** 2 / 580 + (v - 26) ** 2 / 550 > 1)
        continue;
      const [x, y] = pos(u, v),
        h = height(u, v),
        n = noise(u + seedOffset, v);
      ctx.fillStyle = "#526e50";
      ctx.fillRect(x - 6, y, 6, 7);
      ctx.fillStyle = "#3f5945";
      ctx.fillRect(x, y, 6, 7);
      const lit =
        earned.some(([a, b]) => {
          const revealing = revealSlot !== undefined && checkpointPosition(revealSlot).join() === [a, b].join();
          return Math.hypot(u - a, v - b) < 6.5 * (revealing ? light : 1);
        });
      ctx.fillStyle = lit
        ? ["#bdaf70", "#a4ad69", "#dec47f"][Math.floor(n * 3)]
        : h > 91
          ? ["#849789", "#a7b39c", "#6d877a"][Math.floor(n * 3)]
          : ["#5a7959", "#769068", "#647e5d", "#496b50"][Math.floor(n * 4)];
      ctx.beginPath();
      ctx.moveTo(x, y - 3);
      ctx.lineTo(x + 6, y);
      ctx.lineTo(x, y + 3);
      ctx.lineTo(x - 6, y);
      ctx.fill();
      if (h % 16 === 6) {
        ctx.fillStyle = "#536e4c22";
        ctx.fillRect(x - 4, y + 2, 8, 1);
      }
      if (n > 0.96 && h < 80) {
        ctx.fillStyle = "#c5ca97";
        ctx.fillRect(x, y - 1, 2, 1);
      }
    }
  ctx.strokeStyle = "#b5b49d";
  ctx.lineWidth = 4;
  ctx.lineJoin = "bevel";
  ctx.beginPath();
  trail.forEach(([u, v], i) => {
    const [x, y] = pos(u, v);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  if (count && light) {
    ctx.strokeStyle = "#dec47f";
    ctx.lineWidth = 5;
    ctx.beginPath();
    earned.forEach(([u, v], i) => {
      const [x, y] = pos(u, v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  for (let sum = 0; sum < 100; sum++)
    for (let u = 4; u < 49; u += 3) {
      const v = sum - u;
      if (
        v < 4 ||
        v > 48 ||
        v % 3 !== 1 ||
        noise(u + seedOffset, v) < 0.37 ||
        height(u, v) > 88 ||
        (u - 26) ** 2 / 460 + (v - 26) ** 2 / 450 > 1 ||
        trail.some(([a, b]) => Math.hypot(u - a, v - b) < 2.8)
      )
        continue;
      const [x, y] = pos(u, v),
        s = noise(v, u) > 0.5 ? 1.3 : 1;
      ctx.fillStyle = "#5c6041";
      ctx.fillRect(x - 1, y - 7 * s, 3, 9 * s);
      ctx.fillStyle = "#244d3b";
      ctx.fillRect(x - 7 * s, y - 13 * s, 14 * s, 6 * s);
      ctx.fillRect(x - 5 * s, y - 20 * s, 10 * s, 8 * s);
      ctx.fillRect(x - 2 * s, y - 26 * s, 4 * s, 8 * s);
      ctx.fillStyle = "#376649";
      ctx.fillRect(x - 7 * s, y - 13 * s, 7 * s, 4 * s);
      ctx.fillRect(x - 5 * s, y - 20 * s, 5 * s, 7 * s);
      ctx.fillStyle = "#719066";
      ctx.fillRect(x - 2 * s, y - 23 * s, 2 * s, 5 * s);
    }
  const [wx, wy] = pos(42, 28);
  ctx.fillStyle = "#b1d6ca";
  ctx.fillRect(wx - 2, wy, 8, 36);
  ctx.fillStyle = "#78b5b6";
  ctx.fillRect(wx, wy, 4, 39);
  ctx.fillStyle = "#d8e5cd";
  ctx.fillRect(wx - 6, wy + 36, 16, 3);
  earned.forEach(([u, v]) => {
    const [x, y] = pos(u, v);
    ctx.fillStyle = "#dec47f66";
    ctx.fillRect(x - 10, y - 9, 20, 15);
    ctx.fillStyle = "#745e36";
    ctx.fillRect(x - 2, y - 8, 4, 9);
    ctx.fillStyle = "#ffe5a0";
    ctx.fillRect(x - 3, y - 10, 6, 5);
  });
  if (!hideActor && (count || saved)) drawClimber(ctx, currentSlot, saved, bob);
}

export function climberPosition(slot: number | null): number[] {
  if (slot === null) { const start = pos(...checkpointPosition(0) as [number, number]); return [start[0] - 45, start[1] + 22]; }
  const point = checkpointPosition(slot);
  return pos(point[0], point[1]);
}
export function drawClimber(ctx: CanvasRenderingContext2D, slot: number | null, resting: boolean, bob = 0, travel = 1, fromSlot: number | null = null) {
    // Overlay output must not depend on whether a terrain reveal ran before it.
    ctx.imageSmoothingEnabled = false;
    ctx.lineJoin = "bevel";
    const target = climberPosition(slot), origin = climberPosition(fromSlot);
    const x = Math.round(origin[0] + (target[0] - origin[0]) * travel);
    const restingY = Math.round(origin[1] + (target[1] - origin[1]) * travel);
    const y = restingY + bob;
    // Cool outlined resting marker is distinct from warm completed lanterns.
    ctx.strokeStyle = "#c4e3ee";
    ctx.lineWidth = 3;
    ctx.strokeRect(x - 12, y - 5, 24, 10);
    if (resting) {
      // A cool canvas tent and seated pose, never a completed lantern.
      ctx.fillStyle = "#c4e3ee";
      ctx.beginPath(); ctx.moveTo(x + 14, y); ctx.lineTo(x + 25, y - 18); ctx.lineTo(x + 38, y); ctx.fill();
      ctx.fillStyle = "#426e72"; ctx.fillRect(x + 24, y - 10, 6, 10);
      ctx.save(); ctx.translate(0, 8);
    }
    ctx.fillStyle = "#182b29";
    ctx.fillRect(x - 6, y - 33, 12, 30);
    ctx.fillStyle = "#f0e6c1";
    ctx.fillRect(x - 5, y - 33, 10, 5);
    ctx.fillRect(x - 8, y - 29, 15, 3);
    ctx.fillStyle = "#edc69a";
    ctx.fillRect(x - 3, y - 26, 7, 6);
    ctx.fillStyle = "#ed986e";
    ctx.fillRect(x - 5, y - 20, 10, 13);
    ctx.fillStyle = "#d7eaf0";
    ctx.fillRect(x - 9, y - 20, 5, 10);
    ctx.fillStyle = "#182b29";
    ctx.fillRect(x - 5 - bob * 2, y - 7, 4, resting ? 3 : 8);
    ctx.fillRect(x + 2 + bob * 2, y - 7, resting ? 9 : 4, resting ? 3 : 8);
    ctx.fillStyle = "#edf0db";
    ctx.fillRect(x + 9, y - 20, 2, 22);
    if (resting) ctx.restore();
    if (bob) {
      ctx.fillStyle = "#b1d6ca";
      ctx.fillRect(x - 29, restingY + 5 + bob * 2, 9, 2);
    }
}
