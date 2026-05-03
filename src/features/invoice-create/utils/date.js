export const toDateInput = (d) => new Date(d).toISOString().slice(0, 10);

/**
 * @param {string} isoDateStr - YYYY-MM-DD
 * @param {number} daysToAdd - whole calendar days (local)
 */
export function addCalendarDaysToDateInput(isoDateStr, daysToAdd) {
  const trimmed = String(isoDateStr ?? "").trim();
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!m) {
    const base = new Date();
    base.setDate(base.getDate() + daysToAdd);
    return toDateInput(base);
  }
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const day = Number(m[3]);
  const next = new Date(y, mo, day + daysToAdd);
  return toDateInput(next);
}
