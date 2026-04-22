import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { Box, FormControlLabel, Grid, Switch, TextField, Typography } from "@mui/material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
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
          title="Bank details"
          subtitle="Optional block: either provide bank name + IBAN + SWIFT, or explicitly mark that you do not need bank details on invoices."
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
                    I don't need bank details on my invoices
                  </Typography>
                  <Typography variant="caption" color="text.secondary" display="block">
                    When enabled, invoice creation does not require bank name, IBAN, or SWIFT.
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
                label="Bank name"
                disabled={Boolean(noBankDetailsOnInvoices)}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Optional as a group: if one bank field is filled, all 3 are required."
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
                        : "Optional as a group. Validates IBAN format and checksum."
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
                        : "Optional as a group: required only if bank details are provided."
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
