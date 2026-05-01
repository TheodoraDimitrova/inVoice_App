import React from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Table from "../../../components/Table";
import { tableSurfaceSx } from "../../../utils/tableStyles";
import { AverageInvoiceCard } from "./metrics/AverageInvoiceCard";
import { InvoicesCard } from "./metrics/InvoicesCard";
import { PaymentStatusCard } from "./metrics/PaymentStatusCard";
import { RevenueCard } from "./metrics/RevenueCard";

const DashboardPageView = ({
  businessName,
  companyEmail,
  canCreateInvoice,
  invoiceGateLoading,
  onOpenProfile,
  onOpenInvoices,
  recentInvoices,
  vatRate,
  metrics,
  revenueLabel,
  averageInvoiceLabel,
}) => {
  return (
    <Box
      sx={{
        px: { xs: 2, sm: 3 },
        py: { xs: 2, sm: 2.5 },
        maxWidth: 1100,
        mx: "auto",
      }}
    >
      {!invoiceGateLoading && !canCreateInvoice ? (
        <Alert
          severity="warning"
          sx={{ mb: 2.5, alignItems: "center" }}
          action={
            <Button color="inherit" size="small" onClick={onOpenProfile}>
              Настройки на профила
            </Button>
          }
        >
          За да създавате фактури, добавете <strong>данъчни настройки</strong>{" "}
          (ДДС), <strong>фирмен идентификатор</strong> и{" "}
          <strong>банкови данни</strong> в „Профил“, или включете опцията{" "}
          <strong>"Не ми трябват банкови данни във фактурите"</strong>. Данните
          за фирма и адрес са достатъчни за достъп до таблото.
        </Alert>
      ) : null}

      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "stretch", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2.5 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 600,
              color: "var(--color-brand-charcoal)",
              letterSpacing: "-0.02em",
              fontSize: { xs: "1.1rem", sm: "1.2rem" },
              lineHeight: 1.3,
            }}
          >
            Табло
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
            {businessName
              ? businessName
              : "Преглед на текущия месец и последна активност."}
          </Typography>
          {companyEmail ? (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mt: 0.75, display: "block" }}
            >
              Фирмен имейл: {companyEmail}
            </Typography>
          ) : null}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          flexShrink={0}
        >
          <Button
            type="button"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onOpenInvoices}
            sx={{
              minHeight: 40,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "var(--color-brand-primary)",
              color: "var(--color-brand-primary)",
            }}
          >
            Всички фактури
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <RevenueCard revenueLabel={revenueLabel} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <InvoicesCard issuedCount={metrics.issuedCount} />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <PaymentStatusCard
            paidCount={metrics.paidCount}
            unpaidCount={metrics.unpaidCount}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <AverageInvoiceCard averageInvoiceLabel={averageInvoiceLabel} />
        </Grid>
      </Grid>

      <Paper
        variant="outlined"
        sx={{
          ...tableSurfaceSx,
          maxWidth: "100%",
          p: { xs: 1.5, sm: 2 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: "0.95rem",
            color: "#334155",
            mb: 1,
          }}
        >
          Последни фактури
        </Typography>
        <Table invoices={recentInvoices} defaultVatRate={vatRate} />
      </Paper>
    </Box>
  );
};
export default DashboardPageView;
