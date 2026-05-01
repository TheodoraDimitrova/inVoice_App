import React, { useEffect } from "react";
import { Controller } from "react-hook-form";
import { Grid, TextField } from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

const PROFILE_COUNTRY_VALUE = "Bulgaria";

export const AddressSection = ({ form, showTitle = true }) => {
  const { control, setValue } = form;

  useEffect(() => {
    setValue("country", PROFILE_COUNTRY_VALUE, {
      shouldValidate: true,
      shouldDirty: false,
    });
  }, [setValue]);

  return (
    <>
      {showTitle ? (
        <SectionTitle
          icon={PlaceOutlinedIcon}
          title="Адрес на фирмата"
          subtitle="Улица и град за фактури и записи са задължителни; пощенският код е по избор (държава: България)."
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
                    hint={fieldState.error ? undefined : "По избор."}
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
                label="Държава"
                autoComplete="country-name"
                name={field.name}
                inputRef={field.ref}
                onBlur={field.onBlur}
                value="България"
                disabled
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Платформата е за български фирми."
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
