import { createTheme } from "@mui/material/styles";

/**
 * Global MUI theme. Palette primary must stay parseable (hex/rgb) — MUI runs color math on it.
 * Keep brand tokens in sync with :root in src/index.css where applicable.
 */
const theme = createTheme({
  typography: {
    fontFamily: ["Sora", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: "#0f766e",
      dark: "#0d9488",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "0.5rem",
          padding: "10px 22px",
        },
        containedPrimary: {
          boxShadow:
            "0 4px 20px rgba(15, 118, 110, 0.12), 0 2px 8px rgba(15, 23, 42, 0.06)",
          "&:hover": {
            boxShadow:
              "0 8px 28px rgba(15, 118, 110, 0.14), 0 4px 12px rgba(15, 23, 42, 0.07)",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "0.5rem",
          "&:hover": {
            backgroundColor: "#ffffff",
          },
          "&.Mui-focused": {
            backgroundColor: "#ffffff",
          },
          "& fieldset": {
            borderColor: "var(--color-border-soft)",
          },
          "&:hover fieldset": {
            borderColor: "var(--color-border-hover)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--color-brand-primary)",
            borderWidth: "1px",
          },
        },
        input: {
          backgroundColor: "#ffffff",
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
            WebkitTextFillColor: "var(--color-brand-charcoal)",
            caretColor: "var(--color-brand-charcoal)",
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "var(--color-text-muted)",
          backgroundColor: "transparent",
          "&.Mui-focused": {
            color: "var(--color-brand-primary)",
          },
          "&.MuiInputLabel-shrink": {
            backgroundColor: "#ffffff",
            paddingLeft: "4px",
            paddingRight: "4px",
          },
        },
      },
    },
  },
});

export default theme;
