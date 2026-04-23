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
  Bulgaria: [
    {
      id: "eik",
      label: "EIK / BULSTAT",
      pattern: "^(?:[0-9]{9}|[0-9]{10})$",
      primary: true,
      hint: "Фирма (9 цифри) или Фрийлансър (10 цифри).",
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
