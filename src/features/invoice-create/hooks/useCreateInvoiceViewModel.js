import { useCallback, useMemo } from "react";
import { getPrimaryCompanyIdentityRule } from "../../../data/companyIdentityRules";
import { VAT_RATE_OPTIONS } from "../constants/invoiceConstants";
import { toInvoiceItem as mapToInvoiceItem } from "../mappers/invoiceMappers";
import { currencySymbol } from "../utils/number";

export const useCreateInvoiceViewModel = ({
  customerCountry,
  currency,
  defaultBusinessVatRate,
  isBusinessVatRegistered,
  itemList,
}) => {
  const customerIdRule = getPrimaryCompanyIdentityRule(customerCountry || "");
  const customerIdLabel =
    customerIdRule?.label?.split("(")[0]?.trim() || "ЕИК / ДДС";

  const currencySign = currencySymbol(currency);

  const vatRateOptions = useMemo(() => {
    const merged = [...VAT_RATE_OPTIONS, Number(defaultBusinessVatRate) || 0];
    return [...new Set(merged)].sort((a, b) => a - b);
  }, [defaultBusinessVatRate]);

  const toInvoiceItem = useCallback(
    (row) => mapToInvoiceItem(row, isBusinessVatRegistered),
    [isBusinessVatRegistered],
  );

  const invoiceItems = useMemo(
    () =>
      itemList
        .filter((row) => {
          const normalized = toInvoiceItem(row);
          return (
            normalized.itemName &&
            normalized.itemCost > 0 &&
            normalized.itemQuantity >= 1
          );
        })
        .map(toInvoiceItem),
    [itemList, toInvoiceItem],
  );

  return {
    customerIdRule,
    customerIdLabel,
    currencySign,
    vatRateOptions,
    invoiceItems,
  };
};
