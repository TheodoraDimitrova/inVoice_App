import React from "react";
import { Box, Divider, Typography } from "@mui/material";

const InvoiceFooter = ({ business, invoice }) => {
  const bankName = String(business?.bankName || "").trim();
  const iban = String(business?.iban || "").trim();
  const swift = String(business?.swift || "").trim();
  const hideBankDetails = business?.noBankDetailsOnInvoices === true;
  const showPaymentDetails =
    !hideBankDetails && Boolean(bankName || iban || swift);

  const invoiceNoteText = String(invoice?.invoiceNote || "").trim();
  const hasInvoiceNote =
    Boolean(invoice?.includeInvoiceNote) && Boolean(invoiceNoteText);

  return (
    <>
      {showPaymentDetails ? (
        <div className="mt-2 sm:mt-8 flex flex-col">
          <h3 className="mb-1 sm:mb-0.5 text-gray-700 w-full">
            Данни за плащане
          </h3>
          <p className="text-sm mb-1 capitalize">
            <span>Банка: </span>
            {bankName}
          </p>
          <p className="text-sm mb-1 sm:mb-0.5">
            <span>IBAN: </span>
            {iban}
          </p>
          <p className="text-sm mb-1 sm:mb-0.5 capitalize">
            <span>SWIFT: </span> {swift}
          </p>
        </div>
      ) : null}

      {hasInvoiceNote && (
        <Box sx={{ mt: 2 }}>
          <Divider />
          <Typography fontWeight={600}>Забележка</Typography>
          <Typography whiteSpace="pre-wrap">{invoiceNoteText}</Typography>
        </Box>
      )}
    </>
  );
};

export default InvoiceFooter;
