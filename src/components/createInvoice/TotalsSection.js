import React from "react";
import { InvoiceTotalsSummary } from "../invoice/InvoiceTotalsSummary";

export const TotalsSection = ({
  currencySign,
  subtotal,
  discountTotal = 0,
  vatLabel,
  vatTotal,
  grandTotal,
  showVatAmount = true,
}) => (
  <InvoiceTotalsSummary
    currencyLabel={currencySign}
    subtotal={subtotal}
    discountTotal={discountTotal}
    vatLabel={vatLabel}
    vatTotal={vatTotal}
    grandTotal={grandTotal}
    showVatAmount={showVatAmount}
  />
);
