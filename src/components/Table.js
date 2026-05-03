import React from "react";
import DashboardActionsSvg from "./DashboardActionsSvg";
import { InvoiceStatusBadge } from "./InvoiceStatusBadge";

const Table = ({ rows }) => {
  if (!Array.isArray(rows) || rows.length === 0) {
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
            <th className="hidden px-3 py-3 font-bold text-slate-700 sm:table-cell">
              Статус
            </th>
            <th className="px-4 py-3 text-right font-mono font-bold tabular-nums text-slate-700">
              Сума
            </th>
            <th className="w-[168px] whitespace-nowrap px-3 py-3 align-middle font-bold text-slate-700">
              <div className="flex w-full min-w-0 justify-end">Действия</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const {
              id,
              invoiceData,
              issueDateLabel,
              badgeLabel,
              statusBadge,
              customerName,
              amountLabel,
            } = row;
            return (
              <tr
                key={id}
                className="transition-colors hover:bg-emerald-500/5"
              >
                <td className="whitespace-nowrap px-4 py-3">
                  <span className="inline-flex flex-col items-start gap-1">
                    <span className="text-[0.87rem] font-semibold leading-tight text-slate-900">
                      {issueDateLabel}
                    </span>
                    <span className="block font-mono text-[0.79rem] font-medium leading-tight tabular-nums text-slate-600">
                      № {badgeLabel}
                    </span>
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-3 align-middle font-semibold text-[#1A1A1A]">
                  <span className="mb-1 inline-flex sm:hidden">
                    <InvoiceStatusBadge
                      label={statusBadge.label}
                      statusTone={statusBadge.statusTone}
                      variant="pill"
                    />
                  </span>
                  <span className="block">{customerName}</span>
                </td>
                <td className="hidden whitespace-nowrap px-3 py-3 align-middle sm:table-cell">
                  <InvoiceStatusBadge
                    label={statusBadge.label}
                    statusTone={statusBadge.statusTone}
                    variant="pill"
                    className="whitespace-nowrap"
                  />
                </td>
                <td className="px-4 py-3 text-right font-mono tabular-nums text-slate-500">
                  {amountLabel}
                </td>
                <td className="w-[168px] whitespace-nowrap px-3 py-3 text-right align-middle">
                  <div className="flex w-full items-center justify-end gap-1">
                    <DashboardActionsSvg invoiceId={id} invoiceData={invoiceData} />
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
