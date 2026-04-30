import { useCallback } from "react";
import { showToast } from "../../../utils/functions";

export const useLoadInvoiceProducts = ({ loadProducts, setProducts }) =>
  useCallback(async () => {
    try {
      const fetchedProducts = await loadProducts();
      setProducts(fetchedProducts);
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
  }, [loadProducts, setProducts]);
