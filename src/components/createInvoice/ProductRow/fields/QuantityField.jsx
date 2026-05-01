import React from "react";
import { TextField } from "@mui/material";
import { setupProfileFieldProps } from "../../../../utils/muiFieldSx";
import { FormFieldHelperText } from "../../../FormFieldHelperText";

const fieldProps = setupProfileFieldProps;

export const QuantityField = ({ row, lineSx, updateRow, error }) => (
  <TextField
    {...fieldProps}
    type="number"
    label="Количество"
    required
    placeholder="1"
    value={row.itemQuantity}
    onChange={(e) => updateRow(row._rowId, "itemQuantity", e.target.value)}
    onBlur={(e) => {
      const parsed = Number(e.target.value);
      if (!Number.isFinite(parsed) || parsed < 1) {
        updateRow(row._rowId, "itemQuantity", 1);
      }
    }}
    inputProps={{ min: 1, step: "0.01" }}
    error={Boolean(error)}
    helperText={<FormFieldHelperText errorMessage={error} />}
    FormHelperTextProps={{ component: "div" }}
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
