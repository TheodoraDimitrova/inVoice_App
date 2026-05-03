import React from "react";
import {
  formatInvoiceBadge,
  formatStoredDate,
} from "../utils/invoiceFormatters";

const InvoiceMetaBlock = ({ invoice, isPreview }) => {
  if (!invoice) return null;

  const previewNumber = Number(invoice?.id);
  const hasPreviewNumber = Number.isFinite(previewNumber) && previewNumber > 0;
  const badge = formatInvoiceBadge(invoice);
  const issue = formatStoredDate(invoice.issueDate, invoice.timestamp);
  const due = formatStoredDate(invoice.dueDate, invoice.timestamp);

  return (
    <div className="flex w-full flex-col items-stretch space-y-2 sm:items-end sm:text-right">
      {isPreview && !hasPreviewNumber ? (
        <p className="inline-flex self-start rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-800 sm:self-end print:hidden">
          Преглед
        </p>
      ) : null}

      <p className="text-[1.65rem] font-black leading-none tracking-tight text-slate-900 sm:text-[1.85rem] print:text-[1.5rem]">
        ФАКТУРА{" "}
        <span className="text-lg font-bold tabular-nums text-slate-800 sm:text-xl print:text-base">
          № {badge}
        </span>
      </p>

      <div className="space-y-0.5 text-sm text-slate-800">
        <p>
          <span className="text-slate-500">Дата на издаване: </span>
          <span className="font-semibold tabular-nums">{issue}</span>
        </p>
        <p>
          <span className="text-slate-500">Падеж: </span>
          <span className="font-semibold tabular-nums">{due}</span>
        </p>
      </div>
    </div>
  );
};

export default InvoiceMetaBlock;
