import React from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { Button } from "@mui/material";
import { ComponentToPrint } from "../print/ComponentToPrint";
import { InvoiceStatusBadge } from "../../../components/InvoiceStatusBadge";

const ViewInvoicePage = ({
  invoice,
  invoiceStatusBadge,
  business,
  printRef,
  onPrint,
  isPreview,
  showPaidBanner,
  canMarkPaid,
  markPaidBusy,
  markPaidActionsDisabled,
  onMarkPaid,
}) => (
  <div className="flex w-full flex-col px-4 py-5 sm:px-6 sm:py-7 md:px-10 md:py-8 lg:px-12 xl:px-14">
    {!isPreview ? (
      <div className="mx-auto mb-6 w-full max-w-[850px] print:hidden">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.06)] sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <h1 className="text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
              Фактура
            </h1>
            {invoiceStatusBadge ? (
              <InvoiceStatusBadge
                label={invoiceStatusBadge.label}
                statusTone={invoiceStatusBadge.statusTone}
                size="medium"
                variant="chip"
              />
            ) : null}
            {showPaidBanner ? (
              <span className="text-xs font-medium text-emerald-800 sm:border-l sm:border-slate-200 sm:pl-3">
                Платена — без редакция и изтриване.
              </span>
            ) : null}
          </div>

          <div className="flex flex-shrink-0 flex-wrap items-center gap-2 sm:justify-end">
            {canMarkPaid ? (
              <Button
                type="button"
                variant="contained"
                color="success"
                disabled={markPaidActionsDisabled ?? markPaidBusy}
                onClick={onMarkPaid}
                sx={{
                  textTransform: "none",
                  fontWeight: 800,
                  minHeight: 44,
                  px: 2.5,
                  borderRadius: 2,
                  boxShadow: "0 4px 14px rgba(22,163,74,0.35)",
                }}
              >
                {markPaidBusy ? "Записване…" : "Маркирай като платена"}
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outlined"
              color="primary"
              onClick={onPrint}
              startIcon={<LocalPrintshopIcon />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                minHeight: 44,
                borderRadius: 2,
                borderColor: "var(--color-brand-primary)",
                color: "var(--color-brand-primary)",
              }}
            >
              Печат / PDF
            </Button>
          </div>
        </div>
      </div>
    ) : null}

    <div className="flex w-full justify-center">
      <div className="w-full max-w-[850px] min-w-0 shrink-0">
        <ComponentToPrint
          ref={printRef}
          invoice={invoice}
          business={business}
          isPreview={isPreview}
        />
      </div>
    </div>
  </div>
);

export default ViewInvoicePage;
