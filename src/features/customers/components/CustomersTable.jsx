import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { CUSTOMER_TYPE_LABELS } from "../constants/customerConstants";

const headCellClass =
  "px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.06em] text-slate-600";
const iconButtonClass =
  "inline-flex rounded-full p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const CustomersTable = ({
  sortedCustomers,
  editingId,
  onStartEdit,
  onDeleteRequest,
}) => (
  <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <table className="min-w-[780px] table-fixed text-sm">
      <thead className="bg-gradient-to-b from-slate-50/95 to-slate-100/95">
        <tr>
          <th className={`${headCellClass} w-[26%]`}>Клиент</th>
          <th className={`${headCellClass} w-[14%]`}>Тип</th>
          <th className={`${headCellClass} w-[18%]`}>Идентификатор</th>
          <th className={`${headCellClass} w-[20%]`}>Адрес</th>
          <th className={`${headCellClass} w-[14%]`}>Контакт</th>
          <th className={`${headCellClass} w-[118px] whitespace-nowrap text-right`}>
            <div className="flex justify-end">Действия</div>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedCustomers.map((customer) => {
          const isEditing = editingId === customer.id;
          const cityLine = [customer.customerPostCode, customer.customerCity]
            .filter(Boolean)
            .join(" ");
          const addressLine = [customer.customerAddress, cityLine]
            .filter(Boolean)
            .join(", ");

          return (
            <tr
              key={customer.id}
              className={`transition-colors hover:bg-emerald-500/5 ${
                editingId && !isEditing ? "opacity-45" : "opacity-100"
              }`}
            >
              <td className="overflow-hidden px-4 py-3">
                <p className="truncate text-[0.875rem] font-semibold text-slate-900" title={customer.customerName}>
                  {customer.customerName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {customer.customerCountry}
                </p>
              </td>
              <td className="px-4 py-3 text-slate-700">
                {CUSTOMER_TYPE_LABELS[customer.customerType] || "Фирма"}
              </td>
              <td className="overflow-hidden px-4 py-3">
                {customer.customerType === "business" ? (
                  <>
                    <p className="truncate font-mono text-xs text-slate-700" title={customer.companyIdentifier}>
                      {customer.companyIdentifier || "—"}
                    </p>
                    {customer.customerVatRegistered ? (
                      <p className="truncate font-mono text-xs text-slate-500" title={customer.customerVatNumber}>
                        ДДС: {customer.customerVatNumber || "—"}
                      </p>
                    ) : null}
                  </>
                ) : (
                  <span className="text-slate-400">—</span>
                )}
              </td>
              <td className="overflow-hidden px-4 py-3">
                <p className="truncate text-slate-600" title={addressLine}>
                  {addressLine || "—"}
                </p>
              </td>
              <td className="overflow-hidden px-4 py-3">
                <p className="truncate text-slate-600" title={customer.customerEmail}>
                  {customer.customerEmail || "—"}
                </p>
              </td>
              <td className="w-[118px] whitespace-nowrap px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    title="Редактирай"
                    onClick={() => onStartEdit(customer)}
                    disabled={Boolean(editingId)}
                    aria-label="Редакция на клиент"
                    className={`${iconButtonClass} text-slate-600 hover:bg-emerald-500/10 hover:text-[var(--color-brand-primary)]`}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    title="Изтрий"
                    onClick={() => onDeleteRequest(customer.id)}
                    disabled={Boolean(editingId)}
                    aria-label="Изтрий клиент"
                    className={`${iconButtonClass} text-slate-400 hover:bg-red-500/10 hover:text-red-600`}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default CustomersTable;
