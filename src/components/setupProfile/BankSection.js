import React from "react";
import { Controller } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const BankSection = ({ form, showTitle = true }) => {
  const { control } = form;

  return (
    <>
      {showTitle && (
        <SectionTitle
          icon={AccountBalanceOutlinedIcon}
          title="Bank details (Optional)"
          subtitle="Payment instructions on your invoices."
        />
      )}
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
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText errorMessage={fieldState.error?.message} />
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
                helperText={
                  <FormFieldHelperText errorMessage={fieldState.error?.message} />
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
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText errorMessage={fieldState.error?.message} />
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
