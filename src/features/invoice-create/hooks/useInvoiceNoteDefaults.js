import { useEffect } from "react";

export const useInvoiceNoteDefaults = ({
  includeInvoiceNote,
  isBusinessVatRegistered,
  getValues,
  setValue,
  vatExemptDefaultNote,
}) => {
  useEffect(() => {
    if (!includeInvoiceNote || isBusinessVatRegistered) return;
    if (String(getValues("invoiceNote") || "").trim()) return;
    setValue("invoiceNote", vatExemptDefaultNote, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [
    includeInvoiceNote,
    isBusinessVatRegistered,
    getValues,
    setValue,
    vatExemptDefaultNote,
  ]);
};
