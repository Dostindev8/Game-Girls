/**
 * Avatar Mágico — entrada.
 * Une estado, dibujo, interfaz, voz, fotos y almacenamiento local.
 * La foto nunca se escribe en localStorage ni se envía a la red.
 */

import { createRenderer } from "./draw.js";
import { decodePhoto } from "./photo.js";
import { phrasesFor, pickSpanishVoice } from "./speech.js";
import {
  PHOTO_OFFSET_LIMIT,
  ACCESSORY_SCALE_MAX,
  ACCESSORY_SCALE_MIN,
  applyMode,
  clampPhoto,
  cloneState,
  createDefaultState,
  createHistory,
  isFrame,
  randomState,
  serializeState,
  validateState,
} from "./state.js";
import {
  clearStoredAvatar,
  loadGallery,
  loadPersistedState,
  removeGalleryItem,
  saveGalleryItem,
  savePersistedState,
} from "./storage.js";
import { createUI } from "./ui.js";

const canvas = document.getElementById("avatar-canvas");
const renderer = createRenderer(canvas);
const history = createHistory();
const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

let state = loadPersistedState(localStorage) || createDefaultState();
let photo = null;
let photoGen = 0;
let selectedId = null;
let voices = [];
let speaking = false;
let mouthOpen = false;
let blink = false;
let blinkTimer = 0;
let raf = 0;
let looping = false;
let seq = 0;
const pointers = new Map();
let gesture = null;

history.reset(state);

const ui = createUI({
  onColor: (group, hex) => {
    if (state.photoActive) return;
    const next = cloneState(state);
    next[group] = hex;
    commit(next);
  },
  onOption: (key, value) => {
    if (state.photoActive) return;
    const next = cloneState(state);
    next[key] = value;
    commit(next);
  },
  onHair: (value) => {
    if (state.photoActive) return;
    const next = cloneState(state);
    next.hairStyle = value;
    commit(next);
  },
  onAccessory: (id) => {
    const next = cloneState(state);
    const index = next.accessories.findIndex((item) => item.id === id);
    if (index >= 0) {
      next.accessories.splice(index, 1);
      if (selectedId === id) selectedId = null;
    } else {
      next.accessories.push({ id, ox: 0, oy: 0, scale: 1 });
      if (!isFrame(id)) selectedId = id;
    }
    commit(next);
  },
  onMode: (mode) => commit(applyMode(state, mode)),
  onScene: (scene) => {
    const next = cloneState(state);
    next.scene = scene;
    commit(next);
  },
  onPhrase: (phrase) => speak(phrase),
  onReset: () => resetAvatar(),
  onSave: () => saveImage(),
  onSpeak: () => {
    const list = phrasesFor(state.mode);
    speak(list[Math.floor(Math.random() * list.length)]);
  },
  onSurprise: () => surprise(),
  onPhoto: (file) => loadPhoto(file),
  onUndo: () => undo(),
  onRedo: () => redo(),
  onGallery: () => ui.openGallery(loadGallery(localStorage).items),
  onGalleryClose: () => ui.closeGallery(),
  onSaveCreation: () => saveCreation(),
  onClearAll: () => {
    clearStoredAvatar(localStorage);
    state = createDefaultState();
    photo = null;
    photoGen += 1;
    selectedId = null;
    history.reset(state);
    ui.renderGallery([]);
    ui.activateTab("colors");
    ui.sync(view());
    paint();
    ui.toast("Listo. Borré las creaciones de este dispositivo.");
  },
  onDeleteCreation: (id) => {
    const next = removeGalleryItem(localStorage, id);
    ui.renderGallery(next ? next.items : []);
  },
  onOpenCreation: (id) => openCreation(id),
  onZoom: (value, record) =>
    updatePhoto(Number(value), state.photoOffsetX, state.photoOffsetY, record),
  onVoice: (key, value, record) => {
    const next = cloneState(state);
    next[key] = Number(value);
    if (record) commit(next);
    else preview(next);
  },
  onAccScale: (value, record) => scaleSelected(Number(value), record),
  onAccFront: () => bringToFront(),
  onAccRemove: () => removeSelected(),
  onNudge: (direction) => nudge(direction),
});

function view() {
  return {
    state,
    photo: Boolean(state.photoActive && photo),
    canUndo: history.canUndo(),
    canRedo: history.canRedo(),
    selectedId,
  };
}

function runtime() {
  return {
    photo: state.photoActive ? photo : null,
    photoGen,
    blink: blink && !reducedQuery.matches,
    mouthOpen: speaking && mouthOpen,
    selectedId,
  };
}

function paint() {
  renderer.render(state, runtime());
}

function preview(next) {
  state = cloneState(next);
  paint();
}

function persist() {
  savePersistedState(localStorage, state);
}

function commit(next) {
  state = cloneState(next);
  history.push(state);
  persist();
  ui.sync(view());
  paint();
}

function applySnapshot(next) {
  state = cloneState(next);
  if (selectedId && !state.accessories.some((item) => item.id === selectedId))
    selectedId = null;
  persist();
  ui.sync(view());
  paint();
}

function resetAvatar() {
  window.speechSynthesis?.cancel();
  speaking = false;
  mouthOpen = false;
  photo = null;
  photoGen += 1;
  selectedId = null;
  const next = createDefaultState();
  state = next;
  history.push(state);
  persist();
  ui.activateTab("colors");
  ui.sync(view());
  paint();
  ui.toast("Avatar nuevo, listo para crear.");
}

function surprise() {
  window.speechSynthesis?.cancel();
  speaking = false;
  mouthOpen = false;
  photo = null;
  photoGen += 1;
  selectedId = null;
  commit(randomState());
  ui.activateTab("colors");
  ui.toast("¡Sorpresa! Mira este avatar.");
}

function undo() {
  const prev = history.undo();
  if (!prev) return;
  applySnapshot(prev);
}

function redo() {
  const next = history.redo();
  if (!next) return;
  applySnapshot(next);
}

function updatePhoto(scale, offsetX, offsetY, record) {
  const next = cloneState(state);
  Object.assign(next, clampPhoto(scale, offsetX, offsetY));
  if (record) commit(next);
  else preview(next);
}

function selectedAccessory(next = state) {
  return (
    next.accessories.find(
      (item) => item.id === selectedId && !isFrame(item.id),
    ) || null
  );
}

function scaleSelected(value, record) {
  const next = cloneState(state);
  const acc = selectedAccessory(next);
  if (!acc) return;
  const number = Number(value);
  acc.scale = Math.min(
    ACCESSORY_SCALE_MAX,
    Math.max(ACCESSORY_SCALE_MIN, number),
  );
  if (record) commit(next);
  else preview(next);
}

function bringToFront() {
  const next = cloneState(state);
  const index = next.accessories.findIndex((item) => item.id === selectedId);
  if (index < 0) return;
  const [item] = next.accessories.splice(index, 1);
  next.accessories.push(item);
  commit(next);
  ui.toast("Lo traje al frente.");
}

function removeSelected() {
  if (!selectedId) return;
  const next = cloneState(state);
  next.accessories = next.accessories.filter((item) => item.id !== selectedId);
  selectedId = null;
  commit(next);
}

function nudge(direction) {
  const next = cloneState(state);
  const acc = selectedAccessory(next);
  const step = 8;
  if (acc) {
    if (direction === "left") acc.ox -= step;
    if (direction === "right") acc.ox += step;
    if (direction === "up") acc.oy -= step;
    if (direction === "down") acc.oy += step;
    acc.ox = Math.min(
      PHOTO_OFFSET_LIMIT,
      Math.max(-PHOTO_OFFSET_LIMIT, acc.ox),
    );
    acc.oy = Math.min(
      PHOTO_OFFSET_LIMIT,
      Math.max(-PHOTO_OFFSET_LIMIT, acc.oy),
    );
    commit(next);
    return;
  }
  if (!state.photoActive) return;
  let { photoOffsetX, photoOffsetY, photoScale } = state;
  if (direction === "left") photoOffsetX -= step;
  if (direction === "right") photoOffsetX += step;
  if (direction === "up") photoOffsetY -= step;
  if (direction === "down") photoOffsetY += step;
  updatePhoto(photoScale, photoOffsetX, photoOffsetY, true);
}

async function loadPhoto(file) {
  const input = document.getElementById("photo-input");
  if (!file) return;
  const decoded = await decodePhoto(file);
  input.value = "";
  if (!decoded.ok) {
    ui.toast(decoded.message);
    return;
  }
  const surface = document.createElement("canvas");
  surface.width = decoded.width;
  surface.height = decoded.height;
  surface
    .getContext("2d")
    .drawImage(decoded.bitmap, 0, 0, decoded.width, decoded.height);
  decoded.bitmap.close?.();
  photo = surface;
  photoGen += 1;
  const next = cloneState(state);
  next.photoActive = true;
  Object.assign(next, clampPhoto(1, 0, 0));
  commit(next);
  ui.activateTab("accessories");
  ui.toast("¡Foto lista! Se queda en este dispositivo.");
}

async function saveImage() {
  const surface = renderer.exportCanvas(state, runtime());
  const blob = await new Promise((resolve) =>
    surface.toBlob(resolve, "image/png"),
  );
  if (!blob) {
    ui.toast("No pude preparar la imagen. Intenta otra vez.");
    return;
  }
  const file = new File([blob], `avatar-magico-${Date.now()}.png`, {
    type: "image/png",
  });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file], title: "Avatar Mágico" });
      ui.toast("¡Listo para compartir desde este dispositivo!");
      return;
    }
  } catch (error) {
    if (error && error.name === "AbortError") return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = file.name;
  link.rel = "noopener";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  ui.toast("¡Imagen guardada en tu dispositivo!");
}

function saveCreation() {
  const validated = validateState(JSON.parse(serializeState(state)));
  if (!validated) {
    ui.toast("No pude guardar esta creación.");
    return;
  }
  const big = renderer.exportCanvas(validated, {
    photo: null,
    photoGen: 0,
    blink: false,
    mouthOpen: false,
    selectedId: null,
  });
  const small = document.createElement("canvas");
  small.width = 96;
  small.height = 112;
  small.getContext("2d").drawImage(big, 0, 0, 96, 112);
  const thumb = small.toDataURL("image/png");
  const item = {
    id: `${Date.now()}${seq % 10}`,
    createdAt: Date.now(),
    state: validated,
    thumb,
  };
  seq += 1;
  const saved = saveGalleryItem(localStorage, item);
  if (!saved) {
    ui.toast("No había espacio para guardar. Puedes borrar alguna creación.");
    return;
  }
  ui.renderGallery(saved.items);
  ui.toast(
    state.photoActive
      ? "Guardé el avatar. La foto no se guarda, solo se queda en esta pantalla."
      : "Creación guardada en este dispositivo.",
  );
}

function openCreation(id) {
  const item = loadGallery(localStorage).items.find((entry) => entry.id === id);
  if (!item) return;
  photo = null;
  photoGen += 1;
  selectedId = null;
  window.speechSynthesis?.cancel();
  speaking = false;
  commit({ ...item.state, photoActive: false });
  ui.closeGallery();
  ui.activateTab("colors");
  ui.toast("Cargué tu creación.");
}

function refreshVoices() {
  try {
    voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  } catch {
    voices = [];
  }
}

function speak(text) {
  const synth = window.speechSynthesis;
  if (!synth || typeof window.SpeechSynthesisUtterance !== "function") {
    ui.toast("Este navegador no puede hablar. Igual puedes crear tu avatar.");
    return;
  }
  refreshVoices();
  const voice = pickSpanishVoice(voices);
  if (!voice) {
    ui.toast("No encontré una voz en español. Igual puedes crear tu avatar.");
    return;
  }
  synth.cancel();
  const utter = new window.SpeechSynthesisUtterance(text);
  utter.voice = voice;
  utter.lang = voice.lang || "es-ES";
  utter.pitch = state.voicePitch;
  utter.rate = state.voiceRate;
  utter.onstart = () => {
    speaking = true;
    mouthOpen = true;
    startLoop();
  };
  utter.onboundary = () => {
    mouthOpen = !mouthOpen;
  };
  const finish = () => {
    speaking = false;
    mouthOpen = false;
    paint();
    stopLoopIfIdle();
    scheduleBlink();
  };
  utter.onend = finish;
  utter.onerror = finish;
  ui.toast(text);
  synth.speak(utter);
}

function needsAnim() {
  return speaking || blink;
}

function frame() {
  paint();
  if (!needsAnim()) {
    looping = false;
    return;
  }
  raf = window.requestAnimationFrame(frame);
}

function startLoop() {
  if (looping) return;
  looping = true;
  raf = window.requestAnimationFrame(frame);
}

function stopLoopIfIdle() {
  if (!needsAnim()) {
    looping = false;
    window.cancelAnimationFrame(raf);
  }
}

function scheduleBlink() {
  window.clearTimeout(blinkTimer);
  if (reducedQuery.matches || speaking || state.photoActive) return;
  const wait = 2800 + Math.random() * 3400;
  blinkTimer = window.setTimeout(() => {
    if (reducedQuery.matches || speaking || state.photoActive) {
      scheduleBlink();
      return;
    }
    blink = true;
    startLoop();
    window.setTimeout(() => {
      blink = false;
      paint();
      stopLoopIfIdle();
      scheduleBlink();
    }, 140);
  }, wait);
}

function onPointerDown(event) {
  if (event.button !== undefined && event.button !== 0) return;
  canvas.setPointerCapture(event.pointerId);
  const pos = renderer.toLogical(event);
  pointers.set(event.pointerId, pos);
  if (state.photoActive && pointers.size >= 2) {
    const pts = [...pointers.values()];
    gesture = {
      type: "pinch",
      dist: Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1,
      scale: state.photoScale,
    };
    return;
  }
  const hit = renderer.hitTest(state, pos.x, pos.y);
  if (hit && !isFrame(hit.id)) {
    selectedId = hit.id;
    gesture = {
      type: "acc",
      id: hit.id,
      x: pos.x,
      y: pos.y,
      ox: hit.ox,
      oy: hit.oy,
    };
    ui.sync(view());
    paint();
    return;
  }
  selectedId = null;
  gesture = state.photoActive
    ? {
        type: "photo",
        x: pos.x,
        y: pos.y,
        ox: state.photoOffsetX,
        oy: state.photoOffsetY,
      }
    : null;
  ui.sync(view());
  paint();
}

function onPointerMove(event) {
  if (!pointers.has(event.pointerId) || !gesture) return;
  const pos = renderer.toLogical(event);
  pointers.set(event.pointerId, pos);
  if (gesture.type === "pinch" && pointers.size >= 2) {
    const pts = [...pointers.values()];
    const dist = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y) || 1;
    updatePhoto(
      gesture.scale * (dist / gesture.dist),
      state.photoOffsetX,
      state.photoOffsetY,
      false,
    );
    return;
  }
  if (gesture.type === "acc") {
    const next = cloneState(state);
    const acc = next.accessories.find((item) => item.id === gesture.id);
    if (!acc) return;
    acc.ox = Math.min(
      PHOTO_OFFSET_LIMIT,
      Math.max(-PHOTO_OFFSET_LIMIT, gesture.ox + (pos.x - gesture.x)),
    );
    acc.oy = Math.min(
      PHOTO_OFFSET_LIMIT,
      Math.max(-PHOTO_OFFSET_LIMIT, gesture.oy + (pos.y - gesture.y)),
    );
    preview(next);
    return;
  }
  if (gesture.type === "photo") {
    updatePhoto(
      state.photoScale,
      gesture.ox + (pos.x - gesture.x),
      gesture.oy + (pos.y - gesture.y),
      false,
    );
  }
}

function onPointerUp(event) {
  pointers.delete(event.pointerId);
  if (pointers.size === 0 && gesture) {
    history.push(state);
    persist();
    ui.sync(view());
    gesture = null;
  } else if (pointers.size < 2 && gesture?.type === "pinch") {
    gesture = null;
  }
}

canvas.addEventListener("pointerdown", onPointerDown);
canvas.addEventListener("pointermove", onPointerMove);
canvas.addEventListener("pointerup", onPointerUp);
canvas.addEventListener("pointercancel", onPointerUp);
let wheelTimer = 0;
canvas.addEventListener(
  "wheel",
  (event) => {
    if (!state.photoActive) return;
    event.preventDefault();
    const factor = event.deltaY < 0 ? 1.06 : 0.94;
    updatePhoto(
      state.photoScale * factor,
      state.photoOffsetX,
      state.photoOffsetY,
      false,
    );
    window.clearTimeout(wheelTimer);
    wheelTimer = window.setTimeout(() => {
      history.push(state);
      persist();
      ui.sync(view());
    }, 180);
  },
  { passive: false },
);

window.addEventListener("keydown", (event) => {
  const tag = document.activeElement?.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA") return;
  const key = event.key.toLowerCase();
  if ((event.ctrlKey || event.metaKey) && key === "z") {
    event.preventDefault();
    if (event.shiftKey) redo();
    else undo();
  } else if ((event.ctrlKey || event.metaKey) && key === "y") {
    event.preventDefault();
    redo();
  } else if (
    document.activeElement === canvas &&
    ["arrowleft", "arrowright", "arrowup", "arrowdown"].includes(key)
  ) {
    event.preventDefault();
    const direction = {
      arrowleft: "left",
      arrowright: "right",
      arrowup: "up",
      arrowdown: "down",
    }[key];
    nudge(direction);
  }
});

window.addEventListener("resize", () => {
  renderer.resize();
  paint();
});
reducedQuery.addEventListener?.("change", () => {
  blink = false;
  scheduleBlink();
  paint();
});

if (window.speechSynthesis) {
  refreshVoices();
  window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
}

ui.sync(view());
renderer.resize();
paint();
scheduleBlink();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      /* sin red o sin soporte: el juego sigue en esta página */
    });
  });
}
