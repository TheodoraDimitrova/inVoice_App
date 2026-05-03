export const metricCardClass =
  "h-full rounded-2xl border border-[var(--color-border-soft)] bg-white p-4 shadow-sm";

/** Заглавен ред над цифрата */
export const metricLabelClass =
  "text-xs font-semibold text-[var(--color-text-muted)]";

/** Пояснение под основната стойност */
export const metricCaptionClass =
  "mt-1 block text-xs leading-snug text-[var(--color-text-muted)]";

const baseMetricIconClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl";

export const metricIconClasses = {
  green: `${baseMetricIconClass} bg-[var(--color-brand-accent)] text-[var(--color-brand-primary)]`,
  blue: `${baseMetricIconClass} bg-indigo-500/10 text-indigo-600`,
  mint: `${baseMetricIconClass} bg-emerald-500/15 text-emerald-700`,
  amber: `${baseMetricIconClass} bg-amber-300/20 text-amber-700`,
};
