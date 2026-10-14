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
) {
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = "#93a9aa";
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
  ctx.fillStyle = "#5b969b";
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
        n = noise(u, v);
      ctx.fillStyle = "#526e50";
      ctx.fillRect(x - 6, y, 6, 7);
      ctx.fillStyle = "#3f5945";
      ctx.fillRect(x, y, 6, 7);
      const lit =
        light > 0 &&
        trail
          .slice(0, count)
          .some(([a, b]) => Math.hypot(u - a, v - b) < 6.5 * light);
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
    trail.slice(0, count).forEach(([u, v], i) => {
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
        noise(u, v) < 0.37 ||
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
  trail.slice(0, count).forEach(([u, v]) => {
    const [x, y] = pos(u, v);
    ctx.fillStyle = "#dec47f66";
    ctx.fillRect(x - 10, y - 9, 20, 15);
    ctx.fillStyle = "#745e36";
    ctx.fillRect(x - 2, y - 8, 4, 9);
    ctx.fillStyle = "#ffe5a0";
    ctx.fillRect(x - 3, y - 10, 6, 5);
  });
  if (count || saved) {
    const [x, y] = pos(
      trail[Math.min(count, 9)][0],
      trail[Math.min(count, 9)][1],
    );
    // Cool outlined resting marker is distinct from warm completed lanterns.
    ctx.strokeStyle = "#d2edf0";
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 12, y - 5, 24, 10);
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
    ctx.fillRect(x - 5, y - 7, 4, 8);
    ctx.fillRect(x + 2, y - 7, 4, 8);
    ctx.fillStyle = "#edf0db";
    ctx.fillRect(x + 9, y - 20, 2, 22);
  }
}
