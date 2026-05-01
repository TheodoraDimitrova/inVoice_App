import { lineNetBeforeVat, lineVatAmount } from "./invoiceLineNet";

/**
 * Line totals aligned with ViewInvoice / findGrandTotal logic (VAT on net after discounts).
 */

export function computeInvoiceGrandTotalNumber(itemList, vatRate) {
  if (!Array.isArray(itemList) || itemList.length === 0) return 0;
  let total = 0;
  for (let i = 0; i < itemList.length; i++) {
    const item = itemList[i];
    total += lineNetBeforeVat(item) + lineVatAmount(item, vatRate);
  }
  return total;
}

/**
 * @param {Array<{ data: object, id: string }>} invoices
 * @param {number|string} defaultVatRate from business profile
 */
export function aggregateDashboardMetrics(invoices, defaultVatRate) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  ).getTime();

  let monthlyRevenue = 0;
  let currency = "EUR";
  let issuedCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  for (const inv of invoices) {
    const d = inv.data;
    if (!d || d.status === "draft") continue;

    if (d.currency && typeof d.currency === "string") {
      currency = d.currency;
    }

    const ts = d.timestamp?.seconds
      ? d.timestamp.seconds * 1000
      : Number.NaN;
    const isCurrentMonth = Number.isFinite(ts) && ts >= monthStart && ts < monthEnd;
    if (!isCurrentMonth) continue;

    issuedCount += 1;
    monthlyRevenue += computeInvoiceGrandTotalNumber(d.itemList, defaultVatRate);

    const paymentStatus = String(d.paymentStatus || "").toLowerCase();
    const isPaid =
      paymentStatus === "paid" ||
      paymentStatus === "completed" ||
      d.paid === true;
    if (isPaid) {
      paidCount += 1;
    } else {
      unpaidCount += 1;
    }
  }

  const averageInvoiceValue = issuedCount > 0 ? monthlyRevenue / issuedCount : 0;

  return {
    monthlyRevenue,
    averageInvoiceValue,
    currency,
    issuedCount,
    paidCount,
    unpaidCount,
  };
}
