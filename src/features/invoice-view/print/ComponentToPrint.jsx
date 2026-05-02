import React from "react";
import { InvoiceTotalsSummary } from "../../../components/invoice/InvoiceTotalsSummary";
import InvoiceIssuerBlock from "../components/InvoiceIssuerBlock";
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
    const { grossSubtotal, discountTotal, vatAmount, grandTotal } =
      getInvoiceTotals({
        invoiceItems,
        fallbackVatRate,
      });

    return (
      <div
        ref={ref}
        className="invoice-document relative mx-auto mt-2 w-full max-w-[850px] flex flex-col rounded-lg bg-white shadow-lg print:m-0 print:mt-0 print:rounded-none print:shadow-none"
      >
        <div className="invoice-document-inner w-full px-5 py-6 sm:px-6 sm:py-7 print:px-0 print:py-0">
          <div className="border-b border-slate-200 pb-4 lg:pb-5">
            <InvoiceIssuerBlock business={businessData} />
          </div>

          <div className="mt-3 mb-4 grid grid-cols-1 items-start gap-4 print:mt-3 print:mb-3 print:grid-cols-2 sm:grid-cols-2 sm:gap-x-6 lg:gap-x-6">
            <div className="min-w-0">
              <InvoiceCustomerBlock invoice={invoiceData} />
            </div>
            <div className="min-w-0 sm:flex sm:justify-end">
              <InvoiceMetaBlock invoice={invoiceData} isPreview={isPreview} />
            </div>
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

        <div className="invoice-document-footer w-full px-5 pb-5 pt-1 sm:px-6 print:break-inside-avoid print:px-0 print:pb-4">
          <InvoiceFooter business={businessData} invoice={invoiceData} />
        </div>
      </div>
    );
  },
);

ComponentToPrint.displayName = "ComponentToPrint";
