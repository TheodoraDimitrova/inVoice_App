/**  lifecycle status : draft → issued → paid */
export const INVOICE_STATUS = {
  DRAFT: "draft",
  ISSUED: "issued",
  PAID: "paid",
};

export function normalizeInvoiceLifecycleStatus(data) {
  if (!data || typeof data !== "object") return INVOICE_STATUS.DRAFT;
  if (data.status === INVOICE_STATUS.PAID) return INVOICE_STATUS.PAID;
  if (data.status === INVOICE_STATUS.DRAFT) return INVOICE_STATUS.DRAFT;

  const ps = String(data.paymentStatus || "").toLowerCase();
  const legacyPaid = data.paid === true || ps === "paid" || ps === "completed";

  if (data.status === INVOICE_STATUS.ISSUED && legacyPaid) {
    return INVOICE_STATUS.PAID;
  }

  if (legacyPaid) return INVOICE_STATUS.PAID;

  if (
    data.status === INVOICE_STATUS.ISSUED ||
    data.status == null ||
    data.status === ""
  ) {
    return INVOICE_STATUS.ISSUED;
  }

  return INVOICE_STATUS.ISSUED;
}

export function canDeleteInvoiceLifecycle(status) {
  return status === INVOICE_STATUS.DRAFT;
}

export function canEditInvoiceLifecycle(status) {
  return status === INVOICE_STATUS.DRAFT || status === INVOICE_STATUS.ISSUED;
}

export function shouldIncludeInvoiceInMetrics(status) {
  return status === INVOICE_STATUS.ISSUED || status === INVOICE_STATUS.PAID;
}
