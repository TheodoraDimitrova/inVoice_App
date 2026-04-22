
import { COUNTRIES } from "./countries";


/** @typedef {{ currency: string, standardVatRate: number | null, iso2: string }} CountryCommercialRule */

/** @type {Record<string, CountryCommercialRule>} */
export const COUNTRY_COMMERCIAL_RULES = Object.freeze({
  Austria: { currency: "EUR", standardVatRate: 20, iso2: "AT" },
  Belgium: { currency: "EUR", standardVatRate: 21, iso2: "BE" },
  Bulgaria: { currency: "EUR", standardVatRate: 20, iso2: "BG" },
  Croatia: { currency: "EUR", standardVatRate: 25, iso2: "HR" },
  Cyprus: { currency: "EUR", standardVatRate: 19, iso2: "CY" },
  "Czech Republic": { currency: "CZK", standardVatRate: 21, iso2: "CZ" },
  Denmark: { currency: "DKK", standardVatRate: 25, iso2: "DK" },
  Estonia: { currency: "EUR", standardVatRate: 22, iso2: "EE" },
  Finland: { currency: "EUR", standardVatRate: 25.5, iso2: "FI" },
  France: { currency: "EUR", standardVatRate: 20, iso2: "FR" },
  Germany: { currency: "EUR", standardVatRate: 19, iso2: "DE" },
  Greece: { currency: "EUR", standardVatRate: 24, iso2: "GR" },
  Hungary: { currency: "HUF", standardVatRate: 27, iso2: "HU" },
  Ireland: { currency: "EUR", standardVatRate: 23, iso2: "IE" },
  Italy: { currency: "EUR", standardVatRate: 22, iso2: "IT" },
  Latvia: { currency: "EUR", standardVatRate: 21, iso2: "LV" },
  Lithuania: { currency: "EUR", standardVatRate: 21, iso2: "LT" },
  Luxembourg: { currency: "EUR", standardVatRate: 17, iso2: "LU" },
  Malta: { currency: "EUR", standardVatRate: 18, iso2: "MT" },
  Netherlands: { currency: "EUR", standardVatRate: 21, iso2: "NL" },
  Poland: { currency: "PLN", standardVatRate: 23, iso2: "PL" },
  Portugal: { currency: "EUR", standardVatRate: 23, iso2: "PT" },
  Romania: { currency: "RON", standardVatRate: 19, iso2: "RO" },
  Slovakia: { currency: "EUR", standardVatRate: 20, iso2: "SK" },
  Slovenia: { currency: "EUR", standardVatRate: 22, iso2: "SI" },
  Spain: { currency: "EUR", standardVatRate: 21, iso2: "ES" },
  Sweden: { currency: "SEK", standardVatRate: 25, iso2: "SE" },
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
