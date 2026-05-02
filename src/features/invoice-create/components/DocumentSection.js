import React from "react";
import { Button, MenuItem, TextField } from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;
const sectionClass =
  "rounded-2xl border border-[rgba(15,23,42,0.08)] bg-[rgba(15,23,42,0.04)] p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:p-5";
const customerTypeButtonSx = (active) => ({
  px: 2.25,
  py: 0.85,
  borderRadius: 1.5,
  minWidth: 0,
  fontSize: "0.875rem",
  fontWeight: 700,
  textTransform: "none",
  color: active ? "#ffffff" : "#475569",
  bgcolor: active ? "var(--color-brand-primary)" : "transparent",
  boxShadow: active
    ? "0 6px 16px rgba(15, 118, 110, 0.18), 0 1px 2px rgba(15, 23, 42, 0.08)"
    : "none",
  "&:hover": {
    bgcolor: active ? "var(--color-brand-primary-hover)" : "#ffffff",
    color: active ? "#ffffff" : "var(--color-brand-primary)",
  },
});

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
  <section className={sectionClass}>
    <div className="mb-5 flex items-center gap-4">
      <div className="section-icon-tile">
        <DescriptionOutlinedIcon fontSize="inherit" />
      </div>
      <div>
        <h2 className="font-bold text-[var(--color-brand-primary)]">
          Данни за документа
        </h2>
        <p className="text-xs text-slate-500">Номер и дати на фактурата.</p>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12">
        <div className="space-y-2">
          <p className="text-sm font-semibold text-slate-500">Тип клиент</p>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 shadow-inner">
            {[
              ["business", "Фирма (B2B)"],
              ["individual", "Физическо лице (B2C)"],
            ].map(([value, label]) => (
              <Button
                key={value}
                type="button"
                onClick={(event) => onCustomerTypeChange(event, value)}
                sx={customerTypeButtonSx(customerType === value)}
              >
                {label}
              </Button>
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
