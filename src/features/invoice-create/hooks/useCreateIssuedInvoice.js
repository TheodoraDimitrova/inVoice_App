import { useCallback } from "react";
import { doc, increment, updateDoc } from "@firebase/firestore";
import { setInvoice } from "../../../redux/invoice";
import db from "../../../firebase";
import { createInvoice } from "../services/invoiceService";

export const useCreateIssuedInvoice = ({ getNextBusinessInvoiceNumber, dispatch }) =>
  useCallback(
    async ({ basePayload, formData, invoiceItems }) => {
      const { businessDocId, generatedInvoiceNumber } =
        await getNextBusinessInvoiceNumber();

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
          status: "issued",
          id: generatedInvoiceNumber,
          customerVatRegistered: formData.customerVatRegistered,
          customerVatNumber: formData.customerVatNumber || "",
          includeInvoiceNote: Boolean(formData.includeInvoiceNote),
          invoiceNote: formData.includeInvoiceNote
            ? String(formData.invoiceNote || "").trim()
            : "",
        }),
      );

      await createInvoice({
        ...basePayload,
        id: generatedInvoiceNumber,
      });

      if (businessDocId) {
        await updateDoc(doc(db, "businesses", businessDocId), {
          invoices: increment(1),
        });
      }
    },
    [dispatch, getNextBusinessInvoiceNumber],
  );
