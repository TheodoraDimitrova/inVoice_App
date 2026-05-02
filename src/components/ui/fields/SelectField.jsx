import React from "react";
import { MenuItem } from "@mui/material";
import { TextField } from "./TextField";

export const SelectField = ({ options = [], children, getOptionLabel, getOptionValue, ...props }) => (
  <TextField select {...props}>
    {children ||
      options.map((option) => {
        const value = getOptionValue ? getOptionValue(option) : option.value ?? option;
        const label = getOptionLabel ? getOptionLabel(option) : option.label ?? option;
        return (
          <MenuItem key={value} value={value}>
            {label}
          </MenuItem>
        );
      })}
  </TextField>
);
