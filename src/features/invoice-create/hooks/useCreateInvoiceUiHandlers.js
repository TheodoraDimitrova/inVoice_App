import { useCallback } from "react";

export const useCreateInvoiceUiHandlers = ({
  setField,
  getValues,
  setPreviewModalOpen,
  setSaveDialogOpen,
  removeRow,
  isBusinessVatRegistered,
  vatExemptDefaultNote,
}) => {
  const blurActiveElement = useCallback(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  const openSaveDialog = useCallback(
    (e) => {
      e.preventDefault();
      blurActiveElement();
      setSaveDialogOpen(true);
    },
    [blurActiveElement, setSaveDialogOpen],
  );

  const handlePreviewInvoice = useCallback(() => {
    blurActiveElement();
    setPreviewModalOpen(true);
  }, [blurActiveElement, setPreviewModalOpen]);

  const deleteRow = useCallback(
    (e, rowId) => {
      e.preventDefault();
      removeRow(rowId);
    },
    [removeRow],
  );

  const handleCustomerTypeChange = useCallback(
    (_, next) => {
      if (!next) return;
      setField("customerType", next);
      if (next === "individual") {
        setField("companyIdentifier", "");
        setField("customerVatRegistered", false);
        setField("customerVatNumber", "");
      }
    },
    [setField],
  );

  const handleCustomerVatRegisteredChange = useCallback(
    (e) => {
      const nextChecked = e.target.checked;
      setField("customerVatRegistered", nextChecked);
      if (!nextChecked) {
        setField("customerVatNumber", "");
      }
    },
    [setField],
  );

  const handleInvoiceNoteToggle = useCallback(
    (e) => {
      const checked = e.target.checked;
      setField("includeInvoiceNote", checked);
      if (!checked) {
        setField("invoiceNote", "");
        return;
      }
      if (
        !isBusinessVatRegistered &&
        !String(getValues("invoiceNote") || "").trim()
      ) {
        setField("invoiceNote", vatExemptDefaultNote);
      }
    },
    [getValues, isBusinessVatRegistered, setField, vatExemptDefaultNote],
  );

  return {
    openSaveDialog,
    handlePreviewInvoice,
    deleteRow,
    handleCustomerTypeChange,
    handleCustomerVatRegisteredChange,
    handleInvoiceNoteToggle,
  };
};
