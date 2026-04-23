import React from "react";
import { Paper, Stack, Typography } from "@mui/material";

export const TotalsSection = ({ currencySign, subtotal, vatLabel, vatTotal, grandTotal }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      mt: 0.5,
      borderRadius: 2,
      borderColor: "rgba(15, 23, 42, 0.08)",
      bgcolor: "rgba(15, 23, 42, 0.02)",
    }}
  >
    <Stack spacing={0.75} sx={{ maxWidth: 360, ml: "auto" }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          Междинна сума
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {currencySign} {subtotal.toFixed(2)}
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="text.secondary">
          {vatLabel}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {currencySign} {vatTotal.toFixed(2)}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ pt: 0.5, borderTop: "1px solid rgba(15, 23, 42, 0.08)" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
          Крайна сума
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          {currencySign} {grandTotal.toFixed(2)}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

