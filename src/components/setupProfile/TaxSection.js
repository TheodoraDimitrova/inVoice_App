import React from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  Box,
  FormControlLabel,
  Grid,
  InputAdornment,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";
import { getCountryCommercialDefaults } from "../../data/countryCommercialRules";
import {
  getCompanyIdentityIdentifiers,
  getPrimaryCompanyIdentityRule,
} from "../../data/companyIdentityRules";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;

export const TaxSection = ({ form, showTitle = true }) => {
  const { control, setValue } = form;
  const country = useWatch({ control, name: "country" });
  const isVatRegistered = useWatch({ control, name: "isVatRegistered" });
  const rules = getCountryCommercialDefaults(country || "");
  const identityPrimary = getPrimaryCompanyIdentityRule(country || "");
  const identityAll = getCompanyIdentityIdentifiers(country || "");
  const secondaryIdentityLabels = identityAll
    .filter((r) => r.id !== identityPrimary?.id)
    .map((r) => r.label);

  return (
    <>
      {showTitle && (
        <SectionTitle
          icon={GavelOutlinedIcon}
          title="Tax & registration"
          subtitle="VAT status, VAT ID (required only if VAT-registered), required company / trade ID, and read-only tax defaults by country."
        />
      )}
      <Box
        sx={{
          mb: 2,
          p: 1.5,
          borderRadius: 2,
          bgcolor: "rgba(15, 23, 42, 0.04)",
          border: "1px solid",
          borderColor: "rgba(15, 23, 42, 0.08)",
        }}
      >
        <Typography variant="caption" color="text.secondary" component="div">
          {country ? (
            <>
              From system rules for <strong>{country}</strong>
              {rules.standardVatRate != null && (
                <>
                  : suggested standard VAT{" "}
                  <strong>{rules.standardVatRate}%</strong> (applied when you
                  change country in Address)
                </>
              )}
              {rules.standardVatRate == null &&
                " — set your own VAT % below if applicable"}
            </>
          ) : (
            <>Choose a country in Address to apply VAT and currency rules.</>
          )}
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Controller
          name="isVatRegistered"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Switch
                  checked={Boolean(field.value)}
                  onChange={(e) => {
                    const v = e.target.checked;
                    field.onChange(v);
                    if (!v) {
                      setValue("vat", "", {
                        shouldValidate: true,
                        shouldDirty: true,
                      });
                    }
                  }}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={600}>
                    Registered for VAT
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    If on, VAT number is required and checked for format. If
                    off, VAT number is optional. Company ID may still be required
                    depending on country rules.
                  </Typography>
                </Box>
              }
            />
          )}
        />
      </Box>

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
                disabled={!isVatRegistered}
                placeholder={isVatRegistered ? "e.g. DE123456789" : ""}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error || !isVatRegistered
                        ? undefined
                        : "Include country prefix."
                    }
                  />
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
                label={
                  identityPrimary?.label ?? "Company / trade registration ID"
                }
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : [
                            identityPrimary?.hint,
                            "Required for all invoices.",
                            secondaryIdentityLabels.length
                              ? `Other local IDs (not stored in this field yet): ${secondaryIdentityLabels.join(", ")}.`
                              : null,
                          ]
                            .filter(Boolean)
                            .join(" ")
                    }
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} sm={6} sx={{ minWidth: 0 }}>
          <TextField
            {...fieldProps}
            label="Invoice currency"
            value={country ? rules.currency : ""}
            disabled={!country}
            InputProps={country ? { readOnly: true } : undefined}
            helperText={
              <FormFieldHelperText
                hint={
                  country
                    ? "From country rules; saved with your profile."
                    : "Choose a country in Address first."
                }
              />
            }
            FormHelperTextProps={{ component: "div" }}
            sx={gridFieldSx}
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
                disabled
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
                        : "Set from country rules when you pick a country in Address; not editable here."
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
