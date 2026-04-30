import { useEffect } from "react";
import { showToast } from "../../../utils/functions";
import { getBusinessMetaFromDoc } from "../services/businessService";

export const useCreateInvoiceHydration = ({
  invoiceId,
  loadInvoice,
  loadBusinessDocs,
  fetchProducts,
  reset,
  setValue,
  setItemList,
  createEmptyRow,
  defaultBusinessVatRate,
  getNextRowId,
  setIsEditing,
  setIsBusinessVatRegistered,
  setDefaultBusinessVatRate,
  setInvoiceNumberPreview,
  setLoading,
  defaultFormValues,
  getValidInvoiceNumber,
  hasRowInput,
  toDateInput,
  vatRateOptions,
}) => {
  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const inv = await loadInvoice(invoiceId);
        if (!inv) return;
        reset({
          ...defaultFormValues,
          customerName: inv.customerName || "",
          customerType: inv.customerType || "business",
          customerAddress: inv.customerAddress || "",
          customerPostCode: inv.customerPostCode || "",
          customerCity: inv.customerCity || "",
          customerCountry: inv.customerCountry || "Bulgaria",
          customerEmail: inv.customerEmail || "",
          companyIdentifier: inv.companyIdentifier ?? inv.vat ?? "",
          customerVatRegistered: Boolean(inv.customerVatRegistered),
          customerVatNumber: inv.customerVatNumber ?? "",
          currency: (inv.currency || "EUR").toUpperCase(),
          issueDate: inv.issueDate || toDateInput(new Date()),
          dueDate: inv.dueDate || inv.issueDate || toDateInput(new Date()),
          includeInvoiceNote: Boolean(inv.includeInvoiceNote),
          invoiceNote: inv.invoiceNote || "",
        });
        const existingRows = Array.isArray(inv.itemList)
          ? inv.itemList.map((item) => {
              const unit = String(item.itemUnit || "").trim() || "бр.";
              const pct =
                item.itemDiscountPercent != null
                  ? Number(item.itemDiscountPercent)
                  : Number(item.itemDiscount) || 0;
              const amt = Number(item.itemDiscountAmount) || 0;
              return {
                _rowId: getNextRowId(),
                itemName: item.itemName ?? "",
                itemKind: item.itemKind === "service" ? "service" : "product",
                itemUnit: unit,
                itemCost: item.itemCost ?? "",
                itemQuantity: item.itemQuantity ?? 1,
                itemVatRate:
                  item.itemVatRate == null
                    ? Number(defaultBusinessVatRate) || 0
                    : Number(item.itemVatRate) || 0,
                itemDiscountPercent: Math.min(100, Math.max(0, pct)),
                itemDiscountAmount: Math.max(0, amt),
                itemDiscount: Math.min(100, Math.max(0, pct)),
              };
            })
          : [];
        setItemList(
          existingRows.length ? existingRows : [createEmptyRow(defaultBusinessVatRate)],
        );
        const validNumber = getValidInvoiceNumber(inv.id);
        setInvoiceNumberPreview(validNumber ? String(validNumber) : "Чернова");
      } catch {
        showToast("error", "Грешка при зареждане на фактурата. Опитайте отново.");
      }
    };

    const fetchBusinessMeta = async () => {
      try {
        const docs = await loadBusinessDocs();
        docs.forEach((d) => {
          const meta = getBusinessMetaFromDoc(d);
          const data = meta.data;
          setIsBusinessVatRegistered(data?.isVatRegistered !== false);
          if (!invoiceId) {
            setValue("currency", meta.currency);
            setInvoiceNumberPreview(String(meta.invoices + 1));
            const normalizedVatRate = vatRateOptions.includes(meta.normalizedVatRate)
              ? meta.normalizedVatRate
              : 20;
            const resolvedVatRate =
              data?.isVatRegistered === false ? 0 : normalizedVatRate;
            setDefaultBusinessVatRate(normalizedVatRate);
            setItemList((prev) => {
              if (!prev.length) return [createEmptyRow(normalizedVatRate)];
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && !hasRowInput(last)) {
                next[next.length - 1] = {
                  ...last,
                  itemVatRate: resolvedVatRate,
                };
              }
              return next;
            });
          }
        });
      } catch {
        // Keep form usable even if metadata fetch fails.
      }
    };

    if (invoiceId) {
      setIsEditing(true);
      fetchInvoiceData();
    }
    fetchBusinessMeta();
    fetchProducts();
    setLoading(false);
  }, [
    invoiceId,
    loadInvoice,
    loadBusinessDocs,
    fetchProducts,
    reset,
    setValue,
    setItemList,
    createEmptyRow,
    defaultBusinessVatRate,
    getNextRowId,
    setIsEditing,
    setIsBusinessVatRegistered,
    setDefaultBusinessVatRate,
    setInvoiceNumberPreview,
    setLoading,
    defaultFormValues,
    getValidInvoiceNumber,
    hasRowInput,
    toDateInput,
    vatRateOptions,
  ]);
};
