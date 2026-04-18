export const LOGO_ALLOWED_MIME_TYPES = Object.freeze([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export const LOGO_ACCEPT = LOGO_ALLOWED_MIME_TYPES.join(",");

export const LOGO_MAX_MB = 5;
export const LOGO_MAX_BYTES = LOGO_MAX_MB * 1024 * 1024;

export const LOGO_FORMATS_LABEL = "PNG, JPG or WebP";

export const LOGO_UPLOAD_HINT = `${LOGO_FORMATS_LABEL} · up to ${LOGO_MAX_MB} MB · transparent PNGs work well`;

export function validateLogo(file) {
  if (!file) {
    return { ok: false, message: "No file selected." };
  }
  if (!LOGO_ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      ok: false,
      message: `Please choose a ${LOGO_FORMATS_LABEL} image.`,
    };
  }
  if (file.size > LOGO_MAX_BYTES) {
    return {
      ok: false,
      message: `Image must be under ${LOGO_MAX_MB} MB.`,
    };
  }
  return { ok: true };
}
