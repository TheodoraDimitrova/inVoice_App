import React from "react";
import {
  Box,
  FormControlLabel,
  Grid,
  MenuItem,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;

export const CustomerSection = ({
  sectionShellSx,
  sectionIconBoxSx,
  countries,
  customerType,
  customerIdLabel,
  customerIdRule,
  customerName,
  onCustomerNameChange,
  customerCountry,
  onCustomerCountryChange,
  companyIdentifier,
  onCompanyIdentifierChange,
  customerVatRegistered,
  onCustomerVatRegisteredChange,
  customerVatNumber,
  onCustomerVatNumberChange,
  customerAddress,
  onCustomerAddressChange,
  customerPostCode,
  onCustomerPostCodeChange,
  customerCity,
  onCustomerCityChange,
  customerEmail,
  onCustomerEmailChange,
  errors = {},
}) => (
  <Paper variant="outlined" sx={sectionShellSx}>
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
      <Box sx={sectionIconBoxSx}>
        <PersonOutlineOutlinedIcon fontSize="small" />
      </Box>
      <Box>
        <Typography
          sx={{ fontWeight: 700, color: "var(--color-brand-primary)" }}
        >
          Клиент
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Данни за идентификация и контакт за фактуриране.
        </Typography>
      </Box>
    </Stack>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          {...fieldProps}
          label="Име на клиент"
          name="customerName"
          placeholder="напр. Acme Solutions Ltd"
          value={customerName}
          onChange={onCustomerNameChange}
          required
          error={Boolean(errors.customerName)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.customerName?.message}
              hint="Задължително поле."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          {...fieldProps}
          select
          label="Държава на клиента"
          name="customerCountry"
          value={customerCountry}
          onChange={onCustomerCountryChange}
          required
          error={Boolean(errors.customerCountry)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.customerCountry?.message}
              hint="Задължително поле."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        >
          <MenuItem value="" disabled>
            Изберете държава
          </MenuItem>
          {countries.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      {customerType === "business" ? (
        <>
          <Grid item xs={12} md={3}>
            <TextField
              {...fieldProps}
              label={customerIdLabel}
              name="companyIdentifier"
              placeholder={customerIdRule?.hint || "Фирмен идентификатор"}
              value={companyIdentifier}
              onChange={onCompanyIdentifierChange}
              error={Boolean(errors.companyIdentifier)}
              helperText={
                <FormFieldHelperText
                  errorMessage={errors.companyIdentifier?.message}
                  hint="Фирмен идентификатор за избраната държава."
                />
              }
              FormHelperTextProps={{ component: "div" }}
              sx={gridFieldSx}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack spacing={0.5}>
              <FormControlLabel
                control={
                  <Switch
                    checked={Boolean(customerVatRegistered)}
                    onChange={onCustomerVatRegisteredChange}
                    color="primary"
                  />
                }
                label="Фирмата е регистрирана по ДДС"
                sx={{ mx: 0 }}
              />
              <Typography variant="caption" color="text.secondary">
                Показваме ДДС номер само за регистрирани фирми.
              </Typography>
            </Stack>
          </Grid>
          {customerVatRegistered ? (
            <Grid item xs={12} md={4}>
              <TextField
                {...fieldProps}
                label="ДДС номер"
                name="customerVatNumber"
                placeholder="напр. BG123456789"
                value={customerVatNumber}
                onChange={onCustomerVatNumberChange}
                error={Boolean(errors.customerVatNumber)}
                helperText={
                  <FormFieldHelperText
                    errorMessage={errors.customerVatNumber?.message}
                    hint="Въведете с префикс на държавата (напр. BG...)."
                  />
                }
                FormHelperTextProps={{ component: "div" }}
                sx={gridFieldSx}
              />
            </Grid>
          ) : null}
        </>
      ) : (
        <Grid item xs={12} md={3}>
          <TextField
            {...fieldProps}
            label="Личен идентификатор (по избор)"
            name="customerPersonalId"
            value=""
            disabled
            helperText={
              <FormFieldHelperText hint="Не е задължително за физически лица." />
            }
            FormHelperTextProps={{ component: "div" }}
            sx={gridFieldSx}
          />
        </Grid>
      )}
      <Grid item xs={12} md={6}>
        <TextField
          {...fieldProps}
          label="Адрес на клиента"
          name="customerAddress"
          placeholder="напр. бул. Витоша 24"
          value={customerAddress}
          onChange={onCustomerAddressChange}
          helperText={<FormFieldHelperText hint="Улица и номер." />}
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          {...fieldProps}
          label="Пощенски код"
          name="customerPostCode"
          placeholder="напр. 1000"
          value={customerPostCode}
          onChange={onCustomerPostCodeChange}
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          {...fieldProps}
          label="Град"
          name="customerCity"
          placeholder="напр. София"
          value={customerCity}
          onChange={onCustomerCityChange}
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          {...fieldProps}
          label="Имейл на клиента"
          type="email"
          name="customerEmail"
          placeholder="напр. billing@client.com"
          value={customerEmail}
          onChange={onCustomerEmailChange}
          error={Boolean(errors.customerEmail)}
          helperText={
            <FormFieldHelperText errorMessage={errors.customerEmail?.message} />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
    </Grid>
  </Paper>
);
