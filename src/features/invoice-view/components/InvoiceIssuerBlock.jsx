import React from "react";
import { identifierLabelFromDigits } from "../utils/invoiceFormatters";

const logoBoxClass =
  "shrink-0 rounded border border-slate-100 bg-white p-1 print:border-slate-200";
const logoImgClass =
  "block h-auto max-h-[64px] w-auto max-w-[160px] object-contain sm:max-h-[72px] sm:max-w-[180px] print:max-h-[58px] print:max-w-[140px]";

const InvoiceIssuerBlock = ({ business }) => {
  if (!business) return null;

  const pc = business.postCode == null ? "" : String(business.postCode).trim();
  const city = business.city == null ? "" : String(business.city).trim();
  const country =
    business.country == null ? "" : String(business.country).trim();
  const line = [pc, city].filter(Boolean).join(", ");
  const locality = [business.businessAddress, line, country]
    .filter(Boolean)
    .join(" · ");
  const hasLogo = Boolean(business.logo);

  const companyDetails = (
    <>
      {business.businessName ? (
        <h1 className="w-full text-right text-2xl font-semibold leading-snug tracking-tight text-slate-900 print:text-xl sm:text-[1.65rem]">
          {business.businessName}
        </h1>
      ) : null}
      {locality ? (
        <p
          className={`ml-auto block max-w-[36rem] text-right text-[11px] leading-snug text-slate-500 sm:text-xs print:text-[10px] ${
            business.businessName ? "mt-1.5" : ""
          }`}
        >
          {locality}
        </p>
      ) : null}
      {business.phone || business.email ? (
        <p className="ml-auto mt-1 max-w-[36rem] text-right text-[11px] leading-snug text-slate-500 sm:text-xs">
          {[
            business.phone ? `Tel: ${business.phone}` : null,
            business.email || null,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
      ) : null}
      <div className="ml-auto mt-2 w-fit max-w-full space-y-0.5 text-right sm:mt-2.5">
        {business.regNum ? (
          <p className="text-right text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
            Рег. №: <span className="tabular-nums">{business.regNum}</span>
          </p>
        ) : null}
        {business.vat ? (
          <p className="text-right text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
            ДДС №: <span className="tabular-nums">{business.vat}</span>
          </p>
        ) : null}
        {business.tic ? (
          <p className="text-right text-[11px] font-bold leading-tight text-slate-800 sm:text-xs">
            {identifierLabelFromDigits(business.tic, "Идентификатор")}:{" "}
            <span className="tabular-nums">{business.tic}</span>
          </p>
        ) : null}
      </div>
    </>
  );

  return (
    <div className="min-w-0">
      {hasLogo ? (
        <div className="flex items-start justify-between gap-4">
          <div className={logoBoxClass}>
            <img src={business.logo} alt="" className={logoImgClass} />
          </div>
          <div className="min-w-0 flex-1 text-right">{companyDetails}</div>
        </div>
      ) : (
        <div className="flex justify-end">
          <div className="min-w-0 max-w-full text-right">{companyDetails}</div>
        </div>
      )}
    </div>
  );
};

export default InvoiceIssuerBlock;
