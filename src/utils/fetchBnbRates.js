const BNB_RATES_URL =
  "https://www.bnb.bg/Statistics/StExternalSector/StExchangeRates/StERForeignCurrencies/StERForeignCurrencies.xml";

const parseNumber = (val) => Number(String(val || "").replace(",", ".").trim());

/**
 * Fetch exchange rates from BNB XML feed.
 * Returns map in format: { USD: <rateInBGN>, GBP: <rateInBGN>, BGN: 1, EUR: 1.95583, ... }
 */
export async function fetchBnbRates() {
  const res = await fetch(BNB_RATES_URL);

  if (!res.ok) {
    throw new Error(`BNB fetch failed: ${res.status}`);
  }

  const text = await res.text();
  const xml = new DOMParser().parseFromString(text, "application/xml");

  if (xml.querySelector("parsererror")) {
    throw new Error("Invalid XML from BNB");
  }

  const rows = [...xml.querySelectorAll("ROW")];

  const rates = rows.reduce((acc, row) => {
    const code = row.querySelector("CODE")?.textContent?.trim();
    const units = parseNumber(row.querySelector("UNITS")?.textContent) || 1;
    const rate = parseNumber(row.querySelector("RATE")?.textContent);

    if (
      !code ||
      !Number.isFinite(rate) ||
      !Number.isFinite(units) ||
      units <= 0
    ) {
      return acc;
    }

    acc[code] = rate / units;
    return acc;
  }, {});

  rates.BGN = 1;
  rates.EUR = 1.95583; // Fixed BGN/EUR rate

  return rates;
}

export { BNB_RATES_URL };
