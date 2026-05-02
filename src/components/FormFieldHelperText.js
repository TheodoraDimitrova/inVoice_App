import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const FormFieldHelperText = ({ errorMessage, hint }) => {
  if (errorMessage) {
    return (
      <span className="flex w-full items-center gap-2">
        <ErrorOutlineIcon
          sx={{ fontSize: 18, flexShrink: 0 }}
          color="error"
          aria-hidden
        />
        <span>{errorMessage}</span>
      </span>
    );
  }
  return hint ?? null;
};
