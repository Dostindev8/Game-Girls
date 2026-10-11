import assert from "node:assert/strict";
import { test } from "node:test";
import { decodePhoto, validatePhotoFile } from "../js/photo.js";
import { phrasesFor, pickSpanishVoice } from "../js/speech.js";
import {
  applyMode,
  clampPhoto,
  createDefaultState,
  createHistory,
  deserializeState,
  randomState,
  serializeState,
  validateState,
} from "../js/state.js";
import {
  loadGallery,
  loadPersistedState,
  saveGalleryItem,
  savePersistedState,
} from "../js/storage.js";

function memory() {
  const data = new Map();
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => data.set(key, String(value)),
    removeItem: (key) => data.delete(key),
  };
}

function rngFrom(seed) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

test("el estado por defecto es válido y no guarda la foto", () => {
  const state = createDefaultState();
  assert.equal(validateState(state).skin, "#fcd5b5");
  const saved = JSON.parse(
    serializeState({
      ...state,
      photoActive: true,
      photo: "data:image/png,abc",
    }),
  );
  assert.equal(saved.photoActive, undefined);
  assert.equal(saved.photo, undefined);
  assert.equal(validateState({ ...state, photo: "data:image/jpeg,abc" }), null);
  assert.equal(validateState({ ...state, version: 99 }), null);
});

test("la validación recorta zoom y rechaza peinados desconocidos", () => {
  const state = validateState({
    ...createDefaultState(),
    photoScale: 9,
    photoOffsetX: -999,
    hairStyle: "elsa",
  });
  assert.equal(state.photoScale, 3);
  assert.equal(state.photoOffsetX, -400);
  assert.equal(state.hairStyle, "bob");
  assert.equal(state.photoActive, false);
  assert.deepEqual(clampPhoto(0.1, 10, 10), {
    photoScale: 0.4,
    photoOffsetX: 10,
    photoOffsetY: 10,
  });
});

test("deshacer y rehacer conservan 30 pasos", () => {
  const history = createHistory(30);
  history.reset(createDefaultState());
  for (let index = 0; index < 40; index += 1) {
    const next = createDefaultState();
    next.voicePitch = Math.round((0.8 + index * 0.01) * 100) / 100;
    history.push(next);
  }
  let steps = 0;
  while (history.undo()) steps += 1;
  assert.equal(steps, 30);
  assert.ok(history.redo());
  history.push(createDefaultState());
  assert.equal(history.canRedo(), false);
});

test("los modos cambian corona, capa y cabello sin fijar el género en las frases", () => {
  const prince = applyMode(createDefaultState(), "prince");
  assert.ok(prince.accessories.some((item) => item.id === "cape"));
  assert.equal(
    prince.accessories.some((item) => item.id === "crown"),
    false,
  );
  assert.equal(prince.hairStyle, "short");
  const princess = applyMode(prince, "princess");
  assert.ok(princess.accessories.some((item) => item.id === "crown"));
  const neutral = applyMode(princess, "neutral");
  assert.equal(
    neutral.accessories.some(
      (item) => item.id === "crown" || item.id === "cape",
    ),
    false,
  );
  for (const phrase of [
    ...phrasesFor("princess"),
    ...phrasesFor("prince"),
    ...phrasesFor("neutral"),
  ]) {
    assert.equal(/princesa|príncipe|niña|niño/i.test(phrase), false);
  }
});

test("sorpresa repetible y voz en orden es-DO, es-US, es-MX, es-419, es-ES", () => {
  const first = randomState(rngFrom(7));
  const second = randomState(rngFrom(7));
  assert.deepEqual(first, second);
  assert.ok(validateState(first));
  const voices = [
    { lang: "en-US", name: "English" },
    { lang: "es-ES", name: "Spain" },
    { lang: "es-419", name: "LatAm" },
    { lang: "es-MX", name: "Mexico" },
    { lang: "es-DO", name: "Dominicana" },
  ];
  assert.equal(pickSpanishVoice(voices).lang, "es-DO");
  assert.equal(
    pickSpanishVoice(voices.filter((voice) => voice.lang !== "es-DO")).lang,
    "es-MX",
  );
  assert.equal(pickSpanishVoice([{ lang: "fr-FR", name: "French" }]), null);
});

test("la foto valida tipo y tamaño, y pide la orientación EXIF", async () => {
  assert.equal(
    validatePhotoFile({ type: "image/gif", name: "a.gif", size: 10 }).ok,
    false,
  );
  assert.equal(
    validatePhotoFile({
      type: "image/jpeg",
      name: "a.jpg",
      size: 13 * 1024 * 1024,
    }).ok,
    false,
  );
  assert.equal(
    validatePhotoFile({ type: "", name: "foto.heic", size: 1000 }).ok,
    true,
  );
  let options;
  const decoded = await decodePhoto(
    { type: "image/jpeg", name: "a.jpg", size: 100 },
    {
      createImageBitmap: async (_file, opts) => {
        options = opts;
        return { width: 3200, height: 1600, close() {} };
      },
    },
  );
  assert.equal(options.imageOrientation, "from-image");
  assert.equal(decoded.width, 1600);
  assert.equal(decoded.height, 800);
  assert.equal(deserializeState("{"), null);
});

test("localStorage guarda estado y como máximo 8 miniaturas", () => {
  const storage = memory();
  const state = createDefaultState();
  assert.equal(savePersistedState(storage, state), true);
  assert.equal(loadPersistedState(storage).hairStyle, "bob");
  storage.setItem("avatar-magico-state-v1", '{"version":1,"photo":"secreto"}');
  assert.equal(loadPersistedState(storage), null);

  const thumb = "data:image/png;base64,aaaa";
  for (let index = 0; index < 10; index += 1) {
    saveGalleryItem(storage, {
      id: String(index + 1),
      createdAt: index,
      state,
      thumb,
    });
  }
  const gallery = loadGallery(storage);
  assert.equal(gallery.items.length, 8);
  assert.equal(
    saveGalleryItem(storage, {
      id: "11",
      createdAt: 1,
      state,
      thumb: "javascript:alert(1)",
    }),
    null,
  );
});
