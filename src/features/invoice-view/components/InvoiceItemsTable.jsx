import React from "react";
import {
  formatDiscountPercent,
} from "../utils/invoiceFormatters";
import {
  hasDiscountInItems,
  toDiscountAmount,
  toLineTotal,
} from "../utils/invoiceMath";

const InvoiceItemsTable = ({ invoice, fallbackVatRate, isBusinessVatRegistered }) => {
  const invoiceItems = invoice?.itemList ?? [];
  const hasAnyDiscount = hasDiscountInItems(invoiceItems);

  return (
    <div>
      <table className="table-auto mt-2 max-w-full text-xs md:text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-2 py-1">Артикул</th>
            <th className="px-2 py-1">Мярка</th>
            <th className="px-2 py-1 text-right">Ед. цена</th>
            <th className="px-2 py-1 text-right">Кол.</th>
            {hasAnyDiscount ? <th className="px-2 py-1 text-right">Отстъпка</th> : null}
            <th className="px-2 py-1 text-right">ДДС %</th>
            <th className="px-2 py-1 text-right">Общо</th>
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
            const discountAmountText = discAmt ? discAmt.toFixed(2) : "";
            const discountDisplay = [discountPctText, discountAmountText ? `(${discountAmountText})` : ""]
              .filter(Boolean)
              .join(" ");
            const lineTot = toLineTotal(item, fallbackVatRate);
            const kind =
              item.itemKind === "service"
                ? "Услуга"
                : item.itemKind === "product"
                  ? "Продукт"
                  : "";
            const meta = [kind, String(item.itemCategory || "").trim(), item.itemApplication || ""]
              .filter(Boolean)
              .join(" · ");

            return (
              <tr key={`${item.itemName}-${itemIdx}`}>
                <td className="border px-2 py-1 align-top">
                  <div className="font-medium">{item.itemName}</div>
                  {meta ? <div className="text-gray-500 text-xs mt-0.5">{meta}</div> : null}
                </td>
                <td className="border px-2 py-1 align-top">{item.itemUnit || "—"}</td>
                <td className="border px-2 py-1 text-right">
                  {Number(item.itemCost || 0).toFixed(2)}
                </td>
                <td className="border px-2 py-1 text-right">
                  {Number(item.itemQuantity || 0).toLocaleString("bg-BG")}
                </td>
                {hasAnyDiscount ? (
                  <td className="border px-2 py-1 text-right">
                    {discountDisplay || "—"}
                  </td>
                ) : null}
                <td className="border px-2 py-1 text-right">
                  {isBusinessVatRegistered ? `${Number(lineRate).toFixed(0)}%` : "—"}
                </td>
                <td className="border px-2 py-1 text-right">{lineTot.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceItemsTable;
