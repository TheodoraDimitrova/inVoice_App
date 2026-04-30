import { useEffect } from "react";
import { parseLocaleNumber } from "../utils/number";

export const useNormalizeVatRows = ({
  isBusinessVatRegistered,
  setItemList,
}) => {
  useEffect(() => {
    if (isBusinessVatRegistered) return;
    setItemList((prev) => {
      let changed = false;
      const next = prev.map((row) => {
        const currentRate = parseLocaleNumber(row?.itemVatRate);
        if (currentRate === 0) return row;
        changed = true;
        return { ...row, itemVatRate: 0 };
      });
      return changed ? next : prev;
    });
  }, [isBusinessVatRegistered, setItemList]);
};
