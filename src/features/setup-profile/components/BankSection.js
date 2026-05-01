import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { Box, FormControlLabel, Grid, Switch, TextField, Typography } from "@mui/material";
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
      <Box sx={{ mb: 2 }}>
        <Controller
          name="noBankDetailsOnInvoices"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
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
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Не ми трябват банкови данни във фактурите
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    При включване създаването на фактура не изисква банка, IBAN или SWIFT.
                  </Typography>
                </Box>
              }
            />
          )}
        />
      </Box>
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={12} sx={{ minWidth: 0 }}>
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
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
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
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
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
        </Grid>
      </Grid>
    </>
  );
};
