import React from "react";
import { Alert, Box, Paper, Typography } from "@mui/material";
import Table from "../../../components/Table";
import { tableSurfaceSx } from "../../../utils/tableStyles";

const InvoicesPageView = ({ invoices, vatRate }) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      <Typography
        variant="h6"
        component="h1"
        sx={{
          fontWeight: 600,
          color: "var(--color-brand-charcoal)",
          letterSpacing: "-0.02em",
          fontSize: { xs: "1.1rem", sm: "1.2rem" },
          lineHeight: 1.3,
          mb: 0.25,
        }}
      >
        Фактури
      </Typography>

      {invoices.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          Все още няма фактури.
        </Alert>
      ) : null}

      <Paper
        variant="outlined"
        sx={{
          ...tableSurfaceSx,
          maxWidth: "100%",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Table invoices={invoices} defaultVatRate={vatRate} />
      </Paper>
    </Box>
  );
};

export default InvoicesPageView;
