import React from "react";
import { Box, MenuItem, TextField } from "@mui/material";
import { setupProfileFieldProps } from "../../../../../utils/muiFieldSx";
import { FormFieldHelperText } from "../../../../../components/FormFieldHelperText";

const fieldProps = setupProfileFieldProps;

export const VatField = ({
  row,
  lineSx,
  showVatField,
  vatRateOptions,
  updateRow,
  error,
}) =>
  showVatField ? (
    <TextField
      {...fieldProps}
      select
      label="ДДС %"
      required
      value={row.itemVatRate}
      onChange={(e) => updateRow(row._rowId, "itemVatRate", Number(e.target.value))}
      sx={lineSx}
      error={Boolean(error)}
      helperText={<FormFieldHelperText errorMessage={error} />}
      FormHelperTextProps={{ component: "div" }}
      fullWidth
    >
      {vatRateOptions.map((rate) => (
        <MenuItem key={rate} value={rate}>
          {rate}%
        </MenuItem>
      ))}
    </TextField>
  ) : (
    <Box sx={{ minHeight: 40 }} />
  );
