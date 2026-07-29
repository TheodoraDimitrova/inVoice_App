import React from "react";

const rowClass =
  "flex items-baseline justify-end gap-6 py-0.5 text-[11px] leading-tight sm:text-xs print:text-[10px]";
const labelClass = "shrink-0 text-right font-normal text-slate-500";
const valueClass =
  "w-[7.75rem] shrink-0 text-right font-medium tabular-nums text-slate-900 sm:w-[8rem]";
const secondaryClass =
  "w-[7.75rem] shrink-0 pb-1 text-right text-[9px] leading-none text-slate-400 tabular-nums sm:w-[8rem] sm:text-[10px]";

/** Суми под таблицата, подравнени вдясно — без HTML таблица. */
export const InvoiceTotalsSummary = ({
  currencyLabel,
  subtotal,
  discountTotal = 0,
  vatLabel,
  vatTotal,
  grandTotal,
  showVatAmount = true,
  formatSecondaryAmount,
}) => {
  const secondarySubtotal = formatSecondaryAmount
    ? formatSecondaryAmount(subtotal)
    : "";
  const secondaryDiscount = formatSecondaryAmount
    ? formatSecondaryAmount(discountTotal)
    : "";
  const secondaryVat = formatSecondaryAmount
    ? formatSecondaryAmount(vatTotal)
    : "";
  const secondaryGrand = formatSecondaryAmount
    ? formatSecondaryAmount(grandTotal)
    : "";

  const hasDiscount = Number(discountTotal) > 0;
  const negativeSecondaryDiscount = secondaryDiscount
    ? `−${secondaryDiscount}`
    : "";

  const amt = (n) => `${Number(n || 0).toFixed(2)} ${currencyLabel}`;

  return (
    <div className="invoice-totals ml-auto mt-3 w-max max-w-full space-y-0 print:mt-2">
      <div className={rowClass}>
        <span className={labelClass}>Межд. сума</span>
        <span className={valueClass}>{amt(subtotal)}</span>
      </div>
      {secondarySubtotal ? (
        <div className="flex justify-end">
          <span className={secondaryClass}>{secondarySubtotal}</span>
        </div>
      ) : null}

      {hasDiscount ? (
        <>
          <div className={rowClass}>
            <span className={labelClass}>Отстъпки</span>
            <span className={valueClass}>
              −{Number(discountTotal).toFixed(2)} {currencyLabel}
            </span>
          </div>
          {negativeSecondaryDiscount ? (
            <div className="flex justify-end">
              <span className={secondaryClass}>
                {negativeSecondaryDiscount}
              </span>
            </div>
          ) : null}
        </>
      ) : null}

      <div className={rowClass}>
        <span
          className={`${labelClass} ${showVatAmount ? "" : "text-slate-600"}`}
        >
          {vatLabel}
        </span>
        <span className={valueClass}>
          {showVatAmount ? amt(vatTotal) : "—"}
        </span>
      </div>
      {showVatAmount && secondaryVat ? (
        <div className="flex justify-end">
          <span className={secondaryClass}>{secondaryVat}</span>
        </div>
      ) : null}

      <div className={`${rowClass} mt-1 border-t border-slate-300 pt-1.5`}>
        <span
          className={`${labelClass} text-[11px] font-extrabold uppercase tracking-wide text-slate-900 sm:text-xs`}
        >
          Крайна сума
        </span>
        <span
          className={`${valueClass} text-sm font-black sm:text-[0.95rem] print:text-xs`}
        >
          {amt(grandTotal)}
        </span>
      </div>
      {secondaryGrand ? (
        <div className="flex justify-end pt-0.5">
          <span className={`${secondaryClass} font-semibold`}>
            {secondaryGrand}
          </span>
        </div>
      ) : null}
    </div>
  );
};
