import React from "react";
import {
  MenuItem,
  Switch,
  TextField,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;

export const CustomerSection = ({
  countries,
  customerType,
  customerIdLabel,
  customerIdRule,
  customerName,
  onCustomerNameChange,
  customerCountry,
  onCustomerCountryChange,
  companyIdentifier,
  onCompanyIdentifierChange,
  customerVatRegistered,
  onCustomerVatRegisteredChange,
  customerVatNumber,
  onCustomerVatNumberChange,
  customerAddress,
  onCustomerAddressChange,
  customerPostCode,
  onCustomerPostCodeChange,
  customerCity,
  onCustomerCityChange,
  customerEmail,
  onCustomerEmailChange,
  errors = {},
}) => (
  <section className="rounded-2xl border border-[rgba(15,23,42,0.08)] bg-white p-4 sm:p-5">
    <div className="mb-5 flex items-center gap-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)]">
        <PersonOutlineOutlinedIcon fontSize="small" />
      </div>
      <div>
        <h2 className="font-bold text-[var(--color-brand-primary)]">
          Клиент
        </h2>
        <p className="text-xs text-slate-500">
          Данни за идентификация и контакт за фактуриране.
        </p>
      </div>
    </div>
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-6">
        <TextField
          {...fieldProps}
          label="Име на клиент"
          name="customerName"
          placeholder="напр. Acme Solutions Ltd"
          value={customerName}
          onChange={onCustomerNameChange}
          required
          error={Boolean(errors.customerName)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.customerName?.message}
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
          value={customerCountry}
          onChange={onCustomerCountryChange}
          required
          error={Boolean(errors.customerCountry)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.customerCountry?.message}
              hint="Задължително поле."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        >
          <MenuItem value="" disabled>
            Изберете държава
          </MenuItem>
          {countries.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </div>
      {customerType === "business" ? (
        <>
          <div className="col-span-12 md:col-span-3">
            <TextField
              {...fieldProps}
              label={customerIdLabel}
              name="companyIdentifier"
              placeholder={customerIdRule?.hint || "Фирмен идентификатор"}
              value={companyIdentifier}
              onChange={onCompanyIdentifierChange}
              error={Boolean(errors.companyIdentifier)}
              helperText={
                <FormFieldHelperText
                  errorMessage={errors.companyIdentifier?.message}
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
                  checked={Boolean(customerVatRegistered)}
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
          {customerVatRegistered ? (
            <div className="col-span-12 md:col-span-4">
              <TextField
                {...fieldProps}
                label="ДДС номер"
                name="customerVatNumber"
                placeholder="напр. BG123456789"
                value={customerVatNumber}
                onChange={onCustomerVatNumberChange}
                error={Boolean(errors.customerVatNumber)}
                helperText={
                  <FormFieldHelperText
                    errorMessage={errors.customerVatNumber?.message}
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
          value={customerAddress}
          onChange={onCustomerAddressChange}
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
          value={customerPostCode}
          onChange={onCustomerPostCodeChange}
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
          value={customerCity}
          onChange={onCustomerCityChange}
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
          value={customerEmail}
          onChange={onCustomerEmailChange}
          error={Boolean(errors.customerEmail)}
          helperText={
            <FormFieldHelperText errorMessage={errors.customerEmail?.message} />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </div>
    </div>
  </section>
);
