import React from "react";
import { Box, Stack, Typography, Divider } from "@mui/material";

export const InvoiceTotalsSummary = ({
  currencyLabel,
  subtotal,
  discountTotal = 0,
  vatLabel,
  vatTotal,
  grandTotal,
  showVatAmount = true,
  formatSecondaryAmount,
}) => {
  const secondarySubtotal = formatSecondaryAmount
    ? formatSecondaryAmount(subtotal, "subtotal")
    : "";
  const secondaryVat = formatSecondaryAmount
    ? formatSecondaryAmount(vatTotal, "vat")
    : "";
  const secondaryGrand = formatSecondaryAmount
    ? formatSecondaryAmount(grandTotal, "grandTotal")
    : "";

  const Row = ({ label, value, currency, secondary, isTotal = false }) => (
    <Stack
      direction="row"
      justifyContent="flex-end"
      spacing={2}
      sx={{
        alignItems: "baseline",
        py: 0,
        paddingTop: 0.5,
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isTotal ? 800 : 400,
          color: isTotal ? "text.primary" : "text.secondary",
          textAlign: "right",
          width: "200px",
          textTransform: isTotal ? "uppercase" : "none",
          letterSpacing: isTotal ? 0.5 : 0,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>

      <Stack alignItems="flex-end" sx={{ width: "125px", lineHeight: 1 }}>
        <Stack direction="row" alignItems="baseline" spacing={0.2}>
          <Typography
            sx={{
              fontWeight: isTotal ? 900 : 700,
              fontSize: isTotal ? "1.2rem" : "1rem",
              lineHeight: 0.2,
              color: "#111827",
              fontFamily: "'Roboto Mono', monospace",
            }}
          >
            {value}
          </Typography>
          <Typography
            sx={{
              fontWeight: isTotal ? 700 : 600,
              fontSize: isTotal ? "1rem" : "0.85rem",
              color: isTotal ? "#111827" : "text.primary",
            }}
          >
            {currency}
          </Typography>
        </Stack>
        {secondary && (
          <Typography
            variant="caption"
            sx={{
              color: "text.disabled",
              fontWeight: 600,
              fontSize: isTotal ? "0.85rem" : "0.75rem",
              fontFamily: "'Roboto Mono', monospace",
              marginTop: "0px",
              lineHeight: 1,
              display: "block",
            }}
          >
            {secondary}
          </Typography>
        )}
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ mt: 2, ml: "auto", pr: 0 }}>
      <Stack spacing={0}>
        <Row
          label="Междинна сума"
          value={subtotal.toFixed(2)}
          currency={currencyLabel}
          secondary={secondarySubtotal}
        />

        <Row
          label={vatLabel}
          value={showVatAmount ? vatTotal.toFixed(2) : "—"}
          currency={showVatAmount ? currencyLabel : ""}
          secondary={showVatAmount ? secondaryVat : null}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Divider
            sx={{
              my: 1,
              width: "100%",
              maxWidth: 320,
              borderColor: "rgba(0,0,0,0.15)",
            }}
          />
        </Box>

        <Row
          label="Крайна сума"
          value={grandTotal.toFixed(2)}
          currency={currencyLabel}
          secondary={secondaryGrand}
          isTotal
        />
      </Stack>
    </Box>
  );
};
