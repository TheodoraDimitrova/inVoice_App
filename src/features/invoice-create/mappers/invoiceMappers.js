import { parseLocaleNumber } from "../utils/number";

export const toInvoiceItem = (row, isBusinessVatRegistered) => {
  const unit = String(row.itemUnit || "").trim() || "бр.";
  const pct = parseLocaleNumber(row.itemDiscountPercent);
  const pctSafe = Number.isFinite(pct) ? pct : parseLocaleNumber(row.itemDiscount);
  const amountSafe = Math.max(0, parseLocaleNumber(row.itemDiscountAmount));
  const discountMode =
    row.itemDiscountMode === "amount" || amountSafe > 0 ? "amount" : "percent";
  const normalizedPercent =
    discountMode === "amount" && amountSafe > 0
      ? 0
      : Math.min(100, Math.max(0, pctSafe));
  const normalizedAmount =
    discountMode === "percent" && Math.min(100, Math.max(0, pctSafe)) > 0
      ? 0
      : amountSafe;

  return {
    itemName: String(row.itemName || "").trim(),
    itemKind: row.itemKind === "service" ? "service" : "product",
    itemUnit: unit,
    itemCost: parseLocaleNumber(row.itemCost),
    itemQuantity: parseLocaleNumber(row.itemQuantity),
    itemVatRate: isBusinessVatRegistered ? parseLocaleNumber(row.itemVatRate) : 0,
    itemDiscountPercent: normalizedPercent,
    itemDiscountAmount: normalizedAmount,
    itemDiscount: normalizedPercent,
  };
};

export const toPreviewData = ({
  formData,
  invoiceItems,
  invoiceNumberPreview,
  getValidInvoiceNumber,
}) => {
  const previewInvoiceNumber = getValidInvoiceNumber(invoiceNumberPreview);
  const nowMs = Date.now();
  return {
    id: previewInvoiceNumber,
    status: previewInvoiceNumber ? "issued" : "draft",
    customerName: formData.customerName,
    customerType: formData.customerType,
    customerAddress: formData.customerAddress,
    customerPostCode: formData.customerPostCode,
    customerCity: formData.customerCity,
    customerCountry: formData.customerCountry,
    customerEmail: formData.customerEmail,
    companyIdentifier: formData.companyIdentifier || "",
    customerVatRegistered: Boolean(formData.customerVatRegistered),
    customerVatNumber: formData.customerVatNumber || "",
    includeInvoiceNote: Boolean(formData.includeInvoiceNote),
    invoiceNote: formData.includeInvoiceNote
      ? String(formData.invoiceNote || "").trim()
      : "",
    currency: (formData.currency || "EUR").toUpperCase(),
    issueDate: formData.issueDate,
    dueDate: (formData.dueDate || "").trim() || formData.issueDate,
    itemList: invoiceItems,
    timestamp: {
      seconds: Math.floor(nowMs / 1000),
      nanoseconds: (nowMs % 1000) * 1000000,
    },
  };
};
