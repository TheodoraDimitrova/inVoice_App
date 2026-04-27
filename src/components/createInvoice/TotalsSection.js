import React from "react";
import { Paper, Stack, Typography } from "@mui/material";

export const TotalsSection = ({
  currencySign,
  subtotal,
  discountTotal = 0,
  vatLabel,
  vatTotal,
  grandTotal,
  showVatAmount = true,
}) => (
  <Paper
    variant="outlined"
    sx={{
      p: 1.25,
      mt: 0.5,
      borderRadius: 2,
      borderColor: "rgba(15, 23, 42, 0.08)",
      bgcolor: "#fff",
    }}
  >
    <Stack spacing={0.5} sx={{ maxWidth: 420, ml: "auto" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ px: 1.25, py: 0.6, bgcolor: "rgba(15, 23, 42, 0.08)" }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          Междинна сума
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {currencySign} {subtotal.toFixed(2)}
        </Typography>
      </Stack>
      {discountTotal > 0 ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          sx={{ px: 1.25, py: 0.6, bgcolor: "rgba(15, 23, 42, 0.08)" }}
        >
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            Отстъпки
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            -{currencySign} {discountTotal.toFixed(2)}
          </Typography>
        </Stack>
      ) : null}
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ px: 1.25, py: 0.6, bgcolor: "rgba(15, 23, 42, 0.08)" }}
      >
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {vatLabel}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 700 }}>
          {showVatAmount ? `${currencySign} ${vatTotal.toFixed(2)}` : ""}
        </Typography>
      </Stack>
      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{ px: 1.25, py: 0.6, bgcolor: "rgba(15, 23, 42, 0.12)" }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
          Крайна сума
        </Typography>
        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
          {currencySign} {grandTotal.toFixed(2)}
        </Typography>
      </Stack>
    </Stack>
  </Paper>
);

