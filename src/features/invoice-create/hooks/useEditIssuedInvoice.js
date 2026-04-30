import { useCallback } from "react";
import { doc, increment, updateDoc } from "@firebase/firestore";
import db from "../../../firebase";
import { getValidInvoiceNumber } from "../utils/number";
import { fetchInvoiceById, updateInvoice } from "../services/invoiceService";

export const useEditIssuedInvoice = ({ getNextBusinessInvoiceNumber, invoiceId }) =>
  useCallback(
    async ({ basePayload }) => {
      const currentInvoice = await fetchInvoiceById(invoiceId);
      const currentInvoiceData = currentInvoice.exists() ? currentInvoice.data() : {};
      const existingInvoiceNumber = getValidInvoiceNumber(currentInvoiceData?.id);
      const hasInvoiceNumber = existingInvoiceNumber != null;
      let generatedInvoiceNumber = existingInvoiceNumber;
      let businessDocId = "";

      if (!hasInvoiceNumber) {
        const issuedMeta = await getNextBusinessInvoiceNumber();
        generatedInvoiceNumber = issuedMeta.generatedInvoiceNumber;
        businessDocId = issuedMeta.businessDocId;
      }

      await updateInvoice(invoiceId, {
        ...basePayload,
        id: generatedInvoiceNumber,
      });

      if (!hasInvoiceNumber && businessDocId) {
        await updateDoc(doc(db, "businesses", businessDocId), {
          invoices: increment(1),
        });
      }
    },
    [getNextBusinessInvoiceNumber, invoiceId],
  );
