import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const inlineSx = {
  "& .MuiOutlinedInput-root": {
    fontSize: "0.8rem",
    bgcolor: "#fff",
    borderRadius: 1,
  },
  "& .MuiOutlinedInput-input": { py: "5px", px: "7px" },
  "& input[type=number]": { MozAppearance: "textfield" },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    { WebkitAppearance: "none", margin: 0 },
};

const inlineNumericSx = {
  ...inlineSx,
  "& .MuiOutlinedInput-input": {
    py: "5px",
    px: "7px",
    textAlign: "right",
    fontVariantNumeric: "tabular-nums",
  },
};

const headCellClass =
  "px-4 py-3 text-left text-[0.72rem] font-bold uppercase tracking-[0.06em] text-slate-600";
const numericCellClass = "text-right font-mono tabular-nums";
const iconButtonClass =
  "inline-flex rounded-full p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-40";

const ProductsTable = ({
  sortedProducts,
  editingId,
  editData,
  inlineSaving,
  inlineErrors,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateField,
  onDeleteRequest,
}) => (
  <div className="max-w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <table className="min-w-[620px] table-fixed text-sm">
      <thead className="bg-gradient-to-b from-slate-50/95 to-slate-100/95">
        <tr>
          <th className={`${headCellClass} w-[38%]`}>Наименование</th>
          <th className={`${headCellClass} ${numericCellClass} w-[10%]`}>Кол-во</th>
          <th className={`${headCellClass} w-[10%]`}>Мярка</th>
          <th className={`${headCellClass} ${numericCellClass} w-[24%]`}>Нетна цена</th>
          <th className={`${headCellClass} w-[118px] whitespace-nowrap text-right`}>
            <div className="flex justify-end">
              Действия
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedProducts.map((product) => {
          const isEditing = editingId === product.id;

          if (isEditing && editData) {
            return (
              <tr
                key={product.id}
                className="bg-emerald-500/5"
              >
                <td className="px-4 py-3">
                  <TextField
                    autoFocus
                    size="small"
                    fullWidth
                    placeholder="Наименование"
                    value={editData.name}
                    onChange={(e) => onUpdateField("name", e.target.value)}
                    error={Boolean(inlineErrors.name)}
                    title={inlineErrors.name || ""}
                    sx={inlineSx}
                    disabled={inlineSaving}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="1"
                    value={editData.itemQuantity}
                    onChange={(e) =>
                      onUpdateField("itemQuantity", e.target.value)
                    }
                    error={Boolean(inlineErrors.itemQuantity)}
                    title={inlineErrors.itemQuantity || ""}
                    inputProps={{ min: 0.01, step: "0.01" }}
                    sx={inlineNumericSx}
                    disabled={inlineSaving}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="бр."
                    value={editData.itemUnit}
                    onChange={(e) => onUpdateField("itemUnit", e.target.value)}
                    error={Boolean(inlineErrors.itemUnit)}
                    title={inlineErrors.itemUnit || ""}
                    sx={inlineSx}
                    disabled={inlineSaving}
                  />
                </td>
                <td className="px-4 py-3">
                  <TextField
                    size="small"
                    type="number"
                    fullWidth
                    placeholder="0.00"
                    value={editData.priceNet}
                    onChange={(e) => onUpdateField("priceNet", e.target.value)}
                    error={Boolean(inlineErrors.priceNet)}
                    title={inlineErrors.priceNet || ""}
                    inputProps={{ min: 0.01, step: "0.01" }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment
                          position="start"
                          sx={{
                            "& p": { fontSize: "0.75rem", color: "#9CA3AF" },
                          }}
                        >
                          EUR
                        </InputAdornment>
                      ),
                    }}
                    sx={inlineNumericSx}
                    disabled={inlineSaving}
                  />
                </td>
                <td className="w-[118px] whitespace-nowrap px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="Запази"
                      aria-label="Запази"
                      onClick={onSaveEdit}
                      disabled={inlineSaving}
                      className={`${iconButtonClass} text-[var(--color-brand-primary)] hover:bg-emerald-500/10`}
                    >
                      <CheckIcon fontSize="small" />
                    </button>
                    <button
                      type="button"
                      title="Откажи"
                      aria-label="Откажи"
                      onClick={onCancelEdit}
                      disabled={inlineSaving}
                      className={`${iconButtonClass} text-slate-400 hover:bg-slate-100 hover:text-slate-700`}
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          }

          return (
            <tr
              key={product.id}
              className={`transition-colors hover:bg-emerald-500/5 ${
                editingId && !isEditing ? "opacity-45" : "opacity-100"
              }`}
            >
              <td className="overflow-hidden text-ellipsis whitespace-nowrap px-4 py-3 text-[0.875rem] font-semibold text-slate-900" title={product.name}>
                {product.name}
              </td>
              <td className={`px-4 py-3 text-slate-700 ${numericCellClass}`}>
                {Number(product.quantityDefault || 1).toFixed(2)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                {product.unit}
              </td>
              <td className={`px-4 py-3 text-slate-700 ${numericCellClass}`}>
                {Number(product.price).toFixed(2)}
                <span className="ml-1 text-xs text-slate-400">
                  EUR
                </span>
              </td>
              <td className="w-[118px] whitespace-nowrap px-4 py-3 text-right">
                <div className="flex justify-end gap-1">
                  <button
                    type="button"
                    title="Редактирай"
                    onClick={() => onStartEdit(product)}
                    disabled={Boolean(editingId)}
                    aria-label="Редакция на продукт"
                    className={`${iconButtonClass} text-slate-600 hover:bg-emerald-500/10 hover:text-[var(--color-brand-primary)]`}
                  >
                    <EditOutlinedIcon fontSize="small" />
                  </button>
                  <button
                    type="button"
                    title="Изтрий"
                    onClick={() => onDeleteRequest(product.id)}
                    disabled={Boolean(editingId)}
                    aria-label="Изтрий продукт"
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

export default ProductsTable;
