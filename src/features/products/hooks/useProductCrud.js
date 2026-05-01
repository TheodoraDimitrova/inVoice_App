import { useCallback } from "react";
import {
  createProductForCurrentUser,
  updateProductForCurrentUser,
} from "../services/productsService";
import { toProductPayload } from "../mappers/productPayloadMapper";

export const useProductCrud = () => {
  const saveProduct = useCallback(
    async ({ editingId, productData }) => {
      const payload = toProductPayload(productData);

      if (editingId) {
        await updateProductForCurrentUser(editingId, payload);
      } else {
        await createProductForCurrentUser(payload);
      }
    },
    []
  );

  return { saveProduct };
};
