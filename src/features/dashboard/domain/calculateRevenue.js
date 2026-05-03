import { parseIssueDateLocalMs } from "../../../utils/invoiceIssueDateMs";
import {
  INVOICE_STATUS,
  normalizeInvoiceLifecycleStatus,
} from "../../../utils/invoiceLifecycle";
import {
  computeInvoiceGrandTotalNumber,
  computeInvoiceNetTotalNumber,
} from "../../../utils/invoiceMetrics";

export function calculateMonthlyRevenue(invoices, vatRate, isVatRegistered) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

  let monthlyRevenue = 0;
  let monthlyRevenueNet = 0;
  let issuedCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  for (const invoice of invoices) {
    const data = invoice?.data;
    if (!data) continue;
    const life = normalizeInvoiceLifecycleStatus(data);
    if (life === INVOICE_STATUS.DRAFT) continue;

    const issueMs = parseIssueDateLocalMs(data.issueDate);
    const isCurrentMonth =
      Number.isFinite(issueMs) && issueMs >= monthStart && issueMs < monthEnd;
    if (!isCurrentMonth) continue;

    issuedCount += 1;
    if (isVatRegistered) {
      monthlyRevenue += computeInvoiceGrandTotalNumber(data.itemList, vatRate);
      monthlyRevenueNet += computeInvoiceNetTotalNumber(data.itemList);
    } else {
      const netOnly = computeInvoiceNetTotalNumber(data.itemList);
      monthlyRevenue += netOnly;
      monthlyRevenueNet += netOnly;
    }

    if (life === INVOICE_STATUS.PAID) {
      paidCount += 1;
    } else {
      unpaidCount += 1;
    }
  }

  return {
    monthlyRevenue,
    monthlyRevenueNet,
    issuedCount,
    paidCount,
    unpaidCount,
    averageInvoiceValue: issuedCount > 0 ? monthlyRevenue / issuedCount : 0,
  };
}
