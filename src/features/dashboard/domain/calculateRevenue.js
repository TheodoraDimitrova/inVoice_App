import { computeInvoiceGrandTotalNumber } from "../../../utils/invoiceMetrics";

export function calculateMonthlyRevenue(invoices, vatRate) {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).getTime();

  let monthlyRevenue = 0;
  let issuedCount = 0;
  let paidCount = 0;
  let unpaidCount = 0;

  for (const invoice of invoices) {
    const data = invoice?.data;
    if (!data || data.status === "draft") continue;

    const ts = data.timestamp?.seconds ? data.timestamp.seconds * 1000 : Number.NaN;
    const isCurrentMonth = Number.isFinite(ts) && ts >= monthStart && ts < monthEnd;
    if (!isCurrentMonth) continue;

    issuedCount += 1;
    monthlyRevenue += computeInvoiceGrandTotalNumber(data.itemList, vatRate);

    const paymentStatus = String(data.paymentStatus || "").toLowerCase();
    const isPaid =
      paymentStatus === "paid" || paymentStatus === "completed" || data.paid === true;
    if (isPaid) {
      paidCount += 1;
    } else {
      unpaidCount += 1;
    }
  }

  return {
    monthlyRevenue,
    issuedCount,
    paidCount,
    unpaidCount,
    averageInvoiceValue: issuedCount > 0 ? monthlyRevenue / issuedCount : 0,
  };
}
