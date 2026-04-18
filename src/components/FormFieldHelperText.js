import React from "react";
import { Stack } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export const FormFieldHelperText = ({ errorMessage, hint }) => {
  if (errorMessage) {
    return (
      <Stack
        direction="row"
        spacing={0.75}
        alignItems="center"
        component="span"
        sx={{ width: "100%" }}
      >
        <ErrorOutlineIcon
          sx={{ fontSize: 18, flexShrink: 0 }}
          color="error"
          aria-hidden
        />
        <span>{errorMessage}</span>
      </Stack>
    );
  }
  return hint ?? null;
};
