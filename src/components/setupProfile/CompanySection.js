import React from "react";
import { Controller } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const CompanySection = ({ form }) => {
  const { control } = form;

  return (
    <>
      <SectionTitle
        icon={BusinessOutlinedIcon}
        title="Company & contact"
        subtitle="Legal name and how clients reach you."
      />
      <Grid container spacing={3} sx={{ alignItems: "flex-start" }}>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
          <Controller
            name="businessName"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Company name"
                autoComplete="organization"
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
            name="email"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Company email"
                type="email"
                autoComplete="email"
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
        <Grid item xs={12} sx={{ minWidth: 0 }}>
          <Controller
            name="phone"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                label="Phone"
                type="tel"
                autoComplete="tel"
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
      </Grid>
    </>
  );
};
