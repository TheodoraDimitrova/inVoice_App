import React from "react";
import { identifierLabelFromDigits } from "../utils/invoiceFormatters";

const InvoiceCustomerBlock = ({ invoice }) => {
  if (!invoice) return null;

  const postCity = [invoice.customerPostCode, invoice.customerCity]
    .filter(Boolean)
    .join(" ");
  const locationBits = [postCity, invoice.customerCountry].filter(Boolean).join(", ");
  const mid = [invoice.customerAddress, locationBits].filter(Boolean).join(" · ");
  const tail = [mid, invoice.customerEmail].filter(Boolean).join(" | ");

  return (
    <div className="rounded-lg border border-slate-200/90 bg-[#f9fafb] px-3 py-2.5 sm:px-3.5 sm:py-3 print:border-slate-300 print:bg-slate-50">
      <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
        Получател
      </p>
      <p className="mt-1 text-sm font-bold leading-snug text-slate-900 sm:text-[0.95rem]">
        {invoice.customerName}
      </p>
      {invoice.customerType === "business" &&
      String(invoice.companyIdentifier || "").trim() ? (
        <p className="mt-0.5 text-xs font-semibold text-slate-700">
          {identifierLabelFromDigits(invoice.companyIdentifier)}:{" "}
          <span className="tabular-nums">{invoice.companyIdentifier}</span>
        </p>
      ) : null}
      {tail ? (
        <p className="mt-1 text-[11px] leading-snug text-slate-600 sm:text-xs">{tail}</p>
      ) : null}
      {invoice.customerVatRegistered && invoice.customerVatNumber ? (
        <p className="mt-1 text-[11px] text-slate-600 sm:text-xs">
          ДДС номер:{" "}
          <span className="font-medium tabular-nums">{invoice.customerVatNumber}</span>
        </p>
      ) : null}
    </div>
  );
};

export default InvoiceCustomerBlock;
