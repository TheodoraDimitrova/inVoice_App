import React from "react";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const RowTotal = ({ currencySign, rowTotal, isEmpty, onDelete }) => (
  <div className="flex min-h-[24px] w-full min-w-[120px] max-w-[170px] items-center justify-end gap-1 md:min-w-[140px] md:max-w-[190px]">
    <span
      className={`flex flex-1 items-center justify-end whitespace-nowrap text-right text-[0.8125rem] font-semibold leading-none tabular-nums ${
        isEmpty ? "text-slate-400" : "text-slate-900"
      }`}
    >
      {currencySign} {rowTotal.toFixed(2)}
    </span>
    <button
      type="button"
      aria-label="Изтрий ред"
      disabled={isEmpty}
      onClick={onDelete}
      className={`inline-flex shrink-0 items-center justify-center rounded-full p-1 transition-colors ${
        isEmpty
          ? "cursor-not-allowed text-slate-300"
          : "text-red-600 hover:bg-red-50"
      }`}
    >
      <DeleteOutlineIcon fontSize="small" />
    </button>
  </div>
);
