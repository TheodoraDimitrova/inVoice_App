import React from "react";
import { Controller, useWatch } from "react-hook-form";
import {
  Box,
  FormControlLabel,
  Grid,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import GavelOutlinedIcon from "@mui/icons-material/GavelOutlined";
import { FormFieldHelperText } from "../FormFieldHelperText";

import {
  getCompanyIdentityIdentifiers,
  getPrimaryCompanyIdentityRule,
} from "../../data/companyIdentityRules";
import { gridFieldSx, setupProfileFieldProps } from "../../utils/muiFieldSx";
import { SectionTitle } from "./SectionTitle";

const fieldProps = setupProfileFieldProps;
const CURRENCY_OPTIONS = ["EUR", "BGN", "USD", "GBP"];

export const TaxSection = ({ form, showTitle = true }) => {
  const { control, setValue } = form;
  const country = useWatch({ control, name: "country" });
  const isVatRegistered = useWatch({ control, name: "isVatRegistered" });
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
          title="Данъци и регистрация"
          subtitle=""
        />
      )}

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
                    Регистриран по ДДС
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    display="block"
                  >
                    ДДС статус, ДДС номер (задължителен само при регистрация по
                    ДДС)
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
                label="ДДС номер"
                disabled={!isVatRegistered}
                placeholder={isVatRegistered ? "напр. BG123456789" : ""}
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error || !isVatRegistered
                        ? undefined
                        : "Добавете префикс на държавата."
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
                  identityPrimary?.label ?? "Фирмен / търговски идентификатор"
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
                            "Задължително за всички фактури.",
                            secondaryIdentityLabels.length
                              ? `Други локални идентификатори (все още не се съхраняват в това поле): ${secondaryIdentityLabels.join(", ")}.`
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
          <Controller
            name="currency"
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...fieldProps}
                {...field}
                select
                label="Валута на фактуриране"
                value={field.value ?? "EUR"}
                onChange={(e) =>
                  field.onChange((e.target.value || "EUR").toUpperCase())
                }
                error={!!fieldState.error}
                helperText={
                  <FormFieldHelperText
                    errorMessage={fieldState.error?.message}
                    hint={
                      fieldState.error
                        ? undefined
                        : "Изберете валутата за новите фактури (по подразбиране EUR)."
                    }
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              >
                {CURRENCY_OPTIONS.map((code) => (
                  <MenuItem key={code} value={code}>
                    {code}
                  </MenuItem>
                ))}
              </TextField>
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
                label="Стандартна ДДС ставка"
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
                        : "ДДС ставка по подразбиране. Може да се променя при създаване на фактура"
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
