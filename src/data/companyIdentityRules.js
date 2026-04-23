import { COUNTRIES } from "./countries";

/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   pattern: string,
 *   hint?: string,
 *   primary?: boolean,
 * }} CompanyIdentifierRule
 */

/** @type {Record<string, CompanyIdentifierRule[]>} */
export const COMPANY_IDENTITY_RULES_BY_COUNTRY = Object.freeze({
  Austria: [
    {
      id: "firmenbuch",
      label: "Firmenbuchnummer (FN)",
      pattern: "^[A-Z0-9\\/\\-\\s]{3,30}$",
      primary: true,
    },
  ],
  Belgium: [
    {
      id: "enterprise",
      label: "KBO / BCE / RPM",
      pattern: "^[0-9]{10}$",
      primary: true,
      hint: "10 digits.",
    },
  ],
  Bulgaria: [
    {
      id: "eik",
      label: "EIK / BULSTAT",
      pattern: "^(?:[0-9]{9}|[0-9]{10})$",
      primary: true,
      hint: "Фирма (9 цифри) или Фрийлансър (10 цифри).",
    },
  ],
  Croatia: [
    {
      id: "mb",
      label: "Matični broj (MB)",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Cyprus: [
    {
      id: "he",
      label: "HE registration number",
      pattern: "^(HE|he)?\\s?\\d{1,10}$",
      primary: true,
      hint: "Common format: HE 123456.",
    },
  ],
  "Czech Republic": [
    {
      id: "ico",
      label: "IČO",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Denmark: [
    {
      id: "cvr",
      label: "CVR",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Estonia: [
    {
      id: "registrikood",
      label: "Registrikood",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Finland: [
    {
      id: "ytunnus",
      label: "Y-tunnus (Business ID)",
      pattern: "^[0-9]{7}-[0-9]$",
      primary: true,
    },
  ],
  France: [
    {
      id: "siren",
      label: "SIREN",
      pattern: "^[0-9]{9}$",
      primary: true,
      hint: "9 digits. Main legal-entity identifier in France.",
    },
    {
      id: "siret",
      label: "SIRET (establishment)",
      pattern: "^[0-9]{14}$",
      hint: "14 digits. SIREN + 5-digit establishment code (NIC).",
    },
  ],
  Germany: [
    {
      id: "de_business_id",
      label: "Handelsregister / Steuernummer",
      pattern: "^[A-Z0-9\\s\\-\\/.]{5,30}$",
      primary: true,
      hint: "Use either Handelsregister reference or Steuernummer (format varies by case).",
    },
  ],
  Greece: [
    {
      id: "afm",
      label: "AFM (Tax ID)",
      pattern: "^[0-9]{9}$",
      primary: true,
      hint: "9-digit Greek Tax Identification Number.",
    },
  ],
  Hungary: [
    {
      id: "tax",
      label: "Tax number (8-1-1)",
      pattern: "^[0-9]{8}-[0-9]-[0-9]{2}$",
      primary: true,
    },
  ],
  Ireland: [
    {
      id: "ie_cro",
      label: "CRO company number",
      pattern: "^[0-9]{1,6}$",
      primary: true,
    },
  ],
  Italy: [
    {
      id: "cf",
      label: "Codice Fiscale (business)",
      pattern: "^[A-Z0-9]{11,16}$",
      primary: true,
    },
  ],
  Latvia: [
    {
      id: "reg",
      label: "Reģ. Nr. / Registration No.",
      pattern: "^[0-9]{11}$",
      primary: true,
    },
  ],
  Lithuania: [
    {
      id: "code",
      label: "Juridinio asmens kodas",
      pattern: "^[0-9]{7,9}$",
      primary: true,
    },
  ],
  Luxembourg: [
    {
      id: "rcs",
      label: "RCS / Trade register no.",
      pattern: "^.{3,30}$",
      primary: true,
    },
  ],
  Malta: [
    {
      id: "mt_cro",
      label: "CRO / company registration no.",
      pattern: "^[A-Z0-9\\/\\-]{3,20}$",
      primary: true,
    },
  ],
  Netherlands: [
    {
      id: "kvk",
      label: "KvK-nummer",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Poland: [
    {
      id: "nip",
      label: "NIP (without PL prefix)",
      pattern: "^[0-9]{10}$",
      primary: true,
    },
  ],
  Portugal: [
    {
      id: "nipc",
      label: "NIPC",
      pattern: "^[0-9]{9}$",
      primary: true,
    },
  ],
  Romania: [
    {
      id: "cui",
      label: "CUI / CIF (numeric)",
      pattern: "^[0-9]{2,10}$",
      primary: true,
    },
  ],
  Slovakia: [
    {
      id: "ico",
      label: "IČO",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Slovenia: [
    {
      id: "davcna",
      label: "Davčna številka (tax no.)",
      pattern: "^[0-9]{8}$",
      primary: true,
    },
  ],
  Spain: [
    {
      id: "nif",
      label: "NIF / CIF",
      pattern: "^[A-Z0-9][0-9]{7}[A-Z0-9]$",
      primary: true,
      hint: "9 characters. Supports NIE/NIF/CIF variants (letter or digit prefix).",
    },
  ],
  Sweden: [
    {
      id: "orgnr",
      label: "Organisationsnummer",
      pattern: "^[0-9]{6}-?[0-9]{4}$",
      primary: true,
      hint: "10 digits, often written with a dash (e.g. 123456-7890).",
    },
  ],
});

/**
 * @param {string} countryName English label from address country select
 * @returns {CompanyIdentifierRule[]}
 */
export function getCompanyIdentityIdentifiers(countryName) {
  const key = (countryName ?? "").trim();
  if (!COUNTRIES.includes(key)) return [];
  const list = COMPANY_IDENTITY_RULES_BY_COUNTRY[key];
  return list ? [...list] : [];
}

/**
 * Rule used for the single `tic` field: explicit `primary`, else first entry.
 * The `tic` field is required for invoice flow in all supported countries.
 * @param {string} countryName
 * @returns {CompanyIdentifierRule | null}
 */
export function getPrimaryCompanyIdentityRule(countryName) {
  const list = getCompanyIdentityIdentifiers(countryName);
  if (!list.length) return null;
  const primary = list.find((r) => r.primary);
  if (primary) return primary;
  return list[0];
}

/**
 * @param {string} ticRaw
 * @param {string} countryName
 * @returns {{ ok: boolean, message?: string }}
 */
export function validatePrimaryCompanyIdentity(ticRaw, countryName) {
  const primary = getPrimaryCompanyIdentityRule(countryName);
  if (!primary) return { ok: true };

  const tic = (ticRaw ?? "").trim();
  if (!tic) {
    return {
      ok: false,
      message: `${primary.label} is required.`,
    };
  }
  let re;
  try {
    re = new RegExp(primary.pattern);
  } catch {
    return { ok: false, message: `Invalid rule pattern for ${primary.label}.` };
  }

  if (!re.test(tic)) {
    return {
      ok: false,
      message: primary.hint
        ? `Invalid ${primary.label}. ${primary.hint}`
        : `Invalid format for ${primary.label}.`,
    };
  }
  return { ok: true };
}
