import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function ready(page) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto("/");
  await page.waitForFunction(() => {
    const canvas = document.querySelector("#avatar-canvas");
    return canvas && canvas.width >= 480 && canvas.height >= 560;
  });
  return errors;
}

test("carga sin errores de consola", async ({ page }) => {
  const errors = await ready(page);
  await expect(
    page.getByRole("heading", { name: "Avatar Mágico" }),
  ).toBeVisible();
  expect(errors, errors.join("\n")).toEqual([]);
});

test("las pestañas se recorren con el teclado", async ({ page }) => {
  await ready(page);
  await page.locator("#tab-colors").focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.locator("#tab-accessories")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("End");
  await expect(page.locator("#tab-hair")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.keyboard.press("Home");
  await expect(page.locator("#tab-colors")).toHaveAttribute(
    "aria-selected",
    "true",
  );
});

test("reset vuelve a sincronizar la interfaz", async ({ page }) => {
  await ready(page);
  await page.locator("#tab-hair").click();
  await page.getByRole("button", { name: "Largo", exact: true }).click();
  await page.getByRole("button", { name: "Reset" }).click();
  await expect(page.locator("#tab-colors")).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.locator("#hair-grid .opt-btn.active")).toHaveText("Bob");
  await expect(page.locator("#swatches-skin .swatch.active")).toHaveAttribute(
    "data-color",
    "#fcd5b5",
  );
  await expect(page.locator("#accessory-grid .acc-btn.active")).toHaveAttribute(
    "aria-label",
    "Corona",
  );
});

test("la matriz responsive no desborda y el panel se alcanza", async ({
  page,
}) => {
  await ready(page);
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
  for (const [width, height] of sizes) {
    await page.setViewportSize({ width, height });
    await page.locator("#avatar-canvas").scrollIntoViewIfNeeded();
    const canvas = await page.locator("#avatar-canvas").boundingBox();
    expect(canvas?.width || 0).toBeGreaterThan(80);
    expect(canvas?.height || 0).toBeGreaterThan(80);
    const ratio = canvas.width / canvas.height;
    expect(ratio).toBeGreaterThan(0.75);
    expect(ratio).toBeLessThan(0.98);
    await page.locator(".tools-panel").scrollIntoViewIfNeeded();
    const panel = await page.locator(".tools-panel").boundingBox();
    expect(panel?.height || 0).toBeGreaterThan(40);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  }
});

test("sube una foto con EXIF, permite zoom y arrastre", async ({ page }) => {
  await ready(page);
  await page.setInputFiles(
    "#photo-input",
    "tests/fixtures/exif-orientation-6.jpg",
  );
  await expect(page.locator("#photo-note")).toBeVisible();
  await expect(page.locator("#tab-colors")).toBeDisabled();
  await expect(page.locator("#tab-accessories")).toHaveAttribute(
    "aria-selected",
    "true",
  );

  const before = await blueCenter(page);
  await page.locator("#photo-zoom").fill("2");
  const zoomed = await blueCenter(page);
  expect(zoomed.count).toBeGreaterThan(before.count);

  await page.locator("#avatar-canvas").scrollIntoViewIfNeeded();
  const box = await page.locator("#avatar-canvas").boundingBox();
  const startX = box.x + box.width / 2;
  const startY = box.y + box.height / 2;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 60, startY, { steps: 6 });
  await page.mouse.up();
  await page.locator("#avatar-canvas").focus();
  await page.keyboard.press("ArrowRight");
  const moved = await blueCenter(page);
  expect(moved.x).toBeGreaterThan(zoomed.x);
});

test("un accesorio se puede arrastrar", async ({ page }) => {
  await ready(page);
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.locator("#tab-accessories").click();
  await page.getByRole("button", { name: "Cuerno", exact: true }).click();
  await expect(page.locator("#acc-editor")).toBeVisible();
  const box = await page.locator("#avatar-canvas").boundingBox();
  const startX = box.x + (255 / 480) * box.width;
  const startY = box.y + (130 / 560) * box.height;
  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 36, startY + 20);
  await page.mouse.up();
  await expect(page.locator("#acc-editor")).toBeVisible();
});

test("guardar produce un PNG de 960 por 1120", async ({ page }) => {
  await ready(page);
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "canShare", {
      configurable: true,
      value: undefined,
    });
  });
  await page.reload();
  await page.waitForSelector("#avatar-canvas");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Guardar" }).click();
  const download = await downloadPromise;
  const target = test.info().outputPath("avatar.png");
  await download.saveAs(target);
  const buffer = readFileSync(target);
  expect(buffer.readUInt32BE(16)).toBe(960);
  expect(buffer.readUInt32BE(20)).toBe(1120);
  expect(buffer.includes(Buffer.from("Exif"))).toBe(false);
});

test("axe no reporta violaciones", async ({ page }) => {
  await ready(page);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});

test("funciona sin red después de la primera carga", async ({
  page,
  context,
}) => {
  await ready(page);
  await page.waitForFunction(async () => {
    const cache = await caches.open("avatar-magico-v1");
    const keys = await cache.keys();
    return keys.some((request) => /index\.html|\/$/.test(request.url));
  });
  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#avatar-canvas")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Avatar Mágico" }),
  ).toBeVisible();
});

async function blueCenter(page) {
  return page.evaluate(() => {
    const canvas = document.querySelector("#avatar-canvas");
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let count = 0;
    let x = 0;
    let y = 0;
    const step = 4;
    for (let py = 0; py < canvas.height; py += step) {
      for (let px = 0; px < canvas.width; px += step) {
        const index = (py * canvas.width + px) * 4;
        if (data[index + 2] > 150 && data[index] < 80) {
          count += 1;
          x += px;
          y += py;
        }
      }
    }
    return { count, x: count ? x / count : 0, y: count ? y / count : 0 };
  });
}
