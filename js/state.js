/**
 * Estado puro del avatar. No toca el DOM, la red ni la foto.
 * La foto vive solo en memoria de la sesión y nunca entra en este objeto persistible.
 */

export const SCHEMA_VERSION = 1;
export const LOGICAL_W = 480;
export const LOGICAL_H = 560;
export const HISTORY_LIMIT = 30;
export const PHOTO_SCALE_MIN = 0.4;
export const PHOTO_SCALE_MAX = 3;
export const PHOTO_OFFSET_LIMIT = 400;
export const ACCESSORY_SCALE_MIN = 0.5;
export const ACCESSORY_SCALE_MAX = 2.2;

export const MODES = ["princess", "prince", "neutral"];
export const HAIR_STYLES = [
  "bob",
  "long",
  "ponytail",
  "pigtails",
  "bun",
  "short",
  "curls",
  "afro",
  "braids",
];
export const EYE_STYLES = ["big", "almond", "round"];
export const LASH_STYLES = ["none", "short", "long"];
export const LIP_STYLES = ["thin", "full", "heart"];
export const BLUSH_STYLES = ["none", "soft", "strong"];
export const SCENES = ["pastel", "castle", "forest", "stars", "rainbow"];

export const HAIR_LABELS = {
  bob: "Bob",
  long: "Largo",
  ponytail: "Cola",
  pigtails: "Coletas",
  bun: "Moño",
  short: "Corto",
  curls: "Rizos",
  afro: "Afro",
  braids: "Trenzas",
};

export const SCENE_LABELS = {
  pastel: "Pastel",
  castle: "Castillo",
  forest: "Bosque",
  stars: "Estrellas",
  rainbow: "Arcoíris",
};

export const OPTION_GROUPS = {
  eyeStyle: [
    { id: "big", label: "Grandes" },
    { id: "almond", label: "Almendrados" },
    { id: "round", label: "Redondos" },
  ],
  lashStyle: [
    { id: "none", label: "Ninguna" },
    { id: "short", label: "Cortas" },
    { id: "long", label: "Largas" },
  ],
  lipStyle: [
    { id: "thin", label: "Finos" },
    { id: "full", label: "Rellenos" },
    { id: "heart", label: "Corazón" },
  ],
  blush: [
    { id: "none", label: "Ninguno" },
    { id: "soft", label: "Suave" },
    { id: "strong", label: "Intenso" },
  ],
};

export const ACCESSORIES = [
  { id: "crown", icon: "👑", label: "Corona" },
  { id: "cape", icon: "🧥", label: "Capa" },
  { id: "unicorn", icon: "🦄", label: "Cuerno" },
  { id: "flower", icon: "🌸", label: "Flor" },
  { id: "star", icon: "⭐", label: "Estrella" },
  { id: "wand", icon: "🪄", label: "Varita" },
  { id: "sparkle", icon: "✨", label: "Brillos" },
  { id: "heart", icon: "💖", label: "Corazón" },
  { id: "bow", icon: "🎀", label: "Lazo" },
  { id: "glasses", icon: "👓", label: "Gafas" },
  { id: "frame-round", icon: "⭕", label: "Marco redondo" },
  { id: "frame-stars", icon: "🌟", label: "Marco de estrellas" },
  { id: "frame-hearts", icon: "💝", label: "Marco de corazones" },
];

export const ACCESSORY_IDS = ACCESSORIES.map((item) => item.id);

export const PALETTES = {
  skin: [
    { id: "porcelana", hex: "#ffe0bd" },
    { id: "durazno", hex: "#fcd5b5" },
    { id: "arena", hex: "#ffdbac" },
    { id: "rosa-suave", hex: "#f5d0c5" },
    { id: "miel", hex: "#f1c27d" },
    { id: "dorado", hex: "#e0ac69" },
    { id: "canela", hex: "#d4a574" },
    { id: "bronce", hex: "#c68642" },
    { id: "caramelo", hex: "#a67c52" },
    { id: "caoba", hex: "#8d5524" },
    { id: "castano-piel", hex: "#6b4423" },
    { id: "cacao", hex: "#4a2912" },
    { id: "ebano", hex: "#3b2219" },
    { id: "noche", hex: "#2c1810" },
  ],
  hair: [
    { id: "negro", hex: "#1a1a1a" },
    { id: "chocolate", hex: "#3d2314" },
    { id: "castano", hex: "#8b4513" },
    { id: "cobre", hex: "#a0522d" },
    { id: "jengibre", hex: "#d2691e" },
    { id: "dorado-oscuro", hex: "#daa520" },
    { id: "rubio", hex: "#ffd700" },
    { id: "rosa", hex: "#c71585" },
    { id: "violeta", hex: "#4b0082" },
    { id: "turquesa", hex: "#00ced1" },
    { id: "chicle", hex: "#ff69b4" },
    { id: "blanco", hex: "#ffffff" },
  ],
  eyes: [
    { id: "marino", hex: "#1e3a5f" },
    { id: "cielo", hex: "#4a90d9" },
    { id: "bosque", hex: "#2e8b57" },
    { id: "avellana", hex: "#8b4513" },
    { id: "rosa", hex: "#ff69b4" },
    { id: "lila", hex: "#9370db" },
    { id: "turquesa", hex: "#00ced1" },
    { id: "negro", hex: "#000000" },
  ],
  lips: [
    { id: "coral", hex: "#c45c4a" },
    { id: "rojo", hex: "#e74c3c" },
    { id: "rosa", hex: "#ff69b4" },
    { id: "fucsia", hex: "#db2777" },
    { id: "vino", hex: "#9b2c2c" },
    { id: "pastel", hex: "#f472b6" },
    { id: "frambuesa", hex: "#be185d" },
    { id: "cereza", hex: "#7f1d1d" },
  ],
  dress: [
    { id: "lila", hex: "#c084fc" },
    { id: "rosa", hex: "#f472b6" },
    { id: "azul", hex: "#60a5fa" },
    { id: "menta", hex: "#34d399" },
    { id: "sol", hex: "#fbbf24" },
    { id: "coral", hex: "#f87171" },
    { id: "violeta", hex: "#a78bfa" },
    { id: "cielo", hex: "#38bdf8" },
    { id: "fresa", hex: "#fb7185" },
    { id: "hoja", hex: "#4ade80" },
    { id: "limon", hex: "#facc15" },
    { id: "orquidea", hex: "#e879f9" },
  ],
};

export const COLOR_GROUP_LABEL = {
  skin: "Piel",
  hair: "Cabello",
  eyes: "Ojos",
  lips: "Labios",
  dress: "Ropa",
};

const HEX_RE = /^#[0-9a-f]{6}$/;
const PRINCE_HAIR = new Set(["short", "curls", "afro", "braids"]);

export function isFrame(id) {
  return typeof id === "string" && id.startsWith("frame-");
}

export function colorByHex(group, hex) {
  const needle = String(hex || "").toLowerCase();
  return PALETTES[group].find((item) => item.hex === needle) || null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function asNumber(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function oneOf(value, allowed, fallback) {
  return allowed.includes(value) ? value : fallback;
}

function hexOf(value, group, fallback) {
  if (typeof value !== "string") return fallback;
  const needle = value.toLowerCase();
  if (!HEX_RE.test(needle)) return fallback;
  return PALETTES[group].some((item) => item.hex === needle)
    ? needle
    : fallback;
}

export function defaultAccessories(mode) {
  if (mode === "prince") return [{ id: "cape", ox: 0, oy: 0, scale: 1 }];
  if (mode === "neutral") return [];
  return [{ id: "crown", ox: 0, oy: 0, scale: 1 }];
}

export function createDefaultState() {
  return {
    version: SCHEMA_VERSION,
    mode: "princess",
    skin: "#fcd5b5",
    hair: "#8b4513",
    eyes: "#4a90d9",
    lips: "#c45c4a",
    dress: "#c084fc",
    hairStyle: "bob",
    eyeStyle: "big",
    lashStyle: "long",
    lipStyle: "full",
    blush: "soft",
    scene: "pastel",
    accessories: defaultAccessories("princess"),
    photoScale: 1,
    photoOffsetX: 0,
    photoOffsetY: 0,
    photoActive: false,
    voicePitch: 1.2,
    voiceRate: 0.95,
  };
}

export function cloneState(state) {
  return {
    ...state,
    accessories: (state.accessories || []).map((item) => ({ ...item })),
  };
}

export function clampPhoto(scale, offsetX, offsetY) {
  return {
    photoScale: clamp(asNumber(scale, 1), PHOTO_SCALE_MIN, PHOTO_SCALE_MAX),
    photoOffsetX: clamp(
      asNumber(offsetX, 0),
      -PHOTO_OFFSET_LIMIT,
      PHOTO_OFFSET_LIMIT,
    ),
    photoOffsetY: clamp(
      asNumber(offsetY, 0),
      -PHOTO_OFFSET_LIMIT,
      PHOTO_OFFSET_LIMIT,
    ),
  };
}

function sanitizeAccessory(raw) {
  if (!raw || typeof raw !== "object") return null;
  if (!ACCESSORY_IDS.includes(raw.id)) return null;
  return {
    id: raw.id,
    ox: clamp(asNumber(raw.ox, 0), -PHOTO_OFFSET_LIMIT, PHOTO_OFFSET_LIMIT),
    oy: clamp(asNumber(raw.oy, 0), -PHOTO_OFFSET_LIMIT, PHOTO_OFFSET_LIMIT),
    scale: clamp(
      asNumber(raw.scale, 1),
      ACCESSORY_SCALE_MIN,
      ACCESSORY_SCALE_MAX,
    ),
  };
}

/**
 * Valida datos externos (localStorage). Rechaza fotos y esquemas desconocidos.
 * photoActive siempre queda en false: la foto no se puede restaurar.
 */
export function validateState(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  if (input.version !== SCHEMA_VERSION) return null;
  if ("photo" in input || "photoData" in input || "image" in input) return null;

  const base = createDefaultState();
  const mode = oneOf(input.mode, MODES, base.mode);
  const accessories = Array.isArray(input.accessories)
    ? input.accessories.map(sanitizeAccessory).filter(Boolean).slice(0, 16)
    : defaultAccessories(mode);
  const photo = clampPhoto(
    input.photoScale,
    input.photoOffsetX,
    input.photoOffsetY,
  );

  return {
    version: SCHEMA_VERSION,
    mode,
    skin: hexOf(input.skin, "skin", base.skin),
    hair: hexOf(input.hair, "hair", base.hair),
    eyes: hexOf(input.eyes, "eyes", base.eyes),
    lips: hexOf(input.lips, "lips", base.lips),
    dress: hexOf(input.dress, "dress", base.dress),
    hairStyle: oneOf(input.hairStyle, HAIR_STYLES, base.hairStyle),
    eyeStyle: oneOf(input.eyeStyle, EYE_STYLES, base.eyeStyle),
    lashStyle: oneOf(input.lashStyle, LASH_STYLES, base.lashStyle),
    lipStyle: oneOf(input.lipStyle, LIP_STYLES, base.lipStyle),
    blush: oneOf(input.blush, BLUSH_STYLES, base.blush),
    scene: oneOf(input.scene, SCENES, base.scene),
    accessories,
    ...photo,
    photoActive: false,
    voicePitch: clamp(asNumber(input.voicePitch, base.voicePitch), 0.7, 1.6),
    voiceRate: clamp(asNumber(input.voiceRate, base.voiceRate), 0.7, 1.3),
  };
}

export function snapshotState(state) {
  const clean = cloneState(state);
  delete clean.photo;
  return JSON.stringify(clean);
}

export function serializeState(state) {
  const clean = JSON.parse(snapshotState(state));
  delete clean.photoActive;
  return JSON.stringify(clean);
}

export function deserializeState(json) {
  try {
    return validateState(JSON.parse(json));
  } catch {
    return null;
  }
}

export function statesEqual(a, b) {
  return snapshotState(a) === snapshotState(b);
}

export function createHistory(limit = HISTORY_LIMIT) {
  let past = [];
  let future = [];
  let current = null;

  return {
    reset(state) {
      current = cloneState(state);
      past = [];
      future = [];
    },
    push(state) {
      if (!current) {
        current = cloneState(state);
        return;
      }
      if (statesEqual(current, state)) return;
      past.push(current);
      if (past.length > limit) past.shift();
      current = cloneState(state);
      future = [];
    },
    undo() {
      if (!past.length || !current) return null;
      future.push(current);
      current = past.pop();
      return cloneState(current);
    },
    redo() {
      if (!future.length || !current) return null;
      past.push(current);
      current = future.pop();
      return cloneState(current);
    },
    canUndo() {
      return past.length > 0;
    },
    canRedo() {
      return future.length > 0;
    },
  };
}

export function randomState(rng = Math.random) {
  const pick = (list) => list[Math.floor(rng() * list.length)];
  const mode = pick(MODES);
  const state = createDefaultState();
  state.mode = mode;
  state.skin = pick(PALETTES.skin).hex;
  state.hair = pick(PALETTES.hair).hex;
  state.eyes = pick(PALETTES.eyes).hex;
  state.lips = pick(PALETTES.lips).hex;
  state.dress = pick(PALETTES.dress).hex;
  state.hairStyle =
    mode === "prince"
      ? pick(["short", "curls", "afro", "braids"])
      : pick(HAIR_STYLES);
  state.eyeStyle = pick(EYE_STYLES);
  state.lashStyle = pick(LASH_STYLES);
  state.lipStyle = pick(LIP_STYLES);
  state.blush = pick(BLUSH_STYLES);
  state.scene = pick(SCENES);
  state.voicePitch = Math.round((0.9 + rng() * 0.5) * 100) / 100;
  state.voiceRate = Math.round((0.85 + rng() * 0.25) * 100) / 100;
  state.photoScale = 1;
  state.photoOffsetX = 0;
  state.photoOffsetY = 0;
  state.photoActive = false;

  const pool =
    mode === "prince"
      ? ["cape", "glasses", "star", "wand"]
      : mode === "neutral"
        ? ["star", "glasses", "flower", "bow"]
        : ["crown", "unicorn", "flower", "bow", "heart"];
  const bag = [...pool];
  const count = 1 + Math.floor(rng() * Math.min(2, bag.length));
  const chosen = [];
  for (let index = 0; index < count && bag.length; index += 1) {
    const pickIndex = Math.floor(rng() * bag.length);
    chosen.push({ id: bag.splice(pickIndex, 1)[0], ox: 0, oy: 0, scale: 1 });
  }
  state.accessories = chosen;
  return state;
}

export function applyMode(state, mode) {
  const next = cloneState(state);
  if (!MODES.includes(mode)) return next;
  next.mode = mode;
  if (mode === "prince") {
    if (!PRINCE_HAIR.has(next.hairStyle)) next.hairStyle = "short";
    next.accessories = next.accessories.filter((item) => item.id !== "crown");
    if (!next.accessories.some((item) => item.id === "cape")) {
      next.accessories.push({ id: "cape", ox: 0, oy: 0, scale: 1 });
    }
  } else if (mode === "princess") {
    next.accessories = next.accessories.filter((item) => item.id !== "cape");
    if (!next.accessories.some((item) => item.id === "crown")) {
      next.accessories.unshift({ id: "crown", ox: 0, oy: 0, scale: 1 });
    }
  } else {
    next.accessories = next.accessories.filter(
      (item) => item.id !== "crown" && item.id !== "cape",
    );
  }
  return next;
}

export function describeAvatar(state) {
  const modeName =
    { princess: "princesa", prince: "príncipe", neutral: "neutral" }[
      state.mode
    ] || "mágico";
  const skin = colorByHex("skin", state.skin);
  const hair = colorByHex("hair", state.hair);
  const skinLabel = skin ? skin.id.replaceAll("-", " ") : "personalizada";
  const hairLabel = hair ? hair.id.replaceAll("-", " ") : "personalizado";
  const photo = state.photoActive ? ", con foto local" : "";
  return `Avatar modo ${modeName}, piel ${skinLabel}, cabello ${hairLabel}, estilo ${state.hairStyle}, fondo ${state.scene}${photo}`;
}

export function accessoryMeta(id) {
  return ACCESSORIES.find((item) => item.id === id) || null;
}
