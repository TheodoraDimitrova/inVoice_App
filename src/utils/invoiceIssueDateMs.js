/**
 * Parses stored invoice issue date (YYYY-MM-DD) to local-midnight UTC ms.
 * Used for dashboard metrics month bucketing — must not use Firestore server timestamps.
 */
export function parseIssueDateLocalMs(issueDateStr) {
  if (!issueDateStr || typeof issueDateStr !== "string") return Number.NaN;
  const trimmed = issueDateStr.trim();
  const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(trimmed);
  if (!parts) return Number.NaN;
  const y = Number(parts[1]);
  const m = Number(parts[2]) - 1;
  const d = Number(parts[3]);
  const dt = new Date(y, m, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m || dt.getDate() !== d) {
    return Number.NaN;
  }
  return dt.getTime();
}
