import React from "react";
import Table from "../../../components/Table";

const InvoicesPageView = ({ invoices, vatRate }) => {
  return (
    <main className="mx-auto max-w-[1100px] px-4 py-4 sm:px-6 sm:py-6">
      <h1 className="mb-1 text-lg font-semibold leading-snug tracking-[-0.02em] text-[var(--color-brand-charcoal)] sm:text-xl">
        Фактури
      </h1>

      {invoices.length === 0 ? (
        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Все още няма фактури.
        </div>
      ) : null}

      <section className="max-w-full overflow-hidden rounded-3xl border border-slate-300/60 bg-gradient-to-b from-white/95 to-slate-50/95 p-4 shadow-[0_10px_28px_rgba(15,23,42,0.08)]">
        <Table invoices={invoices} defaultVatRate={vatRate} />
      </section>
    </main>
  );
};

export default InvoicesPageView;
