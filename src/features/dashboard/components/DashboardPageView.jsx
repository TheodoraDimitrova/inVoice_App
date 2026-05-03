import React, { useMemo } from "react";
import { Button } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Table from "../../../components/Table";
import { buildInvoiceTableRows } from "../../../utils/invoiceTableRows";
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
  revenueNetLabel,
  isBusinessVatRegistered,
  averageInvoiceLabel,
}) => {
  const invoiceTableRows = useMemo(
    () => buildInvoiceTableRows(recentInvoices, vatRate),
    [recentInvoices, vatRate],
  );

  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6 sm:py-6">
      {!invoiceGateLoading && !canCreateInvoice ? (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:flex-row sm:items-center sm:justify-between">
          <p>
            За да създавате фактури, добавете <strong>данъчни настройки</strong>{" "}
            (ДДС), <strong>фирмен идентификатор</strong> и{" "}
            <strong>банкови данни</strong> в „Профил“, или включете опцията{" "}
            <strong>"Не ми трябват банкови данни във фактурите"</strong>. Данните
            за фирма и адрес са достатъчни за достъп до таблото.
          </p>
          <div className="shrink-0">
            <Button color="inherit" size="small" onClick={onOpenProfile}>
              Настройки на профила
            </Button>
          </div>
        </div>
      ) : null}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h1 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-[var(--color-brand-charcoal)] sm:text-xl">
            Табло
          </h1>
          <p className="mt-1 text-sm text-[var(--color-text-muted)]">
            {businessName
              ? businessName
              : "Преглед на текущия месец и последна активност."}
          </p>
          {companyEmail ? (
            <p className="mt-2 block text-xs text-[var(--color-text-muted)]">
              Фирмен имейл: {companyEmail}
            </p>
          ) : null}
        </div>

        <div className="flex w-full shrink-0 md:w-auto md:justify-end">
          <Button
            type="button"
            variant="outlined"
            color="primary"
            size="small"
            startIcon={<Inventory2OutlinedIcon sx={{ fontSize: 18 }} />}
            onClick={onOpenInvoices}
            sx={{
              minHeight: 40,
              width: "100%",
              textTransform: "none",
              fontWeight: 600,
              borderColor: "var(--color-brand-primary)",
              color: "var(--color-brand-primary)",
              "@media (min-width: 768px)": {
                width: "auto",
              },
            }}
          >
            Всички фактури
          </Button>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 min-[1400px]:grid-cols-4 min-[1400px]:gap-4">
        <div className="h-full min-w-0">
          <RevenueCard
            isVatRegistered={isBusinessVatRegistered}
            revenueLabel={revenueLabel}
            revenueNetLabel={revenueNetLabel}
          />
        </div>
        <div className="h-full min-w-0">
          <InvoicesCard issuedCount={metrics.issuedCount} />
        </div>
        <div className="h-full min-w-0">
          <PaymentStatusCard
            paidCount={metrics.paidCount}
            unpaidCount={metrics.unpaidCount}
          />
        </div>
        <div className="h-full min-w-0">
          <AverageInvoiceCard averageInvoiceLabel={averageInvoiceLabel} />
        </div>
      </div>

      <section className="max-w-full overflow-hidden rounded-3xl border border-slate-300/60 bg-gradient-to-b from-white/95 to-slate-50/95 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <h2 className="mb-3 text-[0.95rem] font-bold text-slate-700">
          Последни фактури
        </h2>
        <Table rows={invoiceTableRows} />
      </section>
    </main>
  );
};
export default DashboardPageView;
