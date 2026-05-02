import { createTheme } from "@mui/material/styles";
import tokens from "./designTokens.json";

const { primary, primaryHover, charcoal, borderSoft, borderHover, textMuted } =
  tokens.brand;

const theme = createTheme({
  typography: {
    fontFamily: ["Sora", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      main: primary,
      dark: primaryHover,
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
        root: ({ theme }) => ({
          textTransform: "none",
          fontWeight: 600,
          borderRadius: "0.5rem",
          padding: "10px 22px",
          [theme.breakpoints.down("sm")]: {
            padding: "8px 16px",
            fontSize: "0.875rem",
          },
        }),
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
            borderColor: borderSoft,
          },
          "&:hover fieldset": {
            borderColor: borderHover,
          },
          "&.Mui-focused fieldset": {
            borderColor: primary,
            borderWidth: "1px",
          },
        },
        input: {
          backgroundColor: "#ffffff",
          "&:-webkit-autofill": {
            WebkitBoxShadow: "0 0 0 1000px #ffffff inset",
            WebkitTextFillColor: charcoal,
            caretColor: charcoal,
          },
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: textMuted,
          backgroundColor: "transparent",
          "&.Mui-focused": {
            color: primary,
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
