import React from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import { ComponentToPrint } from "../print/ComponentToPrint";

const ViewInvoicePage = ({ invoice, business, printRef, onPrint, isPreview }) => {
  return (
    <div className="w-full flex items-center md:justify-start justify-center relative">
      <button
        type="button"
        title="Печат на фактура"
        aria-label="Печат на фактура"
        onClick={onPrint}
        className="absolute right-5 top-0 z-[1000] rounded-full p-2 text-[#F7CCAC] transition-colors hover:bg-slate-100"
      >
        <LocalPrintshopIcon sx={{ fontSize: "40px" }} />
      </button>

      <ComponentToPrint
        ref={printRef}
        invoice={invoice}
        business={business}
        isPreview={isPreview}
      />
    </div>
  );
};

export default ViewInvoicePage;
