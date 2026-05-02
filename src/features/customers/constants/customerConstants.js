export const CUSTOMER_FORM_DEFAULTS = {
  customerType: "business",
  customerName: "",
  customerCountry: "Bulgaria",
  companyIdentifier: "",
  customerVatRegistered: false,
  customerVatNumber: "",
  customerAddress: "",
  customerPostCode: "",
  customerCity: "",
  customerEmail: "",
};

export const createEmptyCustomerForm = () => ({ ...CUSTOMER_FORM_DEFAULTS });

export const CUSTOMER_TYPE_LABELS = {
  business: "Фирма",
  individual: "Физическо лице",
};
