export const metricCardClass =
  "h-full rounded-2xl border border-[var(--color-border-soft)] bg-white p-4 shadow-sm";

const baseMetricIconClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl";

export const metricIconClasses = {
  green: `${baseMetricIconClass} bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)]`,
  blue: `${baseMetricIconClass} bg-indigo-500/10 text-indigo-600`,
  mint: `${baseMetricIconClass} bg-emerald-500/15 text-emerald-700`,
  amber: `${baseMetricIconClass} bg-amber-300/20 text-amber-700`,
};
