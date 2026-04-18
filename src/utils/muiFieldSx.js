/** Shared MUI TextField styles */

const outlinedFieldBase = {
  width: "100%",
  minWidth: 0,
  "& .MuiFormHelperText-root": {
    mt: 1,
    mx: 0,
    lineHeight: 1.35,
  },
  "& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline": {
    borderWidth: 2,
    borderColor: "error.main",
  },
};

const compactOutlinedInput = {
  "& .MuiOutlinedInput-root": {
    minHeight: 44,
    alignItems: "center",
    borderRadius: 1,
  },
  "& .MuiOutlinedInput-input": {
    py: "10px",
    px: "14px",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    boxSizing: "border-box",
  },
  "& .MuiSelect-select": {
    py: "10px",
    minHeight: "auto",
    display: "flex",
    alignItems: "center",
  },
};

export const outlinedFieldLabelProps = {
  shrink: true,
  sx: {
    "&.MuiInputLabel-root": {
      backgroundColor: "#ffffff",
      px: 0.75,
      borderRadius: 0.5,
      ml: -0.125,
    },
  },
};

export const setupProfileFieldProps = {
  fullWidth: true,
  variant: "outlined",
  size: "medium",
  InputLabelProps: outlinedFieldLabelProps,
};

export const outlinedFieldSx = {
  ...outlinedFieldBase,
  mb: 2.5,
  ...compactOutlinedInput,
};

export const gridFieldSx = {
  ...outlinedFieldBase,
  mb: 0,
  ...compactOutlinedInput,
};
