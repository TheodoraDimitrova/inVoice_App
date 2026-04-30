export const COMMON_UNIT_OPTIONS = ["бр.", "пакет", "компл."];

export const invoiceLineFieldSx = (inlineCellSx) => ({
  ...inlineCellSx,
  mb: 0,
  width: "100%",
  minWidth: 0,
  "& .MuiOutlinedInput-root": {
    ...(inlineCellSx["& .MuiOutlinedInput-root"] || {}),
    maxWidth: "100%",
    height: "auto",
    minHeight: 40,
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(15, 23, 42, 0.14)",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(15, 23, 42, 0.2)",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "var(--color-brand-primary)",
      borderWidth: 1,
    },
    "&.Mui-error .MuiOutlinedInput-notchedOutline": {
      borderColor: "error.main",
      borderWidth: 2,
    },
    "&.Mui-error:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "error.main",
    },
    "&.Mui-error.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "error.main",
      borderWidth: 2,
    },
  },
  "& .MuiOutlinedInput-input": {
    ...(inlineCellSx["& .MuiOutlinedInput-input"] || {}),
    py: "8px",
    fontSize: "0.8125rem",
  },
  "& .MuiSelect-select": {
    ...(inlineCellSx["& .MuiSelect-select"] || {}),
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    pr: "30px !important",
    paddingTop: "8px !important",
    paddingBottom: "8px !important",
  },
  "& input[type=number]": {
    MozAppearance: "textfield",
  },
  "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
    {
      WebkitAppearance: "none",
      margin: 0,
    },
});
