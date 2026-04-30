import { useMemo } from "react";
import { lineGross, lineNetBeforeVat, lineVatAmount } from "../../../utils/invoiceLineNet";

export const useInvoiceTotals = ({
  invoiceItems,
  defaultBusinessVatRate,
  isBusinessVatRegistered,
}) =>
  useMemo(() => {
    const subtotal = invoiceItems.reduce((sum, item) => sum + lineGross(item), 0);
    const netSubtotal = invoiceItems.reduce(
      (sum, item) => sum + lineNetBeforeVat(item),
      0,
    );
    const discountTotal = Math.max(0, subtotal - netSubtotal);
    const vatTotal = invoiceItems.reduce(
      (sum, item) => sum + lineVatAmount(item, defaultBusinessVatRate),
      0,
    );
    const grandTotal = netSubtotal + vatTotal;
    const uniqueRates = [
      ...new Set(invoiceItems.map((item) => Number(item.itemVatRate) || 0)),
    ];
    const vatLabel = !isBusinessVatRegistered
      ? "ДДС: не се начислява"
      : uniqueRates.length === 1
        ? `ДДС (${uniqueRates[0].toFixed(0)}%)`
        : "ДДС (смесени ставки)";

    return { subtotal, discountTotal, vatTotal, grandTotal, vatLabel };
  }, [invoiceItems, defaultBusinessVatRate, isBusinessVatRegistered]);
