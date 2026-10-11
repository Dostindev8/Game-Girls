import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
import { PALETTES } from "../js/state.js";

const html = readFileSync("index.html", "utf8");
const css = readFileSync("css/styles.css", "utf8");

test("el HTML no depende de terceros ni bloquea el zoom", () => {
  assert.equal(html.includes("googleapis"), false);
  assert.equal(html.includes("maximum-scale"), false);
  assert.equal(html.includes("user-scalable"), false);
  assert.equal(html.includes("onclick"), false);
  assert.equal(/<style[\s>]/.test(html), false);
  assert.match(html, /Content-Security-Policy/);
  assert.match(html, /script-src 'self'/);
  assert.match(html, /connect-src 'none'/);
  assert.equal(html.includes("Tu foto se queda en tu dispositivo"), true);
});

test("cada color de la paleta tiene una clase CSS", () => {
  for (const group of Object.values(PALETTES)) {
    for (const color of group) assert.equal(css.includes(color.hex), true);
  }
});

test("el service worker lista las fuentes locales", () => {
  const worker = readFileSync("sw.js", "utf8");
  for (const file of readdirSync("assets/fonts")) {
    assert.equal(worker.includes(file), true);
  }
  assert.match(worker, /avatar-magico-v1/);
});
