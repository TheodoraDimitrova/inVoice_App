import React from "react";
import { formatDiscountPercent } from "../utils/invoiceFormatters";
import {
  hasDiscountInItems,
  toDiscountAmount,
  toLineTotal,
} from "../utils/invoiceMath";

const thBase =
  "border border-slate-300 bg-slate-200 px-1 py-0.5 text-left align-bottom text-[10px] font-bold uppercase tracking-wide text-slate-800 sm:px-1.5 sm:text-[11px]";
const tdBase =
  "border border-slate-200 px-1 py-0.5 align-middle text-[10px] text-slate-900 sm:px-1.5 sm:text-[11px]";

const InvoiceItemsTable = ({ invoice, fallbackVatRate, isBusinessVatRegistered }) => {
  const invoiceItems = invoice?.itemList ?? [];
  const hasAnyDiscount = hasDiscountInItems(invoiceItems);

  return (
    <div className="overflow-x-auto">
      <table className="invoice-items-table mt-3 w-full border-collapse text-[10px] sm:mt-3 sm:text-[11px] print:mt-2 print:text-[9px]">
        <colgroup>
          <col />
          <col className="w-[2.75rem] sm:w-[3rem]" />
          <col className="w-[4rem] sm:w-[4.25rem]" />
          <col className="w-[2.5rem] sm:w-[2.75rem]" />
          {hasAnyDiscount ? <col className="w-[2.6rem] sm:w-[2.85rem]" /> : null}
          <col className="w-[2.5rem] sm:w-[2.75rem]" />
          <col className="w-[3.75rem] sm:w-[4rem]" />
        </colgroup>
        <thead>
          <tr>
            <th className={thBase}>Артикул</th>
            <th className={`${thBase} text-center`}>Мярка</th>
            <th className={`${thBase} text-right`}>Ед. ц.</th>
            <th className={`${thBase} text-right`}>Кол.</th>
            {hasAnyDiscount ? (
              <th className={`${thBase} text-center leading-tight`} title="Отстъпка">
                Отст.%
              </th>
            ) : null}
            <th className={`${thBase} text-right`}>ДДС</th>
            <th className={`${thBase} text-right`}>Общо</th>
          </tr>
        </thead>
        <tbody>
          {invoiceItems.map((item, itemIdx) => {
            const lineRate =
              item.itemVatRate == null ? fallbackVatRate : item.itemVatRate;
            const discPct =
              item.itemDiscountPercent != null
                ? Number(item.itemDiscountPercent)
                : Number(item.itemDiscount) || 0;
            const discAmt = toDiscountAmount(item);
            const discountPctText = formatDiscountPercent(discPct);
            const discountCell =
              discPct > 0
                ? discountPctText
                : discAmt > 0
                  ? discAmt.toFixed(0)
                  : "—";
            const lineTot = toLineTotal(item, fallbackVatRate);

            return (
              <tr key={`${item.itemName}-${itemIdx}`}>
                <td className={`${tdBase} max-w-0`}>
                  <div className="truncate font-semibold leading-snug" title={item.itemName}>
                    {item.itemName}
                  </div>
                </td>
                <td className={`${tdBase} text-center`}>{item.itemUnit || "—"}</td>
                <td className={`${tdBase} text-right tabular-nums`}>
                  {Number(item.itemCost || 0).toFixed(2)}
                </td>
                <td className={`${tdBase} text-right tabular-nums`}>
                  {Number(item.itemQuantity || 0).toLocaleString("bg-BG")}
                </td>
                {hasAnyDiscount ? (
                  <td className={`${tdBase} text-center tabular-nums text-[9px] sm:text-[10px]`}>
                    {discountCell}
                  </td>
                ) : null}
                <td className={`${tdBase} text-right`}>
                  {isBusinessVatRegistered ? `${Number(lineRate).toFixed(0)}%` : "—"}
                </td>
                <td className={`${tdBase} text-right font-semibold tabular-nums`}>
                  {lineTot.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;
