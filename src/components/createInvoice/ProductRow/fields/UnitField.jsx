import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { setupProfileFieldProps } from "../../../../utils/muiFieldSx";
import { FormFieldHelperText } from "../../../FormFieldHelperText";

const fieldProps = setupProfileFieldProps;

export const UnitField = ({ row, lineSx, unitOptions, updateRow, error }) => (
  <Autocomplete
    freeSolo
    options={unitOptions}
    value={String(row.itemUnit || "").trim() || "бр."}
    onChange={(_, value) =>
      updateRow(row._rowId, "itemUnit", String(value || "").trim() || "бр.")
    }
    onInputChange={(_, value, reason) => {
      if (reason === "input" || reason === "clear") {
        updateRow(row._rowId, "itemUnit", String(value || "").trim());
      }
    }}
    sx={lineSx}
    renderInput={(params) => (
      <TextField
        {...params}
        {...fieldProps}
        label="Единица"
        required
        placeholder="бр."
        error={Boolean(error)}
        helperText={<FormFieldHelperText errorMessage={error} />}
        FormHelperTextProps={{ component: "div" }}
      />
    )}
  />
);
