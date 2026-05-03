import { formatStoredDate } from "../features/invoice-view/utils/invoiceFormatters";
import {
  getInvoiceBadgeLabel,
  getInvoiceStatusBadgePresentation,
} from "./invoiceLifecycle";
import { computeInvoiceGrandTotalNumber } from "./invoiceMetrics";

/**
 * Подготвя редове за таблицата с фактури (табло / списък).
 * Сметките и форматирането са тук, не в UI компонента Table.
 */
export function buildInvoiceTableRows(invoices, defaultVatRate = 0) {
  if (!Array.isArray(invoices)) return [];
  return invoices.map((invoice) => {
    const invoiceData = invoice.data || {};
    const rowCurrency = String(invoiceData.currency || "EUR").toUpperCase();
    const rowVatRate = Number(invoiceData.vatRate);
    const computedTotal = computeInvoiceGrandTotalNumber(
      invoiceData.itemList,
      Number.isFinite(rowVatRate) ? rowVatRate : defaultVatRate,
    );
    return {
      id: invoice.id,
      invoiceData,
      issueDateLabel: formatStoredDate(
        invoiceData.issueDate,
        invoiceData.timestamp,
      ),
      badgeLabel: getInvoiceBadgeLabel(invoiceData),
      statusBadge: getInvoiceStatusBadgePresentation(invoiceData),
      customerName: invoiceData.customerName || "—",
      amountLabel: `${computedTotal.toFixed(2)} ${rowCurrency}`,
    };
  });
}
