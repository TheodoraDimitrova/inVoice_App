import React from "react";
import { identifierLabelFromDigits } from "../utils/invoiceFormatters";

const InvoiceHeader = ({ business }) => {
  if (!business) return null;

  const pc = business.postCode == null ? "" : String(business.postCode).trim();
  const city = business.city == null ? "" : String(business.city).trim();
  const country = business.country == null ? "" : String(business.country).trim();
  const line = [pc, city].filter(Boolean).join(" ");

  return (
    <div className="w-full border-b border-gray-300">
      <div className="mb-2 flex items-center sm:flex-row">
        {business.logo ? (
          <img
            src={business.logo}
            alt="Logo"
            className="mb-2 print:w-40 w-60 h-25 mr-6 sm:mr-12 mt-2 sm:mt-4"
          />
        ) : null}
        {business.businessName ? (
          <p className="text-4xl print:text-xl">{business.businessName}</p>
        ) : null}
      </div>

      <div className="mb-2">
        {business.regNum ? (
          <p className="text-sm mb-1">Reg. number: {business.regNum}</p>
        ) : null}
        {business.businessAddress ? (
          <p className="text-sm mb-1">{business.businessAddress}</p>
        ) : null}

        {line ? <p className="text-sm mb-1">{line}</p> : null}
        {country ? <p className="text-sm mb-1">{country}</p> : null}
        {!line && !country && business.businessCity ? (
          <p className="text-sm mb-1">{business.businessCity}</p>
        ) : null}

        {business.phone ? <p className="text-sm mb-1">Tel: {business.phone}</p> : null}
        {business.email ? (
          <p className="text-sm mb-1 flex justify-between">
            Email: {business.email}
            {business.vat ? <span className="ml-auto"> VAT: {business.vat}</span> : null}
            {business.tic ? (
              <span className="ml-auto">
                {identifierLabelFromDigits(business.tic, "Идентификатор")}:{" "}
                {business.tic}
              </span>
            ) : null}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default InvoiceHeader;
