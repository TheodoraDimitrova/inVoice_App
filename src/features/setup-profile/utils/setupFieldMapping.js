export const SETUP_FIELD_TO_PANEL = {
  businessName: "company",
  email: "company",
  phone: "company",
  businessAddress: "address",
  postCode: "address",
  city: "address",
  country: "address",
  isVatRegistered: "tax",
  vat: "tax",
  tic: "tax",
  currency: "tax",
  vatRate: "tax",
  bankName: "bank",
  iban: "bank",
  swift: "bank",
  noBankDetailsOnInvoices: "bank",
  logo: "logo",
};

export const SETUP_PANEL_LABELS = {
  address: "Адрес на фирмата",
  tax: "Данъци и регистрация",
  bank: "Банкови данни",
  logo: "Лого",
};

export const SETUP_PANEL_ORDER = ["address", "tax", "bank", "logo"];

export const SETUP_FIELD_SCROLL_ORDER = [
  "businessName",
  "email",
  "phone",
  "businessAddress",
  "postCode",
  "city",
  "country",
  "isVatRegistered",
  "vat",
  "tic",
  "currency",
  "vatRate",
  "bankName",
  "iban",
  "swift",
  "noBankDetailsOnInvoices",
];

export const setupDefaultFormValues = {
  businessName: "",
  email: "",
  phone: "",
  businessAddress: "",
  postCode: "",
  city: "",
  country: "Bulgaria",
  isVatRegistered: false,
  vat: "",
  tic: "",
  currency: "EUR",
  vatRate: 20,
  bankName: "",
  iban: "",
  swift: "",
  noBankDetailsOnInvoices: false,
};
