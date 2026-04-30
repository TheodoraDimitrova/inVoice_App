const FIELD_RADIUS = 1;

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
    borderRadius: FIELD_RADIUS,
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: FIELD_RADIUS,
    },
  },
  "& .MuiOutlinedInput-input": {
    py: "10px",
    px: "14px",
    fontSize: "0.875rem",
    lineHeight: 1.5,
    boxSizing: "border-box",
    borderRadius: "inherit",
  },
  "& .MuiSelect-select": {
    py: "10px",
    minHeight: "auto",
    display: "flex",
    alignItems: "center",
    borderRadius: "inherit",
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

export const inlineCellSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: FIELD_RADIUS,
    minHeight: 44,
    height: "auto",
    alignItems: "center",
    "& .MuiOutlinedInput-notchedOutline": {
      borderRadius: FIELD_RADIUS,
    },
    "& fieldset": { borderColor: "rgba(15, 23, 42, 0.14)" },
    "&:hover fieldset": { borderColor: "rgba(15, 23, 42, 0.16)" },
    "&.Mui-focused fieldset": {
      borderColor: "var(--color-brand-primary)",
      borderWidth: 1,
    },
  },
  "& .MuiOutlinedInput-input": {
    py: "10px",
    fontSize: "0.9rem",
    lineHeight: 1.5,
    boxSizing: "border-box",
    borderRadius: "inherit",
  },
  "& .MuiSelect-select": {
    paddingTop: "10px !important",
    paddingBottom: "10px !important",
    paddingRight: "32px !important",
    minHeight: "auto",
    display: "flex",
    alignItems: "center",
    borderRadius: "inherit",
  },
  "& .MuiSelect-icon": {
    right: 8,
  },
  "& .MuiInputAdornment-root": {
    mt: 0,
  },
};
