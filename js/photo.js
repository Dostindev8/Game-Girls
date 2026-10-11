/** Validación y decodificación de fotos. La imagen no sale del dispositivo. */

export const MAX_PHOTO_BYTES = 12 * 1024 * 1024;
export const MAX_PHOTO_EDGE = 1600;

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

const ALLOWED_EXT = [".jpg", ".jpeg", ".png", ".webp", ".heic", ".heif"];

export function validatePhotoFile(file) {
  if (!file) {
    return { ok: false, message: "No llegó ninguna foto. Prueba otra vez." };
  }
  const type = String(file.type || "").toLowerCase();
  const name = String(file.name || "").toLowerCase();
  const extOk = ALLOWED_EXT.some((ext) => name.endsWith(ext));
  if (!ALLOWED_TYPES.has(type) && !extOk) {
    return {
      ok: false,
      message: "Ese formato no se puede usar. Prueba con JPG, PNG o WEBP.",
    };
  }
  const size = Number(file.size);
  if (!Number.isFinite(size) || size <= 0) {
    return {
      ok: false,
      message: "Esa foto está vacía. Prueba con otra imagen.",
    };
  }
  if (size > MAX_PHOTO_BYTES) {
    return {
      ok: false,
      message: "Esa foto es muy pesada. Elige una de menos de 12 MB.",
    };
  }
  return { ok: true, message: "" };
}

export function friendlyPhotoError(error) {
  const text = String(error?.message || error || "");
  if (/heic|heif/i.test(text) || /heic|heif/i.test(String(error?.name || ""))) {
    return "Tu navegador no puede leer fotos HEIC. Prueba con JPG o PNG.";
  }
  return "No pude abrir esa foto. Prueba con otra imagen.";
}

/**
 * Decodifica respetando EXIF (imageOrientation: from-image) y limita el lado mayor.
 * `deps` permite probarla sin navegador.
 */
export async function decodePhoto(file, deps = globalThis) {
  const check = validatePhotoFile(file);
  if (!check.ok) return check;
  if (typeof deps.createImageBitmap !== "function") {
    return {
      ok: false,
      message: "Este navegador no puede abrir fotos. Prueba con otro.",
    };
  }

  const heic =
    /heic|heif/i.test(String(file.type || "")) ||
    /\.hei[cf]$/i.test(String(file.name || ""));
  let bitmap;
  try {
    bitmap = await deps.createImageBitmap(file, {
      imageOrientation: "from-image",
    });
  } catch (error) {
    try {
      bitmap = await deps.createImageBitmap(file);
    } catch {
      return {
        ok: false,
        message: heic
          ? friendlyPhotoError(new Error("heic"))
          : friendlyPhotoError(error),
      };
    }
  }

  const widthPx = Number(bitmap?.width);
  const heightPx = Number(bitmap?.height);
  if (
    !Number.isFinite(widthPx) ||
    !Number.isFinite(heightPx) ||
    widthPx < 1 ||
    heightPx < 1
  ) {
    bitmap?.close?.();
    return {
      ok: false,
      message: "No pude abrir esa foto. Prueba con otra imagen.",
    };
  }

  const edge = Math.max(widthPx, heightPx);
  const scale = edge > MAX_PHOTO_EDGE ? MAX_PHOTO_EDGE / edge : 1;
  return {
    ok: true,
    bitmap,
    width: Math.max(1, Math.round(widthPx * scale)),
    height: Math.max(1, Math.round(heightPx * scale)),
    message: "",
  };
}
