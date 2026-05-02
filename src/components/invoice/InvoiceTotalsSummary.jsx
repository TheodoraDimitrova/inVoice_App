import React from "react";

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
    ? formatSecondaryAmount(subtotal, "subtotal")
    : "";
  const secondaryDiscount = formatSecondaryAmount
    ? formatSecondaryAmount(discountTotal, "discount")
    : "";
  const secondaryVat = formatSecondaryAmount
    ? formatSecondaryAmount(vatTotal, "vat")
    : "";
  const secondaryGrand = formatSecondaryAmount
    ? formatSecondaryAmount(grandTotal, "grandTotal")
    : "";

  const hasDiscount = Number(discountTotal) > 0;
  const negativeSecondaryDiscount = secondaryDiscount ? `-${secondaryDiscount}` : "";

  const Row = ({ label, value, currency, secondary, isTotal = false }) => (
    <div className="flex items-baseline justify-end gap-4 pt-1">
      <span
        className={`w-[200px] text-right text-sm leading-none ${
          isTotal
            ? "font-extrabold uppercase tracking-wide text-slate-900"
            : "font-normal text-slate-500"
        }`}
      >
        {label}
      </span>

      <span className="flex w-[125px] flex-col items-end leading-none">
        <span className="flex items-baseline gap-1">
          <span
            className={`font-mono text-slate-900 ${
              isTotal ? "text-xl font-black" : "text-base font-bold"
            }`}
          >
            {value}
          </span>
          <span
            className={`${isTotal ? "text-base font-bold text-slate-900" : "text-[0.85rem] font-semibold text-slate-700"}`}
          >
            {currency}
          </span>
        </span>
        {secondary && (
          <span
            className={`block font-mono font-semibold leading-none text-slate-400 ${
              isTotal ? "text-[0.85rem]" : "text-xs"
            }`}
          >
            {secondary}
          </span>
        )}
      </span>
    </div>
  );

  return (
    <div className="ml-auto mt-4 pr-0">
      <div>
        <Row
          label="Междинна сума"
          value={subtotal.toFixed(2)}
          currency={currencyLabel}
          secondary={secondarySubtotal}
        />

        {hasDiscount && (
          <Row
            label="Отстъпки"
            value={`-${Number(discountTotal).toFixed(2)}`}
            currency={currencyLabel}
            secondary={negativeSecondaryDiscount}
          />
        )}

        <Row
          label={vatLabel}
          value={showVatAmount ? vatTotal.toFixed(2) : "—"}
          currency={showVatAmount ? currencyLabel : ""}
          secondary={showVatAmount ? secondaryVat : null}
        />

        <div className="flex justify-end">
          <hr className="my-2 w-full max-w-[320px] border-black/15" />
        </div>

        <Row
          label="Крайна сума"
          value={grandTotal.toFixed(2)}
          currency={currencyLabel}
          secondary={secondaryGrand}
          isTotal
        />
      </div>
    </div>
  );
};
