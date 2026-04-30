import { useCallback, useRef } from "react";

export const useInvoiceRowFactory = ({
  defaultBusinessVatRate,
  isBusinessVatRegistered,
}) => {
  const rowIdRef = useRef(0);

  const getNextRowId = useCallback(() => ++rowIdRef.current, []);

  const createEmptyRow = useCallback(
    (vatRate = defaultBusinessVatRate) => {
      const resolvedVatRate = isBusinessVatRegistered
        ? Number(vatRate) || 0
        : 0;

      return {
        _rowId: getNextRowId(),
        itemName: "",
        itemKind: "product",
        itemUnit: "бр.",
        itemCost: "",
        itemQuantity: 1,
        itemVatRate: resolvedVatRate,
        itemDiscountPercent: 0,
        itemDiscountAmount: 0,
        itemDiscount: 0,
      };
    },
    [defaultBusinessVatRate, getNextRowId, isBusinessVatRegistered],
  );

  return { createEmptyRow, getNextRowId };
};
