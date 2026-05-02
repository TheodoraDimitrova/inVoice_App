import React from "react";
import { InputAdornment, TextField } from "@mui/material";
import { setupProfileFieldProps } from "../../utils/muiFieldSx";
import { FormFieldHelperText } from "../FormFieldHelperText";

const fieldProps = setupProfileFieldProps;

export const PriceField = ({ row, lineSx, currencySign, updateRow, error, fieldName = "priceNet" }) => (
  <TextField
    {...fieldProps}
    type="number"
    label="Ед. цена"
    required
    placeholder="0.00"
    value={row[fieldName]}
    onChange={(e) => updateRow(row._rowId, fieldName, e.target.value)}
    error={Boolean(error)}
    helperText={<FormFieldHelperText errorMessage={error} />}
    FormHelperTextProps={{ component: "div" }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">{currencySign}</InputAdornment>
      ),
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
