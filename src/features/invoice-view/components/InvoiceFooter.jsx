import React from "react";

const row = ({ label, value, mono }) => (
  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-[11px] leading-snug text-slate-800 sm:text-xs">
    <span className="shrink-0 font-medium text-slate-500">{label}</span>
    <span
      className={`min-w-0 break-all font-semibold text-slate-900 ${
        mono ? "font-mono text-[11px] tracking-tight tabular-nums sm:text-[0.8rem]" : ""
      }`}
    >
      {value}
    </span>
  </div>
);

const InvoiceFooter = ({ business, invoice }) => {
  const bankName = String(business?.bankName || "").trim();
  const iban = String(business?.iban || "").trim();
  const swift = String(business?.swift || "").trim();
  const hideBankDetails = business?.noBankDetailsOnInvoices === true;
  const showPaymentDetails =
    !hideBankDetails && Boolean(bankName || iban || swift);

  const invoiceNoteText = String(invoice?.invoiceNote || "").trim();
  const hasInvoiceNote =
    Boolean(invoice?.includeInvoiceNote) && Boolean(invoiceNoteText);

  return (
    <>
      {showPaymentDetails ? (
        <div className="mt-4 rounded-lg border border-slate-200/90 bg-[#f9fafb] px-3 py-2.5 print:mt-3 print:break-inside-avoid print:border-slate-300 print:bg-slate-50 sm:px-3.5 sm:py-3">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-slate-500">
            Данни за плащане
          </p>
          <div className="mt-2 space-y-1.5">
            {bankName
              ? row({ label: "Банка:", value: bankName, mono: false })
              : null}
            {iban
              ? row({ label: "IBAN:", value: iban, mono: true })
              : null}
            {swift
              ? row({ label: "SWIFT:", value: swift.toUpperCase(), mono: true })
              : null}
          </div>
        </div>
      ) : null}
      {hasInvoiceNote ? (
        <div
          className={`border-t border-slate-300 pt-7 print:break-inside-avoid print:pt-6 ${
            showPaymentDetails ? "mt-5 print:mt-4" : "mt-6 print:mt-5"
          }`}
        >
          <p className="mb-2 text-[0.7rem] font-semibold uppercase tracking-wide text-slate-700">
            Забележка
          </p>
          <p className="whitespace-pre-wrap text-[0.75rem] leading-relaxed text-slate-700">
            {invoiceNoteText}
          </p>
        </div>
      ) : null}
    </>
  );
};

export default InvoiceFooter;
