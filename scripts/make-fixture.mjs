import { createRequire } from "node:module";
import { writeFileSync } from "node:fs";

const require = createRequire(import.meta.url);
const jpeg = require("jpeg-js");
const piexif = require("piexifjs");

const width = 40;
const height = 20;
const data = Buffer.alloc(width * height * 4);
for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const index = (y * width + x) * 4;
    const left = x < width / 2;
    data[index] = left ? 220 : 10;
    data[index + 1] = 10;
    data[index + 2] = left ? 10 : 220;
    data[index + 3] = 255;
  }
}

const encoded = jpeg.encode({ data, width, height }, 95);
const binary = Buffer.from(encoded.data).toString("binary");
const exif = piexif.dump({ "0th": { [piexif.ImageIFD.Orientation]: 6 } });
const inserted = piexif.insert(exif, binary);
writeFileSync(
  "tests/fixtures/exif-orientation-6.jpg",
  Buffer.from(inserted, "binary"),
);
console.log("fixture ok");
