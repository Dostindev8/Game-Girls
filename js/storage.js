/** Persistencia local del estado y de hasta 8 miniaturas. Nunca guarda la foto. */

import { SCHEMA_VERSION, serializeState, validateState } from "./state.js";

export const STATE_KEY = "avatar-magico-state-v1";
export const GALLERY_KEY = "avatar-magico-gallery-v1";
export const GALLERY_LIMIT = 8;
const MAX_THUMB_CHARS = 180_000;
const ID_RE = /^[0-9]{1,20}$/;

export function loadPersistedState(storage) {
  try {
    const raw = storage.getItem(STATE_KEY);
    if (!raw) return null;
    return validateState(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function savePersistedState(storage, state) {
  try {
    storage.setItem(STATE_KEY, serializeState(state));
    return true;
  } catch {
    return false;
  }
}

function validateGallery(input) {
  const empty = { version: SCHEMA_VERSION, items: [] };
  if (!input || input.version !== SCHEMA_VERSION || !Array.isArray(input.items))
    return empty;
  const items = [];
  for (const item of input.items) {
    if (!item || typeof item !== "object") continue;
    if (typeof item.id !== "string" || !ID_RE.test(item.id)) continue;
    const state = validateState(item.state);
    if (!state) continue;
    if (
      typeof item.thumb !== "string" ||
      !item.thumb.startsWith("data:image/png")
    )
      continue;
    if (item.thumb.length > MAX_THUMB_CHARS) continue;
    items.push({
      id: item.id,
      createdAt: Number.isFinite(Number(item.createdAt))
        ? Number(item.createdAt)
        : Date.now(),
      state,
      thumb: item.thumb,
    });
    if (items.length >= GALLERY_LIMIT) break;
  }
  return { version: SCHEMA_VERSION, items };
}

export function loadGallery(storage) {
  try {
    const raw = storage.getItem(GALLERY_KEY);
    if (!raw) return { version: SCHEMA_VERSION, items: [] };
    return validateGallery(JSON.parse(raw));
  } catch {
    return { version: SCHEMA_VERSION, items: [] };
  }
}

export function saveGalleryItem(storage, item) {
  const gallery = loadGallery(storage);
  const safe = validateGallery({ version: SCHEMA_VERSION, items: [item] });
  if (!safe.items.length) return null;
  const next = {
    version: SCHEMA_VERSION,
    items: [
      safe.items[0],
      ...gallery.items.filter((entry) => entry.id !== safe.items[0].id),
    ].slice(0, GALLERY_LIMIT),
  };
  try {
    storage.setItem(GALLERY_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function removeGalleryItem(storage, id) {
  const gallery = loadGallery(storage);
  const next = {
    version: SCHEMA_VERSION,
    items: gallery.items.filter((entry) => entry.id !== id),
  };
  try {
    storage.setItem(GALLERY_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function clearStoredAvatar(storage) {
  try {
    storage.removeItem(STATE_KEY);
    storage.removeItem(GALLERY_KEY);
    return true;
  } catch {
    return false;
  }
}
