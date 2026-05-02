import React from "react";

export const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6 flex w-full min-w-0 items-start gap-4">
    <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)] shadow-[inset_0_0_0_1px_rgba(15,118,110,0.14),0_1px_2px_rgba(15,23,42,0.04)]">
      <Icon fontSize="small" />
    </div>
    <div>
      <h2 className="text-lg font-bold leading-snug tracking-[-0.02em] text-slate-900">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-1 text-sm font-normal text-slate-500">
          {subtitle}
        </p>
      )}
    </div>
  </div>
);
