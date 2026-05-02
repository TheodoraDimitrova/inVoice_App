import { toDateInput } from "../utils/date";

export const CURRENCY_SYMBOLS = {
  EUR: "\u20ac",
  BGN: "\u043b\u0432",
  USD: "$",
  GBP: "\u00a3",
};

export const INVOICE_CURRENCY_OPTIONS = ["EUR", "BGN", "USD", "GBP"];

export const VAT_EXEMPT_DEFAULT_NOTE =
  "Основание за неначисляване на ДДС: чл. 113, ал. 9 от ЗДДС";

export const VAT_RATE_OPTIONS = [20, 9, 0];

export const sectionIconBoxSx = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: 44,
  height: 44,
  borderRadius: "50%",
  flexShrink: 0,
  color: "var(--color-brand-primary)",
  bgcolor: "var(--color-brand-accent)",
  boxShadow: "var(--section-icon-tile-shadow)",
  "& .MuiSvgIcon-root": {
    fontSize: "1.375rem",
    opacity: 0.96,
  },
};

export const sectionShellSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: 2,
  bgcolor: "rgba(15, 23, 42, 0.04)",
  border: "1px solid",
  borderColor: "rgba(15, 23, 42, 0.08)",
};

export const createDefaultInvoiceFormValues = () => ({
  customerType: "business",
  issueDate: toDateInput(new Date()),
  dueDate: toDateInput(new Date()),
  currency: "EUR",
  customerName: "",
  customerCountry: "Bulgaria",
  companyIdentifier: "",
  customerVatRegistered: false,
  customerVatNumber: "",
  customerAddress: "",
  customerPostCode: "",
  customerCity: "",
  customerEmail: "",
  includeInvoiceNote: false,
  invoiceNote: "",
  itemList: [],
});
