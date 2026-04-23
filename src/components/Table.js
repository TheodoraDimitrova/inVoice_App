import React from "react";
import DashboardActionsSvg from "./DashboardActionsSvg";
import { convertTimestamp } from "../utils/functions";

const formatInvoiceBadge = (invoiceData) => {
  const n = Number(invoiceData?.id);
  const hasNumber = Number.isFinite(n) && n > 0;
  if (!hasNumber || invoiceData?.status === "draft") return "Чернова";
  return String(n).padStart(10, "0");
};

const Table = ({ invoices }) => {
  return (
    <div className="w-full">
      <h3 className="text-xl text-blue-700 font-semibold">Последни фактури</h3>
      <table>
        <thead>
          <tr>
            <th className="text-blue-600">Дата</th>
            <th className="text-blue-600">Клиент</th>
            <th className="text-blue-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {invoices?.map((invoice) => (
            <tr key={invoice.id}>
              <td className="text-sm text-gray-400">
                {convertTimestamp(invoice.data.timestamp)} -{" "}
                {formatInvoiceBadge(invoice.data)}
              </td>
              <td className="text-sm">{invoice.data.customerName}</td>
              <td>
                <DashboardActionsSvg invoiceId={invoice.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
