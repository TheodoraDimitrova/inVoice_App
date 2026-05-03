import { useEffect } from "react";
import { showToast } from "../../../utils/functions";
import {
  INVOICE_STATUS,
  normalizeInvoiceLifecycleStatus,
} from "../../../utils/invoiceLifecycle";
import { INVOICE_DUE_DAYS_AFTER_ISSUE } from "../constants/invoiceConstants";
import { getBusinessMetaFromDoc } from "../services/businessService";
import { addCalendarDaysToDateInput } from "../utils/date";

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
  setInvoiceLifecycleStatus,
  navigate,
  defaultFormValues,
  getValidInvoiceNumber,
  hasRowInput,
  toDateInput,
  vatRateOptions,
}) => {
  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (invoiceId) {
          setIsEditing(true);
          const inv = await loadInvoice(invoiceId);
          if (cancelled) return;
          if (!inv) {
            showToast("error", "Фактурата не е намерена.");
            navigate("/invoices", { replace: true });
            return;
          }

          const life = normalizeInvoiceLifecycleStatus(inv);
          setInvoiceLifecycleStatus(life);

          if (life === INVOICE_STATUS.PAID) {
            showToast("info", "Платените фактури не могат да се редактират.");
            navigate(`/invoices/${invoiceId}`, { replace: true });
            return;
          }

          const resolvedIssue = inv.issueDate || toDateInput(new Date());
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
            issueDate: resolvedIssue,
            dueDate:
              inv.dueDate ||
              addCalendarDaysToDateInput(
                resolvedIssue,
                INVOICE_DUE_DAYS_AFTER_ISSUE,
              ),
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
        } else {
          setIsEditing(false);
          setInvoiceLifecycleStatus(INVOICE_STATUS.DRAFT);
        }

        try {
          const docs = await loadBusinessDocs();
          if (cancelled) return;
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

        fetchProducts();
      } catch {
        showToast("error", "Грешка при зареждане на фактурата. Опитайте отново.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
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
    setInvoiceLifecycleStatus,
    navigate,
    defaultFormValues,
    getValidInvoiceNumber,
    hasRowInput,
    toDateInput,
    vatRateOptions,
  ]);
};
