export const LOGO_ALLOWED_MIME_TYPES = Object.freeze([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

export const LOGO_ACCEPT = LOGO_ALLOWED_MIME_TYPES.join(",");

export const LOGO_MAX_MB = 5;
export const LOGO_MAX_BYTES = LOGO_MAX_MB * 1024 * 1024;

/** Максимум страна при качване (ширина или височина). На PDF логото се мащабира допълнително с CSS (~140 px). */
export const LOGO_MAX_DIMENSION_PX = 2048;

export const LOGO_FORMATS_LABEL = "PNG, JPG or WebP";

export const LOGO_UPLOAD_HINT = `${LOGO_FORMATS_LABEL} · до ${LOGO_MAX_MB} MB · макс. ${LOGO_MAX_DIMENSION_PX}px ширина/височина · прозрачни PNG`;

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

/**
 * Проверка на разрешението — предотвратява много големи изображения (памет, качване, мобилен трафик).
 */
export async function validateLogoDimensions(file) {
  try {
    const bitmap = await createImageBitmap(file);
    const w = bitmap.width;
    const h = bitmap.height;
    bitmap.close();

    const max = LOGO_MAX_DIMENSION_PX;
    if (w > max || h > max) {
      return {
        ok: false,
        message: `Изображението е прекалено голямо: ${w}×${h} px. Максимум ${max}px по ширина и по височина.`,
      };
    }

    return { ok: true };
  } catch {
    return {
      ok: false,
      message:
        "Не можем да проверим размера на файла. Опитайте друг PNG, JPG или WebP.",
    };
  }
}
