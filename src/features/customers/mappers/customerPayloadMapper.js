export function toCustomerPayload(customerData) {
  const customerType =
    customerData.customerType === "individual" ? "individual" : "business";

  return {
    customerType,
    customerName: String(customerData.customerName || "").trim(),
    customerCountry: String(customerData.customerCountry || "Bulgaria").trim(),
    companyIdentifier:
      customerType === "business"
        ? String(customerData.companyIdentifier || "").trim()
        : "",
    customerVatRegistered:
      customerType === "business" && Boolean(customerData.customerVatRegistered),
    customerVatNumber:
      customerType === "business"
        ? String(customerData.customerVatNumber || "").trim().toUpperCase()
        : "",
    customerAddress: String(customerData.customerAddress || "").trim(),
    customerPostCode: String(customerData.customerPostCode || "").trim(),
    customerCity: String(customerData.customerCity || "").trim(),
    customerEmail: String(customerData.customerEmail || "").trim(),
  };
}
