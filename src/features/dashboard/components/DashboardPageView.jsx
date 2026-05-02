import React from "react";
import { Button } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import Table from "../../../components/Table";
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

      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h1 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-[var(--color-brand-charcoal)] sm:text-xl">
            Табло
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {businessName
              ? businessName
              : "Преглед на текущия месец и последна активност."}
          </p>
          {companyEmail ? (
            <p className="mt-2 block text-xs text-slate-500">
              Фирмен имейл: {companyEmail}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 justify-end gap-2">
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
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <RevenueCard revenueLabel={revenueLabel} />
        </div>
        <div>
          <InvoicesCard issuedCount={metrics.issuedCount} />
        </div>
        <div>
          <PaymentStatusCard
            paidCount={metrics.paidCount}
            unpaidCount={metrics.unpaidCount}
          />
        </div>
        <div>
          <AverageInvoiceCard averageInvoiceLabel={averageInvoiceLabel} />
        </div>
      </div>

      <section className="max-w-full overflow-hidden rounded-3xl border border-slate-300/60 bg-gradient-to-b from-white/95 to-slate-50/95 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <h2 className="mb-3 text-[0.95rem] font-bold text-slate-700">
          Последни фактури
        </h2>
        <Table invoices={recentInvoices} defaultVatRate={vatRate} />
      </section>
    </main>
  );
};
export default DashboardPageView;
