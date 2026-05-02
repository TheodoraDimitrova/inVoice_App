import React from "react";
import {
  MenuItem,
  TextField,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;
const formatInvoicePreviewNumber = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";
  if (!/^\d+$/.test(raw)) return raw;
  return raw.padStart(10, "0");
};

export const DocumentSection = ({
  customerType,
  onCustomerTypeChange,
  invoiceNumberPreview,
  issueDate,
  onIssueDateChange,
  dueDate,
  onDueDateChange,
  currency,
  onCurrencyChange,
  currencyOptions,
  errors = {},
}) => (
  <section className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4 sm:p-5">
    <div className="mb-5 flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)]">
        <DescriptionOutlinedIcon fontSize="small" />
      </div>
      <div>
        <h2 className="font-bold text-[var(--color-brand-primary)]">
          Данни за документа
        </h2>
        <p className="text-xs text-slate-500">
          Номер и дати на фактурата.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">
            Тип клиент
          </p>
          <div className="inline-flex overflow-hidden rounded-lg border border-slate-300">
            {[
              ["business", "Фирма (B2B)"],
              ["individual", "Физическо лице (B2C)"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={(event) => onCustomerTypeChange(event, value)}
                className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
                  customerType === value
                    ? "bg-[var(--color-brand-primary)] text-white"
                    : "bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-slate-500">
            Изберете категорията на клиента за тази фактура.
          </p>
        </div>
      </div>
      <div className="col-span-12 md:col-span-3">
        <TextField
          {...fieldProps}
          label="Номер на фактура"
          value={formatInvoicePreviewNumber(invoiceNumberPreview)}
          placeholder="Генерира се автоматично"
          disabled
          helperText={
            <FormFieldHelperText hint="Автоматично генериран пореден номер." />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <TextField
          {...fieldProps}
          label="Дата на издаване"
          type="date"
          value={issueDate}
          onChange={onIssueDateChange}
          error={Boolean(errors.issueDate)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.issueDate?.message}
              hint="При нужда може да редактирате датата."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <TextField
          {...fieldProps}
          label="Падеж"
          type="date"
          value={dueDate}
          onChange={onDueDateChange}
          error={Boolean(errors.dueDate)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.dueDate?.message}
              hint="Ако е празно, се приема датата на издаване."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <TextField
          {...fieldProps}
          select
          label="Валута"
          value={(currency || "EUR").toUpperCase()}
          onChange={onCurrencyChange}
          error={Boolean(errors.currency)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.currency?.message}
              hint="По подразбиране от профила; промяната ще бъде само за тази фактура."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        >
          {currencyOptions.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </div>
  </section>
);
