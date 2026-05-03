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

/** Маркиране като платена е позволено само за издадена (неплатена) фактура. */
export function canMarkInvoicePaid(data) {
  return normalizeInvoiceLifecycleStatus(data) === INVOICE_STATUS.ISSUED;
}

export function isInvoiceLifecyclePaid(data) {
  return normalizeInvoiceLifecycleStatus(data) === INVOICE_STATUS.PAID;
}

/**
 * Защо persist към Firestore не е позволен (редакция на съществуваща фактура).
 * @param {{ isEditing: boolean, lifecycleStatus: string, persistAction: string }} p
 * @param {string} p.persistAction — `"draft"` | `"issued"` (както payload status)
 * @returns {null | 'paid_immutable' | 'issued_cannot_revert_to_draft'}
 */
export function getInvoicePersistBlockReason({
  isEditing,
  lifecycleStatus,
  persistAction,
}) {
  if (!isEditing) return null;
  if (lifecycleStatus === INVOICE_STATUS.PAID) return "paid_immutable";
  if (
    lifecycleStatus === INVOICE_STATUS.ISSUED &&
    persistAction === INVOICE_STATUS.DRAFT
  ) {
    return "issued_cannot_revert_to_draft";
  }
  return null;
}

/**
 * Вариант на успешно съобщение след persist (UI мапва към текст).
 * @param {{ persistIssued: boolean, isEditing: boolean, lifecycleStatus: string }} p
 * @returns {'update_issued' | 'first_issue' | 'save_draft'}
 */
export function getInvoicePersistSuccessKind({
  persistIssued,
  isEditing,
  lifecycleStatus,
}) {
  if (
    persistIssued &&
    isEditing &&
    lifecycleStatus === INVOICE_STATUS.ISSUED
  ) {
    return "update_issued";
  }
  if (persistIssued) return "first_issue";
  return "save_draft";
}

const INVOICE_LIFECYCLE_LABEL_BG = {
  [INVOICE_STATUS.DRAFT]: "Чернова",
  [INVOICE_STATUS.ISSUED]: "Издадена",
  [INVOICE_STATUS.PAID]: "Платена",
};

/** Етикет за UI по нормализиран lifecycle (BG). */
export function getInvoiceLifecycleLabel(invoiceData) {
  const s = normalizeInvoiceLifecycleStatus(invoiceData);
  return (
    INVOICE_LIFECYCLE_LABEL_BG[s] ??
    INVOICE_LIFECYCLE_LABEL_BG[INVOICE_STATUS.ISSUED]
  );
}

/**
 * Текст за „номер“ на фактура в списъци/преглед: чернова или допълнен числов id.
 */
export function getInvoiceBadgeLabel(invoiceData) {
  const n = Number(invoiceData?.id);
  const hasNumber = Number.isFinite(n) && n > 0;
  const status = normalizeInvoiceLifecycleStatus(invoiceData);
  if (!hasNumber || status === INVOICE_STATUS.DRAFT) {
    return INVOICE_LIFECYCLE_LABEL_BG[INVOICE_STATUS.DRAFT];
  }
  return String(n).padStart(10, "0");
}

/**
 * Флагове за UI на контейнера „създай/редактирай фактура“ (persist + диалози).
 * Контейнерът не клонира по `INVOICE_STATUS` — само чете този обект.
 * @param {string} lifecycleStatus — нормализиран `draft` | `issued` | `paid`
 */
export function getInvoiceEditorPersistUiConfig(lifecycleStatus) {
  const isDraft = lifecycleStatus === INVOICE_STATUS.DRAFT;
  const isIssued = lifecycleStatus === INVOICE_STATUS.ISSUED;
  return {
    syncDueDateFromIssueDate: isDraft,
    closeSaveDialogOnIssued: isIssued,
    primaryPersistLabelKind: isIssued ? "save_changes" : "save_invoice",
    showSaveChoiceDialog: isDraft,
    primaryPersistRunsIssuedImmediately: isIssued,
  };
}

/** Същото като `getInvoiceEditorPersistUiConfig` (по-кратко име). */
export const getInvoicePersistConfig = getInvoiceEditorPersistUiConfig;

/**
 * Пропсове за презентационен badge: етикет + тон за цвят/икона (`draft` | `issued` | `paid`).
 */
export function getInvoiceStatusBadgePresentation(invoiceData) {
  const statusTone = normalizeInvoiceLifecycleStatus(invoiceData);
  return {
    statusTone,
    label: getInvoiceLifecycleLabel(invoiceData),
  };
}
