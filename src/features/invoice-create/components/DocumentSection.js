import React from "react";
import {
  Box,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { FormFieldHelperText } from "../../../components/FormFieldHelperText";
import { gridFieldSx, setupProfileFieldProps } from "../../../utils/muiFieldSx";

const fieldProps = setupProfileFieldProps;
const formatInvoicePreviewNumber = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return "-";
  if (!/^\d+$/.test(raw)) return raw;
  return raw.padStart(10, "0");
};

export const DocumentSection = ({
  sectionShellSx,
  sectionIconBoxSx,
  customerType,
  onCustomerTypeChange,
  invoiceNumberPreview,
  issueDate,
  onIssueDateChange,
  dueDate,
  onDueDateChange,
  currency,
  onCurrencyChange,
  currencyOptions,
  errors = {},
}) => (
  <Paper variant="outlined" sx={sectionShellSx}>
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
      <Box sx={sectionIconBoxSx}>
        <DescriptionOutlinedIcon fontSize="small" />
      </Box>
      <Box>
        <Typography
          sx={{ fontWeight: 700, color: "var(--color-brand-primary)" }}
        >
          Данни за документа
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Номер и дати на фактурата.
        </Typography>
      </Box>
    </Stack>
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Stack spacing={0.75}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: "text.secondary" }}
          >
            Тип клиент
          </Typography>
          <ToggleButtonGroup
            value={customerType}
            exclusive
            onChange={onCustomerTypeChange}
            size="small"
            sx={{
              width: "fit-content",
              "& .MuiToggleButton-root": {
                px: 2,
                textTransform: "none",
                fontWeight: 600,
              },
            }}
          >
            <ToggleButton value="business">Фирма (B2B)</ToggleButton>
            <ToggleButton value="individual">Физическо лице (B2C)</ToggleButton>
          </ToggleButtonGroup>
          <Typography variant="caption" color="text.secondary">
            Изберете категорията на клиента за тази фактура.
          </Typography>
        </Stack>
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          {...fieldProps}
          label="Номер на фактура"
          value={formatInvoicePreviewNumber(invoiceNumberPreview)}
          placeholder="Генерира се автоматично"
          disabled
          helperText={
            <FormFieldHelperText hint="Автоматично генериран пореден номер." />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          {...fieldProps}
          label="Дата на издаване"
          type="date"
          value={issueDate}
          onChange={onIssueDateChange}
          error={Boolean(errors.issueDate)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.issueDate?.message}
              hint="При нужда може да редактирате датата."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        />
      </Grid>
      <Grid item xs={12} md={3}>
        <TextField
          {...fieldProps}
          label="Падеж"
          type="date"
          value={dueDate}
          onChange={onDueDateChange}
          error={Boolean(errors.dueDate)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.dueDate?.message}
              hint="Ако е празно, се приема датата на издаване."
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
          label="Валута"
          value={(currency || "EUR").toUpperCase()}
          onChange={onCurrencyChange}
          error={Boolean(errors.currency)}
          helperText={
            <FormFieldHelperText
              errorMessage={errors.currency?.message}
              hint="По подразбиране от профила; промяната ще бъде само за тази фактура."
            />
          }
          FormHelperTextProps={{ component: "div" }}
          sx={gridFieldSx}
        >
          {currencyOptions.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </Grid>
  </Paper>
);
