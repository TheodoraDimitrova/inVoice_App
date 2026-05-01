import React from "react";
import {
  formatInvoiceBadge,
  formatStoredDate,
} from "../utils/invoiceFormatters";

const InvoiceMetaBlock = ({ invoice, isPreview }) => {
  if (!invoice) return null;

  const previewNumber = Number(invoice?.id);
  const hasPreviewNumber = Number.isFinite(previewNumber) && previewNumber > 0;

  return (
    <div className="py-2 text-right">
      {isPreview && !hasPreviewNumber ? (
        <p className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800 mb-3">
          ПРЕГЛЕД (НЕЗАПИСАНО)
        </p>
      ) : null}
      <h3 className="text-6xl text-gray-700 mb-4">Фактура</h3>
      <p className="text-sm font-medium">
        №: <span className="ml-2 text-sm">{formatInvoiceBadge(invoice)}</span>
      </p>
      <p className="text-sm font-medium">
        Дата на издаване:{" "}
        <span className="ml-2 text-sm">
          {formatStoredDate(invoice.issueDate, invoice.timestamp)}
        </span>
      </p>
      <p className="text-sm font-medium">
        Падеж:{" "}
        <span className="ml-2 text-sm">
          {formatStoredDate(invoice.dueDate, invoice.timestamp)}
        </span>
      </p>
    </div>
  );
};

export default InvoiceMetaBlock;
