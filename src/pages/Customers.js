import React from "react";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";

const Customers = () => (
  <main className="max-w-xl px-4 py-4 sm:px-6 sm:py-6">
    <h1 className="mb-1 text-lg font-semibold tracking-[-0.02em] text-[var(--color-brand-charcoal)]">
      Customers
    </h1>
    <p className="mb-8 text-sm text-slate-500">
      Manage client records and reuse them on invoices.
    </p>
    <section className="rounded-2xl border border-[var(--color-border-soft)] bg-white p-8 text-center">
      <PeopleOutlineOutlinedIcon sx={{ fontSize: 40, color: "var(--color-brand-primary)", mb: 1 }} />
      <h2 className="text-base font-semibold text-slate-900">
        Coming soon
      </h2>
      <p className="mt-2 text-sm text-slate-500">
        Customer directory will be available in a future update.
      </p>
    </section>
  </main>
);

export default Customers;
