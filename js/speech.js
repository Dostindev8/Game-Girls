/** Selección de voz y frases. Puro: no llama a speechSynthesis. */

export const VOICE_PRIORITY = ["es-DO", "es-US", "es-MX", "es-419", "es-ES"];

function normalizeLang(voice) {
  return String(voice?.lang || "")
    .toLowerCase()
    .replaceAll("_", "-");
}

export function pickSpanishVoice(voices) {
  const list = Array.isArray(voices) ? voices.filter(Boolean) : [];
  for (const wanted of VOICE_PRIORITY) {
    const exact = list.find(
      (voice) => normalizeLang(voice) === wanted.toLowerCase(),
    );
    if (exact) return exact;
  }
  for (const wanted of VOICE_PRIORITY) {
    const prefix = list.find((voice) =>
      normalizeLang(voice).startsWith(wanted.toLowerCase()),
    );
    if (prefix) return prefix;
  }
  return list.find((voice) => normalizeLang(voice).startsWith("es")) || null;
}

export function phrasesFor(mode) {
  const shared = [
    "Los unicornios son amigos de verdad.",
    "¡Tú también puedes crear magia!",
    "¡Gracias por jugar conmigo!",
    "¡Qué bonito se ve este avatar hoy!",
  ];
  if (mode === "prince") {
    return ["¡Hola! Este avatar lleva una capa brillante.", ...shared];
  }
  if (mode === "princess") {
    return ["¡Hola! Este avatar lleva una corona brillante.", ...shared];
  }
  return ["¡Hola! Este avatar es mágico.", ...shared];
}

export const PHRASE_SHORT = [
  "¡Hola!",
  "Brillo",
  "Unicornio",
  "Mágico",
  "Gracias",
];
