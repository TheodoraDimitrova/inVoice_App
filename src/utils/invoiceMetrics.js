/**
 * Line totals aligned with ViewInvoice / findGrandTotal logic (VAT on net).
 */

function lineNet(item) {
  const cost = Number(item.itemCost) || 0;
  const qty = Number(item.itemQuantity) || 0;
  const disc = Number(item.itemDiscount) || 0;
  return cost * qty - (cost * qty * disc) / 100;
}

export function computeInvoiceGrandTotalNumber(itemList, vatRate) {
  if (!Array.isArray(itemList) || itemList.length === 0) return 0;
  let net = 0;
  for (let i = 0; i < itemList.length; i++) {
    net += lineNet(itemList[i]);
  }
  const v = parseFloat(vatRate);
  const rate = Number.isNaN(v) ? 20 : v;
  return net * ((100 + rate) / 100);
}

/**
 * @param {Array<{ data: object, id: string }>} invoices
 * @param {number|string} defaultVatRate from business profile
 */
export function aggregateDashboardMetrics(invoices, defaultVatRate) {
  let totalRevenue = 0;
  let currency = "EUR";
  let pendingCount = 0;
  let draftsCount = 0;

  for (const inv of invoices) {
    const d = inv.data;
    if (d.currency && typeof d.currency === "string") {
      currency = d.currency;
    }
    totalRevenue += computeInvoiceGrandTotalNumber(d.itemList, defaultVatRate);

    const ps = d.paymentStatus;
    if (ps === "unpaid" || ps === "pending" || ps === "overdue") {
      pendingCount += 1;
    } else if (d.paid === false) {
      pendingCount += 1;
    }

    if (d.status === "draft") {
      draftsCount += 1;
    }
  }

  return {
    totalRevenue,
    currency,
    pendingCount,
    draftsCount,
  };
}
