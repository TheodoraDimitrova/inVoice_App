import React from "react";
import { identifierLabelFromDigits } from "../utils/invoiceFormatters";

const InvoiceCustomerBlock = ({ invoice }) => {
  if (!invoice) return null;

  return (
    <div className="py-2">
      <h3 className="font-medium mb-2 text-gray-700">Клиент:</h3>
      <p className="text-sm mb-1">{invoice.customerName}</p>
      {invoice.customerType === "business" &&
      String(invoice.companyIdentifier || "").trim() ? (
        <p className="text-sm mb-1">
          {identifierLabelFromDigits(invoice.companyIdentifier)}:{" "}
          {invoice.companyIdentifier}
        </p>
      ) : null}
      <p className="text-sm mb-1">{invoice.customerAddress}</p>
      <p className="text-sm mb-1">
        {[invoice.customerPostCode, invoice.customerCity].filter(Boolean).join(" ")}
      </p>
      <p className="text-sm mb-1">{invoice.customerCountry || ""}</p>
      <p className="text-sm mb-1">{invoice.customerEmail}</p>
      {invoice.customerVatRegistered && invoice.customerVatNumber ? (
        <p className="text-sm mb-1">ДДС номер: {invoice.customerVatNumber}</p>
      ) : null}
    </div>
  );
};

export default InvoiceCustomerBlock;
