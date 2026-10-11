import { deflateSync } from "node:zlib";
import { writeFileSync } from "node:fs";

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i += 1) {
    c ^= buf[i];
    for (let k = 0; k < 8; k += 1) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}

function chunk(type, data) {
  const t = Buffer.from(type);
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([t, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

function inCrown(x, y, size) {
  const nx = (x / size - 0.5) * 2;
  const ny = (y / size - 0.5) * 2;
  if (ny < -0.05 || ny > 0.42 || Math.abs(nx) > 0.55) return false;
  const peaks = [-0.38, 0, 0.38];
  for (const peak of peaks) {
    const dist = Math.abs(nx - peak);
    const tip = peak === 0 ? -0.42 : -0.28;
    if (dist < 0.16 && ny < 0.2 && ny > tip + dist * 1.6) return true;
  }
  return ny > 0.12 && ny < 0.38 && Math.abs(nx) < 0.5;
}

function paint(size) {
  const img = new Uint8Array(size * size * 4);
  const cx = (size - 1) / 2;
  const cy = (size - 1) / 2;
  const radius = size * 0.46;
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = x - cx;
      const dy = y - cy;
      const i = (y * size + x) * 4;
      if (dx * dx + dy * dy > radius * radius) continue;
      const t = y / size;
      img[i] = 255;
      img[i + 1] = Math.round(214 - t * 30);
      img[i + 2] = Math.round(232 - t * 10);
      img[i + 3] = 255;
      if (inCrown(x, y, size)) {
        img[i] = 251;
        img[i + 1] = 191;
        img[i + 2] = 36;
      }
    }
  }
  return img;
}

function encodePNG(size) {
  const pixels = paint(size);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y += 1) {
    const offset = y * (size * 4 + 1);
    raw[offset] = 0;
    pixels
      .subarray(y * size * 4, (y + 1) * size * 4)
      .forEach((value, index) => {
        raw[offset + 1 + index] = value;
      });
  }
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

writeFileSync("assets/icons/icon-192.png", encodePNG(192));
writeFileSync("assets/icons/icon-512.png", encodePNG(512));
console.log("icons ok");
