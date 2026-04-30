import { CURRENCY_SYMBOLS } from "../constants/invoiceConstants";

export const parseLocaleNumber = (value) => {
  const normalized = String(value ?? "")
    .trim()
    .replace(/\s+/g, "")
    .replace(",", ".");
  const n = Number(normalized);
  return Number.isFinite(n) ? n : 0;
};

export const hasRowInput = (row) =>
  String(row?.itemName || "").trim() !== "" ||
  parseLocaleNumber(row?.itemCost) > 0 ||
  parseLocaleNumber(row?.itemQuantity) > 0;

export const getValidInvoiceNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : null;
};

export const currencySymbol = (code) =>
  CURRENCY_SYMBOLS[(code || "").toUpperCase()] ||
  (code || "").toUpperCase() ||
  "\u20ac";
