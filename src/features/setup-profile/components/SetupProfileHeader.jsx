import React from "react";
import { Box, Typography } from "@mui/material";

const SetupProfileHeader = () => (
  <Box sx={{ mb: 3, textAlign: "left" }}>
    <Typography
      variant="overline"
      sx={{
        display: "block",
        color: "primary.main",
        fontWeight: 600,
        letterSpacing: "0.12em",
        mb: 1,
      }}
    >
      Още една стъпка
    </Typography>
    <Typography
      variant="h4"
      component="h1"
      sx={{
        fontWeight: 600,
        color: "var(--color-brand-charcoal)",
        letterSpacing: "-0.03em",
        mb: 1,
      }}
    >
      Настройте бизнеса си
    </Typography>
    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 640 }}>
      Попълнете основните данни за вашия бизнес. След това ще можете да издавате
      фактури веднага.
    </Typography>
  </Box>
);

export default SetupProfileHeader;
