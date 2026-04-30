import { useMemo } from "react";
import { toPreviewData } from "../mappers/invoiceMappers";

export const useInvoicePreviewData = ({
  getValues,
  invoiceItems,
  invoiceNumberPreview,
  getValidInvoiceNumber,
}) =>
  useMemo(
    () =>
      toPreviewData({
        formData: getValues(),
        invoiceItems,
        invoiceNumberPreview,
        getValidInvoiceNumber,
      }),
    [getValues, getValidInvoiceNumber, invoiceItems, invoiceNumberPreview],
  );
