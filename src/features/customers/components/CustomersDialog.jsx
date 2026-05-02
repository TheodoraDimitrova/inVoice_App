import React from "react";
import { Button, MenuItem, Switch, TextField } from "@mui/material";
import { COUNTRIES } from "../../../data/countries";
import { getPrimaryCompanyIdentityRule } from "../../../data/companyIdentityRules";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { Modal } from "../../../components/ui/layout";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;
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

const customerTypeOptions = [
  ["business", "Фирма (B2B)"],
  ["individual", "Физическо лице (B2C)"],
];

const CustomersDialog = ({
  open,
  saving,
  editingId,
  formData,
  formErrors,
  onClose,
  onSubmit,
  setFieldFromEvent,
  onCustomerTypeChange,
  onCustomerVatRegisteredChange,
}) => {
  const customerIdRule = getPrimaryCompanyIdentityRule(
    formData.customerCountry || "",
  );
  const customerIdLabel =
    customerIdRule?.label?.split("(")[0]?.trim() || "ЕИК / ДДС";
  const isBusiness = formData.customerType === "business";

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingId ? "Редакция на клиент" : "Добавяне на клиент"}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate>
        <div className="overflow-x-hidden bg-[#f8fafc] px-4 py-5 sm:px-6">
          <div className="grid grid-cols-12 gap-5">
            {formErrors._form ? (
              <div className="col-span-12">
                <p className="text-sm text-red-600">{formErrors._form}</p>
              </div>
            ) : null}

            <div className="col-span-12">
              <p className="mb-2 text-sm font-semibold text-slate-600">
                Тип клиент
              </p>
              <div className="inline-flex rounded-xl border border-slate-200 bg-slate-100/80 p-1 shadow-inner">
                {customerTypeOptions.map(([value, label]) => (
                  <Button
                    key={value}
                    type="button"
                    onClick={(event) => onCustomerTypeChange(event, value)}
                    sx={customerTypeButtonSx(formData.customerType === value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="col-span-12 md:col-span-6">
              <TextField
                {...fieldProps}
                label="Име на клиент"
                name="customerName"
                placeholder="напр. Acme Solutions Ltd"
                value={formData.customerName}
                onChange={setFieldFromEvent("customerName")}
                required
                error={Boolean(formErrors.customerName)}
                helperText={
                  <FormFieldHelperText
                    errorMessage={formErrors.customerName}
                    hint="Задължително поле."
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
                label="Държава на клиента"
                name="customerCountry"
                value={formData.customerCountry}
                onChange={setFieldFromEvent("customerCountry")}
                required
                error={Boolean(formErrors.customerCountry)}
                helperText={
                  <FormFieldHelperText
                    errorMessage={formErrors.customerCountry}
                    hint="Задължително поле."
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              >
                <MenuItem value="" disabled>
                  Изберете държава
                </MenuItem>
                {COUNTRIES.map((country) => (
                  <MenuItem key={country} value={country}>
                    {country}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            {isBusiness ? (
              <>
                <div className="col-span-12 md:col-span-3">
                  <TextField
                    {...fieldProps}
                    label={customerIdLabel}
                    name="companyIdentifier"
                    placeholder={customerIdRule?.hint || "Фирмен идентификатор"}
                    value={formData.companyIdentifier}
                    onChange={setFieldFromEvent("companyIdentifier")}
                    error={Boolean(formErrors.companyIdentifier)}
                    helperText={
                      <FormFieldHelperText
                        errorMessage={formErrors.companyIdentifier}
                        hint="Фирмен идентификатор за избраната държава."
                      />
                    }
                    FormHelperTextProps={{ component: "div" }}
                    sx={gridFieldSx}
                  />
                </div>

                <div className="col-span-12 md:col-span-4">
                  <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
                      <Switch
                        checked={Boolean(formData.customerVatRegistered)}
                        onChange={onCustomerVatRegisteredChange}
                        color="primary"
                      />
                      <span>Фирмата е регистрирана по ДДС</span>
                    </label>
                    <p className="text-xs text-slate-500">
                      Показваме ДДС номер само за регистрирани фирми.
                    </p>
                  </div>
                </div>

                {formData.customerVatRegistered ? (
                  <div className="col-span-12 md:col-span-4">
                    <TextField
                      {...fieldProps}
                      label="ДДС номер"
                      name="customerVatNumber"
                      placeholder="напр. BG123456789"
                      value={formData.customerVatNumber}
                      onChange={setFieldFromEvent("customerVatNumber")}
                      error={Boolean(formErrors.customerVatNumber)}
                      helperText={
                        <FormFieldHelperText
                          errorMessage={formErrors.customerVatNumber}
                          hint="Въведете с префикс на държавата (напр. BG...)."
                        />
                      }
                      FormHelperTextProps={{ component: "div" }}
                      sx={gridFieldSx}
                    />
                  </div>
                ) : null}
              </>
            ) : (
              <div className="col-span-12 md:col-span-3">
                <TextField
                  {...fieldProps}
                  label="Личен идентификатор (по избор)"
                  name="customerPersonalId"
                  value=""
                  disabled
                  helperText={
                    <FormFieldHelperText hint="Не е задължително за физически лица." />
                  }
                  FormHelperTextProps={{ component: "div" }}
                  sx={gridFieldSx}
                />
              </div>
            )}

            <div className="col-span-12 md:col-span-6">
              <TextField
                {...fieldProps}
                label="Адрес на клиента"
                name="customerAddress"
                placeholder="напр. бул. Витоша 24"
                value={formData.customerAddress}
                onChange={setFieldFromEvent("customerAddress")}
                helperText={<FormFieldHelperText hint="Улица и номер." />}
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <TextField
                {...fieldProps}
                label="Пощенски код"
                name="customerPostCode"
                placeholder="напр. 1000"
                value={formData.customerPostCode}
                onChange={setFieldFromEvent("customerPostCode")}
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            </div>

            <div className="col-span-12 md:col-span-3">
              <TextField
                {...fieldProps}
                label="Град"
                name="customerCity"
                placeholder="напр. София"
                value={formData.customerCity}
                onChange={setFieldFromEvent("customerCity")}
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            </div>

            <div className="col-span-12 md:col-span-6">
              <TextField
                {...fieldProps}
                label="Имейл на клиента"
                type="email"
                name="customerEmail"
                placeholder="напр. billing@client.com"
                value={formData.customerEmail}
                onChange={setFieldFromEvent("customerEmail")}
                error={Boolean(formErrors.customerEmail)}
                helperText={
                  <FormFieldHelperText errorMessage={formErrors.customerEmail} />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-[rgba(15,23,42,0.08)] bg-white px-4 py-4 sm:px-6">
          <Button onClick={onClose} disabled={saving}>
            Отказ
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {editingId ? "Запази промените" : "Добави клиент"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CustomersDialog;
