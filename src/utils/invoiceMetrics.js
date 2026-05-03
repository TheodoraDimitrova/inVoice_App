import { parseIssueDateLocalMs } from "./invoiceIssueDateMs";
import {
  INVOICE_STATUS,
  normalizeInvoiceLifecycleStatus,
} from "./invoiceLifecycle";
import { lineNetBeforeVat, lineVatAmount } from "./invoiceLineNet";

export function computeInvoiceGrandTotalNumber(itemList, vatRate) {
  if (!Array.isArray(itemList) || itemList.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    const item = itemList[i];
    total += lineNetBeforeVat(item) + lineVatAmount(item, vatRate);
  }
  return total;
}

/** Sum of line nets (discount-adjusted), excludes VAT — за разбивка „без ДДС“. */
export function computeInvoiceNetTotalNumber(itemList) {
  if (!Array.isArray(itemList) || itemList.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    total += lineNetBeforeVat(itemList[i]);
  }
  return total;
}

/**
 * @param {Array<{ data: object, id: string }>} invoices
 * @param {number|string} defaultVatRate from business profile
 */
export function aggregateDashboardMetrics(
  invoices,
  defaultVatRate,
  isVatRegistered = true,
) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

  let monthlyRevenue = 0;
  let monthlyRevenueNet = 0;
  let currency = "EUR";
  let issuedCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  for (const inv of invoices) {
    const d = inv.data;
    if (!d) continue;
    const life = normalizeInvoiceLifecycleStatus(d);
    if (life === INVOICE_STATUS.DRAFT) continue;

    if (d.currency && typeof d.currency === "string") {
      currency = d.currency;
    }

    const issueMs = parseIssueDateLocalMs(d.issueDate);
    const isCurrentMonth =
      Number.isFinite(issueMs) && issueMs >= monthStart && issueMs < monthEnd;
    if (!isCurrentMonth) continue;

    issuedCount += 1;
    if (isVatRegistered) {
      monthlyRevenue += computeInvoiceGrandTotalNumber(
        d.itemList,
        defaultVatRate,
      );
      monthlyRevenueNet += computeInvoiceNetTotalNumber(d.itemList);
    } else {
      const netOnly = computeInvoiceNetTotalNumber(d.itemList);
      monthlyRevenue += netOnly;
      monthlyRevenueNet += netOnly;
    }

    if (life === INVOICE_STATUS.PAID) {
      paidCount += 1;
    } else {
      unpaidCount += 1;
    }
  }

  const averageInvoiceValue =
    issuedCount > 0 ? monthlyRevenue / issuedCount : 0;

  return {
    monthlyRevenue,
    monthlyRevenueNet,
    averageInvoiceValue,
    currency,
    issuedCount,
    paidCount,
    unpaidCount,
  };
}
