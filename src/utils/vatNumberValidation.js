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
 * Per-country VAT ID format checks (EU-style + common patterns). Lenient for unknown countries.
 * @param {string} vatRaw
 * @param {string} countryName English label from profile country field
 * @returns {{ ok: boolean, message?: string }}
 */
export function validateVatNumberFormat(vatRaw, countryName) {
  const vat = normaliseVatInput(vatRaw);
  if (!vat) {
    return { ok: false, message: "Enter your VAT registration number." };
  }

  const { iso2 } = getCountryCommercialDefaults(countryName);
  const cc = (iso2 || "").toUpperCase();

  /** @type {Record<string, RegExp>} */
  const euPatterns = {
    AT: /^ATU\d{8}$/,
    BE: /^BE0?\d{9}$|^BE\d{10}$/,
    BG: /^BG\d{9,10}$/,
    HR: /^HR\d{11}$/,
    CY: /^CY\d{8}[A-Z]$/,
    CZ: /^CZ\d{8,10}$/,
    DE: /^DE\d{9}$/,
    DK: /^DK\d{8}$/,
    EE: /^EE\d{9}$/,
    ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$|^ES\d{8}[A-Z]$|^ES[A-Z]\d{7}[A-Z0-9]$/i,
    FI: /^FI\d{8}$/,
    FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
    HU: /^HU\d{8}$/,
    IE: /^IE[A-Z0-9+*]{7,10}$/i,
    IT: /^IT\d{11}$/,
    LV: /^LV\d{11}$/,
    LT: /^LT(\d{9}|\d{12})$/,
    LU: /^LU\d{8}$/,
    MT: /^MT\d{8}$/,
    NL: /^NL\d{9}B\d{2}$/,
    PL: /^PL\d{10}$/,
    PT: /^PT\d{9}$/,
    RO: /^RO\d{2,10}$/,
    SE: /^SE\d{12}$/,
    SI: /^SI\d{8}$/,
    SK: /^SK\d{10}$/,
    GB: /^GB(\d{9}|\d{12}|(GD|HA)\d{3})$/i,
    XI: /^XI\d{9}$/,
    NO: /^NO\d{9}(MVA)?$/i,
    CH: /^CHE-?\d{3}\.?\d{3}\.?\d{3}(\s?(TVA|MWST|IVA))?$/i,
  };

  if (cc === "GR" && /^EL\d{9}$/.test(vat)) {
    return { ok: true };
  }

  const pattern = euPatterns[cc];
  if (pattern) {
    if (pattern.test(vat)) return { ok: true };
    return {
      ok: false,
      message: `VAT number does not match the usual format for ${countryName}.`,
    };
  }

  if (vat.length >= 4 && /^[A-Z0-9]{2,}[\dA-Z]+$/i.test(vat.replace(/\s/g, ""))) {
    return { ok: true };
  }

  return {
    ok: false,
    message: "Enter a valid VAT-style number (country prefix + digits, no spaces optional).",
  };
}
