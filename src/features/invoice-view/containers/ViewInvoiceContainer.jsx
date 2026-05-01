import React, { useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import Loading from "../../../components/Loading";
import ViewInvoicePage from "../components/ViewInvoicePage";
import { useInvoiceData } from "../hooks/useInvoiceData";
import { useBusinessData } from "../hooks/useBusinessData";

export const ViewInvoiceContainer = () => {
  const { id } = useParams();
  const location = useLocation();
  const previewData = location.state?.previewData || null;

  const { invoice, loading: invoiceLoading } = useInvoiceData(id, previewData);
  const { business, loading: businessLoading } = useBusinessData();
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  if (invoiceLoading || businessLoading) return <Loading />;

  return (
    <ViewInvoicePage
      invoice={invoice}
      business={business}
      printRef={componentRef}
      onPrint={handlePrint}
      isPreview={Boolean(previewData)}
    />
  );
};

export default ViewInvoiceContainer;
