export function normalizeStoredProduct(data, id) {
  const quantityDefault = Number(data?.quantityDefault);
  const unit = String(data?.unit || "").trim() || "бр.";
  const vat = Number(data?.vat);
  return {
    id,
    name: data?.name || "",
    price: Number(data?.price) || 0,
    quantityDefault:
      Number.isFinite(quantityDefault) && quantityDefault >= 1
        ? quantityDefault
        : 1,
    unit,
    vat: Number.isFinite(vat) ? vat : 20,
  };
}
