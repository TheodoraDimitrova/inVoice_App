import React from "react";
import { Checkbox, TextField } from "@mui/material";

export const InvoiceNoteSection = ({
  includeInvoiceNote,
  invoiceNote,
  noteError,
  onToggle,
  onChange,
}) => (
  <section className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4 sm:p-5">
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-[0.95rem] font-semibold text-slate-900">
        <Checkbox size="small" checked={Boolean(includeInvoiceNote)} onChange={onToggle} />
        <span>Добави забележка към фактурата</span>
      </label>
      {includeInvoiceNote ? (
        <TextField
          size="small"
          fullWidth
          multiline
          minRows={2}
          label="Забележка"
          value={invoiceNote || ""}
          onChange={onChange}
          error={Boolean(noteError)}
          helperText={noteError}
          sx={{
            "& .MuiInputLabel-root": { fontSize: "0.9rem" },
            "& .MuiInputBase-input": { fontSize: "0.95rem" },
            "& .MuiFormHelperText-root": { fontSize: "0.78rem" },
          }}
        />
      ) : null}
    </div>
  </section>
);
