import { useCallback, useMemo, useState } from "react";
import { showToast } from "../../../utils/functions";
import {
  deleteProductForCurrentUser,
  fetchProductsForCurrentUser,
} from "../services/productsService";

export const useProductsData = () => {
  const [products, setProducts] = useState([]);

  const refreshProducts = useCallback(async () => {
    try {
      const fetched = await fetchProductsForCurrentUser();
      setProducts(fetched);
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
    }
  }, []);

  const sortedProducts = useMemo(
    () =>
      [...products].sort((a, b) =>
        String(a?.name || "").localeCompare(String(b?.name || ""), "bg")
      ),
    [products]
  );

  const deleteProduct = useCallback(async (productId) => {
    try {
      await deleteProductForCurrentUser(productId);
      showToast("success", "Продуктът е изтрит успешно.");
      return true;
    } catch {
      showToast("error", "Моля, свържете се с техническа поддръжка.");
      return false;
    }
  }, []);

  return { products, sortedProducts, refreshProducts, deleteProduct };
};
