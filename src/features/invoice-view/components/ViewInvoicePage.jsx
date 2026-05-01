import React from "react";
import LocalPrintshopIcon from "@mui/icons-material/LocalPrintshop";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import { ComponentToPrint } from "../print/ComponentToPrint";

const ViewInvoicePage = ({ invoice, business, printRef, onPrint, isPreview }) => {
  return (
    <div className="w-full flex items-center md:justify-start justify-center relative">
      <Tooltip title="Печат на фактура">
        <IconButton
          onClick={onPrint}
          sx={{
            position: "absolute",
            top: "0",
            right: "20px",
            zIndex: 1000,
            color: "#F7CCAC",
          }}
        >
          <LocalPrintshopIcon sx={{ fontSize: "40px" }} />
        </IconButton>
      </Tooltip>

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
