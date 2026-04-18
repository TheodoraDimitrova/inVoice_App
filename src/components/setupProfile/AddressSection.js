import React from "react";
import { Controller } from "react-hook-form";
import { Grid, MenuItem, TextField } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { COUNTRIES } from "../../data/countries";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const AddressSection = ({ form }) => {
  const { control } = form;

  return (
    <>
      <SectionTitle
        icon={PlaceOutlinedIcon}
        title="Business address"
        subtitle="Street and location shown on invoices."
      />
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={12} sx={{ minWidth: 0 }}>
          <Controller
            name="businessAddress"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Street address"
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
        <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
          <Controller
            name="postCode"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Post code"
                autoComplete="postal-code"
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
        <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
          <Controller
            name="city"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="City"
                autoComplete="address-level2"
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
        <Grid item xs={12} sm={4} sx={{ minWidth: 0 }}>
          <Controller
            name="country"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                select
                label="Country"
                autoComplete="country-name"
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText errorMessage={fieldState.error?.message} />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              >
                <MenuItem value="" disabled>
                  Select country
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
