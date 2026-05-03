/** Канонична държава за BG фирми във форми и Firestore. */
export const DEFAULT_COUNTRY_BG = "България";

/** Legacy `Bulgaria` / празно → канон за профил и списъци. */
export function normalizeCountryForProfile(value) {
  const s = String(value ?? "").trim();
  if (!s) return DEFAULT_COUNTRY_BG;
  if (s === "Bulgaria" || s.toLowerCase() === "bulgaria") {
    return DEFAULT_COUNTRY_BG;
  }
  return s;
}

export const COUNTRIES = [
  "Austria",
  "Belgium",
  DEFAULT_COUNTRY_BG,
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Germany",
  "Greece",
  "Hungary",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
];
