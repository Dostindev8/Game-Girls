import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir } from "node:fs/promises";

const mode = process.argv[2] === "before" ? "before" : "after";
const port = mode === "before" ? 4180 : 4173;
const root = mode === "before" ? "princess-avatar-creator" : ".";
const out = `docs/captures/${mode}`;
await mkdir(out, { recursive: true });

const server = spawn(process.execPath, ["scripts/serve.mjs", root], {
  env: { ...process.env, PORT: String(port) },
  stdio: "ignore",
});

function waitForServer() {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/`);
        if (response.ok || response.status === 404) {
          resolve();
          return;
        }
      } catch {
        /* todavía no escucha */
      }
      if (Date.now() - started > 8000) {
        reject(new Error("el servidor no arrancó"));
        return;
      }
      setTimeout(tick, 150);
    };
    tick();
  });
}

const browser = await chromium.launch();
try {
  await waitForServer();
  const page = await browser.newPage();
  const sizes = [
    [320, 700],
    [360, 740],
    [375, 812],
    [390, 844],
    [414, 896],
    [768, 1024],
    [820, 1180],
    [1024, 768],
    [1280, 800],
    [1440, 900],
    [1920, 1080],
    [667, 375],
  ];
  const list =
    mode === "before"
      ? [
          [320, 700],
          [375, 812],
          [768, 1024],
          [1024, 768],
          [1440, 900],
          [667, 375],
        ]
      : sizes;
  for (const [width, height] of list) {
    await page.setViewportSize({ width, height });
    await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
    await page.waitForSelector("#avatar-canvas");
    await page.screenshot({ path: `${out}/${width}x${height}.png` });
  }

  await page.setViewportSize({ width: 1024, height: 800 });
  await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: "networkidle" });
  await page.locator('[data-tab="hair"]').click();
  const hairs =
    mode === "before"
      ? ["Bob", "Largo", "Cola", "Coletas", "Moño", "Corto"]
      : [
          "Bob",
          "Largo",
          "Cola",
          "Coletas",
          "Moño",
          "Corto",
          "Rizos",
          "Afro",
          "Trenzas",
        ];
  for (const name of hairs) {
    await page.getByRole("button", { name, exact: true }).click();
    await page.screenshot({ path: `${out}/hair-${name}.png` });
  }
  console.log(`capturas ${mode} listas`);
} finally {
  await browser.close();
  server.kill();
}
