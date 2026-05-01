export const EUR_TO_BGN_RATE = 1.95583;

export const formatInvoiceBadge = (invoiceData) => {
  const n = Number(invoiceData?.id);
  const hasNumber = Number.isFinite(n) && n > 0;
  if (!hasNumber || invoiceData?.status === "draft") return "Чернова";
  return String(n).padStart(10, "0");
};

export const formatStoredDate = (value, fallbackTimestamp) => {
  const raw = String(value || "").trim();
  if (raw) {
    const [y, m, d] = raw.split("-");
    if (y && m && d) return `${d}.${m}.${y}`;
    return raw;
  }
  if (fallbackTimestamp?.seconds) {
    const date = new Date(fallbackTimestamp.seconds * 1000);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }
  return "";
};

export const identifierLabelFromDigits = (value, fallback = "Идентификатор") => {
  const raw = String(value ?? "").trim();
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 9) return "ЕИК";
  if (digits.length === 10) return "Булстат";
  return fallback;
};

export const formatDiscountPercent = (value) => {
  const n = Number(value) || 0;
  if (!n) return "";
  return Number.isInteger(n) ? `${n}%` : `${n.toFixed(1)}%`;
};

export const formatBgnEquivalent = (amount) =>
  `${(Number(amount || 0) * EUR_TO_BGN_RATE).toFixed(2)} BGN`;
