import React from "react";
import { Controller } from "react-hook-form";
import { Grid, MenuItem, TextField } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { COUNTRIES } from "../../data/countries";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const AddressSection = ({ form, showTitle = true, onCountryChange }) => {
  const { control } = form;

  return (
    <>
      {showTitle ? (
        <SectionTitle
          icon={PlaceOutlinedIcon}
          title="Адрес на фирмата"
          subtitle="Улица, пощенски код, град и държава за фактури и записи (всички са задължителни)."
        />
      ) : null}
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={12} sx={{ minWidth: 0 }}>
          <Controller
            name="businessAddress"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Адрес (улица и номер)"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={fieldState.error ? undefined : "Задължително поле."}
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
          <Controller
            name="postCode"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Пощенски код"
                autoComplete="postal-code"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={fieldState.error ? undefined : "Задължително поле."}
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Град"
                autoComplete="address-level2"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={fieldState.error ? undefined : "Задължително поле."}
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                select
                label="Държава"
                autoComplete="country-name"
                value={field.value ?? ""}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={fieldState.error ? undefined : "Задължително поле."}
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onCountryChange?.(e.target.value);
                }}
              >
                <MenuItem value="" disabled>
                  Изберете държава
                </MenuItem>
                {COUNTRIES.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Grid>
      </Grid>
    </>
  );
};
