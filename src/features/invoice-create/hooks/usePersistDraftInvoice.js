import { useCallback } from "react";
import { setInvoice } from "../../../redux/invoice";
import { getValidInvoiceNumber } from "../utils/number";
import { fetchInvoiceById, createInvoice, updateInvoice } from "../services/invoiceService";

export const usePersistDraftInvoice = ({ isEditing, invoiceId, dispatch }) =>
  useCallback(
    async ({ basePayload, formData, invoiceItems }) => {
      if (!isEditing) {
        dispatch(
          setInvoice({
            customerName: formData.customerName,
            customerType: formData.customerType,
            customerAddress: formData.customerAddress,
            customerPostCode: formData.customerPostCode,
            companyIdentifier: formData.companyIdentifier || "",
            customerCity: formData.customerCity,
            customerCountry: formData.customerCountry,
            customerEmail: formData.customerEmail,
            itemList: invoiceItems,
            currency: formData.currency,
            status: "draft",
            id: null,
            customerVatRegistered: formData.customerVatRegistered,
            customerVatNumber: formData.customerVatNumber || "",
            includeInvoiceNote: Boolean(formData.includeInvoiceNote),
            invoiceNote: formData.includeInvoiceNote
              ? String(formData.invoiceNote || "").trim()
              : "",
          }),
        );
        await createInvoice({ ...basePayload, id: null });
        return;
      }

      const currentInvoice = await fetchInvoiceById(invoiceId);
      const currentInvoiceData = currentInvoice.exists() ? currentInvoice.data() : {};
      const existingInvoiceNumber = getValidInvoiceNumber(currentInvoiceData?.id);
      await updateInvoice(invoiceId, {
        ...basePayload,
        id: existingInvoiceNumber,
      });
    },
    [dispatch, invoiceId, isEditing],
  );
