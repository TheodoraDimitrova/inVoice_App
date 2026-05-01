import { useMemo } from "react";
import { toPreviewData } from "../mappers/invoiceMappers";

export const useInvoicePreviewData = ({
  getValues,
  invoiceItems,
  invoiceNumberPreview,
  getValidInvoiceNumber,
  includeInvoiceNote,
  invoiceNote,
}) =>
  useMemo(
    () =>
      toPreviewData({
        formData: getValues(),
        invoiceItems,
        invoiceNumberPreview,
        getValidInvoiceNumber,
      }),
    // includeInvoiceNote и invoiceNote са нужни като зависимости, за да се
    // преизчисли memo-то при промяна на забележката, без смяна на артикули.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getValues, getValidInvoiceNumber, invoiceItems, invoiceNumberPreview, includeInvoiceNote, invoiceNote],
  );
