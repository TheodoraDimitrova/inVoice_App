const tokens = require("./src/theme/designTokens.json");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: tokens.brand.primary,
          "primary-hover": tokens.brand.primaryHover,
          accent: tokens.brand.accent,
          charcoal: tokens.brand.charcoal,
        },
        line: {
          soft: tokens.brand.borderSoft,
          hover: tokens.brand.borderHover,
        },
        ink: {
          muted: tokens.brand.textMuted,
        },
      },
      maxWidth: {
        page: "72rem",
      },
    },
  },
  plugins: [],
};
