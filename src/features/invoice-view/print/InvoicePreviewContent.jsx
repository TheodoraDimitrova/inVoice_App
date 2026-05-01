import React from "react";
import { useBusinessData } from "../hooks/useBusinessData";
import { ComponentToPrint } from "./ComponentToPrint";

const InvoicePreviewContent = React.forwardRef(({ previewData }, ref) => {
  const { business } = useBusinessData();
  return (
    <ComponentToPrint
      ref={ref}
      invoice={previewData}
      business={business}
      isPreview
    />
  );
});

InvoicePreviewContent.displayName = "InvoicePreviewContent";

export default InvoicePreviewContent;
