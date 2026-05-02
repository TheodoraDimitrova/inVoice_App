import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { Switch, TextField } from "@mui/material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const BankSection = ({ form, showTitle = true }) => {
  const { control, setValue } = form;
  const noBankDetailsOnInvoices = useWatch({
    control,
    name: "noBankDetailsOnInvoices",
  });

  return (
    <>
      {showTitle && (
        <SectionTitle
          icon={AccountBalanceOutlinedIcon}
          title="Банкови данни"
          subtitle="Име на банка, IBAN и SWIFT са задължителни, освен ако включите опцията без банкови данни във фактурите."
        />
      )}
      <div className="mb-4">
        <Controller
          name="noBankDetailsOnInvoices"
          control={control}
          render={({ field }) => (
            <label className="flex items-start gap-2">
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    field.onChange(checked);
                    if (checked) {
                      setValue("bankName", "", { shouldValidate: true, shouldDirty: true });
                      setValue("iban", "", { shouldValidate: true, shouldDirty: true });
                      setValue("swift", "", { shouldValidate: true, shouldDirty: true });
                    }
                  }}
                  color="primary"
                />
                <div>
                  <span className="block text-sm font-semibold text-slate-900">
                    Не ми трябват банкови данни във фактурите
                  </span>
                  <span className="block text-xs text-slate-500">
                    При включване създаването на фактура не изисква банка, IBAN или SWIFT.
                  </span>
                </div>
            </label>
          )}
        />
      </div>
      <div className="grid grid-cols-12 items-start gap-6">
        <div className="col-span-12 min-w-0">
          <Controller
            name="bankName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Име на банка"
                disabled={Boolean(noBankDetailsOnInvoices)}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Задължително, ако банковите данни се показват във фактурите."
                    }
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={{
                  ...gridFieldSx,
                  "& .MuiInputBase-input": {
                    py: 1.5,
                    textTransform: "capitalize",
                  },
                }}
              />
            )}
          />
        </div>
        <div className="col-span-12 min-w-0 sm:col-span-6">
          <Controller
            name="iban"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="IBAN"
                disabled={Boolean(noBankDetailsOnInvoices)}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Задължително. Проверява се формат и контролна сума на IBAN."
                    }
                  />
                }
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                inputProps={{ spellCheck: false }}
                error={!!fieldState.error}
                FormHelperTextProps={{ component: "div" }}
                sx={{
                  ...gridFieldSx,
                  "& .MuiInputBase-input": {
                    py: 1.5,
                    fontFamily: "ui-monospace, monospace",
                  },
                }}
              />
            )}
          />
        </div>
        <div className="col-span-12 min-w-0 sm:col-span-6">
          <Controller
            name="swift"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="SWIFT / BIC"
                disabled={Boolean(noBankDetailsOnInvoices)}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Задължително, ако банковите данни се показват във фактурите."
                    }
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={{
                  ...gridFieldSx,
                  "& .MuiInputBase-input": {
                    py: 1.5,
                    textTransform: "uppercase",
                  },
                }}
              />
            )}
          />
        </div>
      </div>
    </>
  );
};
