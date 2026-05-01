import {
  lineGross,
  lineNetBeforeVat,
  lineVatAmount,
  lineTotalWithVat,
} from "../../../utils/invoiceLineNet";

export const getInvoiceTotals = ({ invoiceItems, fallbackVatRate }) => {
  const grossSubtotal = invoiceItems.reduce((sum, item) => sum + lineGross(item), 0);
  const netSubtotal = invoiceItems.reduce(
    (sum, item) => sum + lineNetBeforeVat(item),
    0,
  );
  const discountTotal = Math.max(0, grossSubtotal - netSubtotal);
  const vatAmount = invoiceItems.reduce(
    (sum, item) => sum + lineVatAmount(item, fallbackVatRate),
    0,
  );
  const grandTotal = netSubtotal + vatAmount;

  return {
    grossSubtotal,
    netSubtotal,
    discountTotal,
    vatAmount,
    grandTotal,
  };
};

export const hasDiscountInItems = (invoiceItems) =>
  invoiceItems.some((item) => {
    const pct =
      item?.itemDiscountPercent != null
        ? Number(item.itemDiscountPercent) || 0
        : Number(item?.itemDiscount) || 0;
    const amt = Number(item?.itemDiscountAmount) || 0;
    return pct > 0 || amt > 0;
  });

export const toLineTotal = (item, fallbackVatRate) =>
  lineTotalWithVat(item, fallbackVatRate);

export const toDiscountAmount = (item) =>
  Math.max(0, lineGross(item) - lineNetBeforeVat(item));
