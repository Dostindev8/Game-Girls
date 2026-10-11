import fs from "node:fs";
import { PALETTES } from "../js/state.js";

const hexes = new Set();
for (const group of Object.values(PALETTES)) {
  for (const color of group) hexes.add(color.hex);
}

const rules = [...hexes]
  .map((hex) => `.swatch[data-color="${hex}"] { background: ${hex}; }`)
  .join("\n");
const file = "css/styles.css";
const css = fs.readFileSync(file, "utf8");
const next = css.replace(
  /\/\* SWATCHES-START \*\/[\s\S]*\/\* SWATCHES-END \*\//,
  `/* SWATCHES-START */\n${rules}\n/* SWATCHES-END */`,
);
fs.writeFileSync(file, next);
console.log(`swatches ${hexes.size}`);
