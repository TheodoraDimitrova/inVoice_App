import React from "react";

export const SectionTitle = ({ icon: Icon, title, subtitle }) => (
  <div className="mb-6 flex w-full min-w-0 items-start gap-4">
    <div className="section-icon-tile mt-1">
      <Icon fontSize="inherit" />
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
