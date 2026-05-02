import React from "react";
import DashboardActionsSvg from "./DashboardActionsSvg";
import { convertTimestamp } from "../utils/functions";
import { computeInvoiceGrandTotalNumber } from "../utils/invoiceMetrics";

const formatInvoiceBadge = (invoiceData) => {
  const n = Number(invoiceData?.id);
  const hasNumber = Number.isFinite(n) && n > 0;
  if (!hasNumber || invoiceData?.status === "draft") return "Чернова";
  return String(n).padStart(10, "0");
};

const Table = ({ invoices, defaultVatRate = 0 }) => {
  if (!Array.isArray(invoices) || invoices.length === 0) {
    return (
      <p className="py-1 text-sm text-slate-500">
        Няма налични фактури.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-[560px] text-sm">
        <thead className="bg-gradient-to-b from-slate-50/95 to-slate-100/95">
          <tr>
            <th className="px-4 py-3 font-bold text-slate-700">Дата</th>
            <th className="px-4 py-3 font-bold text-slate-700">Клиент</th>
            <th className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-700">
              Сума
            </th>
            <th className="w-[122px] whitespace-nowrap px-4 py-3 text-right font-bold text-slate-700">
              Действия
            </th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => {
            const invoiceData = invoice.data || {};
            const rowCurrency = String(invoiceData.currency || "EUR").toUpperCase();
            const rowVatRate = Number(invoiceData.vatRate);
            const computedTotal = computeInvoiceGrandTotalNumber(
              invoiceData.itemList,
              Number.isFinite(rowVatRate) ? rowVatRate : defaultVatRate
            );

            return (
              <tr
                key={invoice.id}
                className="transition-colors hover:bg-emerald-500/5"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex flex-col items-start gap-1">
                    <span className="text-[0.87rem] font-semibold leading-tight text-slate-900">
                      {convertTimestamp(invoiceData.timestamp)}
                    </span>
                    <span className="block font-mono text-[0.79rem] font-medium leading-tight tabular-nums text-slate-600">
                      № {formatInvoiceBadge(invoiceData)}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-semibold text-[#1A1A1A]">
                  {invoiceData.customerName || "—"}
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-500">
                  {computedTotal.toFixed(2)} {rowCurrency}
                </td>
                <td className="w-[122px] whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex w-full items-center justify-end gap-1">
                    <DashboardActionsSvg invoiceId={invoice.id} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
