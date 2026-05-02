import React from "react";
import { InvoiceTotalsSummary } from "../../../components/invoice/InvoiceTotalsSummary";
import InvoiceHeader from "../components/InvoiceHeader";
import InvoiceCustomerBlock from "../components/InvoiceCustomerBlock";
import InvoiceMetaBlock from "../components/InvoiceMetaBlock";
import InvoiceItemsTable from "../components/InvoiceItemsTable";
import InvoiceFooter from "../components/InvoiceFooter";
import { formatBgnEquivalent } from "../utils/invoiceFormatters";
import { getInvoiceTotals } from "../utils/invoiceMath";

export const ComponentToPrint = React.forwardRef(
  ({ invoice, business, isPreview }, ref) => {
    const invoiceData = invoice || {};
    const businessData = business || {};
    const invoiceItems = invoiceData.itemList ?? [];
    const fallbackVatRate = Number(businessData.vatRate || 0);
    const invoiceCurrency = String(invoiceData.currency || "BGN").toUpperCase();
    const showBgnEquivalent = invoiceCurrency === "EUR";
    const isBusinessVatRegistered = businessData.isVatRegistered !== false;
    const { grossSubtotal, discountTotal, vatAmount, grandTotal } = getInvoiceTotals({
      invoiceItems,
      fallbackVatRate,
    });

    return (
      <div
        className="flex flex-col p-10 sm:p-10 sm:mt-0 relative md:w-2/3 shadow-xl mx-auto print:w-auto print:max-w-full"
        style={{ minHeight: "100vh" }}
        ref={ref}
      >
        <div style={{ flex: 1 }}>
          <InvoiceHeader business={businessData} />

          <div className="w-full flex justify-between">
            <InvoiceCustomerBlock invoice={invoiceData} />
            <InvoiceMetaBlock invoice={invoiceData} isPreview={isPreview} />
          </div>

          <InvoiceItemsTable
            invoice={invoiceData}
            fallbackVatRate={fallbackVatRate}
            isBusinessVatRegistered={isBusinessVatRegistered}
          />

          <InvoiceTotalsSummary
            currencyLabel={invoiceCurrency}
            subtotal={grossSubtotal}
            discountTotal={discountTotal}
            vatLabel={
              isBusinessVatRegistered ? "Сума ДДС" : "ДДС: не се начислява"
            }
            vatTotal={vatAmount}
            grandTotal={grandTotal}
            showVatAmount={isBusinessVatRegistered}
            formatSecondaryAmount={
              showBgnEquivalent ? (amount) => formatBgnEquivalent(amount) : undefined
            }
          />
        </div>

        <div className="mt-2 break-inside-avoid">
          <InvoiceFooter business={businessData} invoice={invoiceData} />
        </div>
      </div>
    );
  },
);

ComponentToPrint.displayName = "ComponentToPrint";
