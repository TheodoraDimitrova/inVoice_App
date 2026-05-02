import React from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { ComponentToPrint } from "../print/ComponentToPrint";

const printButtonClass =
  "z-[1000] flex shrink-0 items-center justify-center rounded-full bg-white p-2.5 " +
  "text-[#0f766e] shadow-[0_4px_22px_rgba(15,118,110,0.22)] " +
  "ring-2 ring-[#0f766e]/30 transition-colors " +
  "hover:bg-teal-50/90 hover:ring-[#0f766e] " +
  "print:hidden mt-[1rem]";

const ViewInvoicePage = ({
  invoice,
  business,
  printRef,
  onPrint,
  isPreview,
}) => {
  return (
    <div className="flex w-full justify-center px-4 py-5 sm:px-6 sm:py-7 md:px-10 md:py-8 lg:px-12 xl:px-14">
      <div className="flex w-full flex-col-reverse items-center gap-6 pb-2 sm:flex-row sm:items-start sm:justify-center sm:gap-5 sm:pb-0 md:gap-6">
        <div className="w-full max-w-[850px] min-w-0 shrink-0">
          <ComponentToPrint
            ref={printRef}
            invoice={invoice}
            business={business}
            isPreview={isPreview}
          />
        </div>
        <button
          type="button"
          title="Печат на фактура"
          aria-label="Печат на фактура"
          onClick={onPrint}
          className={printButtonClass}
        >
          <LocalPrintshopIcon sx={{ fontSize: 38 }} />
        </button>
      </div>
    </div>
  );
};

export default ViewInvoicePage;
