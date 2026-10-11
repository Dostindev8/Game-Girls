/**
 * Dibujo del avatar en coordenadas lógicas 480×560.
 * El cabello trasero va antes de la cabeza; el flequillo, después y antes de la cara.
 */

import { LOGICAL_H, LOGICAL_W, isFrame } from "./state.js";

const CX = LOGICAL_W / 2;
const CY = 230;

function roundRect(ctx, x, y, w, h, r) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function drawStar(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  for (let i = 0; i < 5; i += 1) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawFlower(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  for (let i = 0; i < 5; i += 1) {
    const angle = (i * 2 * Math.PI) / 5;
    ctx.beginPath();
    ctx.ellipse(
      x + Math.cos(angle) * r * 0.6,
      y + Math.sin(angle) * r * 0.6,
      r * 0.5,
      r * 0.35,
      angle,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }
  ctx.fillStyle = "#fde047";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.35, 0, Math.PI * 2);
  ctx.fill();
}

function drawHeart(ctx, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y + size * 0.3);
  ctx.bezierCurveTo(x, y, x - size, y, x - size, y + size * 0.3);
  ctx.bezierCurveTo(
    x - size,
    y + size * 0.7,
    x,
    y + size * 1.1,
    x,
    y + size * 1.1,
  );
  ctx.bezierCurveTo(
    x,
    y + size * 1.1,
    x + size,
    y + size * 0.7,
    x + size,
    y + size * 0.3,
  );
  ctx.bezierCurveTo(x + size, y, x, y, x, y + size * 0.3);
  ctx.fill();
}

function drawScene(ctx, scene) {
  if (scene === "castle") {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    sky.addColorStop(0, "#dbeafe");
    sky.addColorStop(1, "#fef3c7");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.fillStyle = "#86efac";
    ctx.fillRect(0, 430, LOGICAL_W, 130);
    ctx.fillStyle = "#c4b5fd";
    ctx.fillRect(70, 250, 80, 200);
    ctx.fillRect(330, 230, 80, 220);
    ctx.fillRect(150, 300, 180, 160);
    ctx.fillStyle = "#8b5cf6";
    ctx.beginPath();
    ctx.moveTo(60, 250);
    ctx.lineTo(110, 180);
    ctx.lineTo(160, 250);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(320, 230);
    ctx.lineTo(370, 150);
    ctx.lineTo(420, 230);
    ctx.fill();
    ctx.fillStyle = "#7c3aed";
    ctx.fillRect(210, 360, 60, 100);
    ctx.fillStyle = "#fde68a";
    ctx.beginPath();
    ctx.arc(110, 320, 14, 0, Math.PI * 2);
    ctx.arc(370, 300, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#f472b6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(370, 150);
    ctx.lineTo(370, 110);
    ctx.stroke();
    ctx.fillStyle = "#fb7185";
    ctx.beginPath();
    ctx.moveTo(370, 110);
    ctx.lineTo(400, 122);
    ctx.lineTo(370, 134);
    ctx.fill();
    return;
  }

  if (scene === "forest") {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    sky.addColorStop(0, "#e0f2fe");
    sky.addColorStop(1, "#dcfce7");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.fillStyle = "#fde047";
    ctx.beginPath();
    ctx.arc(80, 80, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#4ade80";
    ctx.beginPath();
    ctx.ellipse(240, 470, 260, 90, 0, 0, Math.PI * 2);
    ctx.fill();
    const trees = [
      [90, 300],
      [400, 280],
      [40, 340],
    ];
    for (const [x, y] of trees) {
      ctx.fillStyle = "#166534";
      ctx.fillRect(x - 8, y + 40, 16, 50);
      ctx.fillStyle = "#15803d";
      ctx.beginPath();
      ctx.moveTo(x, y - 20);
      ctx.lineTo(x + 36, y + 50);
      ctx.lineTo(x - 36, y + 50);
      ctx.fill();
    }
    return;
  }

  if (scene === "stars") {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    sky.addColorStop(0, "#1e1b4b");
    sky.addColorStop(1, "#312e81");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.fillStyle = "#fef9c3";
    ctx.beginPath();
    ctx.arc(380, 90, 26, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#312e81";
    ctx.beginPath();
    ctx.arc(368, 84, 22, 0, Math.PI * 2);
    ctx.fill();
    const stars = [
      [40, 50, 3],
      [120, 90, 2],
      [200, 40, 3],
      [260, 110, 2],
      [80, 160, 2],
      [430, 180, 3],
      [50, 240, 2],
      [300, 60, 2],
    ];
    for (const [x, y, r] of stars) {
      ctx.fillStyle = "#fef9c3";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    return;
  }

  if (scene === "rainbow") {
    const sky = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
    sky.addColorStop(0, "#fff7ed");
    sky.addColorStop(1, "#fce7f3");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
    const bands = [
      "#ef4444",
      "#f97316",
      "#facc15",
      "#4ade80",
      "#38bdf8",
      "#a78bfa",
    ];
    bands.forEach((color, index) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 12;
      ctx.beginPath();
      ctx.arc(240, 430, 250 - index * 16, Math.PI, 0);
      ctx.stroke();
    });
    ctx.fillStyle = "#86efac";
    ctx.fillRect(0, 430, LOGICAL_W, 130);
    return;
  }

  const gradient = ctx.createLinearGradient(0, 0, 0, LOGICAL_H);
  gradient.addColorStop(0, "#fff9fc");
  gradient.addColorStop(1, "#f0e6ff");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, LOGICAL_W, LOGICAL_H);
}

function drawHairBack(ctx, state) {
  const { hairStyle } = state;
  ctx.fillStyle = state.hair;
  if (hairStyle === "bob") {
    ctx.beginPath();
    ctx.ellipse(CX, CY + 20, 110, 130, 0, Math.PI * 0.15, Math.PI * 0.85);
    ctx.fill();
  } else if (hairStyle === "long") {
    ctx.beginPath();
    ctx.moveTo(CX - 100, CY + 10);
    ctx.quadraticCurveTo(CX - 128, CY + 90, CX - 90, CY + 230);
    ctx.lineTo(CX - 58, CY + 230);
    ctx.quadraticCurveTo(CX - 78, CY + 110, CX - 72, CY + 24);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(CX + 100, CY + 10);
    ctx.quadraticCurveTo(CX + 128, CY + 90, CX + 90, CY + 230);
    ctx.lineTo(CX + 58, CY + 230);
    ctx.quadraticCurveTo(CX + 78, CY + 110, CX + 72, CY + 24);
    ctx.closePath();
    ctx.fill();
  } else if (hairStyle === "ponytail") {
    ctx.beginPath();
    ctx.moveTo(CX + 36, CY - 30);
    ctx.quadraticCurveTo(CX + 150, CY - 10, CX + 118, CY + 140);
    ctx.quadraticCurveTo(CX + 90, CY + 180, CX + 52, CY + 140);
    ctx.quadraticCurveTo(CX + 88, CY + 40, CX + 42, CY);
    ctx.fill();
  } else if (hairStyle === "pigtails") {
    ctx.beginPath();
    ctx.ellipse(CX - 118, CY + 55, 30, 66, 0.35, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CX + 118, CY + 55, 30, 66, -0.35, 0, Math.PI * 2);
    ctx.fill();
  } else if (hairStyle === "curls") {
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i += 1) {
        ctx.beginPath();
        ctx.arc(CX + side * 112, CY + 10 + i * 32, 22, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (hairStyle === "afro") {
    ctx.beginPath();
    ctx.arc(CX, CY - 4, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.globalAlpha = 0.28;
    for (let i = 0; i < 16; i += 1) {
      const angle = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(
        CX + Math.cos(angle) * 118,
        CY - 4 + Math.sin(angle) * 118,
        18,
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
    ctx.restore();
  } else if (hairStyle === "braids") {
    for (const side of [-1, 1]) {
      for (let i = 0; i < 8; i += 1) {
        ctx.beginPath();
        ctx.ellipse(
          CX + side * 112 + (i % 2 === 0 ? -8 : 8),
          CY + i * 26,
          13,
          15,
          0,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    }
  }
}

function drawHairFront(ctx, state) {
  ctx.fillStyle = state.hair;
  const cap = [
    "ponytail",
    "pigtails",
    "bun",
    "short",
    "curls",
    "braids",
  ].includes(state.hairStyle);
  if (state.hairStyle === "bob" || state.hairStyle === "long") {
    ctx.beginPath();
    ctx.moveTo(CX - 92, CY - 36);
    ctx.quadraticCurveTo(CX - 48, CY - 118, CX, CY - 102);
    ctx.quadraticCurveTo(CX + 48, CY - 118, CX + 92, CY - 36);
    ctx.quadraticCurveTo(CX + 58, CY - 20, CX + 18, CY - 34);
    ctx.quadraticCurveTo(CX, CY - 50, CX - 18, CY - 34);
    ctx.quadraticCurveTo(CX - 58, CY - 20, CX - 92, CY - 36);
    ctx.fill();
  } else if (cap) {
    ctx.beginPath();
    ctx.ellipse(CX, CY - 16, 102, 104, 0, Math.PI * 1.08, Math.PI * 1.92);
    ctx.fill();
  } else if (state.hairStyle === "afro") {
    ctx.beginPath();
    ctx.arc(CX - 30, CY - 82, 14, 0, Math.PI * 2);
    ctx.arc(CX, CY - 92, 14, 0, Math.PI * 2);
    ctx.arc(CX + 30, CY - 82, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  if (state.hairStyle === "bun") {
    ctx.beginPath();
    ctx.arc(CX, CY - 112, 40, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCape(ctx, state) {
  const cape = state.accessories.find((item) => item.id === "cape");
  if (!cape) return;
  ctx.save();
  ctx.translate(CX + cape.ox, 390 + cape.oy);
  ctx.scale(cape.scale, cape.scale);
  ctx.fillStyle = "#6d28d9";
  ctx.beginPath();
  ctx.moveTo(-78, -36);
  ctx.quadraticCurveTo(-150, 20, -118, 130);
  ctx.lineTo(118, 130);
  ctx.quadraticCurveTo(150, 20, 78, -36);
  ctx.quadraticCurveTo(0, -8, -78, -36);
  ctx.fill();
  ctx.restore();
}

function drawBody(ctx, state) {
  ctx.fillStyle = state.skin;
  ctx.beginPath();
  ctx.ellipse(CX, CY + 130, 38, 50, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = state.dress;
  ctx.beginPath();
  ctx.moveTo(CX - 110, CY + 155);
  ctx.quadraticCurveTo(CX - 90, CY + 120, CX - 50, CY + 145);
  ctx.lineTo(CX + 50, CY + 145);
  ctx.quadraticCurveTo(CX + 90, CY + 120, CX + 110, CY + 155);
  ctx.quadraticCurveTo(CX + 130, CY + 220, CX + 100, CY + 280);
  ctx.lineTo(CX - 100, CY + 280);
  ctx.quadraticCurveTo(CX - 130, CY + 220, CX - 110, CY + 155);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.25)";
  ctx.beginPath();
  ctx.ellipse(CX - 30, CY + 190, 25, 40, -0.3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = state.skin;
  ctx.beginPath();
  ctx.ellipse(CX, CY, 95, 110, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(CX - 95, CY + 10, 18, 28, 0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(CX + 95, CY + 10, 18, 28, -0.2, 0, Math.PI * 2);
  ctx.fill();
}

function drawEye(ctx, x, y, state, runtime) {
  if (runtime.blink) {
    ctx.strokeStyle = "#2d1b14";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - 18, y);
    ctx.quadraticCurveTo(x, y + 8, x + 18, y);
    ctx.stroke();
    return;
  }

  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  if (state.eyeStyle === "almond") ctx.ellipse(x, y, 22, 16, 0, 0, Math.PI * 2);
  else if (state.eyeStyle === "round") ctx.arc(x, y, 20, 0, Math.PI * 2);
  else ctx.ellipse(x, y, 24, 20, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = state.eyes;
  ctx.beginPath();
  ctx.arc(x, y + 2, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#1a1a2e";
  ctx.beginPath();
  ctx.arc(x, y + 3, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.beginPath();
  ctx.arc(x - 4, y - 2, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 5, y + 4, 2.5, 0, Math.PI * 2);
  ctx.fill();

  if (state.lashStyle !== "none") {
    ctx.strokeStyle = "#2d1b14";
    ctx.lineWidth = state.lashStyle === "long" ? 2.2 : 1.5;
    ctx.lineCap = "round";
    const len = state.lashStyle === "long" ? 14 : 8;
    for (let i = -2; i <= 2; i += 1) {
      ctx.beginPath();
      ctx.moveTo(x + i * 8, y - 16);
      ctx.quadraticCurveTo(
        x + i * 10,
        y - 16 - len,
        x + i * 6,
        y - 16 - len * 0.6,
      );
      ctx.stroke();
    }
  }
}

function drawLips(ctx, x, y, state, runtime) {
  if (runtime.mouthOpen) {
    ctx.fillStyle = "#7f1d1d";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = state.lips;
    ctx.beginPath();
    ctx.ellipse(x, y - 4, 20, 7, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.fillStyle = state.lips;
  ctx.beginPath();
  if (state.lipStyle === "thin") {
    ctx.ellipse(x, y, 22, 8, 0, 0, Math.PI * 2);
  } else if (state.lipStyle === "heart") {
    ctx.moveTo(x, y + 6);
    ctx.quadraticCurveTo(x - 25, y - 12, x - 18, y - 4);
    ctx.quadraticCurveTo(x - 8, y - 14, x, y - 2);
    ctx.quadraticCurveTo(x + 8, y - 14, x + 18, y - 4);
    ctx.quadraticCurveTo(x + 25, y - 12, x, y + 6);
  } else {
    ctx.moveTo(x - 28, y);
    ctx.quadraticCurveTo(x - 20, y - 14, x, y - 8);
    ctx.quadraticCurveTo(x + 20, y - 14, x + 28, y);
    ctx.quadraticCurveTo(x + 15, y + 16, x, y + 12);
    ctx.quadraticCurveTo(x - 15, y + 16, x - 28, y);
  }
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(x - 6, y - 2, 8, 4, -0.3, 0, Math.PI * 2);
  ctx.fill();
}

function drawFace(ctx, state, runtime) {
  if (state.blush !== "none") {
    const alpha = state.blush === "soft" ? 0.25 : 0.45;
    ctx.fillStyle = `rgba(255, 150, 150, ${alpha})`;
    ctx.beginPath();
    ctx.ellipse(CX - 55, CY + 25, 28, 16, 0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(CX + 55, CY + 25, 28, 16, -0.2, 0, Math.PI * 2);
    ctx.fill();
  }
  drawEye(ctx, CX - 38, CY - 10, state, runtime);
  drawEye(ctx, CX + 38, CY - 10, state, runtime);
  ctx.fillStyle = "#e8b4a0";
  ctx.beginPath();
  ctx.ellipse(CX, CY + 25, 8, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  drawLips(ctx, CX, CY + 55, state, runtime);
}

function drawPhoto(ctx, image, state) {
  const maxW = LOGICAL_W * 0.92;
  const maxH = LOGICAL_H * 0.92;
  const scale =
    Math.min(maxW / image.width, maxH / image.height) * state.photoScale;
  const dw = image.width * scale;
  const dh = image.height * scale;
  const dx = (LOGICAL_W - dw) / 2 + state.photoOffsetX;
  const dy = (LOGICAL_H - dh) / 2 + state.photoOffsetY;
  ctx.save();
  roundRect(ctx, 16, 16, LOGICAL_W - 32, LOGICAL_H - 32, 28);
  ctx.clip();
  ctx.drawImage(image, dx, dy, dw, dh);
  ctx.restore();
}

function accessoryAnchor(id) {
  switch (id) {
    case "crown":
      return { x: CX, y: CY - 95 };
    case "cape":
      return { x: CX, y: 390 };
    case "unicorn":
      return { x: CX + 15, y: CY - 100 };
    case "flower":
      return { x: CX - 85, y: CY - 70 };
    case "star":
      return { x: CX + 90, y: CY - 120 };
    case "wand":
      return { x: CX + 122, y: CY - 10 };
    case "sparkle":
      return { x: CX, y: CY - 90 };
    case "heart":
      return { x: CX, y: CY + 36 };
    case "bow":
      return { x: CX - 115, y: CY - 22 };
    case "glasses":
      return { x: CX, y: CY - 10 };
    default:
      return { x: CX, y: CY };
  }
}

const HIT_RADIUS = {
  sparkle: 76,
  wand: 58,
  flower: 52,
  heart: 52,
  cape: 78,
  crown: 52,
};

function paintAccessory(ctx, id) {
  if (id === "crown") {
    ctx.fillStyle = "#fbbf24";
    ctx.strokeStyle = "#d97706";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-70, 0);
    ctx.lineTo(-55, -50);
    ctx.lineTo(-30, -15);
    ctx.lineTo(0, -60);
    ctx.lineTo(30, -15);
    ctx.lineTo(55, -50);
    ctx.lineTo(70, 0);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    const gems = [
      [-55, -40, "#ef4444"],
      [0, -50, "#3b82f6"],
      [55, -40, "#22c55e"],
    ];
    for (const [gx, gy, color] of gems) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(gx, gy, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      ctx.beginPath();
      ctx.arc(gx - 2, gy - 2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (id === "unicorn") {
    ctx.fillStyle = "#f0abfc";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(12, -70);
    ctx.lineTo(28, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#e879f9";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(8, -5);
    ctx.quadraticCurveTo(22, -25, 10, -45);
    ctx.quadraticCurveTo(25, -55, 18, -65);
    ctx.stroke();
  } else if (id === "flower") {
    drawFlower(ctx, 0, 0, 18, "#f9a8d4");
    drawFlower(ctx, 165, 15, 14, "#fda4af");
  } else if (id === "star") {
    drawStar(ctx, 0, 0, 16, "#fde047");
    drawStar(ctx, -185, -10, 12, "#fef08a");
  } else if (id === "wand") {
    ctx.strokeStyle = "#a78bfa";
    ctx.lineWidth = 6;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-22, 50);
    ctx.lineTo(23, -50);
    ctx.stroke();
    drawStar(ctx, 28, -60, 14, "#fbbf24");
  } else if (id === "sparkle") {
    const sparks = [
      [-120, 50],
      [125, 70],
      [-70, -50],
      [60, -60],
      [-30, -70],
      [20, -75],
    ];
    sparks.forEach(([sx, sy], index) => {
      drawStar(
        ctx,
        sx,
        sy,
        7 + (index % 3) * 2,
        index % 2 === 0 ? "#fde047" : "#f0abfc",
      );
    });
  } else if (id === "heart") {
    drawHeart(ctx, -100, -6, 16, "#fb7185");
    drawHeart(ctx, 105, 9, 13, "#f472b6");
  } else if (id === "bow") {
    ctx.fillStyle = "#f472b6";
    ctx.beginPath();
    ctx.ellipse(10, 2, 18, 12, -0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(-10, -3, 18, 12, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
  } else if (id === "glasses") {
    ctx.strokeStyle = "#1e1b4b";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(-38, 0, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(38, 0, 26, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.lineTo(12, 0);
    ctx.stroke();
  }
}

function drawAccessories(ctx, state, runtime) {
  for (const acc of state.accessories) {
    if (acc.id === "cape" || isFrame(acc.id)) continue;
    const anchor = accessoryAnchor(acc.id);
    ctx.save();
    ctx.translate(anchor.x + acc.ox, anchor.y + acc.oy);
    ctx.scale(acc.scale, acc.scale);
    paintAccessory(ctx, acc.id);
    if (runtime.selectedId === acc.id) {
      ctx.strokeStyle = "#7c3aed";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, 42, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

function drawFrames(ctx, state) {
  const ids = new Set(state.accessories.map((item) => item.id));
  if (ids.has("frame-round")) {
    ctx.strokeStyle = "#f9a8d4";
    ctx.lineWidth = 14;
    roundRect(ctx, 18, 18, LOGICAL_W - 36, LOGICAL_H - 36, 36);
    ctx.stroke();
  }
  if (ids.has("frame-stars")) {
    for (let i = 0; i < 8; i += 1) {
      const x = 36 + (i % 4) * 130;
      const y = i < 4 ? 28 : LOGICAL_H - 28;
      drawStar(ctx, x, y, 12, "#fde047");
    }
  }
  if (ids.has("frame-hearts")) {
    for (let i = 0; i < 6; i += 1) {
      drawHeart(ctx, 36 + i * 74, 16, 10, "#fb7185");
      drawHeart(ctx, 36 + i * 74, LOGICAL_H - 48, 10, "#f472b6");
    }
  }
}

function paintStatic(ctx, state, runtime) {
  drawScene(ctx, state.scene);
  if (runtime.photo) {
    drawPhoto(ctx, runtime.photo, state);
    return;
  }
  drawHairBack(ctx, state);
  drawCape(ctx, state);
  drawBody(ctx, state);
  drawHairFront(ctx, state);
}

function paintDynamic(ctx, state, runtime) {
  if (!runtime.photo) drawFace(ctx, state, runtime);
  drawAccessories(ctx, state, runtime);
  drawFrames(ctx, state);
}

function staticKey(state, runtime, dpr) {
  const cape = state.accessories.find((item) => item.id === "cape");
  return [
    state.scene,
    state.skin,
    state.hair,
    state.dress,
    state.hairStyle,
    cape ? `${cape.ox},${cape.oy},${cape.scale}` : "-",
    runtime.photo ? runtime.photoGen : 0,
    state.photoScale,
    state.photoOffsetX,
    state.photoOffsetY,
    dpr,
  ].join("|");
}

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");
  let dpr = 1;
  let cache = null;
  let cacheKey = "";

  function resize() {
    const next = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(LOGICAL_W * next);
    const height = Math.round(LOGICAL_H * next);
    if (canvas.width !== width || canvas.height !== height || next !== dpr) {
      dpr = next;
      canvas.width = width;
      canvas.height = height;
      cacheKey = "";
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function bake(state, runtime) {
    const width = Math.round(LOGICAL_W * dpr);
    const height = Math.round(LOGICAL_H * dpr);
    if (!cache || cache.width !== width || cache.height !== height) {
      cache = document.createElement("canvas");
      cache.width = width;
      cache.height = height;
    }
    const baked = cache.getContext("2d");
    baked.setTransform(dpr, 0, 0, dpr, 0, 0);
    baked.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    paintStatic(baked, state, runtime);
  }

  function render(state, runtime) {
    resize();
    const key = staticKey(state, runtime, dpr);
    if (key !== cacheKey) {
      bake(state, runtime);
      cacheKey = key;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, LOGICAL_W, LOGICAL_H);
    ctx.drawImage(cache, 0, 0, LOGICAL_W, LOGICAL_H);
    paintDynamic(ctx, state, runtime);
  }

  function exportCanvas(state, runtime) {
    const surface = document.createElement("canvas");
    surface.width = LOGICAL_W * 2;
    surface.height = LOGICAL_H * 2;
    const exported = surface.getContext("2d");
    exported.setTransform(2, 0, 0, 2, 0, 0);
    paintStatic(exported, state, runtime);
    paintDynamic(exported, state, {
      ...runtime,
      blink: false,
      mouthOpen: false,
      selectedId: null,
    });
    return surface;
  }

  function hitTest(state, x, y) {
    for (let index = state.accessories.length - 1; index >= 0; index -= 1) {
      const acc = state.accessories[index];
      if (isFrame(acc.id)) continue;
      const anchor = accessoryAnchor(acc.id);
      const radius = (HIT_RADIUS[acc.id] || 42) * acc.scale;
      const dx = x - (anchor.x + acc.ox);
      const dy = y - (anchor.y + acc.oy);
      if (dx * dx + dy * dy <= radius * radius) return acc;
    }
    return null;
  }

  function toLogical(event) {
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 1;
    const height = rect.height || 1;
    return {
      x: ((event.clientX - rect.left) / width) * LOGICAL_W,
      y: ((event.clientY - rect.top) / height) * LOGICAL_H,
    };
  }

  return {
    resize,
    render,
    exportCanvas,
    hitTest,
    toLogical,
    invalidate() {
      cacheKey = "";
    },
  };
}
