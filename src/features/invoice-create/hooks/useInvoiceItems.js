import { useMemo, useState } from "react";
import { hasRowInput } from "../utils/number";

/**
 * Item-list state helper for invoice-create flow.
 * This is intentionally small and can be expanded as logic migrates from CreateInvoice.
 */
export const useInvoiceItems = ({
  createEmptyRow,
  defaultBusinessVatRate,
  onItemsChanged,
}) => {
  const [itemList, setItemList] = useState([createEmptyRow(20)]);

  const addRow = () => {
    setItemList((prev) => [...prev, createEmptyRow(defaultBusinessVatRate)]);
    onItemsChanged?.();
  };

  const updateRow = (rowId, key, value) => {
    setItemList((prev) =>
      prev.map((row) => (row._rowId === rowId ? { ...row, [key]: value } : row)),
    );
    onItemsChanged?.();
  };

  const patchRow = (rowId, partial) => {
    setItemList((prev) =>
      prev.map((row) => (row._rowId === rowId ? { ...row, ...partial } : row)),
    );
    onItemsChanged?.();
  };

  const deleteRow = (rowId) => {
    setItemList((prev) => {
      const next = prev.filter((item) => item._rowId !== rowId);
      if (!next.length) return [createEmptyRow(defaultBusinessVatRate)];
      return next;
    });
    onItemsChanged?.();
  };

  const hasAnyInput = useMemo(() => itemList.some(hasRowInput), [itemList]);

  return {
    itemList,
    setItemList,
    addRow,
    updateRow,
    patchRow,
    deleteRow,
    hasAnyInput,
  };
};
