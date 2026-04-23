
import { COUNTRIES } from "./countries";


/** @typedef {{ currency: string, standardVatRate: number | null, iso2: string }} CountryCommercialRule */

/** @type {Record<string, CountryCommercialRule>} */
export const COUNTRY_COMMERCIAL_RULES = Object.freeze({
  Bulgaria: { currency: "EUR", standardVatRate: 20, iso2: "BG" },
});

/**
 * @param {string} countryName English label from address country select
 * @returns {CountryCommercialRule}
 */
export function getCountryCommercialDefaults(countryName) {
  const key = (countryName ?? "").trim();
  if (!COUNTRIES.includes(key)) {
    return { currency: "", standardVatRate: null, iso2: "" };
  }
  const rule = COUNTRY_COMMERCIAL_RULES[key];
  if (rule) {
    return { ...rule };
  }
  return { currency: "", standardVatRate: null, iso2: "" };
}
