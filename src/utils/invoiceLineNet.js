/**
 * Net line amount before VAT: (unit price × qty) minus discounts.
 * - itemDiscountPercent: 0–100
 * - itemDiscountAmount: fixed amount in invoice currency
 * Legacy: itemDiscount alone was treated as percent in some UI; if itemDiscountPercent
 * is missing, itemDiscount is used as percent fallback.
 */
export function lineGross(item) {
  const cost = Number(item?.itemCost) || 0;
  const qty = Number(item?.itemQuantity) || 0;
  return cost * qty;
}

export function lineNetBeforeVat(item) {
  const gross = lineGross(item);
  let pct = Number(item?.itemDiscountPercent);
  if (!Number.isFinite(pct)) {
    pct = Number(item?.itemDiscount);
  }
  if (!Number.isFinite(pct)) pct = 0;
  pct = Math.min(100, Math.max(0, pct));

  let amt = Number(item?.itemDiscountAmount);
  if (!Number.isFinite(amt)) amt = 0;
  amt = Math.max(0, amt);

  let net = gross * (1 - pct / 100) - amt;
  if (!Number.isFinite(net) || net < 0) net = 0;
  return net;
}

export function lineVatAmount(item, fallbackVatRate = 0) {
  const net = lineNetBeforeVat(item);
  let rate = Number(item?.itemVatRate);
  if (!Number.isFinite(rate)) rate = Number(fallbackVatRate) || 0;
  rate = Math.max(0, rate);
  return (net * rate) / 100;
}

export function lineTotalWithVat(item, fallbackVatRate = 0) {
  return lineNetBeforeVat(item) + lineVatAmount(item, fallbackVatRate);
}
