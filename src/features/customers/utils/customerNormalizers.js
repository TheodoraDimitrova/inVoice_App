import { CUSTOMER_FORM_DEFAULTS } from "../constants/customerConstants";

export function normalizeStoredCustomer(data, id) {
  const customerType =
    data?.customerType === "individual" ? "individual" : "business";

  return {
    id,
    ...CUSTOMER_FORM_DEFAULTS,
    customerType,
    customerName: String(data?.customerName || data?.name || "").trim(),
    customerCountry: String(data?.customerCountry || "Bulgaria").trim(),
    companyIdentifier:
      customerType === "business"
        ? String(data?.companyIdentifier || "").trim()
        : "",
    customerVatRegistered:
      customerType === "business" && Boolean(data?.customerVatRegistered),
    customerVatNumber:
      customerType === "business"
        ? String(data?.customerVatNumber || "").trim().toUpperCase()
        : "",
    customerAddress: String(data?.customerAddress || "").trim(),
    customerPostCode: String(data?.customerPostCode || "").trim(),
    customerCity: String(data?.customerCity || "").trim(),
    customerEmail: String(data?.customerEmail || "").trim(),
  };
}
