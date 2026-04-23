import { getCountryCommercialDefaults } from "../data/countryCommercialRules";

/**
 * Normalise VAT input: trim, collapse spaces, uppercase country prefix when present.
 * @param {string} raw
 */
export function normaliseVatInput(raw) {
  if (raw == null) return "";
  return String(raw).replace(/\s+/g, " ").trim().toUpperCase();
}

/**
 * Bulgarian VAT number format validation.
 * @param {string} vatRaw
 * @param {string} countryName English label from profile country field
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateVatNumberFormat(vatRaw, countryName) {
  const vat = normaliseVatInput(vatRaw);
  if (!vat) {
    return { ok: false, message: "Въведете ДДС номер." };
  }

  const { iso2 } = getCountryCommercialDefaults(countryName);
  const cc = (iso2 || "").toUpperCase();
  if (cc !== "BG") {
    return { ok: false, message: "Поддържат се само български ДДС номера." };
  }
  if (/^BG\d{9,10}$/.test(vat)) {
    return { ok: true };
  }
  return {
    ok: false,
    message: "ДДС номерът трябва да е в български формат: BG, последвано от 9 или 10 цифри.",
  };
}
