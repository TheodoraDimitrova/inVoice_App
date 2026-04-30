import { useCallback } from "react";
import { fetchCurrentUserBusinessDocs } from "../services/businessService";
import { fetchInvoiceById } from "../services/invoiceService";
import { fetchUserProducts } from "../services/productService";

export const useCreateInvoiceData = () => {
  const loadInvoice = useCallback(async (invoiceId) => {
    if (!invoiceId) return null;
    const snap = await fetchInvoiceById(invoiceId);
    return snap.exists() ? snap.data() : null;
  }, []);

  const loadBusinessDocs = useCallback(async () => {
    const snap = await fetchCurrentUserBusinessDocs();
    return snap.docs;
  }, []);

  const loadProducts = useCallback(async () => fetchUserProducts(), []);

  return { loadInvoice, loadBusinessDocs, loadProducts };
};
