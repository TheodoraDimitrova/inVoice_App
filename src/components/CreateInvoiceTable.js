import React, { memo } from "react";

const CreateInvoiceTable = memo(({ itemList, onDeleteRow, currencySymbol = "\u20ac" }) => {
  return (
    <div className="my-4 overflow-x-auto rounded border border-slate-200">
      <table className="w-full table-fixed min-w-[640px]">
        <colgroup>
          <col style={{ width: "32%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "12%" }} />
          <col style={{ width: "18%" }} />
          <col style={{ width: "8%" }} />
        </colgroup>
        <thead className="bg-slate-50">
          <tr className="text-slate-700">
            <th className="px-3 py-2 text-left">Артикул</th>
            <th className="px-3 py-2 pr-4 text-right">Ед. цена</th>
            <th className="px-3 py-2 pr-4 text-right">Кол.</th>
            <th className="px-3 py-2 pr-4 text-right">ДДС %</th>
            <th className="px-3 py-2 pr-4 text-right">Общо</th>
            <th className="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {itemList.map((item, index) => (
            <tr key={index} className="border-t border-slate-100">
              <td className="px-3 py-2">{item.itemName}</td>
              <td className="px-3 py-2 pr-4 text-right whitespace-nowrap tabular-nums">
                <span className="block text-right">
                  {currencySymbol} {Number(item.itemCost || 0).toFixed(2)}
                </span>
                {item.itemDiscount ? (
                  <span className="ml-2 text-xs text-emerald-700">
                    -{item.itemDiscount}%
                  </span>
                ) : null}
              </td>
              <td className="px-3 py-2 pr-4 text-right tabular-nums">{item.itemQuantity}</td>
              <td className="px-3 py-2 pr-4 text-right tabular-nums">
                {Number(item.itemVatRate ?? 0).toFixed(0)}%
              </td>
              <td className="px-3 py-2 pr-4 text-right font-semibold whitespace-nowrap tabular-nums">
                <span className="block text-right">
                  {currencySymbol}{" "}
                  {(
                    item.itemCost *
                    item.itemQuantity *
                    (1 + (Number(item.itemVatRate) || 0) / 100)
                  ).toFixed(2)}
                </span>
              </td>
              <td className="px-3 py-2 text-right">
                <button
                  className="text-red-600"
                  onClick={(e) => onDeleteRow(e, index)}
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});

export default CreateInvoiceTable;
