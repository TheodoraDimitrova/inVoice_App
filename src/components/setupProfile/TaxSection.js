import React from "react";
import { Controller } from "react-hook-form";
import { Grid, InputAdornment, TextField } from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const TaxSection = ({ form, showTitle = true }) => {
  const { control } = form;

  return (
    <>
      {showTitle && (
        <SectionTitle
          icon={GavelOutlinedIcon}
          title="Tax & registration (Optional)"
          subtitle="Shown on PDF invoices when applicable."
        />
      )}
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
          <Controller
            name="vat"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="VAT number"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText errorMessage={fieldState.error?.message} />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
          <Controller
            name="tic"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="T.I.C. / company ID"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText errorMessage={fieldState.error?.message} />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
          <Controller
            name="vatRate"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Default VAT rate"
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      sx={{
                        fontWeight: 600,
                        color: "text.secondary",
                        userSelect: "none",
                      }}
                    >
                      %
                    </InputAdornment>
                  ),
                }}
                inputProps={{ min: 0, max: 100, step: 0.5 }}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Applied to new invoice line totals before issuing."
                    }
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};
