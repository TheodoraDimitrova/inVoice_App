import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { setupProfileFieldProps } from "../../../../utils/muiFieldSx";
import { FormFieldHelperText } from "../../../FormFieldHelperText";

const fieldProps = setupProfileFieldProps;

export const PriceField = ({ row, lineSx, currencySign, updateRow, error }) => (
  <TextField
    {...fieldProps}
    type="number"
    label="Ед. цена"
    required
    placeholder="0.00"
    value={row.itemCost}
    onChange={(e) => updateRow(row._rowId, "itemCost", e.target.value)}
    onBlur={(e) => {
      const parsed = Number(e.target.value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        updateRow(row._rowId, "itemCost", "0.01");
      }
    }}
    inputProps={{ step: "0.01", min: 0.01 }}
    error={Boolean(error)}
    helperText={<FormFieldHelperText errorMessage={error} />}
    FormHelperTextProps={{ component: "div" }}
    InputProps={{
      startAdornment: <InputAdornment position="start">{currencySign}</InputAdornment>,
    }}
    sx={{
      ...lineSx,
      "& .MuiOutlinedInput-input": {
        ...(lineSx["& .MuiOutlinedInput-input"] || {}),
        textAlign: "right",
        fontVariantNumeric: "tabular-nums",
      },
    }}
    fullWidth
  />
);
